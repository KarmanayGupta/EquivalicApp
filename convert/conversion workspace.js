/* ============================================================
   Conversion Workspace page logic
   Source: ChangedAnalysisEngine (2).html
   Contains this page's bootstrap, renderers, handlers, and data only.
============================================================ */
window.EQUIVALIC_INITIAL_PAGE = window.EQUIVALIC_INITIAL_PAGE || 'Conversion Workspace';

/* ============================================================
   Page bootstrap and shared shell utilities
============================================================ */
const appState = { product: "Product Suite", section: "Convert", page: "Conversion Workspace", view: "Overview" };
function renderHeader() {
  const el = document.getElementById("appBreadcrumb");
  if (el) el.innerHTML = `${appState.section} > ${appState.page}`;
}
function setState(newState) { Object.assign(appState, newState); renderHeader(); }

let charts = [];
function destroyCharts() { charts.forEach(c => c.destroy()); charts = []; }
let isWikiMode = false, isConvertMode = false;
const leftPanel = document.querySelector(".left-panel");
const displayPanel = document.querySelector(".display-panel");

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


function setConversionView(view) {
  const views = document.querySelectorAll(".conversion-view");
  views.forEach(item => item.classList.remove("active"));
  const active = document.getElementById(`conversion-${view}`);
  if (active) active.classList.add("active");
}

function bindConversionTabs() {
  const tabs = document.querySelectorAll(".conversion-tabs .tab");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      setConversionView(tab.dataset.view);
      
      // Initialize cost chart when switching to cost tab
      if (tab.dataset.view === 'cost') {
        setTimeout(initCostChart, 100);
      }
    });
  });
}

function initCostChart() {
  const canvas = document.getElementById('costChart');
  if (!canvas) return;
  
  // Destroy existing chart if any
  if (window.costChartInstance) {
    window.costChartInstance.destroy();
  }
  
  const ctx = canvas.getContext('2d');
  const opts = { 
    responsive: true, 
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#8f9bad',
          font: { size: 12, weight: '600' },
          padding: 20,
          usePointStyle: true,
          boxWidth: 8,
          boxHeight: 8
        }
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.05)', drawBorder: false },
        ticks: { color: '#8f9bad', font: { size: 11 } }
      },
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(255, 255, 255, 0.05)', drawBorder: false },
        ticks: { 
          color: '#8f9bad', 
          font: { size: 11 },
          callback: function(value) { return '$' + value; }
        }
      }
    }
  };
  
  window.costChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'],
      datasets: [
        {
          label: 'Estimated Cost',
          data: [0, 125, 250, 375, 500, 625, 750, 875],
          borderColor: '#6c5ce7',
          backgroundColor: 'rgba(108, 92, 231, 0.1)',
          fill: true,
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 4,
          pointBackgroundColor: '#6c5ce7',
          pointBorderWidth: 0
        },
        {
          label: 'Actual Cost',
          data: [0, 0, 0, 0, 0, 0, 0, 0],
          borderColor: '#00d4ff',
          backgroundColor: 'rgba(0, 212, 255, 0.1)',
          fill: true,
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 4,
          pointBackgroundColor: '#00d4ff',
          pointBorderWidth: 0,
          borderDash: [5, 5]
        }
      ]
    },
    options: opts
  });
}

function updateReadinessNotice() {
  const blockToggle = document.getElementById("toggleBlockConversion");
  const quarantineToggle = document.getElementById("toggleQuarantine");
  const meta = document.getElementById("readinessModeMeta");
  const bannerTitle = document.getElementById("readinessBannerTitle");

  if (!meta || !bannerTitle) return;

  const strictMode = !!(blockToggle && blockToggle.checked);
  const quarantine = !!(quarantineToggle && quarantineToggle.checked);

  const modeText = strictMode ? "Strict mode" : "Advisory mode";
  const quarantineText = quarantine ? " + program quarantine" : "";
  meta.textContent = `${modeText}${quarantineText} | conversion can proceed`;

  bannerTitle.textContent = strictMode
    ? "Conversion can proceed in strict mode"
    : "Conversion can proceed with warnings";
}

