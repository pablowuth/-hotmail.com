#!/usr/bin/env python3
"""Descarga operaciones aduaneras de importadores construcción desde datospublicos.uy."""

from __future__ import annotations

import json
import re
import sys
import time
from pathlib import Path

import httpx

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.services.construction_filter import extract_hs_code, infer_category, is_construction_product
from app.services.country_codes import resolve_country
from scripts.parse_datospublicos_html import parse_table

BASE = "https://datospublicos.uy"
OUT = Path(__file__).resolve().parent.parent / "data" / "raw" / "datospublicos_snapshot.json"

# RUTs hallados vía búsqueda en datospublicos.uy (madera, mdf, revestimiento, puerta, yeso, bric)
IMPORTER_RUTS = [
    ("216595910016", "BRIC ELEMENTS IMPORTACION & EXPORTACION S R L"),
    ("010107270010", None),
    ("210340070013", None),
    ("000009768809", None),
    ("020562400014", None),
    ("100839780016", None),
    ("190156610010", None),
    ("213594340017", None),
    ("214233410018", None),
    ("216597790018", None),
    ("216772000017", None),
    ("040101280016", None),
    ("211193930011", None),
    ("214737710015", None),
    ("070278230017", None),
    ("215284230015", None),
    ("216322490013", None),
    ("216129230013", None),
]

SEARCH_TERMS = ("mdf", "madera", "tablero", "revestimiento", "puerta", "yeso", "pvc", "osb", "fenolico")


def fetch_html(client: httpx.Client, path: str) -> str | None:
    try:
        r = client.get(f"{BASE}{path}", timeout=90.0)
        if r.status_code != 200 or "Error interno" in r.text:
            return None
        return r.text
    except httpx.HTTPError:
        return None


def importer_name_from_html(html: str) -> str | None:
    from bs4 import BeautifulSoup

    soup = BeautifulSoup(html, "html.parser")
    h1 = soup.find("h1")
    return h1.get_text(strip=True) if h1 else None


def search_ruts(client: httpx.Client, query: str) -> list[str]:
    html = fetch_html(client, f"/api/search?q={query.replace(' ', '%20')}")
    if not html:
        return []
    return list(set(re.findall(r"/proveedor/(\d+)", html)))


def normalize_row(row: dict) -> dict:
    hs = extract_hs_code(row.get("producto", ""))
    category = infer_category(row.get("producto", ""), hs)
    if not category:
        return row
    row["hs"] = hs
    row["category"] = category.value
    row["pais"] = resolve_country(row.get("pais")) or row.get("pais")
    return row


def main():
    all_rows: list[dict] = []
    seen: set[str] = set()

    # HTML local ya capturado
    for f in Path("/tmp").glob("*.html"):
        if f.stat().st_size < 500:
            continue
        html = f.read_text(encoding="utf-8", errors="ignore")
        default_rut = default_name = None
        if "adu" in f.name or "bric" in f.name:
            default_rut, default_name = "216595910016", "BRIC ELEMENTS IMPORTACION & EXPORTACION S R L"
        for row in parse_table(html, default_rut, default_name):
            key = f"{row.get('rut')}-{row.get('fecha')}-{row.get('producto')}-{row.get('usd')}"
            if key not in seen:
                seen.add(key)
                all_rows.append(normalize_row(row))

    ruts: dict[str, str | None] = {r: n for r, n in IMPORTER_RUTS}

    with httpx.Client(
        headers={"User-Agent": "MercadeoIA-SupplyIntel/1.0"},
        follow_redirects=True,
        timeout=httpx.Timeout(90.0, connect=20.0),
    ) as client:
        for term in SEARCH_TERMS:
            for rut in search_ruts(client, term):
                ruts.setdefault(rut, None)
            time.sleep(0.5)

        for i, (rut, name) in enumerate(sorted(ruts.items())):
            print(f"[{i+1}/{len(ruts)}] {rut} …", flush=True)
            html = fetch_html(client, f"/proveedor/{rut}/aduanas?partial=1")
            if not html:
                continue
            resolved_name = name or importer_name_from_html(html) or rut
            for row in parse_table(html, rut, resolved_name):
                row = normalize_row(row)
                key = f"{row.get('rut')}-{row.get('fecha')}-{row.get('producto')}-{row.get('usd')}"
                if key in seen:
                    continue
                seen.add(key)
                all_rows.append(row)
            time.sleep(0.6)

        for page in range(1, 11):
            html = fetch_html(client, f"/tabla/aduanas_operaciones?page={page}&partial=1")
            if not html:
                break
            page_rows = parse_table(html)
            if not page_rows:
                break
            for row in page_rows:
                row = normalize_row(row)
                key = f"{row.get('rut')}-{row.get('fecha')}-{row.get('producto')}-{row.get('usd')}"
                if key in seen:
                    continue
                seen.add(key)
                all_rows.append(row)
            print(f"tabla p{page}: +{len(page_rows)} filas construcción", flush=True)
            time.sleep(0.6)

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(all_rows, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Snapshot: {len(all_rows)} operaciones -> {OUT}")


if __name__ == "__main__":
    main()
