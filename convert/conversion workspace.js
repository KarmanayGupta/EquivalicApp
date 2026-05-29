/* ============================================================
   Conversion Workspace page logic
   Contains this page's bootstrap, renderers, handlers, and data only.
============================================================ */
window.EQUIVALIC_INITIAL_PAGE = window.EQUIVALIC_INITIAL_PAGE || 'Conversion Workspace';

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
  if (document.querySelector('.workspace')) document.querySelector('.workspace').style.gridTemplateColumns = '';
  if (leftPanel) leftPanel.style.display = '';
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


    function activateConvertMode() {
      if (isConvertMode) return;
      isConvertMode = true;
      setState({ section: "Analysis", page: "Summary Overview", view: "Overview" });
      leftPanel.classList.add("fade-transition","fade-out");
      displayPanel.classList.add("fade-transition","fade-out");
      setTimeout(() => {
        leftPanel.innerHTML = `
          <div class="sub-nav active" data-convert="overview">Overview</div>
          <div class="sub-nav" data-convert="classification">Classification</div>
          <div class="sub-nav" data-convert="insights">Insights</div>
          <div style="height:16px;"></div>
          <div class="convert-cta" id="moveToConversion">Proceed to Conversion</div>`;
        displayPanel.innerHTML = `<div class="scroll-container"><div id="convertContent">
          <div class="convert-header"><div class="convert-title">Project Summary</div><div class="convert-badge">testing multiple</div></div>
        </div></div>`;
        leftPanel.classList.remove("fade-out"); displayPanel.classList.remove("fade-out");
        document.getElementById("backToDashboard")?.addEventListener("click", restoreDashboard);
        renderConvertOverview();
        document.querySelectorAll("[data-convert]").forEach(item => {
          item.addEventListener("click", () => {
            document.querySelectorAll("[data-convert]").forEach(i => i.classList.remove("active"));
            item.classList.add("active");
            const container = document.getElementById("convertContent");
            container.innerHTML = `<div class="convert-header"><div class="convert-title">Project Summary</div><div class="convert-badge">testing multiple</div></div>`;
            const type = item.dataset.convert;
            if (type === "overview") renderConvertOverview();
            if (type === "classification") renderConvertClassification();
            if (type === "insights") renderConvertInsights();
          });
        });
      }, 200);
    }

    function renderConvertOverview() {
      document.getElementById("convertContent").innerHTML += `
        <div class="stats-grid">
          <div class="stat-card"><div class="stat-value">2</div><div class="stat-label">Total Programs</div></div>
          <div class="stat-card"><div class="stat-value">0</div><div class="stat-label">SQL Statements</div></div>
          <div class="stat-card"><div class="stat-value">0</div><div class="stat-label">Tables Accessed</div></div>
          <div class="stat-card"><div class="stat-value">0</div><div class="stat-label">DB2 Programs</div></div>
        </div>`;
    }
    function renderConvertClassification() {
      document.getElementById("convertContent").innerHTML += `
        <div class="chart-wrapper dark"><h4>Classification Breakdown</h4>
          <div class="convert-row"><span>Execution Environment</span><span class="pill">Batch (2)</span></div>
          <div class="convert-row"><span>Functional Role</span><span class="pill yellow">Main Programs (2)</span></div>
          <div class="convert-row"><span>Programming Model</span><span class="pill orange">Structured COBOL (2)</span></div>
        </div>`;
    }
    function renderConvertInsights() {
      document.getElementById("convertContent").innerHTML += `
        <div class="chart-wrapper dark"><h4>SQL Analysis</h4><div class="empty">No SQL data available</div></div>
        <div class="chart-wrapper dark"><h4>Table Usage</h4><div class="empty">No table usage data available</div></div>
        <div class="chart-wrapper dark"><h4>Recommendations &amp; Insights</h4><div class="empty">No recommendations available</div></div>`;
    }


syncSidebarActive(window.EQUIVALIC_INITIAL_PAGE);
activateConvertMode();
