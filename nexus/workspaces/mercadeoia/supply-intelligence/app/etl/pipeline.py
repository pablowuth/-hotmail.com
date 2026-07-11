from sqlalchemy.orm import Session

from app.etl.connectors.base import ImportDataConnector, RawImportRecord
from app.models import Importer, ImportOperation, Product, ProductCategory, Supplier
from app.services.cost_calculator import LandedCostInput, calculate_landed_cost


def _get_or_create_importer(db: Session, name: str, tax_id: str | None) -> Importer:
    if tax_id:
        importer = db.query(Importer).filter(Importer.tax_id == tax_id).first()
        if importer:
            return importer
    importer = db.query(Importer).filter(Importer.legal_name == name).first()
    if not importer:
        importer = Importer(legal_name=name, tax_id=tax_id)
        db.add(importer)
        db.flush()
    elif tax_id and not importer.tax_id:
        importer.tax_id = tax_id
    return importer


def _get_or_create_supplier(db: Session, name: str | None, country: str | None) -> Supplier | None:
    if not name:
        return None
    country = country or "—"
    supplier = (
        db.query(Supplier)
        .filter(Supplier.name == name, Supplier.country_code == country)
        .first()
    )
    if not supplier:
        supplier = Supplier(name=name, country_code=country)
        db.add(supplier)
        db.flush()
    return supplier


def _get_or_create_product(db: Session, name: str, category: str, hs_code: str | None, unit: str | None) -> Product:
    cat_enum = ProductCategory(category)
    product = (
        db.query(Product)
        .filter(Product.canonical_name == name, Product.category == cat_enum)
        .first()
    )
    if not product:
        product = Product(
            canonical_name=name,
            category=cat_enum,
            hs_code=hs_code,
            unit=unit,
        )
        db.add(product)
        db.flush()
    return product


def _upsert_operation(db: Session, record: RawImportRecord) -> ImportOperation | None:
    existing = (
        db.query(ImportOperation)
        .filter(
            ImportOperation.source_id == record.source_id,
            ImportOperation.source_name == record.source_name,
        )
        .first()
    )
    if existing:
        return None

    importer = _get_or_create_importer(db, record.importer_name, record.importer_tax_id)
    supplier = _get_or_create_supplier(db, record.supplier_name, record.supplier_country)
    product = _get_or_create_product(
        db, record.product_name, record.product_category, record.hs_code or None, record.unit
    )

    weight_kg = record.quantity if record.unit == "kg" else None
    declared = record.declared_value_usd
    usd_per_kg = None
    if declared and weight_kg and weight_kg > 0:
        usd_per_kg = round(declared / weight_kg, 4)

    fob = freight = insurance = tariff = additional = cif = landed_total = landed_unit = None
    if (
        record.fob_value_usd is not None
        and record.freight_usd is not None
        and record.tariff_rate is not None
        and record.additional_tax_rate is not None
        and record.quantity
        and record.quantity > 0
    ):
        cost = calculate_landed_cost(
            LandedCostInput(
                fob_value_usd=record.fob_value_usd,
                freight_usd=record.freight_usd,
                insurance_usd=record.insurance_usd or 0.0,
                tariff_rate=record.tariff_rate,
                additional_tax_rate=record.additional_tax_rate,
                quantity=record.quantity,
            )
        )
        fob = record.fob_value_usd
        freight = record.freight_usd
        insurance = record.insurance_usd
        tariff = cost.tariff_usd
        additional = cost.additional_taxes_usd
        cif = cost.cif_usd
        landed_total = cost.landed_cost_total_usd
        landed_unit = cost.landed_cost_per_unit_usd

    operation = ImportOperation(
        source_id=record.source_id,
        source_name=record.source_name,
        operation_date=record.operation_date,
        importer_id=importer.id,
        supplier_id=supplier.id if supplier else None,
        product_id=product.id,
        origin_country=record.origin_country or None,
        destination_country_code=record.destination_country,
        quantity=record.quantity,
        unit=record.unit,
        weight_kg=weight_kg,
        declared_value_usd=declared,
        fob_value_usd=fob,
        freight_usd=freight,
        insurance_usd=insurance,
        tariff_rate=record.tariff_rate,
        tariff_usd=tariff,
        additional_taxes_usd=additional,
        cif_usd=cif,
        landed_cost_total_usd=landed_total,
        landed_cost_per_unit_usd=landed_unit,
        usd_per_kg=usd_per_kg,
        customs_office=record.entry_port,
        transport_mode=record.transport_mode,
        description_raw=record.description_raw,
        hs_code_raw=record.hs_code or None,
    )
    db.add(operation)
    return operation


def run_etl(db: Session, connectors: list[ImportDataConnector], commit_every: int = 50) -> dict:
    inserted = 0
    skipped = 0
    pending = 0

    for connector in connectors:
        for record in connector.fetch_records():
            result = _upsert_operation(db, record)
            if result:
                inserted += 1
                pending += 1
            else:
                skipped += 1
            if pending >= commit_every:
                db.commit()
                pending = 0

    db.commit()
    return {"inserted": inserted, "skipped": skipped, "connectors": len(connectors)}
