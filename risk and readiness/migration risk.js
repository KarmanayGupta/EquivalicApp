/* ============================================================
   Migration Risk Assessment page logic
   Source: ChangedAnalysisEngine (2).html
   Contains this page's bootstrap, renderers, handlers, and data only.
============================================================ */
window.EQUIVALIC_INITIAL_PAGE = window.EQUIVALIC_INITIAL_PAGE || 'Migration Risk Assessment';

/* ============================================================
   Page bootstrap and shared shell utilities
============================================================ */
const appState = { product: "Product Suite", section: "Risk & Readiness", page: "Migration Risk", view: "Overview" };
function renderHeader() {
  const el = document.getElementById("appBreadcrumb");
  if (el) el.innerHTML = `${appState.section} > ${appState.page}`;
}
function setState(newState) { Object.assign(appState, newState); renderHeader(); }

let charts = [];
function destroyCharts() { charts.forEach(c => c.destroy()); charts = []; }
let isWikiMode = false, isConvertMode = false;
const leftPanel = null;
const displayPanel = document.querySelector(".display-panel");
const originalLeftPanel = "";

function restoreDashboard() {
  window.location.href = "../Overview/project%20summary.html";
}

function activateMode(sectionName, pageName, leftHTML, displayHTML, afterFn, instant) {
  isWikiMode = false;
  isConvertMode = false;
  setState({ section: "Analysis Engine", page: pageName, view: "Overview" });
  if (instant) {
    if (displayPanel) displayPanel.innerHTML = displayHTML;
    document.getElementById("backToDashboard")?.addEventListener("click", restoreDashboard);
    if (afterFn) afterFn();
    return;
  }
  if (displayPanel) displayPanel.classList.add("fade-transition", "fade-out");
  setTimeout(() => {
    if (displayPanel) {
      displayPanel.innerHTML = displayHTML;
      displayPanel.classList.remove("fade-out");
    }
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


function activateRiskAssessmentMode() {
      const leftHTML = `<div class="sub-nav active">Risk Assessment Report</div>`;
      const displayHTML = `
        <div class="dashboard-tabs" id="riskTabs" style="flex-shrink:0;">
          <button class="tab active" data-view="riskOverview">Risk Overview</button>
          <button class="tab" data-view="assessmentTrending">Assessment Trending</button>
          <button class="tab" data-view="complexityDistribution">Complexity Distribution</button>
          <button class="tab" data-view="migrationRoadmap">Migration Roadmap</button>
          <button class="tab" data-view="classificationSummary">Classification Summary</button>
          <button class="tab" data-view="dependencyHealth">Dependency Health</button>
          <button class="tab" data-view="perProgramMetrics">Per-Program Metrics</button>
          <button class="tab" data-view="wavePlan">Wave Plan</button>
          <button class="tab" data-view="validationFramework">Validation Framework</button>
        </div>
        <div id="riskPreviewContent" class="scroll-container" style="padding-top:16px;"></div>`;
      activateMode('Risk Assessment', 'Risk Assessment', leftHTML, displayHTML, () => {
        updateRiskView("riskOverview");
        document.querySelectorAll("#riskTabs .tab").forEach(tab => {
          tab.addEventListener("click", e => {
            document.querySelectorAll("#riskTabs .tab").forEach(t => t.classList.remove("active"));
            e.target.classList.add("active");
            updateRiskView(e.target.dataset.view);
          });
        });
      });
    }

    

function updateRiskView(view) {
      const el = document.getElementById("riskPreviewContent");
      if (!el) return;
      const map = {
        riskOverview: renderRiskOverview, assessmentTrending: renderAssessmentTrending,
        complexityDistribution: renderComplexityDistribution, migrationRoadmap: renderMigrationRoadmap,
        classificationSummary: renderClassificationSummary, dependencyHealth: renderDependencyHealth,
        perProgramMetrics: renderPerProgramMetrics, wavePlan: renderWavePlan, validationFramework: renderValidationFramework
      };
      if (map[view]) { el.innerHTML = map[view](); setTimeout(initRiskCharts, 50); }
    }

    

function renderRiskOverview() {
      return `<div style="display:flex;flex-direction:column;gap:20px;padding:0 4px 32px;">
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px;">
          <div style="background:linear-gradient(135deg,#6c5ce7,#4a3f9e);border-radius:12px;padding:22px;text-align:center;color:#fff;border:1px solid rgba(108,92,231,0.5);"><div style="font-size:44px;font-weight:800;line-height:1;">100</div><div style="font-size:13px;margin-top:6px;opacity:0.9;">System Score</div></div>
          <div style="background:rgba(46,204,113,0.1);border-radius:12px;padding:22px;text-align:center;border:1px solid rgba(46,204,113,0.3);"><div style="font-size:12px;color:var(--text-muted);margin-bottom:6px;text-transform:uppercase;letter-spacing:1px;">Risk Level</div><div style="font-size:28px;font-weight:700;color:#2ecc71;">LOW</div></div>
          <div style="background:rgba(46,204,113,0.1);border-radius:12px;padding:22px;text-align:center;border:1px solid rgba(46,204,113,0.3);"><div style="font-size:12px;color:var(--text-muted);margin-bottom:6px;text-transform:uppercase;letter-spacing:1px;">Readiness Status</div><div style="font-size:28px;font-weight:700;color:#2ecc71;">READY</div></div>
        </div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px;">
          ${[['&#x1F480;','0.0%','Dead Code'],['&#x1F517;','0','Missing Dependencies'],['&#x1F525;','0','Hardcoded Paths'],['&#x1F4BB;','0','CICS Violations'],['&#x1F4C2;','0','Complex Files'],['&#x2699;&#xFE0F;','0','Technical Debt Issues']].map(([icon,val,label])=>`<div class="stat-card" style="padding:14px;border:1px solid var(--border);background:var(--panel-bg);"><div style="font-size:20px;margin-bottom:6px;">${icon}</div><div style="font-size:22px;font-weight:700;color:#00d4ff;">${val}</div><div style="font-size:11px;color:var(--text-muted);">${label}</div></div>`).join('')}
        </div>
      </div>`;
    }

    

function renderAssessmentTrending() {
      return `<div style="display:flex;flex-direction:column;gap:20px;padding:0 4px 32px;">
        <div style="display:flex;gap:20px;">
          <div class="chart-wrapper dark" style="flex:2;margin-bottom:0;padding:16px;"><div style="height:220px;position:relative;"><canvas id="trendingChart"></canvas></div></div>
          <div class="chart-wrapper dark" style="flex:1;margin-bottom:0;padding:16px;">
            <h4 style="font-size:12px;color:var(--text-muted);text-transform:uppercase;margin-bottom:14px;">Risk Factors</h4>
            ${[['Quality Score','98'],['High Complexity','0'],['Untested Logic','0'],['Dead Code %','0']].map(([k,v])=>`<div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--border);"><span style="font-size:13px;">${k}</span><span style="font-weight:600;">${v}</span></div>`).join('')}
          </div>
        </div>
      </div>`;
    }

    

function renderComplexityDistribution() {
      return `<div style="display:flex;flex-direction:column;gap:20px;padding:0 4px 32px;">
        <div style="display:flex;gap:20px;">
          <div class="chart-wrapper dark" style="flex:1;margin-bottom:0;padding:16px;"><div style="height:180px;position:relative;"><canvas id="complexityDistChart2"></canvas></div></div>
          <div class="chart-wrapper dark" style="flex:1.5;margin-bottom:0;overflow-x:auto;padding:16px;">
            <h4 style="font-size:12px;color:var(--text-muted);text-transform:uppercase;margin-bottom:10px;">Top Complex Files</h4>
            <table style="width:100%;border-collapse:collapse;font-size:12px;">
              <thead><tr style="border-bottom:1px solid var(--border);color:var(--text-muted);">${['Name','Complexity','Total LOC','Missing Deps','Automations'].map(h=>`<th style="padding:7px;text-align:left;font-weight:500;">${h}</th>`).join('')}</tr></thead>
              <tbody>${[['PGM-1.cbl','1','11','0.00','100%'],['PGM-2.cbl','1','9','0.00','100%']].map(r=>`<tr>${r.map(c=>`<td style="padding:7px;border-bottom:1px solid rgba(255,255,255,0.05);">${c}</td>`).join('')}</tr>`).join('')}</tbody>
            </table>
          </div>
        </div>
      </div>`;
    }

    

function renderMigrationRoadmap() {
      return `<div style="display:flex;flex-direction:column;gap:20px;padding:0 4px 32px;">
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px;">
          <div style="background:var(--panel-bg);border-radius:12px;padding:18px;border:1px solid rgba(46,204,113,0.4);border-top:4px solid #2ecc71;"><div style="display:flex;justify-content:space-between;margin-bottom:14px;"><h4 style="font-size:13px;">Safe-to-Migrate: Fast</h4><span style="background:rgba(46,204,113,0.2);color:#2ecc71;padding:2px 8px;border-radius:12px;font-size:11px;font-weight:600;">100%</span></div><div style="font-size:12px;color:var(--text-muted);">Count: <span style="color:#fff;">3 programs</span></div><p style="font-size:11px;color:var(--text-muted);border-top:1px solid var(--border);padding-top:10px;margin-top:10px;">Low complexity (CC &lt; 5) with no DB dependencies.</p></div>
          <div style="background:var(--panel-bg);border-radius:12px;padding:18px;border:1px solid rgba(243,156,18,0.4);border-top:4px solid #f39c12;"><div style="display:flex;justify-content:space-between;margin-bottom:14px;"><h4 style="font-size:13px;">Safe-to-Migrate: Logic</h4><span style="background:rgba(243,156,18,0.2);color:#f39c12;padding:2px 8px;border-radius:12px;font-size:11px;font-weight:600;">0%</span></div><div style="font-size:12px;color:var(--text-muted);">Count: <span style="color:#fff;">0 programs</span></div><p style="font-size:11px;color:var(--text-muted);border-top:1px solid var(--border);padding-top:10px;margin-top:10px;">Medium complexity (CC &lt; 10) or manageable DB dependencies.</p></div>
          <div style="background:var(--panel-bg);border-radius:12px;padding:18px;border:1px solid rgba(231,76,60,0.4);border-top:4px solid #e74c3c;"><div style="display:flex;justify-content:space-between;margin-bottom:14px;"><h4 style="font-size:13px;">Complex Programs</h4><span style="background:rgba(231,76,60,0.2);color:#e74c3c;padding:2px 8px;border-radius:12px;font-size:11px;font-weight:600;">0%</span></div><div style="font-size:12px;color:var(--text-muted);">Count: <span style="color:#fff;">0 programs</span></div><p style="font-size:11px;color:var(--text-muted);border-top:1px solid var(--border);padding-top:10px;margin-top:10px;">High complexity (CC &gt; 10) or heavy DB dependencies.</p></div>
        </div>
      </div>`;
    }

    

function renderClassificationSummary() {
      return `<div style="display:flex;flex-direction:column;gap:20px;padding:0 4px 32px;">
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px;">
          <div class="chart-wrapper dark" style="margin-bottom:0;text-align:center;padding:14px;"><h4 style="font-size:12px;color:var(--text-muted);margin-bottom:10px;">Execution Environment</h4><div style="height:140px;position:relative;"><canvas id="classPie1"></canvas></div></div>
          <div class="chart-wrapper dark" style="margin-bottom:0;text-align:center;padding:14px;"><h4 style="font-size:12px;color:var(--text-muted);margin-bottom:10px;">Database</h4><div style="height:140px;position:relative;"><canvas id="classPie2"></canvas></div></div>
          <div class="chart-wrapper dark" style="margin-bottom:0;text-align:center;padding:14px;"><h4 style="font-size:12px;color:var(--text-muted);margin-bottom:10px;">Functional Role</h4><div style="height:140px;position:relative;"><canvas id="classPie3"></canvas></div></div>
        </div>
      </div>`;
    }

    

function renderDependencyHealth() {
      return `<div style="display:flex;flex-direction:column;gap:20px;padding:0 4px 32px;">
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px;">
          ${[['1','Nodes'],['0','Edges'],['0','Circular Dependencies']].map(([v,l])=>`<div class="stat-card" style="padding:22px;border:1px solid var(--border);background:var(--panel-bg);"><div style="font-size:28px;font-weight:700;color:#00d4ff;">${v}</div><div style="font-size:11px;color:var(--text-muted);text-transform:uppercase;">${l}</div></div>`).join('')}
        </div>
        <div class="chart-wrapper dark" style="margin-bottom:0;padding:14px;"><h4>Circular Dependencies</h4><p style="font-size:13px;color:var(--text-muted);">No circular dependencies found.</p></div>
        <div class="chart-wrapper dark" style="margin-bottom:0;padding:14px;"><h4>Network Metrics</h4><div style="font-size:13px;color:var(--text-muted);line-height:1.7;"><div><strong>Peripheral Dependencies:</strong> 0 (0.0%)</div><div><strong>Sub-networks:</strong> 1</div><div><strong>Most Called:</strong> None</div><div><strong>Calls Outside Boundary:</strong> 0</div></div></div>
      </div>`;
    }

    

function renderPerProgramMetrics() {
      return `<div style="display:flex;flex-direction:column;gap:20px;padding:0 4px 32px;">
        <div class="chart-wrapper dark" style="margin-bottom:0;overflow-x:auto;padding:14px;">
          <table style="width:100%;border-collapse:collapse;font-size:12px;white-space:nowrap;">
            <thead style="border-bottom:1px solid var(--border);color:var(--text-muted);">
              <tr>${['Program Name','LOC','Deps','Missing Deps','Complexity','Environment','Dead Code %','QA Auth %','Status','Migration Wave'].map(h=>`<th style="padding:8px;text-align:left;font-weight:500;">${h}</th>`).join('')}</tr>
            </thead>
            <tbody>
              <tr><td style="padding:8px;color:#00d4ff;">MAINPROG</td><td style="padding:8px;">11</td><td style="padding:8px;">0</td><td style="padding:8px;">0</td><td style="padding:8px;">1</td><td style="padding:8px;">Batch</td><td style="padding:8px;">0.0%</td><td style="padding:8px;">100%</td><td style="padding:8px;color:#2ecc71;">&#x2713; Success</td><td style="padding:8px;">Wave 1</td></tr>
            </tbody>
          </table>
        </div>
      </div>`;
    }

    

function renderWavePlan() {
      return `<div style="display:flex;flex-direction:column;gap:20px;padding:0 4px 32px;">
        <div class="chart-wrapper dark" style="margin-bottom:0;padding:14px;">
          ${[['Wave 1: Sub-System A','1 programs','100%','#2ecc71'],['Wave 2: (No label)','0 programs','0%','var(--text-muted)'],['Wave 3: (No label)','0 programs','0%','var(--text-muted)'],['Wave 4: (No label)','0 programs','0%','var(--text-muted)']].map(([name,count,pct,color])=>`
            <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(255,255,255,0.05);padding:10px 0;">
              <div style="font-weight:600;font-size:13px;">${name}</div>
              <div style="display:flex;align-items:center;gap:14px;font-size:12px;">
                <span style="color:var(--text-muted);">${count}</span>
                <div style="width:120px;height:5px;background:rgba(255,255,255,0.1);border-radius:4px;overflow:hidden;"><div style="width:${pct};height:100%;background:${color};"></div></div>
                <span style="font-weight:600;color:${color};">${pct}</span>
              </div>
            </div>`).join('')}
          <div style="margin-top:14px;font-size:12px;color:var(--text-muted);"><strong>Recommended Conversion Sequence:</strong> n/a</div>
        </div>
      </div>`;
    }

    

function renderValidationFramework() {
      return `<div style="display:flex;flex-direction:column;gap:20px;padding:0 4px 32px;">
        <div style="display:flex;gap:20px;">
          <div class="chart-wrapper dark" style="flex:1;margin-bottom:0;padding:14px;"><h4>Validation Insights</h4><div style="display:flex;justify-content:space-around;margin-bottom:20px;"><div style="text-align:center;"><div style="font-size:22px;font-weight:700;color:#2ecc71;">100%</div><div style="font-size:11px;color:var(--text-muted);">Total Pass Rate</div></div><div style="text-align:center;"><div style="font-size:22px;font-weight:700;color:#6c5ce7;">100%</div><div style="font-size:11px;color:var(--text-muted);">Execution Rate</div></div></div></div>
          <div class="chart-wrapper dark" style="flex:2;margin-bottom:0;padding:14px;"><h4>QA Automations</h4><div style="display:flex;flex-direction:column;gap:10px;font-size:12px;"><div style="background:rgba(255,255,255,0.03);padding:10px;border-radius:8px;border:1px solid rgba(255,255,255,0.05);"><div style="font-weight:600;margin-bottom:3px;">Unit Tests (Java) <span style="float:right;color:#2ecc71;">100% PASS</span></div><div style="color:var(--text-muted);">Automated logic tests targeting core modules</div></div><div style="background:rgba(255,255,255,0.03);padding:10px;border-radius:8px;border:1px solid rgba(255,255,255,0.05);"><div style="font-weight:600;margin-bottom:3px;">Integration Tests</div><div style="color:var(--text-muted);">Validates inter-program comms and boundaries</div></div></div></div>
        </div>
        <div class="chart-wrapper dark" style="margin-bottom:0;overflow-x:auto;padding:14px;">
          <table style="width:100%;border-collapse:collapse;font-size:12px;">
            <thead style="border-bottom:1px solid var(--border);color:var(--text-muted);"><tr>${['Test ID','Module','Type','Execution Status','Result'].map(h=>`<th style="padding:8px;text-align:left;">${h}</th>`).join('')}</tr></thead>
            <tbody><tr><td style="padding:8px;border-bottom:1px solid rgba(255,255,255,0.05);">TC-001</td><td style="padding:8px;border-bottom:1px solid rgba(255,255,255,0.05);">MAINPROG</td><td style="padding:8px;border-bottom:1px solid rgba(255,255,255,0.05);">Unit</td><td style="padding:8px;border-bottom:1px solid rgba(255,255,255,0.05);">Completed</td><td style="padding:8px;border-bottom:1px solid rgba(255,255,255,0.05);color:#2ecc71;">PASS</td></tr></tbody>
          </table>
        </div>
      </div>`;
    }

    

function initRiskCharts() {
      const opts = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } };
      const t = document.getElementById("trendingChart");
      if (t) new Chart(t, { type: "line", data: { labels: ["Day 1","Day 2","Day 3","Day 4","Day 5"], datasets: [{ data: [100,100,100,100,100], borderColor: "#6c5ce7", backgroundColor: "rgba(108,92,231,.1)", fill: true, tension: 0.4 }] }, options: { ...opts, plugins: { legend: { display: false } }, scales: { y: { min: 0, max: 100 } } } });
      const c = document.getElementById("complexityDistChart2");
      if (c) new Chart(c, { type: "bar", data: { labels: ["1-10","11-20","21-30","31+"], datasets: [{ data: [1,0,0,0], backgroundColor: "#2ecc71" }] }, options: opts });
      const p1 = document.getElementById("classPie1");
      if (p1) new Chart(p1, { type: "pie", data: { labels: ["Batch","Online"], datasets: [{ data: [100,0], backgroundColor: ["#6c5ce7","transparent"] }] }, options: opts });
      const p2 = document.getElementById("classPie2");
      if (p2) new Chart(p2, { type: "doughnut", data: { labels: ["None"], datasets: [{ data: [1], backgroundColor: ["rgba(255,255,255,0.05)"] }] }, options: opts });
      const p3 = document.getElementById("classPie3");
      if (p3) new Chart(p3, { type: "doughnut", data: { labels: ["Main"], datasets: [{ data: [1], backgroundColor: ["rgba(255,255,255,0.05)"] }] }, options: opts });
    }
    

syncSidebarActive(window.EQUIVALIC_INITIAL_PAGE);
activateRiskAssessmentMode();
