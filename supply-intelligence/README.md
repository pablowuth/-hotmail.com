# Supply Intelligence — Importaciones Construcción

Dashboard de importaciones de productos de construcción con cálculo de costo desaduanizado, detección de variaciones y alertas.

## Productos cubiertos

Madera, WPC, cielorraso PVC, placas simil mármol, piedra flexible, perfiles para yeso, pisos SPC, OSB, fenólicos, MDF, puertas semi blindada.

## Fuentes de datos

| Conector | Descripción |
|----------|-------------|
| `CsvImportConnector` | Archivo CSV normalizado (`data/seed/importaciones_construccion.csv`) |
| `MockTradeApiConnector` | Simula API comercial (Volza/Panjiva/aduanas) — interfaz lista para producción |

## Cálculo de costo desaduanizado

```
CIF = FOB + flete + seguro
Arancel = CIF × tasa arancelaria
Tasas adicionales = (CIF + arancel) × tasa (IVA/estadística)
Costo total = CIF + arancel + tasas
Costo/unidad = total ÷ cantidad
```

## Instalación y ejecución

```bash
cd supply-intelligence
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python scripts/generate_seed.py
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Abrir http://localhost:8000

## API

| Endpoint | Descripción |
|----------|-------------|
| `GET /api/summary?product=` | KPIs del dashboard |
| `GET /api/trends?product=&months=12` | Series temporales |
| `GET /api/importers?product=` | Ranking de importadores |
| `GET /api/operations?product=` | Últimas operaciones con desglose de costos |
| `GET /api/alerts?product=` | Alertas de variación de costo, proveedor y volumen |
| `GET /api/categories` | Categorías disponibles |
| `POST /api/ingest` | Sincronizar conectores y recalcular alertas |

## Alertas detectadas

- Variación de costo desaduanizado (>12% entre períodos de 30 días)
- Cambio de proveedor principal por producto
- Variación de volumen por importador (>25%)
