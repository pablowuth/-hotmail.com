import csv
from datetime import datetime
from pathlib import Path
from typing import Iterator

from app.etl.connectors.base import ImportDataConnector, RawImportRecord


class CsvImportConnector(ImportDataConnector):
    """Conector para archivos CSV normalizados (fuente local / exportaciones de partners)."""

    def __init__(self, file_path: Path):
        self.file_path = file_path

    @property
    def source_name(self) -> str:
        return "csv_import"

    def fetch_records(self) -> Iterator[RawImportRecord]:
        with self.file_path.open(encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                yield RawImportRecord(
                    source_id=row["source_id"],
                    source_name=self.source_name,
                    operation_date=datetime.strptime(row["operation_date"], "%Y-%m-%d").date(),
                    importer_name=row["importer_name"].strip(),
                    importer_tax_id=row.get("importer_tax_id") or None,
                    supplier_name=row["supplier_name"].strip(),
                    supplier_country=row["supplier_country"].strip().upper(),
                    product_name=row["product_name"].strip(),
                    product_category=row["product_category"].strip().lower(),
                    hs_code=row["hs_code"].strip(),
                    origin_country=row["origin_country"].strip().upper(),
                    destination_country=row.get("destination_country", "UY").strip().upper(),
                    quantity=float(row["quantity"]),
                    unit=row["unit"].strip(),
                    fob_value_usd=float(row["fob_value_usd"]),
                    freight_usd=float(row["freight_usd"]),
                    insurance_usd=float(row.get("insurance_usd") or 0),
                    tariff_rate=float(row["tariff_rate"]),
                    additional_tax_rate=float(row["additional_tax_rate"]),
                    entry_port=row.get("entry_port"),
                    transport_mode=row.get("transport_mode", "sea"),
                    description_raw=row.get("description_raw"),
                )
