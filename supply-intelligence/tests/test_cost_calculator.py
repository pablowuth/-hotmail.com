import pytest
from datetime import date

from app.services.cost_calculator import LandedCostInput, calculate_landed_cost


def test_landed_cost_calculation():
    result = calculate_landed_cost(
        LandedCostInput(
            fob_value_usd=10000,
            freight_usd=1200,
            insurance_usd=50,
            tariff_rate=0.14,
            additional_tax_rate=0.22,
            quantity=1000,
        )
    )
    assert result.cif_usd == 11250.0
    assert result.tariff_usd == 1575.0
    assert result.additional_taxes_usd == 2821.5
    assert result.landed_cost_total_usd == 15646.5
    assert result.landed_cost_per_unit_usd == 15.6465


def test_quantity_must_be_positive():
    with pytest.raises(ValueError):
        calculate_landed_cost(
            LandedCostInput(
                fob_value_usd=100,
                freight_usd=10,
                insurance_usd=0,
                tariff_rate=0.1,
                additional_tax_rate=0.2,
                quantity=0,
            )
        )
