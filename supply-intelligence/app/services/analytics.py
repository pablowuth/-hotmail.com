from datetime import date, timedelta

from sqlalchemy import func
from sqlalchemy.orm import Session, joinedload

from app.models import ImportOperation, Importer, Product, ProductCategory, Supplier, VariationAlert


def get_dashboard_summary(db: Session, product_category: str | None = None) -> dict:
    q = db.query(ImportOperation)
    if product_category:
        q = q.join(Product).filter(Product.category == ProductCategory(product_category))

    total_ops = q.count()
    total_volume_usd = db.query(func.sum(ImportOperation.landed_cost_total_usd)).scalar() or 0
    avg_unit_cost = db.query(func.avg(ImportOperation.landed_cost_per_unit_usd)).scalar() or 0
    importer_count = db.query(func.count(func.distinct(ImportOperation.importer_id))).scalar() or 0
    supplier_count = db.query(func.count(func.distinct(ImportOperation.supplier_id))).scalar() or 0
    alert_count = db.query(VariationAlert).count()

    return {
        "total_operations": total_ops,
        "total_landed_cost_usd": round(float(total_volume_usd), 2),
        "avg_landed_cost_per_unit_usd": round(float(avg_unit_cost), 4),
        "active_importers": importer_count,
        "active_suppliers": supplier_count,
        "open_alerts": alert_count,
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
            func.sum(ImportOperation.quantity).label("volume"),
            func.avg(ImportOperation.landed_cost_per_unit_usd).label("avg_unit_cost"),
            func.sum(ImportOperation.landed_cost_total_usd).label("total_landed"),
            func.sum(ImportOperation.fob_value_usd).label("total_fob"),
            func.sum(ImportOperation.freight_usd).label("total_freight"),
            func.sum(ImportOperation.tariff_usd).label("total_tariff"),
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
            "volume": round(float(row.volume or 0), 2),
            "avg_unit_cost_usd": round(float(row.avg_unit_cost or 0), 4),
            "total_landed_usd": round(float(row.total_landed or 0), 2),
            "total_fob_usd": round(float(row.total_fob or 0), 2),
            "total_freight_usd": round(float(row.total_freight or 0), 2),
            "total_tariff_usd": round(float(row.total_tariff or 0), 2),
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
            func.sum(ImportOperation.landed_cost_total_usd).label("total_landed"),
            func.sum(ImportOperation.quantity).label("total_quantity"),
            func.avg(ImportOperation.landed_cost_per_unit_usd).label("avg_unit_cost"),
        )
        .join(ImportOperation, ImportOperation.importer_id == Importer.id)
        .group_by(Importer.id, Importer.legal_name, Importer.tax_id)
        .order_by(func.sum(ImportOperation.landed_cost_total_usd).desc())
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
            "total_landed_usd": round(float(row.total_landed or 0), 2),
            "total_quantity": round(float(row.total_quantity or 0), 2),
            "avg_unit_cost_usd": round(float(row.avg_unit_cost or 0), 4),
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

    return [
        {
            "id": op.id,
            "date": op.operation_date.isoformat(),
            "importer": op.importer.legal_name,
            "supplier": op.supplier.name,
            "supplier_country": op.supplier.country_code,
            "product": op.product.canonical_name,
            "category": op.product.category.value,
            "quantity": op.quantity,
            "unit": op.unit,
            "fob_usd": op.fob_value_usd,
            "freight_usd": op.freight_usd,
            "tariff_usd": op.tariff_usd,
            "additional_taxes_usd": op.additional_taxes_usd,
            "landed_cost_per_unit_usd": op.landed_cost_per_unit_usd,
            "landed_cost_total_usd": op.landed_cost_total_usd,
        }
        for op in q.all()
    ]


def get_alerts(
    db: Session,
    product_category: str | None = None,
    severity: str | None = None,
) -> list[dict]:
    q = db.query(VariationAlert).order_by(VariationAlert.detected_at.desc())

    if severity:
        q = q.filter(VariationAlert.severity == severity)

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
            func.avg(ImportOperation.landed_cost_per_unit_usd).label("avg_cost"),
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
            "avg_unit_cost_usd": round(float(row.avg_cost or 0), 4),
        }
        for row in rows
    ]
