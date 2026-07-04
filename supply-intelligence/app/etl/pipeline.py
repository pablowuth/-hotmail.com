from sqlalchemy.orm import Session

from app.etl.connectors.base import ImportDataConnector, RawImportRecord
from app.models import Importer, ImportOperation, Product, ProductCategory, Supplier
from app.services.cost_calculator import LandedCostInput, calculate_landed_cost


def _get_or_create_importer(db: Session, name: str, tax_id: str | None) -> Importer:
    importer = db.query(Importer).filter(Importer.legal_name == name).first()
    if not importer:
        importer = Importer(legal_name=name, tax_id=tax_id)
        db.add(importer)
        db.flush()
    return importer


def _get_or_create_supplier(db: Session, name: str, country: str) -> Supplier:
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


def _get_or_create_product(db: Session, name: str, category: str, hs_code: str, unit: str) -> Product:
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
        db, record.product_name, record.product_category, record.hs_code, record.unit
    )

    cost = calculate_landed_cost(
        LandedCostInput(
            fob_value_usd=record.fob_value_usd,
            freight_usd=record.freight_usd,
            insurance_usd=record.insurance_usd,
            tariff_rate=record.tariff_rate,
            additional_tax_rate=record.additional_tax_rate,
            quantity=record.quantity,
        )
    )

    operation = ImportOperation(
        source_id=record.source_id,
        source_name=record.source_name,
        operation_date=record.operation_date,
        importer_id=importer.id,
        supplier_id=supplier.id,
        product_id=product.id,
        origin_country_code=record.origin_country,
        destination_country_code=record.destination_country,
        quantity=record.quantity,
        unit=record.unit,
        fob_value_usd=record.fob_value_usd,
        freight_usd=record.freight_usd,
        insurance_usd=record.insurance_usd,
        tariff_rate=record.tariff_rate,
        tariff_usd=cost.tariff_usd,
        additional_taxes_usd=cost.additional_taxes_usd,
        cif_usd=cost.cif_usd,
        landed_cost_total_usd=cost.landed_cost_total_usd,
        landed_cost_per_unit_usd=cost.landed_cost_per_unit_usd,
        entry_port=record.entry_port,
        transport_mode=record.transport_mode,
        description_raw=record.description_raw,
    )
    db.add(operation)
    return operation


def run_etl(db: Session, connectors: list[ImportDataConnector]) -> dict:
    inserted = 0
    skipped = 0

    for connector in connectors:
        for record in connector.fetch_records():
            result = _upsert_operation(db, record)
            if result:
                inserted += 1
            else:
                skipped += 1

    db.commit()
    return {"inserted": inserted, "skipped": skipped, "connectors": len(connectors)}
