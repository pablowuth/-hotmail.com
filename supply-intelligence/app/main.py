from pathlib import Path

from fastapi import Depends, FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session

from app.database import Base, engine, get_db
from app.etl.connectors.datospublicos_snapshot_connector import DatosPublicosSnapshotConnector
from app.etl.connectors.datospublicos_uy_connector import DatosPublicosUyConnector
from app.etl.pipeline import run_etl
from app.models import ImportOperation
from app.services import analytics
from app.services.change_detector import detect_variations

STATIC_DIR = Path(__file__).resolve().parent.parent / "static"


def create_app() -> FastAPI:
    app = FastAPI(
        title="Supply Intelligence — Importaciones Construcción Uruguay",
        description="Dashboard con datos reales de importaciones Uruguay (datospublicos.uy / DNA)",
        version="2.0.0",
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
        from app.database import SessionLocal

        db = SessionLocal()
        try:
            if db.query(ImportOperation).count() == 0:
                run_etl(db, [DatosPublicosSnapshotConnector()])
                detect_variations(db)
        finally:
            db.close()

    @app.get("/api/health")
    def health():
        return {"status": "ok"}

    @app.get("/api/meta")
    def meta(db: Session = Depends(get_db)):
        return {
            "sources": analytics.get_data_sources(db),
            "field_coverage": analytics.get_field_coverage(db),
            "notes": [
                "Importador, valor USD, kg, origen y producto provienen de datospublicos.uy (DNA).",
                "Proveedor, FOB, flete y aranceles no están en la fuente pública gratuita — se muestran vacíos.",
                "USD/kg es un proxy de precio cuando hay valor y peso declarados.",
                "Descarga CSV completa en datospublicos.uy requiere plan Pro.",
            ],
        }

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
    def ingest(
        max_pages: int = Query(40, ge=5, le=200),
        db: Session = Depends(get_db),
    ):
        connector = DatosPublicosUyConnector(
            max_tabla_pages=max_pages,
            fetch_importer_histories=True,
            request_delay_sec=0.35,
        )
        result = run_etl(db, [connector])
        alerts = detect_variations(db)
        result["alerts_generated"] = len(alerts)
        result["source"] = "datospublicos.uy"
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


app = create_app()
