from datetime import date, timedelta

from sqlalchemy import func
from sqlalchemy.orm import Session, joinedload

from app.models import ImportOperation, Importer, Product, ProductCategory, VariationAlert


def _nullify(value):
    return value if value is not None else None


def get_data_sources(db: Session) -> list[dict]:
    rows = (
        db.query(ImportOperation.source_name, func.count(ImportOperation.id))
        .group_by(ImportOperation.source_name)
        .all()
    )
    labels = {
        "datospublicos_uy": "datospublicos.uy — DNA Uruguay",
        "csv_import": "CSV local",
        "mock_trade_api": "Mock API",
    }
    return [{"source": labels.get(r[0], r[0]), "operations": r[1]} for r in rows]


def get_field_coverage(db: Session) -> dict:
    total = db.query(ImportOperation).count() or 1
    q = db.query

    def pct(col):
        filled = q(ImportOperation).filter(col.isnot(None)).count()
        return round(100 * filled / total, 1)

    return {
        "importer": 100.0,
        "declared_value_usd": pct(ImportOperation.declared_value_usd),
        "weight_kg": pct(ImportOperation.weight_kg),
        "origin_country": pct(ImportOperation.origin_country),
        "hs_code": pct(ImportOperation.hs_code_raw),
        "usd_per_kg": pct(ImportOperation.usd_per_kg),
        "supplier": round(100 * q(ImportOperation).filter(ImportOperation.supplier_id.isnot(None)).count() / total, 1),
        "fob": pct(ImportOperation.fob_value_usd),
        "freight": pct(ImportOperation.freight_usd),
        "tariff": pct(ImportOperation.tariff_usd),
        "landed_cost": pct(ImportOperation.landed_cost_per_unit_usd),
    }


def get_dashboard_summary(db: Session, product_category: str | None = None) -> dict:
    q = db.query(ImportOperation)
    if product_category:
        q = q.join(Product).filter(Product.category == ProductCategory(product_category))

    total_ops = q.count()
    total_value = (
        db.query(func.sum(ImportOperation.declared_value_usd)).scalar() or 0
    )
    avg_usd_kg = db.query(func.avg(ImportOperation.usd_per_kg)).filter(
        ImportOperation.usd_per_kg.isnot(None)
    ).scalar()
    importer_count = db.query(func.count(func.distinct(ImportOperation.importer_id))).scalar() or 0
    alert_count = db.query(VariationAlert).count()

    return {
        "total_operations": total_ops,
        "total_declared_value_usd": round(float(total_value), 2) if total_value else None,
        "avg_usd_per_kg": round(float(avg_usd_kg), 4) if avg_usd_kg else None,
        "active_importers": importer_count,
        "open_alerts": alert_count,
        "sources": get_data_sources(db),
        "field_coverage": get_field_coverage(db),
    }


def get_trend_series(
    db: Session,
    product_category: str | None = None,
    months: int = 12,
) -> list[dict]:
    end = date.today()
    start = end - timedelta(days=months * 30)

    month_expr = func.strftime("%Y-%m", ImportOperation.operation_date)
    q = (
        db.query(
            month_expr.label("period"),
            func.count(ImportOperation.id).label("operations"),
            func.sum(ImportOperation.weight_kg).label("volume_kg"),
            func.avg(ImportOperation.usd_per_kg).label("avg_usd_per_kg"),
            func.sum(ImportOperation.declared_value_usd).label("total_value_usd"),
        )
        .filter(ImportOperation.operation_date >= start)
        .group_by(month_expr)
        .order_by(month_expr)
    )

    if product_category:
        q = q.join(Product).filter(Product.category == ProductCategory(product_category))

    return [
        {
            "period": row.period,
            "operations": row.operations,
            "volume_kg": round(float(row.volume_kg or 0), 2) if row.volume_kg else None,
            "avg_usd_per_kg": round(float(row.avg_usd_per_kg or 0), 4) if row.avg_usd_per_kg else None,
            "total_value_usd": round(float(row.total_value_usd or 0), 2) if row.total_value_usd else None,
        }
        for row in q.all()
    ]


def get_importers_ranking(
    db: Session,
    product_category: str | None = None,
    limit: int = 20,
) -> list[dict]:
    q = (
        db.query(
            Importer.id,
            Importer.legal_name,
            Importer.tax_id,
            func.count(ImportOperation.id).label("operations"),
            func.sum(ImportOperation.declared_value_usd).label("total_value"),
            func.sum(ImportOperation.weight_kg).label("total_kg"),
            func.avg(ImportOperation.usd_per_kg).label("avg_usd_per_kg"),
        )
        .join(ImportOperation, ImportOperation.importer_id == Importer.id)
        .group_by(Importer.id, Importer.legal_name, Importer.tax_id)
        .order_by(func.sum(ImportOperation.declared_value_usd).desc().nullslast())
        .limit(limit)
    )

    if product_category:
        q = q.join(Product, ImportOperation.product_id == Product.id).filter(
            Product.category == ProductCategory(product_category)
        )

    return [
        {
            "id": row.id,
            "legal_name": row.legal_name,
            "tax_id": row.tax_id,
            "operations": row.operations,
            "total_value_usd": round(float(row.total_value), 2) if row.total_value else None,
            "total_kg": round(float(row.total_kg), 2) if row.total_kg else None,
            "avg_usd_per_kg": round(float(row.avg_usd_per_kg), 4) if row.avg_usd_per_kg else None,
        }
        for row in q.all()
    ]


