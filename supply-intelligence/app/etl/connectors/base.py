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
    supplier_name: str
    supplier_country: str
    product_name: str
    product_category: str
    hs_code: str
    origin_country: str
    destination_country: str
    quantity: float
    unit: str
    fob_value_usd: float
    freight_usd: float
    insurance_usd: float
    tariff_rate: float
    additional_tax_rate: float
    entry_port: str | None
    transport_mode: str
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
