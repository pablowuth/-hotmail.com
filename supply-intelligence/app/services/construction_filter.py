"""Filtro de productos de construcción para operaciones aduaneras Uruguay."""

import re
from app.models import ProductCategory

# Capítulos / partidas NCM frecuentes en construcción
HS_PREFIXES = (
    "4407", "4409", "4410", "4411", "4412", "4418", "4419", "441233", "441114",
    "3918", "391810", "392062", "392590", "392690", "3925", "3926",
    "6810", "681019", "6811",
    "6802", "6803",
    "7210", "7216", "721691",
)

KEYWORDS = (
    "madera", "wpc", "mdf", "osb", "fenol", "fenólic", "spc", "pvc", "cielorraso",
    "cielo raso", "yeso", "durlock", "revest", "piedra", "marmol", "mármol",
    "puerta", "semi blind", "tablero", "piso", "deck", "laminado", "melamina",
    "aglomer", "contrachap", "perfil", "steel frame",
)


def extract_hs_code(product_text: str) -> str | None:
    if not product_text:
        return None
    text = product_text.strip()
    if re.fullmatch(r"\d{4,10}", text):
        return text
    m = re.search(r"\((\d{4,10})", text)
    if m:
        return m.group(1)
    m = re.search(r"\b(\d{8,10})\b", text)
    return m.group(1) if m else None


def infer_category(product_text: str, hs: str | None) -> ProductCategory | None:
    text = (product_text or "").lower()
    hs = hs or ""

    rules: list[tuple[ProductCategory, tuple[str, ...]]] = [
        (ProductCategory.PUERTAS_SEMI_BLINDADA, ("puerta", "4418", "blind")),
        (ProductCategory.MDF, ("mdf", "441114", "aglomer", "melamina")),
        (ProductCategory.OSB, ("osb", "441233")),
        (ProductCategory.FENOLICOS, ("fenol", "4410")),
        (ProductCategory.PISOS_SPC, ("spc", "391810", "piso vinil", "piso click")),
        (ProductCategory.WPC, ("wpc", "deck")),
        (ProductCategory.CIELORRASO_PVC, ("cielorraso", "cielo raso", "392590", "392062", "plástico", "plastico")),
        (ProductCategory.PLACAS_SIMIL_MARMOL, ("simil marm", "mármol", "marmol", "681019")),
        (ProductCategory.PIEDRA_FLEXIBLE, ("piedra flex", "piedra", "6803")),
        (ProductCategory.PERFILES_YESO, ("perfil", "yeso", "durlock", "721691", "steel frame")),
        (ProductCategory.MADERA, ("madera", "4407", "4409", "contrachap")),
    ]
    for category, tokens in rules:
        if any(t in text or t in hs for t in tokens):
            return category
    if hs.startswith(("44", "39", "68", "72")):
        return ProductCategory.MADERA
    return None


def is_construction_product(product_text: str) -> bool:
    if not product_text:
        return False
    text = product_text.lower()
    hs = extract_hs_code(product_text) or ""
    if any(hs.startswith(p) for p in HS_PREFIXES):
        return True
    if any(kw in text for kw in KEYWORDS):
        return True
    return False
