/* ============================================================
   Conversion Status page logic
   Source: ChangedAnalysisEngine (2).html
   Contains this page's bootstrap, renderers, handlers, and data only.
============================================================ */
window.EQUIVALIC_INITIAL_PAGE = window.EQUIVALIC_INITIAL_PAGE || 'Conversion Status';

/* ============================================================
   Page bootstrap and shared shell utilities
============================================================ */
const appState = { product: "Product Suite", section: "Analysis Engine", page: "Project Summary", view: "Overview" };
function renderHeader() {
  const el = document.getElementById("appBreadcrumb");
  if (el) el.innerHTML = `${appState.product} > ${appState.section} > ${appState.page}`;
}
function setState(newState) { Object.assign(appState, newState); renderHeader(); }

let charts = [];
function destroyCharts() { charts.forEach(c => c.destroy()); charts = []; }
let isWikiMode = false, isConvertMode = false;
const leftPanel = document.querySelector(".left-panel");
const displayPanel = document.querySelector(".display-panel");
const originalLeftPanel = leftPanel ? leftPanel.innerHTML : "";

function restoreDashboard() {
  window.location.href = "../Overview/project%20summary.html";
}

function activateMode(sectionName, pageName, leftHTML, displayHTML, afterFn, instant) {
  isWikiMode = false;
  isConvertMode = false;
  setState({ section: "Analysis Engine", page: pageName, view: "Overview" });
  if (instant) {
    leftPanel.innerHTML = leftHTML;
    displayPanel.innerHTML = displayHTML;
    document.getElementById("backToDashboard")?.addEventListener("click", restoreDashboard);
    if (afterFn) afterFn();
    return;
  }
  leftPanel.classList.add("fade-transition", "fade-out");
  displayPanel.classList.add("fade-transition", "fade-out");
  setTimeout(() => {
    leftPanel.innerHTML = leftHTML;
    displayPanel.innerHTML = displayHTML;
    leftPanel.classList.remove("fade-out");
    displayPanel.classList.remove("fade-out");
    document.getElementById("backToDashboard")?.addEventListener("click", restoreDashboard);
    if (afterFn) afterFn();
  }, 200);
}

function syncSidebarActive(pageName) {
  document.querySelectorAll('.nav-child').forEach(child => {
    child.classList.toggle('active', child.dataset.page === pageName);
  });
  document.querySelectorAll('.nav-row').forEach(row => row.classList.remove('active'));
  document.querySelectorAll('.nav-children').forEach(group => group.classList.remove('open'));
  const activeChild = document.querySelector(`.nav-child[data-page="${pageName}"]`);
  const group = activeChild?.closest('.nav-children');
  if (group) {
    group.classList.add('open');
    const navKey = group.id.replace('children-', '');
    document.querySelector(`.nav-row[data-nav="${navKey}"]`)?.classList.add('active');
  }
}

document.querySelectorAll(".nav-row").forEach(row => {
  row.addEventListener("click", () => {
    const navKey = row.dataset.nav;
    const childrenEl = document.getElementById("children-" + navKey);
    const isOpen = childrenEl && childrenEl.classList.contains("open");
    document.querySelectorAll(".nav-row").forEach(r => r.classList.remove("active"));
    document.querySelectorAll(".nav-children").forEach(c => c.classList.remove("open"));
    if (!isOpen) {
      row.classList.add("active");
      if (childrenEl) childrenEl.classList.add("open");
    }
  });
});

renderHeader();


function activateConversionStatusMode() {
      const leftHTML = `<div class="sub-nav active">Conversion Overview</div>`;
      const displayHTML = `<div class="scroll-container" style="gap:16px;">
        <div class="chart-wrapper dark" style="margin-bottom:0;padding:16px;">
          <h4 style="margin-bottom:6px;">Uploaded files</h4>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px;">
            <div style="background:linear-gradient(145deg,rgba(108,92,231,0.15),rgba(108,92,231,0.05));border:1px solid rgba(108,92,231,0.3);border-radius:12px;padding:14px;text-align:center;"><div style="font-size:22px;margin-bottom:6px;">&#x1F4C4;</div><div style="font-size:28px;font-weight:800;color:#fff;">1</div><div style="font-size:12px;color:var(--text-muted);margin-top:4px;">COBOL Programs</div></div>
            <div style="background:linear-gradient(145deg,rgba(108,92,231,0.15),rgba(108,92,231,0.05));border:1px solid rgba(108,92,231,0.3);border-radius:12px;padding:14px;text-align:center;"><div style="font-size:22px;margin-bottom:6px;">&#x1F4CB;</div><div style="font-size:28px;font-weight:800;color:#fff;">0</div><div style="font-size:12px;color:var(--text-muted);margin-top:4px;">Copybooks</div></div>
            <div style="background:linear-gradient(145deg,rgba(108,92,231,0.15),rgba(108,92,231,0.05));border:1px solid rgba(108,92,231,0.3);border-radius:12px;padding:14px;text-align:center;"><div style="font-size:22px;margin-bottom:6px;">&#x1F4DC;</div><div style="font-size:28px;font-weight:800;color:#fff;">0</div><div style="font-size:12px;color:var(--text-muted);margin-top:4px;">JCL Scripts</div></div>
          </div>
        </div>
        <div class="chart-wrapper dark" style="margin-bottom:0;padding:16px;">
          <h4>Conversion Results</h4>
          <div style="background:#2ecc71;color:#fff;font-weight:700;font-size:13px;text-align:center;padding:8px;border-radius:20px;margin-bottom:12px;">100% Success</div>
          <div style="display:flex;justify-content:center;gap:24px;font-size:14px;font-weight:600;margin-bottom:14px;">
            <span style="color:#2ecc71;">&#x2713; 1 Successful</span><span style="color:#f1c40f;">&#x26A0;&#xFE0F; 0 Partial</span><span style="color:#e74c3c;">&#x274C; 0 Failed</span>
          </div>
        </div>
        <div class="chart-wrapper dark" style="margin-bottom:0;padding:16px;">
          <h4>File Status</h4>
          <table style="width:100%;border-collapse:collapse;font-size:13px;">
            <thead><tr><th style="padding:10px;border-bottom:1px solid var(--border);text-align:left;color:var(--text-primary);">File Name</th><th style="padding:10px;border-bottom:1px solid var(--border);text-align:left;color:var(--text-primary);">Status</th><th style="padding:10px;border-bottom:1px solid var(--border);text-align:left;color:var(--text-primary);">Issue</th></tr></thead>
            <tbody><tr><td style="padding:10px;color:var(--text-muted);">temp.cbl</td><td style="padding:10px;color:#2ecc71;">&#x2713; Success</td><td style="padding:10px;color:var(--text-muted);">-</td></tr></tbody>
          </table>
        </div>
      </div>`;
      activateMode('Conversion Status', 'Conversion Status', leftHTML, displayHTML);
    }
    

syncSidebarActive(window.EQUIVALIC_INITIAL_PAGE);
activateConversionStatusMode();
