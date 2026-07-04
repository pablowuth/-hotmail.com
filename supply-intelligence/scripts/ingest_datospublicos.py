#!/usr/bin/env python3
"""Ingesta inicial desde datospublicos.uy (operaciones aduaneras DNA Uruguay)."""

import argparse
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.database import Base, engine, SessionLocal
from app.etl.connectors.datospublicos_uy_connector import DatosPublicosUyConnector
from app.etl.pipeline import run_etl
from app.services.change_detector import detect_variations


def main():
    parser = argparse.ArgumentParser(description="Ingestar importaciones construcción Uruguay")
    parser.add_argument("--max-pages", type=int, default=50, help="Páginas de tabla aduanas a recorrer")
    parser.add_argument("--no-importers", action="store_true", help="No buscar historial por importador")
    args = parser.parse_args()

    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        connector = DatosPublicosUyConnector(
            max_tabla_pages=args.max_pages,
            fetch_importer_histories=not args.no_importers,
        )
        print(f"Ingestando desde datospublicos.uy (max {args.max_pages} páginas)...", flush=True)
        result = run_etl(db, [connector], commit_every=25)
        print("ETL:", result, flush=True)
        alerts = detect_variations(db)
        print(f"Alertas generadas: {len(alerts)}")
    finally:
        db.close()


if __name__ == "__main__":
    main()
