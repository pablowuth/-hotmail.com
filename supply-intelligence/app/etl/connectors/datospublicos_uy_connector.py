"""
Conector a datospublicos.uy — Operaciones aduaneras DNA Uruguay.

Fuente: https://datospublicos.uy/tabla/aduanas_operaciones
Campos disponibles: fecha, RUT, importador, tipo, valor USD, kg, país origen,
producto (descripción + NCM), aduana.

Campos NO disponibles en esta fuente (quedan vacíos): proveedor, FOB, flete,
aranceles, tasas, costo desaduanizado desglosado.
"""

from __future__ import annotations

import re
import time
from datetime import datetime
from typing import Iterator
from urllib.parse import quote

import httpx
from bs4 import BeautifulSoup

from app.etl.connectors.base import ImportDataConnector, RawImportRecord
from app.services.construction_filter import extract_hs_code, infer_category, is_construction_product
from app.services.country_codes import resolve_country
from app.services.number_parse import parse_amount

BASE = "https://datospublicos.uy"
USER_AGENT = "MercadeoIA-SupplyIntel/1.0 (datos abiertos Uruguay; +https://github.com)"


class DatosPublicosUyConnector(ImportDataConnector):
    """Extrae importaciones de construcción desde datospublicos.uy."""

    SEARCH_TERMS = (
        "mdf importacion",
        "madera importacion",
        "wpc importacion",
        "spc piso importacion",
        "pvc cielorraso",
        "revestimiento construccion",
    )

    def __init__(
        self,
        max_tabla_pages: int = 80,
        fetch_importer_histories: bool = True,
        request_delay_sec: float = 0.4,
    ):
        self.max_tabla_pages = max_tabla_pages
        self.fetch_importer_histories = fetch_importer_histories
        self.request_delay_sec = request_delay_sec
        self._seen_source_ids: set[str] = set()

    @property
    def source_name(self) -> str:
        return "datospublicos_uy"

    def fetch_records(self) -> Iterator[RawImportRecord]:
        with httpx.Client(
            timeout=httpx.Timeout(90.0, connect=15.0),
            headers={"User-Agent": USER_AGENT},
            follow_redirects=True,
        ) as client:
            importer_ruts: set[str] = set()

            for term in self.SEARCH_TERMS:
                for rut in self._search_importer_ruts(client, term):
                    importer_ruts.add(rut)
                time.sleep(self.request_delay_sec)

            if self.fetch_importer_histories:
                for rut in sorted(importer_ruts):
                    yield from self._fetch_importer_operations(client, rut)
                    time.sleep(self.request_delay_sec)

            for page in range(1, self.max_tabla_pages + 1):
                rows = self._fetch_tabla_page(client, page)
                if not rows:
                    break
                yield from self._rows_to_records(rows, page)
                time.sleep(self.request_delay_sec)

    def _get_html(self, client: httpx.Client, path: str) -> str | None:
        try:
            r = client.get(f"{BASE}{path}")
            if r.status_code != 200:
                return None
            if "Error interno" in r.text:
                return None
            return r.text
        except httpx.HTTPError:
            return None

    def _search_importer_ruts(self, client: httpx.Client, query: str) -> list[str]:
        html = self._get_html(client, f"/api/search?q={quote(query)}")
        if not html:
            return []
        return list(set(re.findall(r"/proveedor/(\d+)", html)))

    def _fetch_importer_operations(self, client: httpx.Client, rut: str) -> Iterator[RawImportRecord]:
        html = self._get_html(client, f"/proveedor/{rut}/aduanas?partial=1")
        if not html:
            return
        name = self._resolve_importer_name(client, rut, html) if html else rut
        rows = self._parse_operations_table(html, default_rut=rut, default_name=name)
        yield from self._rows_to_records(rows, source_page=f"prov-{rut}")

    def _fetch_tabla_page(self, client: httpx.Client, page: int) -> list[dict]:
        html = self._get_html(client, f"/tabla/aduanas_operaciones?page={page}&partial=1")
        if not html:
            return []
        return self._parse_operations_table(html)

    def _importer_name_from_page(self, html: str) -> str | None:
        soup = BeautifulSoup(html, "html.parser")
        h1 = soup.find("h1")
        if h1:
            return h1.get_text(strip=True)
        title = soup.find("title")
        if title:
            text = title.get_text(strip=True)
            if text and "datospublicos" not in text.lower():
                return text.split("|")[0].strip()
        return None

    def _resolve_importer_name(self, client: httpx.Client, rut: str, html: str) -> str:
        name = self._importer_name_from_page(html)
        if name:
            return name
        full = self._get_html(client, f"/proveedor/{rut}")
        if full:
            name = self._importer_name_from_page(full)
            if name:
                return name
        return rut

    def _parse_operations_table(
        self, html: str, default_rut: str | None = None, default_name: str | None = None
    ) -> list[dict]:
        soup = BeautifulSoup(html, "html.parser")
        table = soup.find("table", class_="table-compact")
        if not table:
            return []
        tbody = table.find("tbody")
        if not tbody:
            return []

        rows = []
        for tr in tbody.find_all("tr"):
            cells = tr.find_all("td")
            if len(cells) < 5:
                continue

            def cell_title(idx: int, fallback: str = "") -> str:
                if idx >= len(cells):
                    return fallback
                return cells[idx].get("title") or cells[idx].get_text(strip=True) or fallback

            # Tabla global: Fecha, RUT, Nombre, Tipo, USD, Kg, País, Producto, Aduana
            # Perfil importador: Fecha, Tipo, País, Mercadería, USD, Kg, Aduana
            if len(cells) >= 9:
                fecha = cell_title(0)
                rut = cell_title(1)
                link = cells[1].find("a")
                if link and link.get("href"):
                    m = re.search(r"/proveedor/(\d+)", link["href"])
                    if m:
                        rut = m.group(1)
                nombre = cell_title(2)
                tipo = cell_title(3)
                usd = cell_title(4)
                kg = cell_title(5)
                pais = cell_title(6)
                producto = cell_title(7)
                aduana = cell_title(8)
            else:
                fecha = cell_title(0)
                rut = default_rut or ""
                nombre = default_name or ""
                tipo = cell_title(1)
                pais = cell_title(2)
                producto = cell_title(3)
                usd = cell_title(4)
                kg = cell_title(5)
                aduana = cell_title(6)

            if tipo.upper() not in ("I", "IMPORTACIÓN", "IMPORTACION"):
                continue

            rows.append(
                {
                    "fecha": fecha,
                    "rut": rut,
                    "nombre": nombre,
                    "usd": usd,
                    "kg": kg,
                    "pais": pais,
                    "producto": producto,
                    "aduana": aduana,
                }
            )
        return rows

    def _rows_to_records(self, rows: list[dict], source_page: str | int) -> Iterator[RawImportRecord]:
        for i, row in enumerate(rows):
            producto = row.get("producto", "")
            if not is_construction_product(producto):
                continue

            hs = extract_hs_code(producto)
            category = infer_category(producto, hs)
            if not category:
                continue

            try:
                op_date = datetime.strptime(row["fecha"][:10], "%Y-%m-%d").date()
            except (ValueError, TypeError):
                try:
                    op_date = datetime.strptime(row["fecha"][:10], "%d/%m/%Y").date()
                except (ValueError, TypeError):
                    continue

            usd = parse_amount(row.get("usd", ""))
            kg = parse_amount(row.get("kg", ""))

            source_id = f"{row.get('rut','')}-{op_date.isoformat()}-{hs or 'x'}-{usd}-{i}-{source_page}"
            if source_id in self._seen_source_ids:
                continue
            self._seen_source_ids.add(source_id)

            yield RawImportRecord(
                source_id=source_id[:64],
                source_name=self.source_name,
                operation_date=op_date,
                importer_name=row.get("nombre") or "—",
                importer_tax_id=row.get("rut") or None,
                supplier_name=None,
                supplier_country=None,
                product_name=producto.split("(")[0].strip() or producto[:80],
                product_category=category.value,
                hs_code=hs or "",
                origin_country=resolve_country(row.get("pais")) or row.get("pais") or "",
                destination_country="UY",
                quantity=kg if kg and kg > 0 else None,
                unit="kg" if kg and kg > 0 else None,
                fob_value_usd=None,
                freight_usd=None,
                insurance_usd=None,
                tariff_rate=None,
                additional_tax_rate=None,
                declared_value_usd=usd,
                entry_port=row.get("aduana"),
                transport_mode=None,
                description_raw=producto,
            )

    @staticmethod
    def _parse_number(value: str) -> float | None:
        return parse_amount(value)
