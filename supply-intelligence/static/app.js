const API = "";
let valueChart, priceChart, volumeChart;

const fmtUsd = (n) =>
  n == null || n === "" ? "—" : new Intl.NumberFormat("es-UY", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(n);

const fmtNum = (n) =>
  n == null || n === "" ? "—" : new Intl.NumberFormat("es-UY", { maximumFractionDigits: 2 }).format(n);

const fmtPct = (n) => (n == null ? "—" : `${(n * 100).toFixed(1)}%`);

const empty = (v) => v == null || v === "" || v === undefined;

async function fetchJson(path) {
  const res = await fetch(`${API}${path}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function selectedProduct() {
  return document.getElementById("productFilter").value || null;
}

function productQuery() {
  const p = selectedProduct();
  return p ? `product=${encodeURIComponent(p)}` : "";
}

const chartDefaults = {
  responsive: true,
  plugins: { legend: { labels: { color: "#8fa3bf" } } },
  scales: {
    x: { ticks: { color: "#8fa3bf" }, grid: { color: "#2f3f56" } },
    y: { ticks: { color: "#8fa3bf" }, grid: { color: "#2f3f56" } },
  },
};

async function loadMeta() {
  const meta = await fetchJson("/api/meta");
  const cov = meta.field_coverage || {};
  document.getElementById("coverage").innerHTML = `
    <h2>Cobertura de datos (fuente real)</h2>
    <div class="coverage-grid">
      ${Object.entries(cov).map(([k, v]) => `
        <div class="cov-item">
          <span class="cov-label">${k.replace(/_/g, " ")}</span>
          <span class="cov-val ${v < 50 ? "low" : ""}">${v}%</span>
        </div>`).join("")}
    </div>
    <ul class="meta-notes">${(meta.notes || []).map((n) => `<li>${n}</li>`).join("")}</ul>
  `;
}

async function loadCategories() {
  const categories = await fetchJson("/api/categories");
  const select = document.getElementById("productFilter");
  select.innerHTML = '<option value="">Todos</option>';
  categories.forEach((c) => {
    const opt = document.createElement("option");
    opt.value = c.value;
    opt.textContent = `${c.label} (${c.operations})`;
    select.appendChild(opt);
  });
}

async function loadSummary() {
  const q = productQuery();
  const data = await fetchJson(`/api/summary${q ? "?" + q : ""}`);
  document.getElementById("kpis").innerHTML = `
    <div class="kpi"><div class="label">Operaciones</div><div class="value">${fmtNum(data.total_operations)}</div></div>
    <div class="kpi"><div class="label">Valor declarado USD</div><div class="value small">${fmtUsd(data.total_declared_value_usd)}</div></div>
    <div class="kpi"><div class="label">USD/kg promedio</div><div class="value small">${empty(data.avg_usd_per_kg) ? "—" : fmtUsd(data.avg_usd_per_kg)}</div></div>
    <div class="kpi"><div class="label">Importadores</div><div class="value">${data.active_importers}</div></div>
    <div class="kpi"><div class="label">Alertas</div><div class="value">${data.open_alerts}</div></div>
  `;
}

async function loadTrends() {
  const q = productQuery();
  const data = await fetchJson(`/api/trends?months=24${q ? "&" + q : ""}`);
  const labels = data.map((d) => d.period);
  const values = data.map((d) => d.total_value_usd);
  const prices = data.map((d) => d.avg_usd_per_kg);
  const volumes = data.map((d) => d.volume_kg);

  if (valueChart) valueChart.destroy();
  valueChart = new Chart(document.getElementById("valueChart"), {
    type: "bar",
    data: { labels, datasets: [{ label: "USD declarado", data: values, backgroundColor: "#3b9eff" }] },
    options: chartDefaults,
  });

  if (priceChart) priceChart.destroy();
  priceChart = new Chart(document.getElementById("priceChart"), {
    type: "line",
    data: { labels, datasets: [{ label: "USD/kg", data: prices, borderColor: "#f59e0b", tension: 0.3 }] },
    options: chartDefaults,
  });

  if (volumeChart) volumeChart.destroy();
  volumeChart = new Chart(document.getElementById("volumeChart"), {
    type: "bar",
    data: { labels, datasets: [{ label: "Kg", data: volumes, backgroundColor: "#22c55e" }] },
    options: chartDefaults,
  });
}

async function loadAlerts() {
  const q = productQuery();
  const data = await fetchJson(`/api/alerts${q ? "?" + q : ""}`);
  const container = document.getElementById("alertsList");
  if (!data.length) {
    container.innerHTML = '<p class="empty">Sin alertas para el filtro actual.</p>';
    return;
  }
  container.innerHTML = data.map((a) => `
    <div class="alert ${a.severity}">
      <div class="title">${a.title}</div>
      <div class="desc">${a.description}</div>
    </div>
  `).join("");
}

async function loadImporters() {
  const q = productQuery();
  const data = await fetchJson(`/api/importers?limit=30${q ? "&" + q : ""}`);
  document.querySelector("#importersTable tbody").innerHTML = data.map((r) => `
    <tr>
      <td>${r.legal_name}</td>
      <td>${r.tax_id || "—"}</td>
      <td>${r.operations}</td>
      <td>${fmtUsd(r.total_value_usd)}</td>
      <td>${fmtNum(r.total_kg)}</td>
      <td>${empty(r.avg_usd_per_kg) ? "—" : fmtUsd(r.avg_usd_per_kg)}</td>
    </tr>
  `).join("");
}

async function loadOperations() {
  const q = productQuery();
  const data = await fetchJson(`/api/operations?limit=100${q ? "&" + q : ""}`);
  document.querySelector("#operationsTable tbody").innerHTML = data.map((op) => `
    <tr>
      <td>${op.date}</td>
      <td>${op.importer}</td>
      <td>${op.importer_rut || "—"}</td>
      <td>${op.product}</td>
      <td>${op.hs_code || "—"}</td>
      <td>${op.origin || "—"}</td>
      <td>${fmtNum(op.weight_kg)}</td>
      <td>${fmtUsd(op.declared_value_usd)}</td>
      <td class="${empty(op.usd_per_kg) ? "na" : ""}">${empty(op.usd_per_kg) ? "—" : fmtUsd(op.usd_per_kg)}</td>
      <td class="na">${op.supplier || "—"}</td>
      <td class="na">${fmtUsd(op.fob_usd)}</td>
      <td class="na">${fmtUsd(op.freight_usd)}</td>
      <td class="na">${fmtUsd(op.tariff_usd)}</td>
      <td class="na">${fmtUsd(op.landed_cost_per_unit_usd)}</td>
      <td>${op.customs_office || "—"}</td>
    </tr>
  `).join("");
}

async function refreshAll() {
  await Promise.all([
    loadSummary(),
    loadTrends(),
    loadAlerts(),
    loadImporters(),
    loadOperations(),
  ]);
}

async function syncSources() {
  const btn = document.getElementById("ingestBtn");
  btn.disabled = true;
  btn.textContent = "Sincronizando DNA…";
  try {
    const result = await fetch(`${API}/api/ingest?max_pages=30`, { method: "POST" }).then((r) => r.json());
    btn.textContent = `+${result.inserted} ops`;
    await loadMeta();
    await refreshAll();
  } catch (e) {
    btn.textContent = "Error";
    console.error(e);
  } finally {
    setTimeout(() => { btn.disabled = false; btn.textContent = "Sincronizar DNA"; }, 2500);
  }
}

document.getElementById("productFilter").addEventListener("change", refreshAll);
document.getElementById("refreshBtn").addEventListener("click", refreshAll);
document.getElementById("ingestBtn").addEventListener("click", syncSources);

(async () => {
  await loadMeta();
  await loadCategories();
  await refreshAll();
})();