function activateConvertMode() {
  if (isConvertMode) return;
  isConvertMode = true;
  setState({ section: "Conversion Engine", page: "Conversion Workspace", view: "Overview" });
  if (!displayPanel) return;
  if (leftPanel) leftPanel.classList.add("fade-transition", "fade-out");
  displayPanel.classList.add("fade-transition", "fade-out");
  setTimeout(() => {
    if (leftPanel) leftPanel.innerHTML = "";
    displayPanel.innerHTML = `
      <div class="conversion-header">
        <div>
          <div class="conversion-title">Conversion Workspace</div>
        </div>
      </div>
      <div class="dashboard-tabs conversion-tabs">
        <button class="tab active" data-view="overview">Input Readiness Gate</button>
        <button class="tab" data-view="waveplan-summary">Wave Plan</button>
        <button class="tab" data-view="progress">Conversion Progress</button>
        <button class="tab" data-view="progress-over-time">Conversion Progress Over Time</button>
        <button class="tab" data-view="waveplan">Wave Details</button>
        <button class="tab" data-view="cost">LLM Cost</button>
        <button class="tab" data-view="timeline">Wave Timeline</button>
        <button class="tab" data-view="bridges">Strangler Bridges</button>
      </div>
      <div class="scroll-container conversion-scroll">
        <section id="conversion-overview" class="conversion-view active">
          <div class="readiness-header">
            <div>
              <div class="section-title">Input Readiness Gate</div>
              <div class="readiness-meta" id="readinessModeMeta">Advisory mode | conversion can proceed</div>
            </div>
          </div>

          <!-- Status Banner -->
          <div class="readiness-banner">
            <div style="display: flex; align-items: center; gap: 16px;">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style="flex-shrink: 0;">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#00d4ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="#00d4ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="#00d4ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <div style="flex: 1;">
                <div style="font-size: 15px; font-weight: 700; color: #f1f3f8; margin-bottom: 4px;" id="readinessBannerTitle">Conversion can proceed with warnings</div>
                <div style="font-size: 12px; color: #8f9bad;" id="readinessBannerMeta">0 blocker(s), 1 warning(s). Deterministic analysis readiness is checked before conversion starts.</div>
              </div>
            </div>
          </div>

          <!-- Control Panel -->
          <div style="background: linear-gradient(135deg, rgba(108, 92, 231, 0.05) 0%, rgba(0, 212, 255, 0.05) 100%); border: 1px solid rgba(108, 92, 231, 0.2); border-radius: 8px; padding: 16px 20px; margin-bottom: 24px;">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 24px; flex-wrap: wrap;">
              <div style="display: flex; align-items: center; gap: 12px;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00d4ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="3"></circle>
                  <path d="M12 1v6m0 6v6"></path>
                  <path d="m4.93 4.93 4.24 4.24m5.66 5.66 4.24 4.24"></path>
                  <path d="m1 12h6m6 0h6"></path>
                  <path d="m4.93 19.07 4.24-4.24m5.66-5.66 4.24-4.24"></path>
                </svg>
                <span style="font-size: 12px; font-weight: 700; color: #8f9bad; text-transform: uppercase; letter-spacing: 0.5px;">Conversion Controls</span>
              </div>
              <div style="display: flex; align-items: center; gap: 32px; flex-wrap: wrap;">
                <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                  <input type="checkbox" id="toggleBlockConversion" style="width: 16px; height: 16px; cursor: pointer; accent-color: #00d4ff;" />
                  <span style="font-size: 13px; font-weight: 600; color: #f1f3f8;">Block conversion if analysis has blockers</span>
                </label>
                <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                  <input type="checkbox" id="toggleQuarantine" style="width: 16px; height: 16px; cursor: pointer; accent-color: #00d4ff;" />
                  <span style="font-size: 13px; font-weight: 600; color: #f1f3f8;">Quarantine blocked programs</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Metrics Grid -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 24px;">
            <div style="background: var(--panel-bg); border: 1px solid var(--border); border-left: 4px solid #f39c12; border-radius: 8px; padding: 20px;">
              <div style="font-size: 11px; color: var(--text-muted); text-transform: uppercase; font-weight: 600; letter-spacing: 1px; margin-bottom: 8px;">READINESS</div>
              <div style="font-size: 28px; font-weight: 800; color: #f39c12;">Warning</div>
            </div>
            <div style="background: var(--panel-bg); border: 1px solid var(--border); border-left: 4px solid #2ecc71; border-radius: 8px; padding: 20px;">
              <div style="font-size: 11px; color: var(--text-muted); text-transform: uppercase; font-weight: 600; letter-spacing: 1px; margin-bottom: 8px;">BLOCKERS</div>
              <div style="font-size: 28px; font-weight: 800; color: #fff;">0</div>
            </div>
            <div style="background: var(--panel-bg); border: 1px solid var(--border); border-left: 4px solid #f39c12; border-radius: 8px; padding: 20px;">
              <div style="font-size: 11px; color: var(--text-muted); text-transform: uppercase; font-weight: 600; letter-spacing: 1px; margin-bottom: 8px;">WARNINGS</div>
              <div style="font-size: 28px; font-weight: 800; color: #fff;">1</div>
            </div>
            <div style="background: var(--panel-bg); border: 1px solid var(--border); border-left: 4px solid #00d4ff; border-radius: 8px; padding: 20px;">
              <div style="font-size: 11px; color: var(--text-muted); text-transform: uppercase; font-weight: 600; letter-spacing: 1px; margin-bottom: 8px;">IR SOURCE</div>
              <div style="font-size: 16px; font-weight: 700; color: #00d4ff; text-transform: uppercase; margin-top: 8px;">Initial IR Only</div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div style="display: flex; gap: 12px; margin-bottom: 32px;">
            <button class="ghost-button" style="flex: 1; padding: 12px 24px; background: var(--panel-bg); border: 1px solid var(--border); border-radius: 8px; color: var(--accent-2); font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; justify-content: center; gap: 8px;" onmouseover="this.style.background='rgba(108,92,231,0.14)'; this.style.borderColor='rgba(0,212,255,0.32)'; this.style.color='var(--text-primary)'; this.style.transform='translateY(-1px)'" onmouseout="this.style.background='var(--panel-bg)'; this.style.borderColor='var(--border)'; this.style.color='var(--accent-2)'; this.style.transform='translateY(0)'">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="1" x2="12" y2="23"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
              Analysis Health
            </button>
            <button class="ghost-button" style="flex: 1; padding: 12px 24px; background: var(--panel-bg); border: 1px solid var(--border); border-radius: 8px; color: var(--accent-2); font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; justify-content: center; gap: 8px;" onmouseover="this.style.background='rgba(108,92,231,0.14)'; this.style.borderColor='rgba(0,212,255,0.32)'; this.style.color='var(--text-primary)'; this.style.transform='translateY(-1px)'" onmouseout="this.style.background='var(--panel-bg)'; this.style.borderColor='var(--border)'; this.style.color='var(--accent-2)'; this.style.transform='translateY(0)'">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="23 4 23 10 17 10"></polyline>
                <polyline points="1 20 1 14 7 14"></polyline>
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
              </svg>
              Refresh Readiness
            </button>
          </div>

          <!-- Issues Section -->
          <div style="background: var(--panel-bg); border: 1px solid var(--border); border-radius: 8px; padding: 24px; margin-bottom: 24px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;">
              <h3 style="font-size: 15px; font-weight: 700; color: var(--text-primary); margin: 0;">Readiness Issues</h3>
              <span style="padding: 4px 12px; background: rgba(243, 156, 18, 0.15); color: #f39c12; font-size: 11px; font-weight: 700; border-radius: 12px; text-transform: uppercase;">1 Warning</span>
            </div>
            <div style="display: flex; gap: 16px; padding: 16px; background: rgba(243, 156, 18, 0.08); border-left: 3px solid #f39c12; border-radius: 6px;">
              <div style="padding: 6px 12px; background: rgba(243, 156, 18, 0.2); color: #f39c12; font-size: 11px; font-weight: 700; border-radius: 6px; height: fit-content; text-transform: uppercase;">Warn</div>
              <div style="flex: 1;">
                <div style="font-size: 13px; font-weight: 700; color: #f1f3f8; margin-bottom: 6px;">DEPENDENCY_GRAPH_NON_COBOL_OR_SYSTEM_REFERENCES</div>
                <div style="font-size: 12px; color: #8f9bad; line-height: 1.6;">Dependency graph has unresolved JCL/system-tool references that are advisory for COBOL conversion. <span style="color: #00d4ff; font-family: monospace;">analysis/dependency_graph_audit.json</span></div>
              </div>
            </div>
          </div>

          <!-- Program Readiness Section -->
          <div style="background: var(--panel-bg); border: 1px solid var(--border); border-radius: 8px; padding: 24px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;">
              <h3 style="font-size: 15px; font-weight: 700; color: var(--text-primary); margin: 0;">Program Readiness Status</h3>
              <div style="display: flex; gap: 16px; font-size: 12px;">
                <div style="display: flex; align-items: center; gap: 6px;">
                  <div style="width: 10px; height: 10px; background: #2ecc71; border-radius: 50%;"></div>
                  <span style="color: var(--text-muted);">10 Passed</span>
                </div>
                <div style="display: flex; align-items: center; gap: 6px;">
                  <div style="width: 10px; height: 10px; background: #f39c12; border-radius: 50%;"></div>
                  <span style="color: var(--text-muted);">3 Warning</span>
                </div>
                <div style="display: flex; align-items: center; gap: 6px;">
                  <div style="width: 10px; height: 10px; background: #ff4d4f; border-radius: 50%;"></div>
                  <span style="color: var(--text-muted);">3 Blocked</span>
                </div>
              </div>
            </div>
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px;">
              <div class="program-pill good"><span style="font-weight: 600;">ACCTINQ</span> <span style="color: #2ecc71;">✓ Passed</span></div>
              <div class="program-pill good"><span style="font-weight: 600;">ACCTINQ-SCREEN</span> <span style="color: #2ecc71;">✓ Passed</span></div>
              <div class="program-pill warn"><span style="font-weight: 600;">BANKING</span> <span style="color: #f39c12;">⚠ Warning</span></div>
              <div class="program-pill bad"><span style="font-weight: 600;">BATCH_TEST_200</span> <span style="color: #ff4d4f;">✕ Blocked</span></div>
              <div class="program-pill bad"><span style="font-weight: 600;">BATCH_TEST_500</span> <span style="color: #ff4d4f;">✕ Blocked</span></div>
              <div class="program-pill good"><span style="font-weight: 600;">BHUVAN</span> <span style="color: #2ecc71;">✓ Passed</span></div>
              <div class="program-pill good"><span style="font-weight: 600;">CALCULIT</span> <span style="color: #2ecc71;">✓ Passed</span></div>
              <div class="program-pill warn"><span style="font-weight: 600;">CREATE-TEST-DATA</span> <span style="color: #f39c12;">⚠ Warning</span></div>
              <div class="program-pill good"><span style="font-weight: 600;">DATECALC</span> <span style="color: #2ecc71;">✓ Passed</span></div>
              <div class="program-pill good"><span style="font-weight: 600;">DATEDAYS</span> <span style="color: #2ecc71;">✓ Passed</span></div>
              <div class="program-pill warn"><span style="font-weight: 600;">DISCOUNT-FINAL</span> <span style="color: #f39c12;">⚠ Warning</span></div>
              <div class="program-pill good"><span style="font-weight: 600;">ORDINV</span> <span style="color: #2ecc71;">✓ Passed</span></div>
              <div class="program-pill good"><span style="font-weight: 600;">ORDVAL</span> <span style="color: #2ecc71;">✓ Passed</span></div>
              <div class="program-pill warn"><span style="font-weight: 600;">TEST_50</span> <span style="color: #f39c12;">⚠ Warning</span></div>
              <div class="program-pill bad"><span style="font-weight: 600;">TEST_200</span> <span style="color: #ff4d4f;">✕ Blocked</span></div>
              <div class="program-pill bad"><span style="font-weight: 600;">TEST_500</span> <span style="color: #ff4d4f;">✕ Blocked</span></div>
            </div>
          </div>
        </section>

        <section id="conversion-waveplan-summary" class="conversion-view">
          <div class="wave-plan-command">
            <div class="wave-plan-heading">
              <div>
                <div class="section-title">Wave Plan: fd85b676-1668-4e8e-93af-d0b8d977cc9b</div>
                <div class="wave-plan-meta">Generated: 6/2/2026, 6:29:23 PM | 15 programs, 2 waves</div>
              </div>
            </div>
            <div class="wave-engine-status">
              <span class="engine-dot"></span>
              Conversion engine connected
              <span class="engine-url">http://conversion-engine:8001</span>
            </div>
          </div>
          <div class="wave-plan-free-actions">
            <div class="action-divider"></div>
            <button class="primary-button compact wave-action-button primary" onclick="startAllWavesConversion(this)"><span>Convert All Waves</span></button>
            <button class="ghost-button compact wave-action-button">Regenerate</button>
            <button class="ghost-button compact wave-action-button" onclick="openConversionStatus()">Refresh Dashboard</button>
            <div class="action-divider"></div>
          </div>
        </section>

        <section id="conversion-progress" class="conversion-view">
          <div class="section-title">Conversion Progress</div>
          <div class="progress-grid">
            <div class="metric-card">
              <div class="metric-value">57</div>
              <div class="metric-label">Not Started</div>
            </div>
            <div class="metric-card">
              <div class="metric-value">0</div>
              <div class="metric-label">In Flight</div>
            </div>
            <div class="metric-card">
              <div class="metric-value">0</div>
              <div class="metric-label">Converted</div>
            </div>
            <div class="metric-card">
              <div class="metric-value">0</div>
              <div class="metric-label">Blocked</div>
            </div>
            <div class="metric-card">
              <div class="metric-value">0</div>
              <div class="metric-label">Deferred</div>
            </div>
          </div>
          <div class="progress-split">
            <div class="progress-card">
              <div class="card-title">Programs Converted</div>
              <div class="progress-track"><span style="width:0%"></span></div>
              <div class="progress-meta">0.0%</div>
            </div>
            <div class="progress-card">
              <div class="card-title">LOC Converted</div>
              <div class="progress-track"><span style="width:0%"></span></div>
              <div class="progress-meta">0.0%</div>
            </div>
          </div>
          <div class="wave-status">Current Wave: <span>None</span></div>
        </section>

        <section id="conversion-waveplan" class="conversion-view">
          <div class="section-title">Wave Plan</div>
          <div class="wave-summary">Wave Plan: bdbf5624-c2b4-4b31-aabe-56d676fbb77a</div>
          <div class="wave-list">
            <!-- Wave 1 -->
            <div class="wave-card" style="background: var(--panel-bg); border: 1px solid var(--border); border-radius: 8px; padding: 20px; margin-bottom: 16px; width: 100%; box-sizing: border-box;">
              <div class="wave-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; cursor: pointer; width: 100%;" onclick="toggleWave(this)">
                <div style="display: flex; align-items: center; gap: 12px; flex: 1;">
                  <div>
                    <div class="item-title" style="font-size: 16px; font-weight: 700; color: var(--text-primary); margin-bottom: 4px;">Wave 1: Group JCL-EXECUTE (JCL_JOB)</div>
                    <div class="item-sub" style="font-size: 12px; color: var(--text-muted);">4 programs, 0 LOC, 0.5 weeks, $0.00</div>
                  </div>
                </div>
                <div style="display: flex; align-items: center; gap: 12px;">
                  <div class="wave-actions" style="display: flex; gap: 8px;" onclick="event.stopPropagation()">
                    <span class="badge neutral" style="padding: 6px 12px; background: rgba(243, 156, 18, 0.15); color: #f39c12; border-radius: 6px; font-size: 11px; font-weight: 600;">PENDING</span>
                    <button class="ghost-button" onclick="showConversionModal('Wave 1: Group JCL-EXECUTE', 'wave_1', true)" style="padding: 8px 16px; background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 6px; color: #8f9bad; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s ease;" onmouseover="this.style.background='rgba(255,255,255,0.05)'; this.style.borderColor='rgba(255,255,255,0.2)'; this.style.color='#f1f3f8'" onmouseout="this.style.background='rgba(255,255,255,0.02)'; this.style.borderColor='rgba(255,255,255,0.12)'; this.style.color='#8f9bad'">Dry Run</button>
                    <button class="primary-button" onclick="showConversionModal('Wave 1: Group JCL-EXECUTE', 'wave_1', false)" style="padding: 8px 20px; background: linear-gradient(135deg, rgba(108, 92, 231, 0.2), rgba(0, 212, 255, 0.15)); border: 1px solid rgba(0, 212, 255, 0.4); border-radius: 6px; color: #00d4ff; font-size: 12px; font-weight: 700; cursor: pointer; transition: all 0.2s ease; box-shadow: 0 0 12px rgba(0, 212, 255, 0.08);" onmouseover="this.style.background='linear-gradient(135deg, rgba(108, 92, 231, 0.3), rgba(0, 212, 255, 0.25))'; this.style.boxShadow='0 0 20px rgba(0, 212, 255, 0.2)'; this.style.transform='translateY(-1px)'" onmouseout="this.style.background='linear-gradient(135deg, rgba(108, 92, 231, 0.2), rgba(0, 212, 255, 0.15))'; this.style.boxShadow='0 0 12px rgba(0, 212, 255, 0.08)'; this.style.transform='translateY(0)'">Convert</button>
                  </div>
                  <svg class="wave-arrow" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00d4ff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="transition: transform 0.3s ease; transform: rotate(-90deg); flex-shrink: 0;">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
              </div>

              <div class="wave-details" style="display: none; width: 100%; box-sizing: border-box;">
              <!-- Programs Table -->
              <div style="overflow-x: auto; margin-bottom: 16px; width: 100%;">
                <table style="width: 100%; min-width: 900px; border-collapse: collapse; font-size: 12px;">
                  <thead style="background: rgba(108, 92, 231, 0.05); border-bottom: 2px solid rgba(108, 92, 231, 0.2);">
                    <tr>
                      <th style="padding: 10px; text-align: left; color: #00d4ff; font-weight: 600; text-transform: uppercase; font-size: 10px; letter-spacing: 0.5px; width: 18%;">PROGRAM</th>
                      <th style="padding: 10px; text-align: left; color: #00d4ff; font-weight: 600; text-transform: uppercase; font-size: 10px; letter-spacing: 0.5px; width: 11%;">EQUIVALIC</th>
                      <th style="padding: 10px; text-align: left; color: #00d4ff; font-weight: 600; text-transform: uppercase; font-size: 10px; letter-spacing: 0.5px; width: 13%;">T-SHIRT</th>
                      <th style="padding: 10px; text-align: left; color: #00d4ff; font-weight: 600; text-transform: uppercase; font-size: 10px; letter-spacing: 0.5px; width: 9%;">LOC</th>
                      <th style="padding: 10px; text-align: left; color: #00d4ff; font-weight: 600; text-transform: uppercase; font-size: 10px; letter-spacing: 0.5px; width: 13%;">EXEC ENV</th>
                      <th style="padding: 10px; text-align: left; color: #00d4ff; font-weight: 600; text-transform: uppercase; font-size: 10px; letter-spacing: 0.5px; width: 11%;">RISK</th>
                      <th style="padding: 10px; text-align: left; color: #00d4ff; font-weight: 600; text-transform: uppercase; font-size: 10px; letter-spacing: 0.5px; width: 10%;">EFFORT</th>
                      <th style="padding: 10px; text-align: left; color: #00d4ff; font-weight: 600; text-transform: uppercase; font-size: 10px; letter-spacing: 0.5px; width: 15%;">STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                      <td style="padding: 10px; color: #00d4ff; font-weight: 600;">ILEFT01</td>
                      <td style="padding: 10px;">0.0</td>
                      <td style="padding: 10px;">AUTOMATED</td>
                      <td style="padding: 10px;">0</td>
                      <td style="padding: 10px;">UTILITY</td>
                      <td style="padding: 10px;"><span style="padding: 3px 8px; background: rgba(46, 204, 113, 0.15); color: #2ecc71; border-radius: 4px; font-size: 10px; font-weight: 600;">LOW</span></td>
                      <td style="padding: 10px;">0.1</td>
                      <td style="padding: 10px; color: #8f9bad;">NOT STARTED</td>
                    </tr>
                    <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                      <td style="padding: 10px; color: #00d4ff; font-weight: 600;">ORDVAL</td>
                      <td style="padding: 10px;">54.4</td>
                      <td style="padding: 10px;">COMPLEX</td>
                      <td style="padding: 10px;">0</td>
                      <td style="padding: 10px;">BATCH</td>
                      <td style="padding: 10px;"><span style="padding: 3px 8px; background: rgba(239, 68, 68, 0.15); color: #ef4444; border-radius: 4px; font-size: 10px; font-weight: 600;">HIGH</span></td>
                      <td style="padding: 10px;">0.1</td>
                      <td style="padding: 10px; color: #8f9bad;">NOT STARTED</td>
                    </tr>
                    <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
                      <td style="padding: 10px; color: #00d4ff; font-weight: 600;">ORDINV</td>
                      <td style="padding: 10px;">61.4</td>
                      <td style="padding: 10px;">COMPLEX</td>
                      <td style="padding: 10px;">0</td>
                      <td style="padding: 10px;">BATCH</td>
                      <td style="padding: 10px;"><span style="padding: 3px 8px; background: rgba(239, 68, 68, 0.15); color: #ef4444; border-radius: 4px; font-size: 10px; font-weight: 600;">HIGH</span></td>
                      <td style="padding: 10px;">0.2</td>
                      <td style="padding: 10px; color: #8f9bad;">NOT STARTED</td>
                    </tr>
                    <tr>
                      <td style="padding: 10px; color: #00d4ff; font-weight: 600;">EXECUTE</td>
                      <td style="padding: 10px;">0.0</td>
                      <td style="padding: 10px;">AUTOMATED</td>
                      <td style="padding: 10px;">0</td>
                      <td style="padding: 10px;">JCL</td>
                      <td style="padding: 10px;"><span style="padding: 3px 8px; background: rgba(46, 204, 113, 0.15); color: #2ecc71; border-radius: 4px; font-size: 10px; font-weight: 600;">LOW</span></td>
                      <td style="padding: 10px;">0.1</td>
                      <td style="padding: 10px; color: #8f9bad;">NOT STARTED</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Delivery Preview + Bundles Section -->
              <div style="display: grid; grid-template-columns: 1.2fr 1.4fr 1.4fr; gap: 16px; margin-bottom: 16px; width: 100%; min-width: 900px; box-sizing: border-box;">
                <!-- Delivery Preview Overlay -->
                <div style="background: rgba(0, 212, 255, 0.05); border: 1px solid rgba(0, 212, 255, 0.2); border-radius: 6px; padding: 18px;">
                  <div style="font-size: 13px; font-weight: 700; color: var(--text-primary); margin-bottom: 12px;">Delivery Preview</div>
                  <div style="display: flex; flex-direction: column; gap: 8px;">
                    <span style="padding: 7px 14px; background: rgba(108, 92, 231, 0.15); border: 1px solid rgba(108, 92, 231, 0.3); border-radius: 6px; font-size: 11px; color: #a29bfe; font-weight: 600; text-align: center;">JCL bundles: 1</span>
                    <span style="padding: 7px 14px; background: rgba(108, 92, 231, 0.15); border: 1px solid rgba(108, 92, 231, 0.3); border-radius: 6px; font-size: 11px; color: #a29bfe; font-weight: 600; text-align: center;">CICS bundles: 0</span>
                    <span style="padding: 7px 14px; background: rgba(108, 92, 231, 0.15); border: 1px solid rgba(108, 92, 231, 0.3); border-radius: 6px; font-size: 11px; color: #a29bfe; font-weight: 600; text-align: center;">Local edges: 5</span>
                    <span style="padding: 7px 14px; background: rgba(108, 92, 231, 0.15); border: 1px solid rgba(108, 92, 231, 0.3); border-radius: 6px; font-size: 11px; color: #a29bfe; font-weight: 600; text-align: center;">Incoming: 0</span>
                    <span style="padding: 7px 14px; background: rgba(108, 92, 231, 0.15); border: 1px solid rgba(108, 92, 231, 0.3); border-radius: 6px; font-size: 11px; color: #a29bfe; font-weight: 600; text-align: center;">Outgoing: 11</span>
                  </div>
                </div>

                <!-- JCL Bundles -->
                <div style="background: rgba(108, 92, 231, 0.05); border: 1px solid rgba(108, 92, 231, 0.15); border-radius: 6px; padding: 18px;">
                  <div style="font-size: 13px; font-weight: 700; color: var(--text-primary); margin-bottom: 12px;">JCL Bundles</div>
                  <div style="background: rgba(20, 26, 36, 0.6); border-radius: 4px; padding: 12px;">
                    <div style="font-size: 12px; font-weight: 600; color: #00d4ff; margin-bottom: 6px;">JCL-EXECUTE <span style="padding: 3px 8px; background: rgba(0, 212, 255, 0.2); border-radius: 4px; font-size: 9px; margin-left: 6px;">JCL_JOB</span></div>
                    <div style="font-size: 10px; color: #8f9bad; line-height: 1.6;">Members: ILEFT01, ORDVAL, ORDINV, EXECUTE</div>
                    <div style="font-size: 10px; color: #8f9bad; line-height: 1.6;">Direct: ILEFT01, ORDVAL, ORDINV, EXECUTE</div>
                  </div>
                </div>

                <!-- CICS Bundles -->
                <div style="background: rgba(108, 92, 231, 0.05); border: 1px solid rgba(108, 92, 231, 0.15); border-radius: 6px; padding: 18px;">
                  <div style="font-size: 13px; font-weight: 700; color: var(--text-primary); margin-bottom: 12px;">CICS Bundles</div>
                  <div style="padding: 24px; text-align: center; color: #8f9bad; font-size: 11px; font-style: italic;">No CICS bundles in this wave</div>
                </div>
              </div>

              <!-- Wave Dependency Graph Slice -->
              <div style="background: rgba(0, 212, 255, 0.05); border: 1px solid rgba(0, 212, 255, 0.15); border-radius: 6px; padding: 18px; width: 100%; box-sizing: border-box;">
                <div style="font-size: 13px; font-weight: 700; color: var(--text-primary); margin-bottom: 12px;">Wave Dependency Graph Slice</div>
                <div style="display: grid; grid-template-columns: 1.3fr 0.9fr 1.8fr; gap: 16px; font-size: 11px; min-width: 850px;">
                  <div>
                    <div style="font-weight: 600; color: #6c5ce7; margin-bottom: 8px; padding: 6px 12px; background: rgba(108, 92, 231, 0.15); border-radius: 4px; text-align: center;">LOCAL EDGES (INSIDE WAVE)</div>
                    <div style="background: rgba(20, 26, 36, 0.6); border-radius: 4px; padding: 14px; color: var(--text-muted); line-height: 1.8; font-family: monospace; font-size: 11px;">
                      ORDVAL → ORDINV<br>
                      ORDINV → ORDVAL<br>
                      EXECUTE → ILEFT01<br>
                      EXECUTE → ORDVAL<br>
                      EXECUTE → ORDINV
                    </div>
                  </div>
                  <div>
                    <div style="font-weight: 600; color: #2ecc71; margin-bottom: 8px; padding: 6px 12px; background: rgba(46, 204, 113, 0.15); border-radius: 4px; text-align: center;">INCOMING</div>
                    <div style="background: rgba(20, 26, 36, 0.6); border-radius: 4px; padding: 14px; text-align: center; color: #8f9bad; font-style: italic; min-height: 126px; display: flex; align-items: center; justify-content: center;">
                      None
                    </div>
                  </div>
                  <div>
                    <div style="font-weight: 600; color: #f39c12; margin-bottom: 8px; padding: 6px 12px; background: rgba(243, 156, 18, 0.15); border-radius: 4px; text-align: center;">OUTGOING TO OTHER WAVES</div>
                    <div style="background: rgba(20, 26, 36, 0.6); border-radius: 4px; padding: 14px; color: var(--text-muted); line-height: 1.8; font-family: monospace; font-size: 11px; max-height: 170px; overflow-y: auto;">
                      EXECUTE → PROD.LOADLIB<br>
                      EXECUTE → PROD.ORDERS.ERROR<br>
                      EXECUTE → PROD.ORDERS.INPUT<br>
                      EXECUTE → PROD.ORDERS.PROCESSED<br>
                      EXECUTE → PROD.ORDERS.VALID<br>
                      ORDINV → INVENTORY<br>
                      ORDINV → ORDER.STATUS<br>
                      ORDINV → SQLCODES<br>
                      ORDVAL → CUSTOMER<br>
                      ORDVAL → INVSTRUC<br>
                      ORDVAL → ORDSTRUC
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </div>

            <!-- Wave 2 -->
            <div class="wave-card" style="background: var(--panel-bg); border: 1px solid var(--border); border-radius: 8px; padding: 20px; margin-bottom: 16px; width: 100%; box-sizing: border-box;">
              <div class="wave-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; cursor: pointer; width: 100%;" onclick="toggleWave(this)">
                <div style="display: flex; align-items: center; gap: 12px; flex: 1;">
                  <div>
                    <div class="item-title" style="font-size: 16px; font-weight: 700; color: var(--text-primary); margin-bottom: 4px;">Wave 2: Ungrouped Convertible Programs</div>
                    <div class="item-sub" style="font-size: 12px; color: var(--text-muted);">16 programs, 0 LOC, 1.2 weeks, $0.00</div>
                  </div>
                </div>
                <div style="display: flex; align-items: center; gap: 12px;">
                  <div class="wave-actions" style="display: flex; gap: 8px;" onclick="event.stopPropagation()">
                    <span class="badge neutral" style="padding: 6px 12px; background: rgba(243, 156, 18, 0.15); color: #f39c12; border-radius: 6px; font-size: 11px; font-weight: 600;">PENDING</span>
                    <button class="ghost-button" onclick="showConversionModal('Wave 2: Ungrouped Convertible Programs', 'wave_2', true)" style="padding: 8px 16px; background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 6px; color: #8f9bad; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s ease;" onmouseover="this.style.background='rgba(255,255,255,0.05)'; this.style.borderColor='rgba(255,255,255,0.2)'; this.style.color='#f1f3f8'" onmouseout="this.style.background='rgba(255,255,255,0.02)'; this.style.borderColor='rgba(255,255,255,0.12)'; this.style.color='#8f9bad'">Dry Run</button>
                    <button class="primary-button" onclick="showConversionModal('Wave 2: Ungrouped Convertible Programs', 'wave_2', false)" style="padding: 8px 20px; background: linear-gradient(135deg, rgba(108, 92, 231, 0.2), rgba(0, 212, 255, 0.15)); border: 1px solid rgba(0, 212, 255, 0.4); border-radius: 6px; color: #00d4ff; font-size: 12px; font-weight: 700; cursor: pointer; transition: all 0.2s ease; box-shadow: 0 0 12px rgba(0, 212, 255, 0.08);" onmouseover="this.style.background='linear-gradient(135deg, rgba(108, 92, 231, 0.3), rgba(0, 212, 255, 0.25))'; this.style.boxShadow='0 0 20px rgba(0, 212, 255, 0.2)'; this.style.transform='translateY(-1px)'" onmouseout="this.style.background='linear-gradient(135deg, rgba(108, 92, 231, 0.2), rgba(0, 212, 255, 0.15))'; this.style.boxShadow='0 0 12px rgba(0, 212, 255, 0.08)'; this.style.transform='translateY(0)'">Convert</button>
                  </div>
                  <svg class="wave-arrow" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00d4ff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="transition: transform 0.3s ease; transform: rotate(-90deg); flex-shrink: 0;">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
              </div>

              <div class="wave-details" style="display: none; width: 100%; box-sizing: border-box;">
                <!-- Programs Table -->
                <div style="overflow-x: auto; margin-bottom: 16px; width: 100%;">
                  <table style="width: 100%; min-width: 850px; border-collapse: collapse; font-size: 12px;">
                    <thead style="background: rgba(108, 92, 231, 0.05); border-bottom: 2px solid rgba(108, 92, 231, 0.2);">
                      <tr>
                        <th style="padding: 10px; text-align: left; color: #00d4ff; font-weight: 600; text-transform: uppercase; font-size: 10px;">PROGRAM</th>
                        <th style="padding: 10px; text-align: left; color: #00d4ff; font-weight: 600; text-transform: uppercase; font-size: 10px;">EQUIVALIC</th>
                        <th style="padding: 10px; text-align: left; color: #00d4ff; font-weight: 600; text-transform: uppercase; font-size: 10px;">T-SHIRT</th>
                        <th style="padding: 10px; text-align: left; color: #00d4ff; font-weight: 600; text-transform: uppercase; font-size: 10px;">LOC</th>
                        <th style="padding: 10px; text-align: left; color: #00d4ff; font-weight: 600; text-transform: uppercase; font-size: 10px;">EXEC ENV</th>
                        <th style="padding: 10px; text-align: left; color: #00d4ff; font-weight: 600; text-transform: uppercase; font-size: 10px;">RISK</th>
                        <th style="padding: 10px; text-align: left; color: #00d4ff; font-weight: 600; text-transform: uppercase; font-size: 10px;">STATUS</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);"><td style="padding: 10px; color: #00d4ff; font-weight: 600;">ACCTINQ</td><td style="padding: 10px;">12.5</td><td style="padding: 10px;">SIMPLE</td><td style="padding: 10px;">150</td><td style="padding: 10px;">BATCH</td><td style="padding: 10px;"><span style="padding: 3px 8px; background: rgba(46, 204, 113, 0.15); color: #2ecc71; border-radius: 4px; font-size: 10px;">LOW</span></td><td style="padding: 10px; color: #8f9bad;">NOT STARTED</td></tr>
                      <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);"><td style="padding: 10px; color: #00d4ff; font-weight: 600;">BANKING</td><td style="padding: 10px;">25.3</td><td style="padding: 10px;">MEDIUM</td><td style="padding: 10px;">300</td><td style="padding: 10px;">ONLINE</td><td style="padding: 10px;"><span style="padding: 3px 8px; background: rgba(243, 156, 18, 0.15); color: #f39c12; border-radius: 4px; font-size: 10px;">MEDIUM</span></td><td style="padding: 10px; color: #8f9bad;">NOT STARTED</td></tr>
                      <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);"><td style="padding: 10px; color: #00d4ff; font-weight: 600;">CALCULIT</td><td style="padding: 10px;">8.2</td><td style="padding: 10px;">SIMPLE</td><td style="padding: 10px;">120</td><td style="padding: 10px;">UTILITY</td><td style="padding: 10px;"><span style="padding: 3px 8px; background: rgba(46, 204, 113, 0.15); color: #2ecc71; border-radius: 4px; font-size: 10px;">LOW</span></td><td style="padding: 10px; color: #8f9bad;">NOT STARTED</td></tr>
                      <tr><td style="padding: 10px; color: #8f9bad; font-style: italic;" colspan="7">+ 13 more programs...</td></tr>
                    </tbody>
                  </table>
                </div>
                <div style="background: rgba(0, 212, 255, 0.05); border: 1px solid rgba(0, 212, 255, 0.2); border-radius: 6px; padding: 12px; text-align: center; color: #8f9bad; font-size: 12px; width: 100%; box-sizing: border-box;">
                  No bundle or dependency data for ungrouped programs
                </div>
              </div>
            </div>

            <!-- Wave 3 -->
            <div class="wave-card" style="background: var(--panel-bg); border: 1px solid var(--border); border-radius: 8px; padding: 20px; margin-bottom: 16px; width: 100%; box-sizing: border-box;">
              <div class="wave-header" style="display: flex; justify-content: space-between; align-items: center; cursor: pointer; width: 100%;" onclick="toggleWave(this)">
                <div style="display: flex; align-items: center; gap: 12px; flex: 1;">
                  <div>
                    <div class="item-title" style="font-size: 16px; font-weight: 700; color: var(--text-primary); margin-bottom: 4px;">Wave 3: Non-Convertible References</div>
                    <div class="item-sub" style="font-size: 12px; color: var(--text-muted);">30 programs, 0 LOC, 3.0 weeks, $0.00</div>
                  </div>
                </div>
                <div style="display: flex; align-items: center; gap: 12px;">
                  <div class="wave-actions" style="display: flex; gap: 8px;" onclick="event.stopPropagation()">
                    <span class="badge neutral" style="padding: 6px 12px; background: rgba(243, 156, 18, 0.15); color: #f39c12; border-radius: 6px; font-size: 11px; font-weight: 600;">PENDING</span>
                    <button class="ghost-button" style="padding: 8px 16px; background: var(--panel-bg); border: 1px solid var(--border); border-radius: 6px; color: var(--accent-2); font-size: 12px; font-weight: 600; cursor: pointer;">Reference Only</button>
                  </div>
                  <svg class="wave-arrow" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00d4ff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="transition: transform 0.3s ease; transform: rotate(-90deg); flex-shrink: 0;">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
              </div>

              <div class="wave-details" style="display: none; width: 100%; box-sizing: border-box;">
                <!-- Programs Table -->
                <div style="overflow-x: auto; margin-bottom: 16px; width: 100%;">
                  <table style="width: 100%; min-width: 700px; border-collapse: collapse; font-size: 12px;">
                    <thead style="background: rgba(108, 92, 231, 0.05); border-bottom: 2px solid rgba(108, 92, 231, 0.2);">
                      <tr>
                        <th style="padding: 10px; text-align: left; color: #00d4ff; font-weight: 600; text-transform: uppercase; font-size: 10px;">PROGRAM</th>
                        <th style="padding: 10px; text-align: left; color: #00d4ff; font-weight: 600; text-transform: uppercase; font-size: 10px;">TYPE</th>
                        <th style="padding: 10px; text-align: left; color: #00d4ff; font-weight: 600; text-transform: uppercase; font-size: 10px;">REASON</th>
                        <th style="padding: 10px; text-align: left; color: #00d4ff; font-weight: 600; text-transform: uppercase; font-size: 10px;">STATUS</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);"><td style="padding: 10px; color: #00d4ff; font-weight: 600;">CUSTOMER</td><td style="padding: 10px;">SQL_REFERENCE</td><td style="padding: 10px; color: #8f9bad;">Database table reference</td><td style="padding: 10px; color: #8f9bad;">REFERENCE ONLY</td></tr>
                      <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);"><td style="padding: 10px; color: #00d4ff; font-weight: 600;">INVENTORY</td><td style="padding: 10px;">SQL_REFERENCE</td><td style="padding: 10px; color: #8f9bad;">Database table reference</td><td style="padding: 10px; color: #8f9bad;">REFERENCE ONLY</td></tr>
                      <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);"><td style="padding: 10px; color: #00d4ff; font-weight: 600;">INVSTRUC</td><td style="padding: 10px;">COPYBOOK</td><td style="padding: 10px; color: #8f9bad;">Data structure definition</td><td style="padding: 10px; color: #8f9bad;">REFERENCE ONLY</td></tr>
                      <tr><td style="padding: 10px; color: #8f9bad; font-style: italic;" colspan="4">+ 27 more references...</td></tr>
                    </tbody>
                  </table>
                </div>
                <div style="background: rgba(243, 156, 18, 0.05); border: 1px solid rgba(243, 156, 18, 0.2); border-radius: 6px; padding: 12px; color: #8f9bad; font-size: 12px; width: 100%; box-sizing: border-box;">
                  <strong style="color: #f39c12;">Note:</strong> These are non-convertible references (SQL tables, copybooks, etc.) that don't require conversion but are used by other programs.
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="conversion-cost" class="conversion-view">
          <div class="section-title">LLM Cost Tracking</div>
          <div class="cost-grid">
            <div class="metric-card compact">
              <div class="metric-label">Estimated Total</div>
              <div class="metric-value">$0.00</div>
            </div>
            <div class="metric-card compact">
              <div class="metric-label">Spent To Date</div>
              <div class="metric-value">$0.00</div>
            </div>
            <div class="metric-card compact">
              <div class="metric-label">Remaining</div>
              <div class="metric-value">$0.00</div>
            </div>
          </div>
          <div style="background: var(--panel-bg); border: 1px solid var(--border); border-radius: 8px; padding: 24px; margin-top: 24px;">
            <div style="font-size: 15px; font-weight: 700; color: var(--text-primary); margin-bottom: 20px;">Cost Over Time (Estimated vs Actual)</div>
            <canvas id="costChart" style="max-height: 350px;"></canvas>
          </div>
        </section>

        <section id="conversion-timeline" class="conversion-view">
          <div class="section-title">Wave Timeline</div>
          <div class="timeline-meta">Projected Completion: 2026-07-10 | Velocity: -- programs/week</div>
          <div class="timeline-shell">
            <div class="timeline-row"><span>JCL-ACCTINQ-SCREEN</span><span>1 prog, 0 LOC</span></div>
            <div class="timeline-row"><span>JCL-EXECUTE</span><span>4 prog, 0 LOC</span></div>
            <div class="timeline-row"><span>JCL-MAINPROG</span><span>2 prog, 0 LOC</span></div>
            <div class="timeline-row"><span>JCL-SALES-PROCESS</span><span>2 prog, 0 LOC</span></div>
            <div class="timeline-row"><span>JCL-STUDENT-PROCESS</span><span>2 prog, 0 LOC</span></div>
            <div class="timeline-row"><span>Ungrouped Convertible Programs</span><span>16 prog, 0 LOC</span></div>
            <div class="timeline-row"><span>Non-Convertible References</span><span>30 prog, 0 LOC</span></div>
          </div>
        </section>

        <section id="conversion-bridges" class="conversion-view">
          <div class="section-title">Strangler Fig Bridges</div>
          <div class="table-card">
            <table>
              <thead>
                <tr>
                  <th>Caller</th>
                  <th>Callee</th>
                  <th>Direction</th>
                  <th>Wrapper Type</th>
                  <th>Needed In Wave</th>
                  <th>Stub Complexity</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colspan="6" class="empty-row">No strangler fig bridges needed</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    `;
    if (leftPanel) leftPanel.classList.remove("fade-out");
    displayPanel.classList.remove("fade-out");
    document.getElementById("backToDashboard")?.addEventListener("click", restoreDashboard);
    bindConversionTabs();
    const blockToggle = document.getElementById("toggleBlockConversion");
    const quarantineToggle = document.getElementById("toggleQuarantine");
    if (blockToggle) blockToggle.addEventListener("change", updateReadinessNotice);
    if (quarantineToggle) quarantineToggle.addEventListener("change", updateReadinessNotice);
    updateReadinessNotice();
  }, 200);
}

