# Supply Intelligence — Importaciones Construcción Uruguay

Dashboard de importaciones de productos de construcción en Uruguay. Muestra **quién importa**, **volumen (kg)**, **precio proxy (USD/kg)** y **origen**, usando solo datos públicos reales. Los campos que la fuente no publica (proveedor, FOB, flete, aranceles, costo desaduanizado) se dejan vacíos.

## Fuente principal

| Fuente | URL | Campos disponibles |
|--------|-----|-------------------|
| **datospublicos.uy** (DNA Uruguay) | https://datospublicos.uy/tabla/aduanas_operaciones | Importador, RUT, fecha, valor USD declarado, kg, país origen, producto/NCM, aduana |
| CSV completo DNA | Requiere plan Pro en datospublicos.uy | — |

## Productos filtrados

Madera, WPC, cielorraso PVC, placas simil mármol, piedra flexible, perfiles para yeso, pisos SPC, OSB, fenólicos, MDF, puertas semi blindada (filtro por NCM y palabras clave).

## Instalación

```bash
cd supply-intelligence
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Abrir http://localhost:8000

Al iniciar, si la base está vacía, carga `data/raw/datospublicos_snapshot.json` (operaciones reales ya descargadas).

## Sincronizar más datos

```bash
# Descargar snapshot ampliado desde datospublicos.uy (lento, ~30s por importador)
python scripts/fetch_datospublicos_snapshot.py

# O desde el dashboard: botón "Sincronizar DNA"
# O vía API:
curl -X POST "http://localhost:8000/api/ingest?max_pages=20"
```

## API

| Endpoint | Descripción |
|----------|-------------|
| `GET /api/meta` | Fuentes y cobertura de campos |
| `GET /api/summary?product=` | KPIs |
| `GET /api/trends?product=&months=12` | Series temporales |
| `GET /api/importers?product=` | Ranking importadores |
| `GET /api/operations?product=` | Operaciones con campos vacíos donde no hay dato |
| `GET /api/alerts?product=` | Alertas de variación |
| `POST /api/ingest` | Sincronizar datospublicos.uy |

## Cobertura honesta de datos

| Campo | Fuente gratuita |
|-------|-----------------|
| Importador, RUT | Sí |
| Valor USD declarado, kg | Sí |
| Origen, NCM, aduana | Sí |
| USD/kg (calculado) | Sí, si hay USD y kg |
| Proveedor extranjero | No |
| FOB, flete, aranceles | No |
| Costo desaduanizado | No (sin FOB/flete/aranceles) |
