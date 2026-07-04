"""
Conector simulado para APIs comerciales de comercio exterior.

En producción se conectaría a Volza, Panjiva, Datamyne, portales aduaneros
(AR/UY/CL) u otros partners licenciados. Este adaptador demuestra la
interfaz unificada del pipeline.
"""

from datetime import date, timedelta
from typing import Iterator
import random

from app.etl.connectors.base import ImportDataConnector, RawImportRecord

# Tarifas referenciales por categoría (NCM Uruguay/LATAM construcción)
CATEGORY_DEFAULTS = {
    "madera": {"hs": "440710", "tariff": 0.08, "tax": 0.22, "unit": "m3"},
    "wpc": {"hs": "391890", "tariff": 0.14, "tax": 0.22, "unit": "m2"},
    "cielorraso_pvc": {"hs": "392590", "tariff": 0.14, "tax": 0.22, "unit": "m2"},
    "placas_simil_marmol": {"hs": "681019", "tariff": 0.12, "tax": 0.22, "unit": "m2"},
    "piedra_flexible": {"hs": "680300", "tariff": 0.10, "tax": 0.22, "unit": "m2"},
    "perfiles_yeso": {"hs": "721691", "tariff": 0.12, "tax": 0.22, "unit": "u"},
    "pisos_spc": {"hs": "391810", "tariff": 0.14, "tax": 0.22, "unit": "m2"},
    "osb": {"hs": "441233", "tariff": 0.08, "tax": 0.22, "unit": "m3"},
    "fenolicos": {"hs": "441233", "tariff": 0.10, "tax": 0.22, "unit": "m2"},
    "mdf": {"hs": "441114", "tariff": 0.08, "tax": 0.22, "unit": "m3"},
    "puertas_semi_blindada": {"hs": "441821", "tariff": 0.12, "tax": 0.22, "unit": "u"},
}

IMPORTERS = [
    ("Distribuidora Casamax S.A.", "211234560018"),
    ("Materiales del Plata S.R.L.", "30709876543"),
    ("Importadora Construya UY", "219876540012"),
    ("Grupo Andino Building", "20111222334"),
    ("Revestimientos Premium S.A.", "21555666778"),
]

SUPPLIERS = [
    ("Zhejiang WPC New Materials Co.", "CN"),
    ("Guangdong PVC Ceiling Ltd.", "CN"),
    ("Shandong SPC Flooring Group", "CN"),
    ("Brazil Timber Export S.A.", "BR"),
    ("Chile MDF Industries", "CL"),
    ("Vietnam Stone Flex Co.", "VN"),
    ("Turkey Marble Panel Inc.", "TR"),
]


class MockTradeApiConnector(ImportDataConnector):
    """Genera registros incrementales simulando una API de comercio exterior."""

    def __init__(self, days_back: int = 30, records_per_day: int = 3):
        self.days_back = days_back
        self.records_per_day = records_per_day
        self._counter = 0

    @property
    def source_name(self) -> str:
        return "mock_trade_api"

    def fetch_records(self) -> Iterator[RawImportRecord]:
        today = date.today()
        categories = list(CATEGORY_DEFAULTS.keys())

        for day_offset in range(self.days_back, -1, -1):
            op_date = today - timedelta(days=day_offset)
            for _ in range(self.records_per_day):
                self._counter += 1
                cat = random.choice(categories)
                cfg = CATEGORY_DEFAULTS[cat]
                importer = random.choice(IMPORTERS)
                supplier = random.choice(SUPPLIERS)
                qty = round(random.uniform(500, 8000), 2)
                unit_price = random.uniform(2.5, 45.0)
                fob = round(qty * unit_price, 2)
                freight = round(fob * random.uniform(0.08, 0.18), 2)

                yield RawImportRecord(
                    source_id=f"API-{self._counter:06d}",
                    source_name=self.source_name,
                    operation_date=op_date,
                    importer_name=importer[0],
                    importer_tax_id=importer[1],
                    supplier_name=supplier[0],
                    supplier_country=supplier[1],
                    product_name=cat.replace("_", " ").title(),
                    product_category=cat,
                    hs_code=cfg["hs"],
                    origin_country=supplier[1],
                    destination_country="UY",
                    quantity=qty,
                    unit=cfg["unit"],
                    fob_value_usd=fob,
                    freight_usd=freight,
                    insurance_usd=round(fob * 0.005, 2),
                    tariff_rate=cfg["tariff"],
                    additional_tax_rate=cfg["tax"],
                    entry_port=random.choice(["Montevideo", "Nueva Palmira", "Zarate AR"]),
                    transport_mode="sea",
                    description_raw=f"Import {cat} from {supplier[0]}",
                )
