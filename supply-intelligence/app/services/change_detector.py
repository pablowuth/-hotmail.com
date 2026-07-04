from collections import defaultdict
from datetime import date, datetime, timedelta

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models import AlertSeverity, ImportOperation, Importer, Product, Supplier, VariationAlert


COST_CHANGE_THRESHOLD = 0.12
VOLUME_CHANGE_THRESHOLD = 0.25


def _severity_from_pct(pct: float) -> AlertSeverity:
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
            _detect_supplier_changes(
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


def _avg_cost(
    db: Session, product_id: str, start: date, end: date
) -> float | None:
    result = (
        db.query(func.avg(ImportOperation.landed_cost_per_unit_usd))
        .filter(
            ImportOperation.product_id == product_id,
            ImportOperation.operation_date >= start,
            ImportOperation.operation_date <= end,
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
    prev_avg = _avg_cost(db, product.id, prev_start, prev_end)
    cur_avg = _avg_cost(db, product.id, cur_start, cur_end)

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
            title=f"Costo desaduanizado {direction} — {product.canonical_name}",
            description=(
                f"El costo promedio por unidad pasó de USD {prev_avg:.2f} a USD {cur_avg:.2f} "
                f"({change_pct:+.1%}) en los últimos 30 días vs. el período anterior."
            ),
            previous_value=round(prev_avg, 4),
            current_value=round(cur_avg, 4),
            change_pct=round(change_pct, 4),
            period_start=cur_start,
            period_end=cur_end,
        )
    ]


def _top_suppliers(
    db: Session, product_id: str, start: date, end: date, limit: int = 3
) -> list[tuple[str, str, float]]:
    rows = (
        db.query(
            Supplier.id,
            Supplier.name,
            func.sum(ImportOperation.quantity).label("vol"),
        )
        .join(ImportOperation, ImportOperation.supplier_id == Supplier.id)
        .filter(
            ImportOperation.product_id == product_id,
            ImportOperation.operation_date >= start,
            ImportOperation.operation_date <= end,
        )
        .group_by(Supplier.id, Supplier.name)
        .order_by(func.sum(ImportOperation.quantity).desc())
        .limit(limit)
        .all()
    )
    return [(r[0], r[1], float(r[2])) for r in rows]


def _detect_supplier_changes(
    db: Session,
    product: Product,
    cur_start: date,
    cur_end: date,
    prev_start: date,
    prev_end: date,
) -> list[VariationAlert]:
    prev_top = _top_suppliers(db, product.id, prev_start, prev_end, limit=1)
    cur_top = _top_suppliers(db, product.id, cur_start, cur_end, limit=1)

    if not prev_top or not cur_top:
        return []

    prev_id, prev_name, _ = prev_top[0]
    cur_id, cur_name, _ = cur_top[0]

    if prev_id == cur_id:
        return []

    return [
        VariationAlert(
            alert_type="supplier_change",
            severity=AlertSeverity.MEDIUM,
            product_id=product.id,
            title=f"Cambio de proveedor principal — {product.canonical_name}",
            description=(
                f"El proveedor dominante cambió de '{prev_name}' a '{cur_name}' "
                f"entre el período anterior y los últimos 30 días."
            ),
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
            db.query(func.sum(ImportOperation.landed_cost_total_usd))
            .filter(
                ImportOperation.importer_id == importer.id,
                ImportOperation.operation_date >= prev_start,
                ImportOperation.operation_date <= prev_end,
            )
            .scalar()
        ) or 0.0

        cur_vol = (
            db.query(func.sum(ImportOperation.landed_cost_total_usd))
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
                title=f"Volumen importado {direction} — {importer.legal_name}",
                description=(
                    f"El valor desaduanizado total pasó de USD {prev_vol:,.0f} a USD {cur_vol:,.0f} "
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
