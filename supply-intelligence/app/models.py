import enum
import uuid
from datetime import date, datetime

from sqlalchemy import (
    Date,
    DateTime,
    Enum,
    Float,
    ForeignKey,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class ProductCategory(str, enum.Enum):
    MADERA = "madera"
    WPC = "wpc"
    CIELORRASO_PVC = "cielorraso_pvc"
    PLACAS_SIMIL_MARMOL = "placas_simil_marmol"
    PIEDRA_FLEXIBLE = "piedra_flexible"
    PERFILES_YESO = "perfiles_yeso"
    PISOS_SPC = "pisos_spc"
    OSB = "osb"
    FENOLICOS = "fenolicos"
    MDF = "mdf"
    PUERTAS_SEMI_BLINDADA = "puertas_semi_blindada"


class AlertSeverity(str, enum.Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class Importer(Base):
    __tablename__ = "importers"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    legal_name: Mapped[str] = mapped_column(String(255), index=True)
    tax_id: Mapped[str | None] = mapped_column(String(32), nullable=True, index=True)
    country_code: Mapped[str] = mapped_column(String(2), default="UY")
    __table_args__ = (UniqueConstraint("legal_name", "tax_id", name="uq_importer_name_rut"),)

    operations: Mapped[list["ImportOperation"]] = relationship(back_populates="importer")


class Supplier(Base):
    __tablename__ = "suppliers"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name: Mapped[str] = mapped_column(String(255), index=True)
    country_code: Mapped[str] = mapped_column(String(2), default="—")
    __table_args__ = (UniqueConstraint("name", "country_code", name="uq_supplier_name_country"),)

    operations: Mapped[list["ImportOperation"]] = relationship(back_populates="supplier")


class Product(Base):
    __tablename__ = "products"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    canonical_name: Mapped[str] = mapped_column(String(255), index=True)
    category: Mapped[ProductCategory] = mapped_column(Enum(ProductCategory), index=True)
    hs_code: Mapped[str | None] = mapped_column(String(12), nullable=True)
    unit: Mapped[str | None] = mapped_column(String(16), nullable=True)

    operations: Mapped[list["ImportOperation"]] = relationship(back_populates="product")


class ImportOperation(Base):
    __tablename__ = "import_operations"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    source_id: Mapped[str] = mapped_column(String(96), index=True)
    source_name: Mapped[str] = mapped_column(String(64), index=True)
    operation_date: Mapped[date] = mapped_column(Date, index=True)

    importer_id: Mapped[str] = mapped_column(ForeignKey("importers.id"), index=True)
    supplier_id: Mapped[str | None] = mapped_column(ForeignKey("suppliers.id"), nullable=True, index=True)
    product_id: Mapped[str] = mapped_column(ForeignKey("products.id"), index=True)

    origin_country: Mapped[str | None] = mapped_column(String(64), nullable=True)
    destination_country_code: Mapped[str] = mapped_column(String(2), default="UY")
    quantity: Mapped[float | None] = mapped_column(Float, nullable=True)
    unit: Mapped[str | None] = mapped_column(String(16), nullable=True)
    weight_kg: Mapped[float | None] = mapped_column(Float, nullable=True)

    declared_value_usd: Mapped[float | None] = mapped_column(Float, nullable=True)
    fob_value_usd: Mapped[float | None] = mapped_column(Float, nullable=True)
    freight_usd: Mapped[float | None] = mapped_column(Float, nullable=True)
    insurance_usd: Mapped[float | None] = mapped_column(Float, nullable=True)
    tariff_rate: Mapped[float | None] = mapped_column(Float, nullable=True)
    tariff_usd: Mapped[float | None] = mapped_column(Float, nullable=True)
    additional_taxes_usd: Mapped[float | None] = mapped_column(Float, nullable=True)
    cif_usd: Mapped[float | None] = mapped_column(Float, nullable=True)
    landed_cost_total_usd: Mapped[float | None] = mapped_column(Float, nullable=True)
    landed_cost_per_unit_usd: Mapped[float | None] = mapped_column(Float, nullable=True)
    usd_per_kg: Mapped[float | None] = mapped_column(Float, nullable=True)

    customs_office: Mapped[str | None] = mapped_column(String(64), nullable=True)
    transport_mode: Mapped[str | None] = mapped_column(String(16), nullable=True)
    description_raw: Mapped[str | None] = mapped_column(Text, nullable=True)
    hs_code_raw: Mapped[str | None] = mapped_column(String(16), nullable=True)

    ingested_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    importer: Mapped[Importer] = relationship(back_populates="operations")
    supplier: Mapped[Supplier | None] = relationship(back_populates="operations")
    product: Mapped[Product] = relationship(back_populates="operations")

    __table_args__ = (UniqueConstraint("source_id", "source_name", name="uq_operation_source"),)


class VariationAlert(Base):
    __tablename__ = "variation_alerts"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    alert_type: Mapped[str] = mapped_column(String(64), index=True)
    severity: Mapped[AlertSeverity] = mapped_column(Enum(AlertSeverity), index=True)
    product_id: Mapped[str | None] = mapped_column(ForeignKey("products.id"), nullable=True, index=True)
    importer_id: Mapped[str | None] = mapped_column(ForeignKey("importers.id"), nullable=True, index=True)
    title: Mapped[str] = mapped_column(String(255))
    description: Mapped[str] = mapped_column(Text)
    previous_value: Mapped[float | None] = mapped_column(Float, nullable=True)
    current_value: Mapped[float | None] = mapped_column(Float, nullable=True)
    change_pct: Mapped[float | None] = mapped_column(Float, nullable=True)
    detected_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)
    period_start: Mapped[date | None] = mapped_column(Date, nullable=True)
    period_end: Mapped[date | None] = mapped_column(Date, nullable=True)
