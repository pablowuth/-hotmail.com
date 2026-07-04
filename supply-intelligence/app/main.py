from pathlib import Path

from fastapi import Depends, FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session

from app.database import Base, engine, get_db
from app.etl.connectors.csv_connector import CsvImportConnector
from app.etl.connectors.mock_api_connector import MockTradeApiConnector
from app.etl.pipeline import run_etl
from app.services import analytics
from app.services.change_detector import detect_variations

STATIC_DIR = Path(__file__).resolve().parent.parent / "static"
SEED_CSV = Path(__file__).resolve().parent.parent / "data" / "seed" / "importaciones_construccion.csv"


def create_app() -> FastAPI:
    app = FastAPI(
        title="Supply Intelligence — Importaciones Construcción",
        description="Dashboard de importaciones con costo desaduanizado, tendencias y alertas",
        version="1.0.0",
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.on_event("startup")
    def startup():
        Base.metadata.create_all(bind=engine)
        _ensure_seed_data()

    @app.get("/api/health")
    def health():
        return {"status": "ok"}

    @app.get("/api/categories")
    def categories(db: Session = Depends(get_db)):
        return analytics.get_product_categories(db)

    @app.get("/api/summary")
    def summary(
        product: str | None = Query(None, description="Categoría de producto"),
        db: Session = Depends(get_db),
    ):
        return analytics.get_dashboard_summary(db, product)

    @app.get("/api/trends")
    def trends(
        product: str | None = Query(None),
        months: int = Query(12, ge=3, le=24),
        db: Session = Depends(get_db),
    ):
        return analytics.get_trend_series(db, product, months)

    @app.get("/api/importers")
    def importers(
        product: str | None = Query(None),
        limit: int = Query(20, ge=5, le=100),
        db: Session = Depends(get_db),
    ):
        return analytics.get_importers_ranking(db, product, limit)

    @app.get("/api/operations")
    def operations(
        product: str | None = Query(None),
        limit: int = Query(50, ge=10, le=200),
        db: Session = Depends(get_db),
    ):
        return analytics.get_recent_operations(db, product, limit)

    @app.get("/api/alerts")
    def alerts(
        product: str | None = Query(None),
        severity: str | None = Query(None),
        db: Session = Depends(get_db),
    ):
        return analytics.get_alerts(db, product, severity)

    @app.post("/api/ingest")
    def ingest(db: Session = Depends(get_db)):
        connectors = [CsvImportConnector(SEED_CSV)]
        if SEED_CSV.exists():
            result = run_etl(db, connectors)
        else:
            result = {"inserted": 0, "skipped": 0, "connectors": 0}
        mock_result = run_etl(db, [MockTradeApiConnector(days_back=14, records_per_day=2)])
        result["inserted"] += mock_result["inserted"]
        result["skipped"] += mock_result["skipped"]
        alerts = detect_variations(db)
        result["alerts_generated"] = len(alerts)
        return result

    @app.post("/api/recalculate-alerts")
    def recalculate_alerts(db: Session = Depends(get_db)):
        alerts = detect_variations(db)
        return {"alerts_generated": len(alerts)}

    if STATIC_DIR.exists():
        app.mount("/assets", StaticFiles(directory=STATIC_DIR), name="assets")

        @app.get("/")
        def dashboard():
            return FileResponse(STATIC_DIR / "index.html")

    return app


def _ensure_seed_data():
    from app.database import SessionLocal
    from app.models import ImportOperation

    db = SessionLocal()
    try:
        count = db.query(ImportOperation).count()
        if count == 0 and SEED_CSV.exists():
            run_etl(db, [CsvImportConnector(SEED_CSV)])
            detect_variations(db)
    finally:
        db.close()


app = create_app()
