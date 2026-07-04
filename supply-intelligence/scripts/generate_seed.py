#!/usr/bin/env python3
"""Genera CSV seed con 12 meses de importaciones de productos de construcción."""

import csv
import random
from datetime import date, timedelta
from pathlib import Path

OUTPUT = Path(__file__).resolve().parent.parent / "data" / "seed" / "importaciones_construccion.csv"

PRODUCTS = [
    ("Madera pino radiata", "madera", "440710", "m3", 0.08, 0.22, 320, 580),
    ("Deck WPC exterior", "wpc", "391890", "m2", 0.14, 0.22, 8, 22),
    ("Cielorraso PVC blanco", "cielorraso_pvc", "392590", "m2", 0.14, 0.22, 2.5, 6.5),
    ("Placa simil mármol UV", "placas_simil_marmol", "681019", "m2", 0.12, 0.22, 12, 28),
    ("Piedra flexible mural", "piedra_flexible", "680300", "m2", 0.10, 0.22, 9, 18),
    ("Perfil metal yeso 70mm", "perfiles_yeso", "721691", "u", 0.12, 0.22, 1.2, 3.5),
    ("Piso SPC click 5mm", "pisos_spc", "391810", "m2", 0.14, 0.22, 5, 14),
    ("Tablero OSB 15mm", "osb", "441233", "m3", 0.08, 0.22, 180, 350),
    ("Placa fenólica 18mm", "fenolicos", "441233", "m2", 0.10, 0.22, 15, 35),
    ("MDF melamina 18mm", "mdf", "441114", "m3", 0.08, 0.22, 220, 420),
    ("Puerta semi blindada", "puertas_semi_blindada", "441821", "u", 0.12, 0.22, 85, 220),
]

IMPORTERS = [
    ("Distribuidora Casamax S.A.", "211234560018"),
    ("Materiales del Plata S.R.L.", "30709876543"),
    ("Importadora Construya UY", "219876540012"),
    ("Grupo Andino Building", "20111222334"),
    ("Revestimientos Premium S.A.", "21555666778"),
    ("Maderas Uruguay Import", "21888999001"),
    ("Pisos y Revestimientos S.A.", "21222333445"),
]

SUPPLIERS = [
    ("Zhejiang WPC New Materials Co.", "CN"),
    ("Guangdong PVC Ceiling Ltd.", "CN"),
    ("Shandong SPC Flooring Group", "CN"),
    ("Brazil Timber Export S.A.", "BR"),
    ("Chile MDF Industries", "CL"),
    ("Vietnam Stone Flex Co.", "VN"),
    ("Turkey Marble Panel Inc.", "TR"),
    ("Jiangsu Door Systems Co.", "CN"),
    ("Fujian OSB Manufacturing", "CN"),
]

PORTS = ["Montevideo", "Nueva Palmira", "Zarate AR", "Santos BR"]


def main():
    random.seed(42)
    rows = []
    counter = 1
    today = date.today()
    start = today - timedelta(days=365)

    # Supplier shifts for WPC and SPC in recent months (for change detection)
    wpc_supplier_by_month: dict[str, str] = {}
    spc_supplier_by_month: dict[str, str] = {}

    current = start
    while current <= today:
        month_key = current.strftime("%Y-%m")
        for product in PRODUCTS:
            if random.random() > 0.55:
                continue

            name, cat, hs, unit, tariff, tax, min_p, max_p = product
            importer = random.choice(IMPORTERS)

            if cat == "wpc":
                if month_key < (today - timedelta(days=60)).strftime("%Y-%m"):
                    supplier = ("Zhejiang WPC New Materials Co.", "CN")
                else:
                    supplier = ("Guangdong WPC Advanced Co.", "CN")
                wpc_supplier_by_month[month_key] = supplier[0]
            elif cat == "pisos_spc":
                if month_key < (today - timedelta(days=45)).strftime("%Y-%m"):
                    supplier = ("Shandong SPC Flooring Group", "CN")
                else:
                    supplier = ("Vietnam SPC Industries", "VN")
                spc_supplier_by_month[month_key] = supplier[0]
            else:
                supplier = random.choice(SUPPLIERS)

            qty = round(random.uniform(800, 12000), 2)
            unit_price = random.uniform(min_p, max_p)

            # Cost increase for MDF in last 2 months
            if cat == "mdf" and current >= today - timedelta(days=60):
                unit_price *= random.uniform(1.15, 1.28)

            fob = round(qty * unit_price, 2)
            freight = round(fob * random.uniform(0.09, 0.16), 2)
            insurance = round(fob * 0.005, 2)

            rows.append(
                {
                    "source_id": f"SEED-{counter:05d}",
                    "operation_date": current.isoformat(),
                    "importer_name": importer[0],
                    "importer_tax_id": importer[1],
                    "supplier_name": supplier[0],
                    "supplier_country": supplier[1],
                    "product_name": name,
                    "product_category": cat,
                    "hs_code": hs,
                    "origin_country": supplier[1],
                    "destination_country": "UY",
                    "quantity": qty,
                    "unit": unit,
                    "fob_value_usd": fob,
                    "freight_usd": freight,
                    "insurance_usd": insurance,
                    "tariff_rate": tariff,
                    "additional_tax_rate": tax,
                    "entry_port": random.choice(PORTS),
                    "transport_mode": "sea",
                    "description_raw": f"{name} - BL ref {counter}",
                }
            )
            counter += 1

        current += timedelta(days=random.randint(2, 5))

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    fieldnames = list(rows[0].keys())
    with OUTPUT.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    print(f"Generated {len(rows)} records -> {OUTPUT}")


if __name__ == "__main__":
    main()
