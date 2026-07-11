"""Carga operaciones desde snapshot JSON (datos reales parseados de datospublicos.uy)."""

import json
from datetime import datetime
from pathlib import Path
from typing import Iterator

from app.etl.connectors.base import ImportDataConnector, RawImportRecord
from app.services.country_codes import resolve_country
from app.services.number_parse import parse_amount

SNAPSHOT = Path(__file__).resolve().parent.parent.parent.parent / "data" / "raw" / "datospublicos_snapshot.json"


class DatosPublicosSnapshotConnector(ImportDataConnector):
    def __init__(self, path: Path | None = None):
        self.path = path or SNAPSHOT

    @property
    def source_name(self) -> str:
        return "datospublicos_uy"

    def fetch_records(self) -> Iterator[RawImportRecord]:
        if not self.path.exists():
            return
        rows = json.loads(self.path.read_text(encoding="utf-8"))
        for i, row in enumerate(rows):
            yield self._to_record(row, i)

    def _to_record(self, row: dict, i: int) -> RawImportRecord:
        fecha = row["fecha"]
        for fmt in ("%Y-%m-%d", "%d/%m/%Y"):
            try:
                op_date = datetime.strptime(fecha[:10], fmt).date()
                break
            except ValueError:
                op_date = None
        if op_date is None:
            raise ValueError(f"fecha inválida: {fecha}")

        usd = parse_amount(row.get("usd"))
        kg = parse_amount(row.get("kg"))
        producto = row.get("producto", "")

        return RawImportRecord(
            source_id=f"snap-{row.get('rut','')}-{op_date}-{i}"[:64],
            source_name=self.source_name,
            operation_date=op_date,
            importer_name=row.get("nombre") or "—",
            importer_tax_id=row.get("rut") or None,
            supplier_name=None,
            supplier_country=None,
            product_name=producto.split("(")[0].strip()[:80],
            product_category=row["category"],
            hs_code=row.get("hs") or "",
            origin_country=resolve_country(row.get("pais")) or row.get("pais") or "",
            destination_country="UY",
            quantity=kg,
            unit="kg" if kg else None,
            declared_value_usd=usd,
            fob_value_usd=None,
            freight_usd=None,
            insurance_usd=None,
            tariff_rate=None,
            additional_tax_rate=None,
            entry_port=row.get("aduana"),
            transport_mode=None,
            description_raw=producto,
        )

