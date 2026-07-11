#!/usr/bin/env python3
"""Parsea HTML guardado de datospublicos.uy a JSON de operaciones."""

import json
import re
import sys
from pathlib import Path

from bs4 import BeautifulSoup

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.services.construction_filter import extract_hs_code, infer_category, is_construction_product

OUT = Path(__file__).resolve().parent.parent / "data" / "raw" / "datospublicos_snapshot.json"


def parse_table(html: str, default_rut: str | None = None, default_name: str | None = None) -> list[dict]:
    soup = BeautifulSoup(html, "html.parser")
    table = soup.find("table", class_="table-compact")
    if not table or not table.find("tbody"):
        return []
    rows = []
    for tr in table.find("tbody").find_all("tr"):
        cells = tr.find_all("td")
        if len(cells) < 5:
            continue

        def title(i: int, fb: str = "") -> str:
            return cells[i].get("title") or cells[i].get_text(strip=True) or fb

        if len(cells) >= 9:
            row = {
                "fecha": title(0),
                "rut": title(1),
                "nombre": title(2),
                "tipo": title(3),
                "usd": title(4),
                "kg": title(5),
                "pais": title(6),
                "producto": title(7),
                "aduana": title(8),
            }
            link = cells[1].find("a")
            if link and link.get("href"):
                m = re.search(r"/proveedor/(\d+)", link["href"])
                if m:
                    row["rut"] = m.group(1)
        else:
            row = {
                "fecha": title(0),
                "rut": default_rut or "",
                "nombre": default_name or "",
                "tipo": title(1),
                "pais": title(2),
                "producto": title(3),
                "usd": title(4),
                "kg": title(5),
                "aduana": title(6),
            }
        if row["tipo"].upper() not in ("I", "IMPORTACIÓN", "IMPORTACION"):
            continue
        if not is_construction_product(row["producto"]):
            continue
        row["hs"] = extract_hs_code(row["producto"])
        category = infer_category(row["producto"], row["hs"])
        if not category:
            continue
        row["category"] = category.value
        rows.append(row)
    return rows


def main():
    files = list(Path("/tmp").glob("tabla*.html")) + list(Path("/tmp").glob("adu.html"))
    all_rows = []
    for f in files:
        if f.stat().st_size < 500:
            continue
        html = f.read_text(encoding="utf-8", errors="ignore")
        name = None
        rut = None
        if "adu.html" in f.name:
            rut = "216595910016"
            name = "BRIC ELEMENTS IMPORTACION & EXPORTACION S R L"
        all_rows.extend(parse_table(html, rut, name))

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(all_rows, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Saved {len(all_rows)} construction rows -> {OUT}")


if __name__ == "__main__":
    main()
