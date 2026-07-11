"""Parseo de montos publicados por datospublicos.uy (US$, separadores, sufijo k)."""

import re


def parse_amount(value: str | float | int | None) -> float | None:
    if value is None:
        return None
    if isinstance(value, (int, float)):
        return float(value)

    s = str(value).strip()
    if not s:
        return None

    s = s.replace("US$", "").replace("USD", "").replace("$", "").strip()
    multiplier = 1.0
    if re.search(r"[kK]\s*$", s):
        multiplier = 1000.0
        s = re.sub(r"[kK]\s*$", "", s).strip()

    # Formato uruguayo: 7.023,88 o 541.935
    if "," in s and "." in s:
        s = s.replace(".", "").replace(",", ".")
    elif "," in s:
        s = s.replace(",", ".")
    elif s.count(".") > 1:
        s = s.replace(".", "")

    try:
        return float(s) * multiplier
    except ValueError:
        return None
