from datetime import date, timedelta

from sqlalchemy import func
from sqlalchemy.orm import Session, joinedload

from app.models import ImportOperation, Importer, Product, ProductCategory, VariationAlert


COST_CHANGE_THRESHOLD = 0.12
VOLUME_CHANGE_THRESHOLD = 0.25


def _severity_from_pct(pct: float) -> "AlertSeverity":
    from app.models import AlertSeverity

    abs_pct = abs(pct)
    if abs_pct >= 0.30:
        return AlertSeverity.CRITICAL
    if abs_pct >= 0.20:
        return AlertSeverity.HIGH
    if abs_pct >= 0.12:
        return AlertSeverity.MEDIUM
    return AlertSeverity.LOW


def _period_bounds(reference: date | None = None) -> tuple[date, date, date, date]:
    ref = reference or date.today()
    current_end = ref
    current_start = ref - timedelta(days=30)
    previous_end = current_start - timedelta(days=1)
    previous_start = previous_end - timedelta(days=30)
    return current_start, current_end, previous_start, previous_end


def detect_variations(db: Session, clear_existing: bool = True) -> list[VariationAlert]:
    from app.models import AlertSeverity

    if clear_existing:
        db.query(VariationAlert).delete()

    current_start, current_end, previous_start, previous_end = _period_bounds()
    alerts: list[VariationAlert] = []

    products = db.query(Product).all()
    for product in products:
        alerts.extend(
            _detect_product_cost_change(
                db, product, current_start, current_end, previous_start, previous_end
            )
        )

    alerts.extend(
        _detect_importer_volume_changes(
            db, current_start, current_end, previous_start, previous_end
        )
    )

    for alert in alerts:
        db.add(alert)

    db.commit()
    return alerts


def _avg_usd_per_kg(db: Session, product_id: str, start: date, end: date) -> float | None:
    result = (
        db.query(func.avg(ImportOperation.usd_per_kg))
        .filter(
            ImportOperation.product_id == product_id,
            ImportOperation.operation_date >= start,
            ImportOperation.operation_date <= end,
            ImportOperation.usd_per_kg.isnot(None),
        )
        .scalar()
    )
    return float(result) if result is not None else None


def _detect_product_cost_change(
    db: Session,
    product: Product,
    cur_start: date,
    cur_end: date,
    prev_start: date,
    prev_end: date,
) -> list[VariationAlert]:
    from app.models import AlertSeverity

    prev_avg = _avg_usd_per_kg(db, product.id, prev_start, prev_end)
    cur_avg = _avg_usd_per_kg(db, product.id, cur_start, cur_end)

    if prev_avg is None or cur_avg is None or prev_avg == 0:
        return []

    change_pct = (cur_avg - prev_avg) / prev_avg
    if abs(change_pct) < COST_CHANGE_THRESHOLD:
        return []

    direction = "subió" if change_pct > 0 else "bajó"
    return [
        VariationAlert(
            alert_type="cost_variation",
            severity=_severity_from_pct(change_pct),
            product_id=product.id,
            title=f"USD/kg {direction} — {product.canonical_name}",
            description=(
                f"El precio proxy (USD/kg) pasó de {prev_avg:.2f} a {cur_avg:.2f} "
                f"({change_pct:+.1%}) entre períodos de 30 días."
            ),
            previous_value=round(prev_avg, 4),
            current_value=round(cur_avg, 4),
            change_pct=round(change_pct, 4),
            period_start=cur_start,
            period_end=cur_end,
        )
    ]


def _detect_importer_volume_changes(
    db: Session,
    cur_start: date,
    cur_end: date,
    prev_start: date,
    prev_end: date,
) -> list[VariationAlert]:
    alerts: list[VariationAlert] = []
    importers = db.query(Importer).all()

    for importer in importers:
        prev_vol = (
            db.query(func.sum(ImportOperation.declared_value_usd))
            .filter(
                ImportOperation.importer_id == importer.id,
                ImportOperation.operation_date >= prev_start,
                ImportOperation.operation_date <= prev_end,
            )
            .scalar()
        ) or 0.0

        cur_vol = (
            db.query(func.sum(ImportOperation.declared_value_usd))
            .filter(
                ImportOperation.importer_id == importer.id,
                ImportOperation.operation_date >= cur_start,
                ImportOperation.operation_date <= cur_end,
            )
            .scalar()
        ) or 0.0

        if prev_vol == 0:
            continue

        change_pct = (cur_vol - prev_vol) / prev_vol
        if abs(change_pct) < VOLUME_CHANGE_THRESHOLD:
            continue

        direction = "aumentó" if change_pct > 0 else "disminuyó"
        alerts.append(
            VariationAlert(
                alert_type="importer_volume",
                severity=_severity_from_pct(change_pct),
                importer_id=importer.id,
                title=f"Valor importado {direction} — {importer.legal_name}",
                description=(
                    f"El valor declarado pasó de USD {prev_vol:,.0f} a USD {cur_vol:,.0f} "
                    f"({change_pct:+.1%}) comparando períodos de 30 días."
                ),
                previous_value=round(prev_vol, 2),
                current_value=round(cur_vol, 2),
                change_pct=round(change_pct, 4),
                period_start=cur_start,
                period_end=cur_end,
            )
        )

    return alerts
