const API = "";
let costChart, volumeChart, compositionChart;

const fmtUsd = (n) =>
  new Intl.NumberFormat("es-UY", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(n);

const fmtNum = (n) =>
  new Intl.NumberFormat("es-UY", { maximumFractionDigits: 2 }).format(n);

const fmtPct = (n) => (n == null ? "—" : `${(n * 100).toFixed(1)}%`);

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

async function loadCategories() {
  const categories = await fetchJson("/api/categories");
  const select = document.getElementById("productFilter");
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
  const kpis = document.getElementById("kpis");
  kpis.innerHTML = `
    <div class="kpi"><div class="label">Operaciones</div><div class="value">${fmtNum(data.total_operations)}</div></div>
    <div class="kpi"><div class="label">Valor desaduanizado</div><div class="value small">${fmtUsd(data.total_landed_cost_usd)}</div></div>
    <div class="kpi"><div class="label">Costo prom./unidad</div><div class="value small">${fmtUsd(data.avg_landed_cost_per_unit_usd)}</div></div>
    <div class="kpi"><div class="label">Importadores</div><div class="value">${data.active_importers}</div></div>
    <div class="kpi"><div class="label">Proveedores</div><div class="value">${data.active_suppliers}</div></div>
    <div class="kpi"><div class="label">Alertas activas</div><div class="value">${data.open_alerts}</div></div>
  `;
}

async function loadTrends() {
  const q = productQuery();
  const data = await fetchJson(`/api/trends?months=12${q ? "&" + q : ""}`);
  const labels = data.map((d) => d.period);
  const costs = data.map((d) => d.avg_unit_cost_usd);
  const volumes = data.map((d) => d.volume);
  const fob = data.map((d) => d.total_fob_usd);
  const freight = data.map((d) => d.total_freight_usd);
  const tariff = data.map((d) => d.total_tariff_usd);

  const chartDefaults = {
    responsive: true,
    plugins: { legend: { labels: { color: "#8fa3bf" } } },
    scales: {
      x: { ticks: { color: "#8fa3bf" }, grid: { color: "#2f3f56" } },
      y: { ticks: { color: "#8fa3bf" }, grid: { color: "#2f3f56" } },
    },
  };

  if (costChart) costChart.destroy();
  costChart = new Chart(document.getElementById("costChart"), {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: "USD/unidad desaduanizado",
        data: costs,
        borderColor: "#3b9eff",
        backgroundColor: "rgba(59,158,255,0.15)",
        fill: true,
        tension: 0.3,
      }],
    },
    options: chartDefaults,
  });

  if (volumeChart) volumeChart.destroy();
  volumeChart = new Chart(document.getElementById("volumeChart"), {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Cantidad importada",
        data: volumes,
        backgroundColor: "rgba(34,197,94,0.6)",
        borderColor: "#22c55e",
        borderWidth: 1,
      }],
    },
    options: chartDefaults,
  });

  if (compositionChart) compositionChart.destroy();
  compositionChart = new Chart(document.getElementById("compositionChart"), {
    type: "bar",
    data: {
      labels,
      datasets: [
        { label: "FOB", data: fob, backgroundColor: "#3b9eff" },
        { label: "Flete", data: freight, backgroundColor: "#f59e0b" },
        { label: "Arancel", data: tariff, backgroundColor: "#ef4444" },
      ],
    },
    options: { ...chartDefaults, scales: { ...chartDefaults.scales, x: { stacked: true, ticks: { color: "#8fa3bf" }, grid: { color: "#2f3f56" } }, y: { stacked: true, ticks: { color: "#8fa3bf" }, grid: { color: "#2f3f56" } } } },
  });
}

async function loadAlerts() {
  const q = productQuery();
  const data = await fetchJson(`/api/alerts${q ? "?" + q : ""}`);
  const container = document.getElementById("alertsList");

  if (!data.length) {
    container.innerHTML = '<p class="empty">Sin alertas de variación para el filtro seleccionado.</p>';
    return;
  }

  container.innerHTML = data.map((a) => `
    <div class="alert ${a.severity}">
      <div class="title">${a.title}</div>
      <div class="desc">${a.description}</div>
      <div class="meta">
        ${a.type} · ${a.severity}
        ${a.change_pct != null ? ` · ${fmtPct(a.change_pct)}` : ""}
        ${a.product ? ` · ${a.product}` : ""}
      </div>
    </div>
  `).join("");
}

async function loadImporters() {
  const q = productQuery();
  const data = await fetchJson(`/api/importers?limit=20${q ? "&" + q : ""}`);
  const tbody = document.querySelector("#importersTable tbody");
  tbody.innerHTML = data.map((r) => `
    <tr>
      <td>${r.legal_name}</td>
      <td>${r.tax_id || "—"}</td>
      <td>${r.operations}</td>
      <td>${fmtUsd(r.total_landed_usd)}</td>
      <td>${fmtNum(r.total_quantity)}</td>
      <td>${fmtUsd(r.avg_unit_cost_usd)}</td>
    </tr>
  `).join("");
}

async function loadOperations() {
  const q = productQuery();
  const data = await fetchJson(`/api/operations?limit=30${q ? "&" + q : ""}`);
  const tbody = document.querySelector("#operationsTable tbody");
  tbody.innerHTML = data.map((op) => `
    <tr>
      <td>${op.date}</td>
      <td>${op.importer}</td>
      <td>${op.supplier} (${op.supplier_country})</td>
      <td>${op.product}</td>
      <td>${fmtNum(op.quantity)} ${op.unit}</td>
      <td>${fmtUsd(op.fob_usd)}</td>
      <td>${fmtUsd(op.freight_usd)}</td>
      <td>${fmtUsd(op.tariff_usd)}</td>
      <td>${fmtUsd(op.additional_taxes_usd)}</td>
      <td><strong>${fmtUsd(op.landed_cost_per_unit_usd)}</strong></td>
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
  btn.textContent = "Sincronizando…";
  try {
    const result = await fetch(`${API}/api/ingest`, { method: "POST" }).then((r) => r.json());
    btn.textContent = `+${result.inserted} registros`;
    await fetch(`${API}/api/recalculate-alerts`, { method: "POST" });
    await refreshAll();
  } catch (e) {
    btn.textContent = "Error";
    console.error(e);
  } finally {
    setTimeout(() => { btn.disabled = false; btn.textContent = "Sincronizar fuentes"; }, 2000);
  }
}

document.getElementById("productFilter").addEventListener("change", refreshAll);
document.getElementById("refreshBtn").addEventListener("click", refreshAll);
document.getElementById("ingestBtn").addEventListener("click", syncSources);

(async () => {
  await loadCategories();
  await refreshAll();
})();