def get_recent_operations(
    db: Session,
    product_category: str | None = None,
    limit: int = 50,
) -> list[dict]:
    q = (
        db.query(ImportOperation)
        .options(
            joinedload(ImportOperation.importer),
            joinedload(ImportOperation.supplier),
            joinedload(ImportOperation.product),
        )
        .order_by(ImportOperation.operation_date.desc())
        .limit(limit)
    )

    if product_category:
        q = q.join(Product).filter(Product.category == ProductCategory(product_category))

    results = []
    for op in q.all():
        results.append(
            {
                "id": op.id,
                "date": op.operation_date.isoformat(),
                "importer": op.importer.legal_name,
                "importer_rut": op.importer.tax_id,
                "supplier": op.supplier.name if op.supplier else None,
                "product": op.product.canonical_name,
                "category": op.product.category.value,
                "origin": op.origin_country,
                "weight_kg": op.weight_kg,
                "declared_value_usd": op.declared_value_usd,
                "usd_per_kg": op.usd_per_kg,
                "fob_usd": op.fob_value_usd,
                "freight_usd": op.freight_usd,
                "tariff_usd": op.tariff_usd,
                "additional_taxes_usd": op.additional_taxes_usd,
                "landed_cost_per_unit_usd": op.landed_cost_per_unit_usd,
                "hs_code": op.hs_code_raw,
                "customs_office": op.customs_office,
                "source": op.source_name,
                "description": op.description_raw,
            }
        )
    return results


def get_alerts(
    db: Session,
    product_category: str | None = None,
    severity: str | None = None,
) -> list[dict]:
    q = db.query(VariationAlert).order_by(VariationAlert.detected_at.desc())

    if severity:
        from app.models import AlertSeverity
        q = q.filter(VariationAlert.severity == AlertSeverity(severity))

    if product_category:
        q = q.join(Product, VariationAlert.product_id == Product.id, isouter=True).filter(
            (Product.category == ProductCategory(product_category))
            | (VariationAlert.product_id.is_(None))
        )

    results = []
    for alert in q.limit(50).all():
        product_name = None
        importer_name = None
        if alert.product_id:
            product = db.get(Product, alert.product_id)
            product_name = product.canonical_name if product else None
        if alert.importer_id:
            importer = db.get(Importer, alert.importer_id)
            importer_name = importer.legal_name if importer else None

        results.append(
            {
                "id": alert.id,
                "type": alert.alert_type,
                "severity": alert.severity.value,
                "title": alert.title,
                "description": alert.description,
                "product": product_name,
                "importer": importer_name,
                "previous_value": alert.previous_value,
                "current_value": alert.current_value,
                "change_pct": alert.change_pct,
                "detected_at": alert.detected_at.isoformat(),
            }
        )
    return results


def get_product_categories(db: Session) -> list[dict]:
    rows = (
        db.query(
            Product.category,
            func.count(ImportOperation.id).label("operations"),
            func.avg(ImportOperation.usd_per_kg).label("avg_usd_kg"),
        )
        .join(ImportOperation, ImportOperation.product_id == Product.id)
        .group_by(Product.category)
        .order_by(Product.category)
        .all()
    )
    labels = {
        ProductCategory.MADERA: "Madera",
        ProductCategory.WPC: "WPC",
        ProductCategory.CIELORRASO_PVC: "Cielorraso PVC",
        ProductCategory.PLACAS_SIMIL_MARMOL: "Placas simil mármol",
        ProductCategory.PIEDRA_FLEXIBLE: "Piedra flexible",
        ProductCategory.PERFILES_YESO: "Perfiles para yeso",
        ProductCategory.PISOS_SPC: "Pisos SPC",
        ProductCategory.OSB: "OSB",
        ProductCategory.FENOLICOS: "Fenólicos",
        ProductCategory.MDF: "MDF",
        ProductCategory.PUERTAS_SEMI_BLINDADA: "Puertas semi blindada",
    }
    return [
        {
            "value": row.category.value,
            "label": labels.get(row.category, row.category.value),
            "operations": row.operations,
            "avg_usd_per_kg": round(float(row.avg_usd_kg), 4) if row.avg_usd_kg else None,
        }
        for row in rows
    ]
