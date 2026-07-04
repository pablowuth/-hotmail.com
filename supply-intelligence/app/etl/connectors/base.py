from abc import ABC, abstractmethod
from dataclasses import dataclass
from datetime import date
from typing import Iterator


@dataclass
class RawImportRecord:
    source_id: str
    source_name: str
    operation_date: date
    importer_name: str
    importer_tax_id: str | None
    supplier_name: str | None
    supplier_country: str | None
    product_name: str
    product_category: str
    hs_code: str
    origin_country: str
    destination_country: str
    quantity: float | None
    unit: str | None
    declared_value_usd: float | None
    fob_value_usd: float | None
    freight_usd: float | None
    insurance_usd: float | None
    tariff_rate: float | None
    additional_tax_rate: float | None
    entry_port: str | None
    transport_mode: str | None
    description_raw: str | None


class ImportDataConnector(ABC):
    """Adaptador base para fuentes de importaciones."""

    @property
    @abstractmethod
    def source_name(self) -> str:
        pass

    @abstractmethod
    def fetch_records(self) -> Iterator[RawImportRecord]:
        pass