function toggleWave(header) {
  const card = header.closest('.wave-card');
  const details = card.querySelector('.wave-details');
  const arrow = header.querySelector('.wave-arrow');
  
  if (details.style.display === 'none') {
    details.style.display = 'block';
    arrow.style.transform = 'rotate(0deg)';
  } else {
    details.style.display = 'none';
    arrow.style.transform = 'rotate(-90deg)';
  }
}

function openConversionStatus() {
  window.location.href = 'conversion%20status.html';
}

function startAllWavesConversion(button) {
  const label = button?.querySelector('span');
  if (button) {
    button.disabled = true;
    button.classList.add('is-converting');
  }
  if (label) label.textContent = 'Converting all...';

  showConversionModal('All Waves', 'All Waves', false, 500, () => {
    if (button) {
      button.disabled = false;
      button.classList.remove('is-converting');
    }
    if (label) label.textContent = 'Convert All Waves';
  });
}

function showConversionModal(waveName, waveId, isDryRun, statusCode = 400, onModalShown) {
  // First show the "Starting conversion" notification
  const startNotification = document.createElement('div');
  startNotification.className = 'conversion-toast warning';
  startNotification.innerHTML = `
    <div class="conversion-toast-title">
      Starting conversion for ${waveId}${isDryRun ? ' (Dry Run)' : ''}...
    </div>
  `;
  document.body.appendChild(startNotification);

  // After 2 seconds, remove the start notification and show the result notification
  setTimeout(() => {
    document.body.removeChild(startNotification);
    
    // Show result notification
    const resultNotification = document.createElement('div');
    resultNotification.className = `conversion-toast ${isDryRun ? 'success' : 'warning'}`;
    
    if (isDryRun) {
      resultNotification.innerHTML = `
        <div class="conversion-toast-title">
          Dry run completed for ${waveId}
        </div>
        <div class="conversion-toast-meta">
          Ready to review results
        </div>
      `;
    } else {
      resultNotification.innerHTML = `
        <div class="conversion-toast-title">
          Conversion engine returned HTTP ${statusCode}
        </div>
      `;
    }
    document.body.appendChild(resultNotification);

    // After 1 second, show the modal
    setTimeout(() => {
      showModal();
    }, 1000);

    // Remove notification after 4 seconds
    setTimeout(() => {
      if (document.body.contains(resultNotification)) {
        resultNotification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
          if (document.body.contains(resultNotification)) {
            document.body.removeChild(resultNotification);
          }
        }, 300);
      }
    }, 4000);
  }, 2000);

  function showModal() {
    const displayWaveName = waveName || waveId.replace(/_/g, ' ');
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'conversion-modal-overlay';

    const modal = document.createElement('div');
    modal.className = 'conversion-result-modal';

    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '×';
    closeBtn.className = 'conversion-modal-close';
    closeBtn.setAttribute('aria-label', 'Close conversion result');
    closeBtn.onclick = () => document.body.removeChild(modalOverlay);

    const title = document.createElement('h2');
    title.textContent = `Conversion Result: ${displayWaveName}${isDryRun ? ' (Dry Run)' : ''}`;
    title.className = 'conversion-modal-title';

    const content = document.createElement('div');
    content.className = 'conversion-modal-content';
    
    if (isDryRun) {
      // Dry Run modal content
      content.innerHTML = `
        <div class="conversion-result-block">
          <h3 class="conversion-result-heading">Programs to Convert (4)</h3>
          <div class="conversion-program-list">
            <span class="conversion-program-chip">ORDVAL</span>
            <span class="conversion-program-chip">ORDINV</span>
            <span class="conversion-program-chip">EXECUTE</span>
            <span class="conversion-program-chip">IKJEFT01</span>
          </div>
        </div>
        <button id="viewStatusBtn" class="conversion-status-button">
          <span class="conversion-status-icon" aria-hidden="true"><span></span></span>
          <span>View Detailed Conversion Status</span>
        </button>
      `;
    } else {
      // Convert modal content
      content.innerHTML = `
        <div class="conversion-result-block warning">
          <div class="conversion-result-kicker">Status</div>
          <div class="conversion-result-message">Conversion engine returned HTTP ${statusCode}</div>
        </div>
        <button id="viewStatusBtn" class="conversion-status-button">
          <span class="conversion-status-icon" aria-hidden="true"><span></span></span>
          <span>View Detailed Conversion Status</span>
        </button>
      `;
    }

    modal.appendChild(closeBtn);
    modal.appendChild(title);
    modal.appendChild(content);
    modalOverlay.appendChild(modal);
    document.body.appendChild(modalOverlay);
    if (onModalShown) onModalShown();

    // Add event listener for View Status button
    const viewStatusBtn = document.getElementById('viewStatusBtn');
    if (viewStatusBtn) {
      viewStatusBtn.onclick = () => {
        openConversionStatus();
      };
    }

    // Close on overlay click
    modalOverlay.onclick = (e) => {
      if (e.target === modalOverlay) {
        document.body.removeChild(modalOverlay);
      }
    };
  }

  // Add animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes slideInRight {
      from { opacity: 0; transform: translateX(100px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes slideOutRight {
      from { opacity: 1; transform: translateX(0); }
      to { opacity: 0; transform: translateX(100px); }
    }
  `;
  if (!document.getElementById('conversion-animations')) {
    style.id = 'conversion-animations';
    document.head.appendChild(style);
  }
}

syncSidebarActive(window.EQUIVALIC_INITIAL_PAGE);
activateConvertMode();
