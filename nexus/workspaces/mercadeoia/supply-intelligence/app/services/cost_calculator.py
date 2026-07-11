"""Cálculo de costo desaduanizado por unidad."""

from dataclasses import dataclass


@dataclass
class LandedCostInput:
    fob_value_usd: float
    freight_usd: float
    insurance_usd: float
    tariff_rate: float
    additional_tax_rate: float
    quantity: float


@dataclass
class LandedCostResult:
    cif_usd: float
    tariff_usd: float
    additional_taxes_usd: float
    landed_cost_total_usd: float
    landed_cost_per_unit_usd: float


def calculate_landed_cost(data: LandedCostInput) -> LandedCostResult:
    """
    Fórmula estándar LATAM (CIF base):
    CIF = FOB + flete + seguro
    Arancel = CIF × tasa arancelaria
    Tasas adicionales (IVA/estadística/percepciones) = (CIF + arancel) × tasa
    Costo desaduanizado total = CIF + arancel + tasas
    Costo por unidad = total / cantidad
    """
    if data.quantity <= 0:
        raise ValueError("La cantidad debe ser mayor a cero")

    cif = data.fob_value_usd + data.freight_usd + data.insurance_usd
    tariff = cif * data.tariff_rate
    tax_base = cif + tariff
    additional_taxes = tax_base * data.additional_tax_rate
    landed_total = cif + tariff + additional_taxes

    return LandedCostResult(
        cif_usd=round(cif, 2),
        tariff_usd=round(tariff, 2),
        additional_taxes_usd=round(additional_taxes, 2),
        landed_cost_total_usd=round(landed_total, 2),
        landed_cost_per_unit_usd=round(landed_total / data.quantity, 4),
    )
