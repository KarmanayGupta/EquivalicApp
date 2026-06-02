/* ============================================================
   Analysis Health page logic
   Source: ChangedAnalysisEngine (2).html
   Contains this page's bootstrap, renderers, handlers, and data only.
============================================================ */
window.EQUIVALIC_INITIAL_PAGE = window.EQUIVALIC_INITIAL_PAGE || 'Analysis Health';

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


function activateAnalysisHealthMode() {
      
      
      const leftHTML = `
      <style>
      .health-sidebar {
        display: flex; flex-direction: column; gap: 4px;
      }
      .health-sidebar .tab {
        text-align: left; padding: 14px 16px 14px 13px; border-left: 3px solid transparent; border-radius: 10px; background: transparent; color: var(--text-muted); cursor: pointer; transition: all 0.2s ease; font-family: "Inter", sans-serif; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; border-top: none; border-right: none; border-bottom: none;
      }
      .health-sidebar .tab:hover {
        background: rgba(255,255,255,0.05); color: var(--text-primary); border-left-color: var(--accent-1); transform: translateX(4px);
      }
      .health-sidebar .tab.active {
        background: linear-gradient(90deg, rgba(108,92,231,0.18), transparent);
        color: var(--accent-2);
        border-left-color: var(--accent-1);
      }
      .health-sidebar .tab.active:hover {
        transform: none;
      }
      .health-sidebar .tab.active::after {
        display: none;
      }
      </style>
      <div class="tree" style="display: block;">
        <div style="font-size: 12px; font-weight: 700; color: var(--text-primary); letter-spacing: 0.5px; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid var(--border); text-transform: uppercase;">
          ANALYSIS OVERVIEW
        </div>
        <div class="health-sidebar" id="healthTabs">
          
            <button class="tab active" data-view="health-tab-overview">Overview</button>
<button class="tab" data-view="health-tab-0" >Upload, Discovery, Preprocess & IR Generation</button><button class="tab" data-view="health-tab-1" >Parser & AST</button><button class="tab" data-view="health-tab-2" >IR Accuracy Lifecycle</button><button class="tab" data-view="health-tab-3" >Dependency Graph Audit</button><button class="tab" data-view="health-tab-4" >Project-Level Artifact Health</button><button class="tab" data-view="health-tab-5" >Post-IR Readiness</button><button class="tab" data-view="health-tab-6" >AI Assistance Health</button><button class="tab" data-view="health-tab-7" >Run Timeline & Performance</button><button class="tab" data-view="health-tab-8" >Persistence & Artifact I/O Health</button><button class="tab" data-view="health-tab-9" >Review Queue & Downloads</button>
        
        </div>
      </div>
    `;
      const displayHTML = `
      <div class="scroll-container" style="display:flex; flex-direction:column; height:100%; overflow-y:auto; padding-right:16px;">
        <div class="health-content-area" style="flex: 1; min-width: 0;">

            <div id="health-tab-overview" class="health-section" style="display:block;">
                
        
        <!-- Header -->
        <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:24px;">
            <div>
                <div style="font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase; margin-bottom:4px; letter-spacing:0.5px;">COBOL Analysis Readiness</div>
                <h2 style="font-size:32px; font-weight:700; color:#fff; margin:0 0 8px 0;">Analysis Health</h2>
                <div style="font-size:14px; color:var(--text-muted);">A deterministic pipeline view from repo upload through AST, IR generation, IR accuracy, dependencies, artifacts, optional AI, and conversion readiness.</div>
            </div>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px;">
                <button class="graph-btn" style="justify-content:center;">Refresh</button>
                <button class="graph-btn" style="justify-content:center;">Project DNA</button>
                <button class="graph-btn" style="grid-column: span 2; justify-content:center;">Download health bundle</button>
            </div>
        </div>

        <!-- Alert Banner -->
        <div style="background:rgba(241,196,15,0.1); border:1px solid rgba(241,196,15,0.3); color:#f1c40f; padding:16px 20px; border-radius:8px; font-size:14px; font-weight:600; margin-bottom:24px;">
            Ready with warnings: review partial parses, graph references, project artifact findings, or post-IR warnings before conversion.
        </div>
    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(150px, 1fr)); gap:16px; margin-bottom:32px;">
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Timeline Stages</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">10</div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Parser Failures</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">0</div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Partial Parses</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">1</div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">IR Warnings</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">1</div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Graph Unresolved</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">0</div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Artifact Validation Fails</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">0</div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Artifact I/O Reads</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">14</div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Large Artifacts</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">0</div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">I/O Cache Hits</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">13</div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Skipped Files</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">0</div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">AI Calls</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">0</div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">AI Cache Hits</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">0</div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Post-IR Blockers</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">0</div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Initial IR Score</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">-</div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Post-Fix IR Score</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">-</div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">IR Readiness</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">not_checked</div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Resource Nodes</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">0</div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Evidence Edges</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">0</div>
        
    </div>
    
            </div> <!-- CLOSE GRID -->
            </div> <!-- CLOSE HEALTH-TAB-OVERVIEW -->
    <div id="health-tab-0" class="health-section" style="display:none; background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:12px; padding:24px; margin-bottom:32px;">
        <h3 style="font-size:16px; font-weight:600; color:#fff; margin-top:0; margin-bottom:20px;">Upload, Discovery, Preprocess & IR Generation</h3>
        <div style="display:flex; flex-wrap:wrap; gap:12px; margin-bottom:24px;"><div style='flex:1; min-width:140px;'>
    <div style="background:#212733; border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Uploaded files</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">1</div>
        
    </div>
    </div><div style='flex:1; min-width:140px;'>
    <div style="background:#212733; border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Parsed programs</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">1</div>
        
    </div>
    </div><div style='flex:1; min-width:140px;'>
    <div style="background:#212733; border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Dependency context</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">0</div>
        
    </div>
    </div><div style='flex:1; min-width:140px;'>
    <div style="background:#212733; border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Unsupported skipped</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">0</div>
        
    </div>
    </div><div style='flex:1; min-width:180px;'>
    <div style="background:#212733; border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Discovery cache</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">hit=0, miss=1</div>
        
    </div>
    </div><div style='flex:1; min-width:180px;'>
    <div style="background:#212733; border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Copybooks</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">reg=0, dup=0</div>
        
    </div>
    </div><div style='flex:1; min-width:180px;'>
    <div style="background:#212733; border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Missing copybooks</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">app=0, sys=0</div>
        
    </div>
    </div><div style='flex:1; min-width:180px;'>
    <div style="background:#212733; border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Copybook policy</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">app=warn</div>
        
    </div>
    </div><div style='flex:1; min-width:180px;'>
    <div style="background:#212733; border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">IR quality</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">pass=0, warn=1, fail=0</div>
        
    </div>
    </div><div style='flex:1; min-width:180px;'>
    <div style="background:#212733; border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">IR certification</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">cert=0, warn=1, block=0</div>
        
    </div>
    </div><div style='flex:1; min-width:180px;'>
    <div style="background:#212733; border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Conversion risk</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">low=1, med=0, high=0</div>
        
    </div>
    </div><div style='flex:1; min-width:140px;'>
    <div style="background:#212733; border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Preprocess warnings</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">1</div>
        
    </div>
    </div></div>
    
    <style>
      .health-table th:not(:last-child),
      .health-table td:not(:last-child) {
        border-right: 1px solid rgba(255,255,255,0.05);
      }
    </style>
    
    <h4 style='font-size:14px; font-weight:600; margin-bottom:12px; color:#fff;'>Deterministic IR Quality</h4>
    <div class="custom-scrollbar" style="overflow-x:auto; margin-bottom:24px; background:rgba(0,0,0,0.15); border-radius:8px; border:1px solid rgba(255,255,255,0.05);">
        <table class="health-table" style="width:100%; border-collapse:collapse; font-size:13px; text-align:left;">
            <thead style="background:rgba(255,255,255,0.02); color:var(--text-muted); font-size:11px; text-transform:uppercase; letter-spacing:0.5px;">
                <tr><th style="padding:16px;">Program</th><th style="padding:16px;">Status</th><th style="padding:16px;">Score</th><th style="padding:16px;">Issues</th></tr>
            </thead>
            <tbody>
                <tr style="border-top:1px solid rgba(255,255,255,0.05); transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
                    <td style="padding:16px; vertical-align:top; font-weight:700; color:#fff;">temp</td>
                    <td style="padding:16px; vertical-align:top; color:#cbd5e1;">passed_warnings</td>
                    <td style="padding:16px; vertical-align:top; color:#cbd5e1;">72</td>
                    <td style="padding:16px; vertical-align:top; color:#cbd5e1;">partial_parse, parse_errors, preprocessing_warnings</td>
                </tr>
            </tbody>
        </table>
    </div>

    <h4 style='font-size:14px; font-weight:600; margin-bottom:12px; color:#fff;'>IR Certification</h4>
    <div class="custom-scrollbar" style="overflow-x:auto; margin-bottom:24px; background:rgba(0,0,0,0.15); border-radius:8px; border:1px solid rgba(255,255,255,0.05);">
        <table class="health-table" style="width:100%; border-collapse:collapse; font-size:13px; text-align:left;">
            <thead style="background:rgba(255,255,255,0.02); color:var(--text-muted); font-size:11px; text-transform:uppercase; letter-spacing:0.5px;">
                <tr><th style="padding:16px;">Program</th><th style="padding:16px;">Status</th><th style="padding:16px;">Score</th><th style="padding:16px;">Risk</th><th style="padding:16px;">Blocking</th></tr>
            </thead>
            <tbody>
                <tr style="border-top:1px solid rgba(255,255,255,0.05); transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
                    <td style="padding:16px; vertical-align:top; font-weight:700; color:#fff;">temp</td>
                    <td style="padding:16px; vertical-align:top; color:#cbd5e1;">certified_with_warnings</td>
                    <td style="padding:16px; vertical-align:top; color:#cbd5e1;">99</td>
                    <td style="padding:16px; vertical-align:top; color:#cbd5e1;">LOW</td>
                    <td style="padding:16px; vertical-align:top; color:#cbd5e1;">0</td>
                </tr>
            </tbody>
        </table>
    </div>

    <h4 style='font-size:14px; font-weight:600; margin-bottom:12px; color:#fff;'>Preprocessing Warnings</h4>
    <div class="custom-scrollbar" style="overflow-x:auto; margin-bottom:24px; background:rgba(0,0,0,0.15); border-radius:8px; border:1px solid rgba(255,255,255,0.05);">
        <table class="health-table" style="width:100%; border-collapse:collapse; font-size:13px; text-align:left;">
            <thead style="background:rgba(255,255,255,0.02); color:var(--text-muted); font-size:11px; text-transform:uppercase; letter-spacing:0.5px;">
                <tr><th style="padding:16px;">Program</th><th style="padding:16px;">Severity</th><th style="padding:16px;">Type</th><th style="padding:16px;">Message</th></tr>
            </thead>
            <tbody>
                <tr style="border-top:1px solid rgba(255,255,255,0.05); transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
                    <td style="padding:16px; vertical-align:top; font-weight:700; color:#fff;">temp</td>
                    <td style="padding:16px; vertical-align:top; color:#cbd5e1;">INFO</td>
                    <td style="padding:16px; vertical-align:top; color:#cbd5e1;">DEBUG_INDICATOR_LINE_COMMENTED</td>
                    <td style="padding:16px; vertical-align:top; color:#cbd5e1;">Commented debug indicator line from column 7 for parser compatibility.</td>
                </tr>
            </tbody>
        </table>
    </div>

    <h4 style='font-size:14px; font-weight:600; margin-bottom:12px; color:#fff;'>SQL/CICS Mapping Audit</h4>
    <div class="custom-scrollbar" style="overflow-x:auto; margin-bottom:24px; background:rgba(0,0,0,0.15); border-radius:8px; border:1px solid rgba(255,255,255,0.05);">
        <table class="health-table" style="width:100%; border-collapse:collapse; font-size:13px; text-align:left;">
            <thead style="background:rgba(255,255,255,0.02); color:var(--text-muted); font-size:11px; text-transform:uppercase; letter-spacing:0.5px;">
                <tr><th style="padding:16px;">Program</th><th style="padding:16px;">Extracted</th><th style="padding:16px;">Mapped</th><th style="padding:16px;">Unmapped</th><th style="padding:16px;">Warnings</th></tr>
            </thead>
            <tbody>
                <tr style="border-top:1px solid rgba(255,255,255,0.05); transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
                    <td style="padding:16px; vertical-align:top; font-weight:700; color:#fff;">temp</td>
                    <td style="padding:16px; vertical-align:top; color:#cbd5e1;">0</td>
                    <td style="padding:16px; vertical-align:top; color:#cbd5e1;">0</td>
                    <td style="padding:16px; vertical-align:top; color:#cbd5e1;">0</td>
                    <td style="padding:16px; vertical-align:top; color:#cbd5e1;">-</td>
                </tr>
            </tbody>
        </table>
    </div>

    <h4 style='font-size:14px; font-weight:600; margin-bottom:12px; color:#fff;'>Copybook Resolution</h4>
    <div class="custom-scrollbar" style="overflow-x:auto; margin-bottom:24px; background:rgba(0,0,0,0.15); border-radius:8px; border:1px solid rgba(255,255,255,0.05);">
        <table class="health-table" style="width:100%; border-collapse:collapse; font-size:13px; text-align:left;">
            <thead style="background:rgba(255,255,255,0.02); color:var(--text-muted); font-size:11px; text-transform:uppercase; letter-spacing:0.5px;">
                <tr><th style="padding:16px;">Program</th><th style="padding:16px;">Copybook</th><th style="padding:16px;">Status</th><th style="padding:16px;">Severity</th><th style="padding:16px;">Selected</th><th style="padding:16px;">Reason</th></tr>
            </thead>
            <tbody>
                <tr style="border-top:1px solid rgba(255,255,255,0.05); transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
                    <td style="padding:16px; vertical-align:top; font-weight:700; color:#fff;">No copybook references recorded.</td>
                    <td style="padding:16px; vertical-align:top; color:#cbd5e1;"></td>
                    <td style="padding:16px; vertical-align:top; color:#cbd5e1;"></td>
                    <td style="padding:16px; vertical-align:top; color:#cbd5e1;"></td>
                    <td style="padding:16px; vertical-align:top; color:#cbd5e1;"></td>
                    <td style="padding:16px; vertical-align:top; color:#cbd5e1;"></td>
                </tr>
            </tbody>
        </table>
    </div>

    <h4 style='font-size:14px; font-weight:600; margin-bottom:12px; color:#fff;'>File Classification</h4>
    <div class="custom-scrollbar" style="overflow-x:auto; margin-bottom:24px; background:rgba(0,0,0,0.15); border-radius:8px; border:1px solid rgba(255,255,255,0.05);">
        <table class="health-table" style="width:100%; border-collapse:collapse; font-size:13px; text-align:left;">
            <thead style="background:rgba(255,255,255,0.02); color:var(--text-muted); font-size:11px; text-transform:uppercase; letter-spacing:0.5px;">
                <tr><th style="padding:16px;">File</th><th style="padding:16px;">Type</th><th style="padding:16px;">Disposition</th><th style="padding:16px;">Confidence</th><th style="padding:16px;">Reason</th></tr>
            </thead>
            <tbody>
                <tr style="border-top:1px solid rgba(255,255,255,0.05); transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
                    <td style="padding:16px; vertical-align:top; font-weight:700; color:#fff;">cobol files/temp.cbl</td>
                    <td style="padding:16px; vertical-align:top; color:#cbd5e1;">program</td>
                    <td style="padding:16px; vertical-align:top; color:#cbd5e1;">parsed_program</td>
                    <td style="padding:16px; vertical-align:top; color:#cbd5e1;">0.98</td>
                    <td style="padding:16px; vertical-align:top; color:#cbd5e1;">program_by_extension</td>
                </tr>
            </tbody>
        </table>
    </div>
    
    </div>
    
    <div id="health-tab-1" class="health-section" style="display:none; background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:12px; padding:24px; margin-bottom:32px;">
        <h3 style="font-size:16px; font-weight:600; color:#fff; margin-top:0; margin-bottom:20px;">Parser & AST</h3>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(150px, 1fr)); gap:12px; margin-bottom:24px;">
    <div style="background:#212733; border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Programs</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">1</div>
        
    </div>
    
    <div style="background:#212733; border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Success</div>
        <div style="font-size:18px; font-weight:700; color:#fff;"><span style='color:#2ecc71'>0</span></div>
        
    </div>
    
    <div style="background:#212733; border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Partial</div>
        <div style="font-size:18px; font-weight:700; color:#fff;"><span style='color:#f1c40f'>1</span></div>
        
    </div>
    
    <div style="background:#212733; border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Failed</div>
        <div style="font-size:18px; font-weight:700; color:#fff;"><span style='color:#e74c3c'>0</span></div>
        
    </div>
    
    <div style="background:#212733; border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Total parser time</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">233ms</div>
        
    </div>
    
    <div style="background:#212733; border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Failure triage</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">1</div>
        
    </div>
    </div><h4 style='font-size:14px; font-weight:600; margin-bottom:12px; color:#fff;'>Slowest Parses</h4>
    <div class="custom-scrollbar" style="overflow-x:auto; margin-bottom:24px; background:rgba(0,0,0,0.15); border-radius:8px; border:1px solid rgba(255,255,255,0.05);">
        <table class="health-table" style="width:100%; border-collapse:collapse; font-size:13px; text-align:left;">
            <thead style="background:rgba(255,255,255,0.02); color:var(--text-muted); font-size:11px; text-transform:uppercase; letter-spacing:0.5px;">
                <tr><th style="padding:16px;">Program</th><th style="padding:16px;">Status</th><th style="padding:16px;">Total Time</th><th style="padding:16px;">Errors</th></tr>
            </thead>
            <tbody>
<tr style="border-top:1px solid rgba(255,255,255,0.05); transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
                    <td style="padding:16px; vertical-align:top; font-weight:700; color:#fff;">temp</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">partial</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">233ms</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">1</td>
                </tr>
                    </tbody>
        </table>
    </div>
    <h4 style='font-size:14px; font-weight:600; margin-bottom:12px; color:#fff;'>Largest ASTs</h4>
    <div class="custom-scrollbar" style="overflow-x:auto; margin-bottom:24px; background:rgba(0,0,0,0.15); border-radius:8px; border:1px solid rgba(255,255,255,0.05);">
        <table class="health-table" style="width:100%; border-collapse:collapse; font-size:13px; text-align:left;">
            <thead style="background:rgba(255,255,255,0.02); color:var(--text-muted); font-size:11px; text-transform:uppercase; letter-spacing:0.5px;">
                <tr><th style="padding:16px;">Program</th><th style="padding:16px;">AST Size</th><th style="padding:16px;">AST Nodes</th></tr>
            </thead>
            <tbody>
<tr style="border-top:1px solid rgba(255,255,255,0.05); transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
                    <td style="padding:16px; vertical-align:top; font-weight:700; color:#fff;">temp</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">35.1 KB</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">291</td>
                </tr>
                    </tbody>
        </table>
    </div>
    <h4 style='font-size:14px; font-weight:600; margin-bottom:12px; color:#fff;'>Parse Failure Triage</h4>
    <div class="custom-scrollbar" style="overflow-x:auto; margin-bottom:24px; background:rgba(0,0,0,0.15); border-radius:8px; border:1px solid rgba(255,255,255,0.05);">
        <table class="health-table" style="width:100%; border-collapse:collapse; font-size:13px; text-align:left;">
            <thead style="background:rgba(255,255,255,0.02); color:var(--text-muted); font-size:11px; text-transform:uppercase; letter-spacing:0.5px;">
                <tr><th style="padding:16px;">Program</th><th style="padding:16px;">Classification</th><th style="padding:16px;">Errors</th><th style="padding:16px;">Suggested Fix</th></tr>
            </thead>
            <tbody>
<tr style="border-top:1px solid rgba(255,255,255,0.05); transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
                    <td style="padding:16px; vertical-align:top; font-weight:700; color:#fff;">temp</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">unknown_parser_failure</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">1</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">Review parser errors and source context, then add preprocessing or grammar support for the failing construct.</td>
                </tr>
                    </tbody>
        </table>
    </div>
    
    </div>
    
    <div id="health-tab-2" class="health-section" style="display:none; background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:12px; padding:24px; margin-bottom:32px;">
        <h3 style="font-size:16px; font-weight:600; color:#fff; margin-top:0; margin-bottom:20px;">IR Accuracy Lifecycle</h3>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(150px, 1fr)); gap:12px; margin-bottom:16px;">
    <div style="background:#212733; border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Initial IR score</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">not captured</div>
        
    </div>
    
    <div style="background:#212733; border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Initial chunks</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">pass=0, warn=0, fail=0</div>
        
    </div>
    
    <div style="background:#212733; border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Fix proposals</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">0</div>
        
    </div>
    
    <div style="background:#212733; border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Applicable patches</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">0</div>
        
    </div>
    
    <div style="background:#212733; border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Applied fixes</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">0</div>
        
    </div>
    
    <div style="background:#212733; border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Post-fix IR score</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">not captured</div>
        
    </div>
    
    <div style="background:#212733; border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Post-fix chunks</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">pass=0, warn=0, fail=0</div>
        
    </div>
    
    <div style="background:#212733; border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Conversion readiness</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">not_checked</div>
        
    </div>
    </div>
    <div style="background:rgba(255,255,255,0.05); padding:8px 12px; border-radius:4px; font-size:13px; color:var(--text-muted); margin-bottom:16px; border:1px solid rgba(255,255,255,0.1); display:inline-block;">Pass/warn/fail delta: post-fix not captured. Readiness: IR quality has not been captured.</div>
    <div style="display:flex; gap:12px; margin-bottom:24px;">
        <button style="background:transparent; border:1px solid #6c5ce7; color:#6c5ce7; padding:8px 16px; border-radius:4px; font-size:13px; cursor:pointer;">Create Fix Review</button>
        <button style="background:transparent; border:1px solid #6c5ce7; color:#6c5ce7; padding:8px 16px; border-radius:4px; font-size:13px; cursor:pointer;">Approve selected fixes</button>
        <button style="background:transparent; border:1px solid #6c5ce7; color:#6c5ce7; padding:8px 16px; border-radius:4px; font-size:13px; cursor:pointer;">Rerun Post-Fix Quality</button>
        <button style="background:transparent; border:1px solid #6c5ce7; color:#6c5ce7; padding:8px 16px; border-radius:4px; font-size:13px; cursor:pointer;">Download Lifecycle</button>
    </div>
    <h4 style='font-size:14px; font-weight:600; margin-bottom:12px; color:#fff;'>Before / After Quality</h4>
    <div class="custom-scrollbar" style="overflow-x:auto; margin-bottom:24px; background:rgba(0,0,0,0.15); border-radius:8px; border:1px solid rgba(255,255,255,0.05);">
        <table class="health-table" style="width:100%; border-collapse:collapse; font-size:13px; text-align:left;">
            <thead style="background:rgba(255,255,255,0.02); color:var(--text-muted); font-size:11px; text-transform:uppercase; letter-spacing:0.5px;">
                <tr><th style="padding:16px;">Phase</th><th style="padding:16px;">Status</th><th style="padding:16px;">Score</th><th style="padding:16px;">Pass</th><th style="padding:16px;">Warn</th><th style="padding:16px;">Fail</th><th style="padding:16px;">Semantic Warnings</th></tr>
            </thead>
            <tbody>
<tr style="border-top:1px solid rgba(255,255,255,0.05); transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
                    <td style="padding:16px; vertical-align:top; font-weight:700; color:#fff;">Initial</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">not captured</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">-</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">0</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">0</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">0</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">0</td>
                </tr><tr style="border-top:1px solid rgba(255,255,255,0.05); transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
                    <td style="padding:16px; vertical-align:top; font-weight:700; color:#fff;">Post-fix</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">not captured</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">-</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">0</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">0</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">0</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">0</td>
                </tr>
                    </tbody>
        </table>
    </div>
    <h4 style='font-size:14px; font-weight:600; margin-bottom:12px; color:#fff;'>Fix Review</h4><div style='border:1px dashed rgba(255,255,255,0.2); padding:20px; color:var(--text-muted); font-size:13px; border-radius:4px;'>No fix proposals yet. Run Check IR Quality, then Create Fix Review.</div>
    </div>
    
    <div id="health-tab-3" class="health-section" style="display:none; background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:12px; padding:24px; margin-bottom:32px;">
        <h3 style="font-size:16px; font-weight:600; color:#fff; margin-top:0; margin-bottom:20px;">Dependency Graph Audit</h3>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(150px, 1fr)); gap:12px; margin-bottom:16px;">
    <div style="background:#212733; border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Schema</div>
        <div style="font-size:18px; font-weight:700; color:#fff;"><span style='color:#2ecc71'>yes</span></div>
        
    </div>
    
    <div style="background:#212733; border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Nodes</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">1</div>
        
    </div>
    
    <div style="background:#212733; border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Edges</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">0</div>
        
    </div>
    
    <div style="background:#212733; border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Edge evidence</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">0</div>
        
    </div>
    
    <div style="background:#212733; border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Unresolved refs</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">0</div>
        
    </div>
    
    <div style="background:#212733; border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Missing IR edges</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">0</div>
        
    </div>
    
    <div style="background:#212733; border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Resource nodes</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">0</div>
        
    </div>
    
    <div style="background:#212733; border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">DB2 nodes</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">0</div>
        
    </div>
    
    <div style="background:#212733; border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">CICS map nodes</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">0</div>
        
    </div>
    
    <div style="background:#212733; border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Dataset nodes</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">0</div>
        
    </div>
    
    <div style="background:#212733; border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">DB2 usage</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">0</div>
        
    </div>
    
    <div style="background:#212733; border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">JCL lineage</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">0</div>
        
    </div>
    </div><div style='background:rgba(255,255,255,0.05); padding:8px 12px; border-radius:4px; font-size:13px; color:var(--text-muted); margin-bottom:16px; border:1px solid rgba(255,255,255,0.1); display:inline-block;'>Edge types: -</div><h4 style='font-size:14px; font-weight:600; margin-bottom:12px; color:#fff;'>Unresolved References</h4>
    <div class="custom-scrollbar" style="overflow-x:auto; margin-bottom:24px; background:rgba(0,0,0,0.15); border-radius:8px; border:1px solid rgba(255,255,255,0.05);">
        <table class="health-table" style="width:100%; border-collapse:collapse; font-size:13px; text-align:left;">
            <thead style="background:rgba(255,255,255,0.02); color:var(--text-muted); font-size:11px; text-transform:uppercase; letter-spacing:0.5px;">
                <tr><th style="padding:16px;">Source</th><th style="padding:16px;">Type</th><th style="padding:16px;">Target</th><th style="padding:16px;">Evidence</th></tr>
            </thead>
            <tbody>
<tr style="border-top:1px solid rgba(255,255,255,0.05); transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
                    <td style="padding:16px; vertical-align:top; font-weight:700; color:#fff;">No unresolved graph references recorded.</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;"></td><td style="padding:16px; vertical-align:top; color:#cbd5e1;"></td><td style="padding:16px; vertical-align:top; color:#cbd5e1;"></td>
                </tr>
                    </tbody>
        </table>
    </div>
    <h4 style='font-size:14px; font-weight:600; margin-bottom:12px; color:#fff;'>DB2 Table Usage</h4>
    <div class="custom-scrollbar" style="overflow-x:auto; margin-bottom:24px; background:rgba(0,0,0,0.15); border-radius:8px; border:1px solid rgba(255,255,255,0.05);">
        <table class="health-table" style="width:100%; border-collapse:collapse; font-size:13px; text-align:left;">
            <thead style="background:rgba(255,255,255,0.02); color:var(--text-muted); font-size:11px; text-transform:uppercase; letter-spacing:0.5px;">
                <tr><th style="padding:16px;">Table</th><th style="padding:16px;">Program</th><th style="padding:16px;">Modes</th></tr>
            </thead>
            <tbody>
<tr style="border-top:1px solid rgba(255,255,255,0.05); transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
                    <td style="padding:16px; vertical-align:top; font-weight:700; color:#fff;">No DB2 table usage captured.</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;"></td><td style="padding:16px; vertical-align:top; color:#cbd5e1;"></td>
                </tr>
                    </tbody>
        </table>
    </div>
    <h4 style='font-size:14px; font-weight:600; margin-bottom:12px; color:#fff;'>JCL Program Dataset Lineage</h4>
    <div class="custom-scrollbar" style="overflow-x:auto; margin-bottom:24px; background:rgba(0,0,0,0.15); border-radius:8px; border:1px solid rgba(255,255,255,0.05);">
        <table class="health-table" style="width:100%; border-collapse:collapse; font-size:13px; text-align:left;">
            <thead style="background:rgba(255,255,255,0.02); color:var(--text-muted); font-size:11px; text-transform:uppercase; letter-spacing:0.5px;">
                <tr><th style="padding:16px;">JCL</th><th style="padding:16px;">Step</th><th style="padding:16px;">Program</th><th style="padding:16px;">Datasets</th></tr>
            </thead>
            <tbody>
<tr style="border-top:1px solid rgba(255,255,255,0.05); transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
                    <td style="padding:16px; vertical-align:top; font-weight:700; color:#fff;">No JCL lineage captured.</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;"></td><td style="padding:16px; vertical-align:top; color:#cbd5e1;"></td><td style="padding:16px; vertical-align:top; color:#cbd5e1;"></td>
                </tr>
                    </tbody>
        </table>
    </div>
    <h4 style='font-size:14px; font-weight:600; margin-bottom:12px; color:#fff;'>CICS Binding Audit</h4>
    <div class="custom-scrollbar" style="overflow-x:auto; margin-bottom:24px; background:rgba(0,0,0,0.15); border-radius:8px; border:1px solid rgba(255,255,255,0.05);">
        <table class="health-table" style="width:100%; border-collapse:collapse; font-size:13px; text-align:left;">
            <thead style="background:rgba(255,255,255,0.02); color:var(--text-muted); font-size:11px; text-transform:uppercase; letter-spacing:0.5px;">
                <tr><th style="padding:16px;">Program</th><th style="padding:16px;">Verb</th><th style="padding:16px;">Map</th><th style="padding:16px;">Link Program</th><th style="padding:16px;">Resource</th></tr>
            </thead>
            <tbody>
<tr style="border-top:1px solid rgba(255,255,255,0.05); transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
                    <td style="padding:16px; vertical-align:top; font-weight:700; color:#fff;">No CICS bindings captured.</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;"></td><td style="padding:16px; vertical-align:top; color:#cbd5e1;"></td><td style="padding:16px; vertical-align:top; color:#cbd5e1;"></td><td style="padding:16px; vertical-align:top; color:#cbd5e1;"></td>
                </tr>
                    </tbody>
        </table>
    </div>
    
    </div>
    
    <div id="health-tab-4" class="health-section" style="display:none; background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:12px; padding:24px; margin-bottom:32px;">
        <h3 style="font-size:16px; font-weight:600; color:#fff; margin-top:0; margin-bottom:20px;">Project-Level Artifact Health</h3>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(150px, 1fr)); gap:12px; margin-bottom:24px;">
    <div style="background:#212733; border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Status</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">passed_warnings</div>
        
    </div>
    
    <div style="background:#212733; border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Artifacts</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">7</div>
        
    </div>
    
    <div style="background:#212733; border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Validated</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">6</div>
        
    </div>
    
    <div style="background:#212733; border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Validation fails</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">0</div>
        
    </div>
    
    <div style="background:#212733; border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Stamped</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">7</div>
        
    </div>
    
    <div style="background:#212733; border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Manifest warnings</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">0</div>
        
    </div>
    
    <div style="background:#212733; border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Contract findings</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">1</div>
        
    </div>
    
    <div style="background:#212733; border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Preview warnings</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">1</div>
        
    </div>
    
    <div style="background:#212733; border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Artifact graph nodes</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">7</div>
        
    </div>
    
    <div style="background:#212733; border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Artifact graph edges</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">20</div>
        
    </div>
    </div><h4 style='font-size:14px; font-weight:600; margin-bottom:12px; color:#fff;'>Artifact Schema Validation</h4>
    <div class="custom-scrollbar" style="overflow-x:auto; margin-bottom:24px; background:rgba(0,0,0,0.15); border-radius:8px; border:1px solid rgba(255,255,255,0.05);">
        <table class="health-table" style="width:100%; border-collapse:collapse; font-size:13px; text-align:left;">
            <thead style="background:rgba(255,255,255,0.02); color:var(--text-muted); font-size:11px; text-transform:uppercase; letter-spacing:0.5px;">
                <tr><th style="padding:16px;">Artifact</th><th style="padding:16px;">Schema</th><th style="padding:16px;">Status</th><th style="padding:16px;">Errors</th></tr>
            </thead>
            <tbody>
<tr style="border-top:1px solid rgba(255,255,255,0.05); transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
                    <td style="padding:16px; vertical-align:top; font-weight:700; color:#fff;">project_dependency_graph</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">-</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">passed</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">-</td>
                </tr><tr style="border-top:1px solid rgba(255,255,255,0.05); transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
                    <td style="padding:16px; vertical-align:top; font-weight:700; color:#fff;">generation_manifest</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">generation_manifest</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">passed</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">-</td>
                </tr><tr style="border-top:1px solid rgba(255,255,255,0.05); transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
                    <td style="padding:16px; vertical-align:top; font-weight:700; color:#fff;">enriched_manifest</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">enriched_manifest</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">passed</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">-</td>
                </tr><tr style="border-top:1px solid rgba(255,255,255,0.05); transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
                    <td style="padding:16px; vertical-align:top; font-weight:700; color:#fff;">classification_report</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">classification_report</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">passed</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">-</td>
                </tr><tr style="border-top:1px solid rgba(255,255,255,0.05); transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
                    <td style="padding:16px; vertical-align:top; font-weight:700; color:#fff;">source_architecture_preview</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">source_architecture_preview</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">passed</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">-</td>
                </tr><tr style="border-top:1px solid rgba(255,255,255,0.05); transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
                    <td style="padding:16px; vertical-align:top; font-weight:700; color:#fff;">target_preview</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">target_preview</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">passed</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">-</td>
                </tr><tr style="border-top:1px solid rgba(255,255,255,0.05); transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
                    <td style="padding:16px; vertical-align:top; font-weight:700; color:#fff;">post_ir_traceability_report</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">post_ir_traceability_report</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">passed</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">-</td>
                </tr>
                    </tbody>
        </table>
    </div>
    <h4 style='font-size:14px; font-weight:600; margin-bottom:12px; color:#fff;'>Manifest Enrichment Diff</h4>
    <div class="custom-scrollbar" style="overflow-x:auto; margin-bottom:24px; background:rgba(0,0,0,0.15); border-radius:8px; border:1px solid rgba(255,255,255,0.05);">
        <table class="health-table" style="width:100%; border-collapse:collapse; font-size:13px; text-align:left;">
            <thead style="background:rgba(255,255,255,0.02); color:var(--text-muted); font-size:11px; text-transform:uppercase; letter-spacing:0.5px;">
                <tr><th style="padding:16px;">Class</th><th style="padding:16px;">Before Fields</th><th style="padding:16px;">After Fields</th><th style="padding:16px;">Added Keys</th></tr>
            </thead>
            <tbody>
<tr style="border-top:1px solid rgba(255,255,255,0.05); transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
                    <td style="padding:16px; vertical-align:top; font-weight:700; color:#fff;">EmpRecord</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">0</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">3</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">field_enrichment, fields, program_name, source_category</td>
                </tr><tr style="border-top:1px solid rgba(255,255,255,0.05); transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
                    <td style="padding:16px; vertical-align:top; font-weight:700; color:#fff;">TempService</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">0</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">0</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">source_category</td>
                </tr>
                    </tbody>
        </table>
    </div>
    <h4 style='font-size:14px; font-weight:600; margin-bottom:12px; color:#fff;'>Program Contract Consistency</h4>
    <div class="custom-scrollbar" style="overflow-x:auto; margin-bottom:24px; background:rgba(0,0,0,0.15); border-radius:8px; border:1px solid rgba(255,255,255,0.05);">
        <table class="health-table" style="width:100%; border-collapse:collapse; font-size:13px; text-align:left;">
            <thead style="background:rgba(255,255,255,0.02); color:var(--text-muted); font-size:11px; text-transform:uppercase; letter-spacing:0.5px;">
                <tr><th style="padding:16px;">Severity</th><th style="padding:16px;">Code</th><th style="padding:16px;">Program(s)</th><th style="padding:16px;">Message</th></tr>
            </thead>
            <tbody>
<tr style="border-top:1px solid rgba(255,255,255,0.05); transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
                    <td style="padding:16px; vertical-align:top; font-weight:700; color:#fff;">warn</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">ir_programs_missing_from_classification</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">READ_FILE_EXAMPLE</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">IR programs are missing from classification</td>
                </tr>
                    </tbody>
        </table>
    </div>
    <h4 style='font-size:14px; font-weight:600; margin-bottom:12px; color:#fff;'>Preview Traceability</h4>
    <div class="custom-scrollbar" style="overflow-x:auto; margin-bottom:24px; background:rgba(0,0,0,0.15); border-radius:8px; border:1px solid rgba(255,255,255,0.05);">
        <table class="health-table" style="width:100%; border-collapse:collapse; font-size:13px; text-align:left;">
            <thead style="background:rgba(255,255,255,0.02); color:var(--text-muted); font-size:11px; text-transform:uppercase; letter-spacing:0.5px;">
                <tr><th style="padding:16px;">Program</th><th style="padding:16px;">Source Preview</th><th style="padding:16px;">Target Preview</th></tr>
            </thead>
            <tbody>
<tr style="border-top:1px solid rgba(255,255,255,0.05); transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
                    <td style="padding:16px; vertical-align:top; font-weight:700; color:#fff;">READ_FILE_EXAMPLE</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">yes</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">no</td>
                </tr>
                    </tbody>
        </table>
    </div>
    <h4 style='font-size:14px; font-weight:600; margin-bottom:12px; color:#fff;'>Artifact Dependency Graph</h4>
    <div class="custom-scrollbar" style="overflow-x:auto; margin-bottom:24px; background:rgba(0,0,0,0.15); border-radius:8px; border:1px solid rgba(255,255,255,0.05);">
        <table class="health-table" style="width:100%; border-collapse:collapse; font-size:13px; text-align:left;">
            <thead style="background:rgba(255,255,255,0.02); color:var(--text-muted); font-size:11px; text-transform:uppercase; letter-spacing:0.5px;">
                <tr><th style="padding:16px;">Artifact</th><th style="padding:16px;">Producer</th><th style="padding:16px;">Validation</th><th style="padding:16px;">Size</th></tr>
            </thead>
            <tbody>
<tr style="border-top:1px solid rgba(255,255,255,0.05); transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
                    <td style="padding:16px; vertical-align:top; font-weight:700; color:#fff;">project_dependency_graph</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">CrossFileDependencyResolver</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">passed</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">2.3 KB</td>
                </tr><tr style="border-top:1px solid rgba(255,255,255,0.05); transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
                    <td style="padding:16px; vertical-align:top; font-weight:700; color:#fff;">generation_manifest</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">GenerationManifestGenerator</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">passed</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">11.2 KB</td>
                </tr><tr style="border-top:1px solid rgba(255,255,255,0.05); transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
                    <td style="padding:16px; vertical-align:top; font-weight:700; color:#fff;">enriched_manifest</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">FieldEnrichmentService</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">passed</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">16.7 KB</td>
                </tr><tr style="border-top:1px solid rgba(255,255,255,0.05); transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
                    <td style="padding:16px; vertical-align:top; font-weight:700; color:#fff;">classification_report</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">ClassificationReportGenerator</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">passed</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">1.2 KB</td>
                </tr><tr style="border-top:1px solid rgba(255,255,255,0.05); transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
                    <td style="padding:16px; vertical-align:top; font-weight:700; color:#fff;">source_architecture_preview</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">SourceArchitecturePreviewBuilder</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">passed</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">6.7 KB</td>
                </tr><tr style="border-top:1px solid rgba(255,255,255,0.05); transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
                    <td style="padding:16px; vertical-align:top; font-weight:700; color:#fff;">target_preview</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">TargetPreviewBuilder</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">passed</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">5.4 KB</td>
                </tr><tr style="border-top:1px solid rgba(255,255,255,0.05); transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
                    <td style="padding:16px; vertical-align:top; font-weight:700; color:#fff;">post_ir_traceability_report</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">PostIrHealth</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">passed</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">6.2 KB</td>
                </tr>
                    </tbody>
        </table>
    </div>
    <div style='background:rgba(255,255,255,0.05); padding:12px; border-radius:4px; font-size:13px; color:var(--text-muted); border:1px solid rgba(255,255,255,0.1);'>Manifest: classes=2, programs=2. Program contract: services=1, domain classes=1. Preview: source=1, target=0.</div>
    </div>
    
    <div id="health-tab-5" class="health-section" style="display:none; background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:12px; padding:24px; margin-bottom:32px;">
        <h3 style="font-size:16px; font-weight:600; color:#fff; margin-top:0; margin-bottom:20px;">Post-IR Readiness</h3>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(150px, 1fr)); gap:12px; margin-bottom:24px;">
    <div style="background:#212733; border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Status</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">passed</div>
        
    </div>
    
    <div style="background:#212733; border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">IR programs</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">1</div>
        
    </div>
    
    <div style="background:#212733; border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Graph nodes</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">1</div>
        
    </div>
    
    <div style="background:#212733; border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Manifest programs</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">2</div>
        
    </div>
    
    <div style="background:#212733; border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Manifest services</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">1</div>
        
    </div>
    
    <div style="background:#212733; border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Blocking issues</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">0</div>
        
    </div>
    
    <div style="background:#212733; border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Warnings</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">0</div>
        
    </div>
    </div><h4 style='font-size:14px; font-weight:600; margin-bottom:12px; color:#fff;'>Artifact Contracts</h4>
    <div class="custom-scrollbar" style="overflow-x:auto; margin-bottom:24px; background:rgba(0,0,0,0.15); border-radius:8px; border:1px solid rgba(255,255,255,0.05);">
        <table class="health-table" style="width:100%; border-collapse:collapse; font-size:13px; text-align:left;">
            <thead style="background:rgba(255,255,255,0.02); color:var(--text-muted); font-size:11px; text-transform:uppercase; letter-spacing:0.5px;">
                <tr><th style="padding:16px;">Artifact</th><th style="padding:16px;">Status</th><th style="padding:16px;">Missing Keys</th></tr>
            </thead>
            <tbody>
<tr style="border-top:1px solid rgba(255,255,255,0.05); transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
                    <td style="padding:16px; vertical-align:top; font-weight:700; color:#fff;">project_dependency_graph</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">passed</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">-</td>
                </tr><tr style="border-top:1px solid rgba(255,255,255,0.05); transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
                    <td style="padding:16px; vertical-align:top; font-weight:700; color:#fff;">generation_manifest</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">passed</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">-</td>
                </tr><tr style="border-top:1px solid rgba(255,255,255,0.05); transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
                    <td style="padding:16px; vertical-align:top; font-weight:700; color:#fff;">enriched_manifest</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">passed</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">-</td>
                </tr><tr style="border-top:1px solid rgba(255,255,255,0.05); transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
                    <td style="padding:16px; vertical-align:top; font-weight:700; color:#fff;">classification_report</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">passed</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">-</td>
                </tr><tr style="border-top:1px solid rgba(255,255,255,0.05); transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
                    <td style="padding:16px; vertical-align:top; font-weight:700; color:#fff;">source_architecture_preview</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">passed</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">-</td>
                </tr><tr style="border-top:1px solid rgba(255,255,255,0.05); transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
                    <td style="padding:16px; vertical-align:top; font-weight:700; color:#fff;">target_preview</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">passed</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">-</td>
                </tr>
                    </tbody>
        </table>
    </div>
    <h4 style='font-size:14px; font-weight:600; margin-bottom:12px; color:#fff;'>Program Traceability</h4>
    <div class="custom-scrollbar" style="overflow-x:auto; margin-bottom:24px; background:rgba(0,0,0,0.15); border-radius:8px; border:1px solid rgba(255,255,255,0.05);">
        <table class="health-table" style="width:100%; border-collapse:collapse; font-size:13px; text-align:left;">
            <thead style="background:rgba(255,255,255,0.02); color:var(--text-muted); font-size:11px; text-transform:uppercase; letter-spacing:0.5px;">
                <tr><th style="padding:16px;">Program</th><th style="padding:16px;">Graph</th><th style="padding:16px;">Manifest</th><th style="padding:16px;">Classification</th><th style="padding:16px;">Program Contract</th><th style="padding:16px;">Previews</th></tr>
            </thead>
            <tbody>
<tr style="border-top:1px solid rgba(255,255,255,0.05); transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
                    <td style="padding:16px; vertical-align:top; font-weight:700; color:#fff;">READ_FILE_EXAMPLE</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">yes</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">yes</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">yes</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">yes</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">source=yes, target=yes</td>
                </tr>
                    </tbody>
        </table>
    </div>
    <h4 style='font-size:14px; font-weight:600; margin-bottom:12px; color:#fff;'>Readiness Findings</h4>
    <div class="custom-scrollbar" style="overflow-x:auto; margin-bottom:24px; background:rgba(0,0,0,0.15); border-radius:8px; border:1px solid rgba(255,255,255,0.05);">
        <table class="health-table" style="width:100%; border-collapse:collapse; font-size:13px; text-align:left;">
            <thead style="background:rgba(255,255,255,0.02); color:var(--text-muted); font-size:11px; text-transform:uppercase; letter-spacing:0.5px;">
                <tr><th style="padding:16px;">Severity</th><th style="padding:16px;">Code</th><th style="padding:16px;">Program/Ref</th><th style="padding:16px;">Message</th></tr>
            </thead>
            <tbody>
<tr style="border-top:1px solid rgba(255,255,255,0.05); transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
                    <td style="padding:16px; vertical-align:top; font-weight:700; color:#fff;">No post-IR readiness findings.</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;"></td><td style="padding:16px; vertical-align:top; color:#cbd5e1;"></td><td style="padding:16px; vertical-align:top; color:#cbd5e1;"></td>
                </tr>
                    </tbody>
        </table>
    </div>
    
    </div>
    
    <div id="health-tab-6" class="health-section" style="display:none; background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:12px; padding:24px; margin-bottom:32px;">
        <h3 style="font-size:16px; font-weight:600; color:#fff; margin-top:0; margin-bottom:20px;">AI Assistance Health</h3>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(150px, 1fr)); gap:12px; margin-bottom:16px;">
    <div style="background:#212733; border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Layer</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">AI-generated / optional</div>
        
    </div>
    
    <div style="background:#212733; border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Optional layer</div>
        <div style="font-size:18px; font-weight:700; color:#fff;"><span style='color:#2ecc71'>yes</span></div>
        
    </div>
    
    <div style="background:#212733; border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Deterministic separate</div>
        <div style="font-size:18px; font-weight:700; color:#fff;"><span style='color:#2ecc71'>yes</span></div>
        
    </div>
    
    <div style="background:#212733; border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Total calls</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">0</div>
        
    </div>
    
    <div style="background:#212733; border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Cache hits</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">0</div>
        
    </div>
    
    <div style="background:#212733; border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Budget blocks</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">0</div>
        
    </div>
    
    <div style="background:#212733; border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Est. tokens</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">0</div>
        
    </div>
    
    <div style="background:#212733; border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Est. cost</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">$0</div>
        
    </div>
    
    <div style="background:#212733; border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Timeout</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">180s</div>
        
    </div>
    
    <div style="background:#212733; border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Retries</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">5</div>
        
    </div>
    </div><div style='background:rgba(255,255,255,0.05); padding:8px 12px; border-radius:4px; font-size:13px; color:var(--text-muted); margin-bottom:24px; border:1px solid rgba(255,255,255,0.1); display:inline-block;'>Deterministic vs AI-generated: deterministic AST, IR, graph, and artifact health are authoritative; AI checks are advisory enhancement jobs.</div><h4 style='font-size:14px; font-weight:600; margin-bottom:12px; color:#fff;'>Feature Budgets</h4>
    <div class="custom-scrollbar" style="overflow-x:auto; margin-bottom:24px; background:rgba(0,0,0,0.15); border-radius:8px; border:1px solid rgba(255,255,255,0.05);">
        <table class="health-table" style="width:100%; border-collapse:collapse; font-size:13px; text-align:left;">
            <thead style="background:rgba(255,255,255,0.02); color:var(--text-muted); font-size:11px; text-transform:uppercase; letter-spacing:0.5px;">
                <tr><th style="padding:16px;">Feature</th><th style="padding:16px;">Calls</th><th style="padding:16px;">Est. Tokens</th><th style="padding:16px;">Max Calls</th><th style="padding:16px;">Max Prompt Tokens</th></tr>
            </thead>
            <tbody>
<tr style="border-top:1px solid rgba(255,255,255,0.05); transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
                    <td style="padding:16px; vertical-align:top; font-weight:700; color:#fff;">No LLM feature budgets configured.</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;"></td><td style="padding:16px; vertical-align:top; color:#cbd5e1;"></td><td style="padding:16px; vertical-align:top; color:#cbd5e1;"></td><td style="padding:16px; vertical-align:top; color:#cbd5e1;"></td>
                </tr>
                    </tbody>
        </table>
    </div>
    <h4 style='font-size:14px; font-weight:600; margin-bottom:12px; color:#fff;'>Recent AI Calls</h4>
    <div class="custom-scrollbar" style="overflow-x:auto; margin-bottom:24px; background:rgba(0,0,0,0.15); border-radius:8px; border:1px solid rgba(255,255,255,0.05);">
        <table class="health-table" style="width:100%; border-collapse:collapse; font-size:13px; text-align:left;">
            <thead style="background:rgba(255,255,255,0.02); color:var(--text-muted); font-size:11px; text-transform:uppercase; letter-spacing:0.5px;">
                <tr><th style="padding:16px;">Feature</th><th style="padding:16px;">Model</th><th style="padding:16px;">Status</th><th style="padding:16px;">Cache</th><th style="padding:16px;">Est. Tokens</th></tr>
            </thead>
            <tbody>
<tr style="border-top:1px solid rgba(255,255,255,0.05); transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
                    <td style="padding:16px; vertical-align:top; font-weight:700; color:#fff;">No LLM calls recorded for this project.</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;"></td><td style="padding:16px; vertical-align:top; color:#cbd5e1;"></td><td style="padding:16px; vertical-align:top; color:#cbd5e1;"></td><td style="padding:16px; vertical-align:top; color:#cbd5e1;"></td>
                </tr>
                    </tbody>
        </table>
    </div>
    <h4 style='font-size:14px; font-weight:600; margin-bottom:12px; color:#fff;'>LLM Background / Queue Status</h4>
    <div class="custom-scrollbar" style="overflow-x:auto; margin-bottom:24px; background:rgba(0,0,0,0.15); border-radius:8px; border:1px solid rgba(255,255,255,0.05);">
        <table class="health-table" style="width:100%; border-collapse:collapse; font-size:13px; text-align:left;">
            <thead style="background:rgba(255,255,255,0.02); color:var(--text-muted); font-size:11px; text-transform:uppercase; letter-spacing:0.5px;">
                <tr><th style="padding:16px;">Job</th><th style="padding:16px;">Kind</th><th style="padding:16px;">Status</th><th style="padding:16px;">Retry Policy</th></tr>
            </thead>
            <tbody>
<tr style="border-top:1px solid rgba(255,255,255,0.05); transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
                    <td style="padding:16px; vertical-align:top; font-weight:700; color:#fff;">8b69c4d2-977f-40ab-b8c6-874f7498b54c</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">analysis</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">COMPLETED</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">analysis job owns deterministic retry; LLM calls use llm_governance retry/timeout policy</td>
                </tr>
                    </tbody>
        </table>
    </div>
    
    </div>
    
    <div id="health-tab-7" class="health-section" style="display:none; background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:12px; padding:24px; margin-bottom:32px;">
        <h3 style="font-size:16px; font-weight:600; color:#fff; margin-top:0; margin-bottom:20px;">Run Timeline & Performance</h3>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(150px, 1fr)); gap:12px; margin-bottom:16px;">
    <div style="background:#212733; border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Status</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">warnings</div>
        
    </div>
    
    <div style="background:#212733; border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Live run</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">COMPLETED</div>
        
    </div>
    
    <div style="background:#212733; border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Current stage</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">analysis</div>
        
    </div>
    
    <div style="background:#212733; border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Timeline stages</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">10</div>
        
    </div>
    
    <div style="background:#212733; border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Artifacts</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">66</div>
        
    </div>
    
    <div style="background:#212733; border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Total artifact size</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">275.1 KB</div>
        
    </div>
    
    <div style="background:#212733; border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Parse time</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">233ms</div>
        
    </div>
    
    <div style="background:#212733; border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Slow I/O ops</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">0</div>
        
    </div>
    
    <div style="background:#212733; border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Failed / partial</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">2</div>
        
    </div>
    
    <div style="background:#212733; border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Skipped files</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">0</div>
        
    </div>
    
    <div style="background:#212733; border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Run comparison</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">no</div>
        
    </div>
    </div><div style='background:rgba(255,255,255,0.05); padding:8px 12px; border-radius:4px; font-size:13px; color:var(--text-muted); margin-bottom:24px; border:1px solid rgba(255,255,255,0.1); display:inline-block;'>This view answers what happened, what failed or skipped, what changed, and what took time using deterministic health APIs and persisted run metadata.</div><h4 style='font-size:14px; font-weight:600; margin-bottom:12px; color:#fff;'>Live Stage Progress</h4>
    <div class="custom-scrollbar" style="overflow-x:auto; margin-bottom:24px; background:rgba(0,0,0,0.15); border-radius:8px; border:1px solid rgba(255,255,255,0.05);">
        <table class="health-table" style="width:100%; border-collapse:collapse; font-size:13px; text-align:left;">
            <thead style="background:rgba(255,255,255,0.02); color:var(--text-muted); font-size:11px; text-transform:uppercase; letter-spacing:0.5px;">
                <tr><th style="padding:16px;">Stage</th><th style="padding:16px;">Status</th><th style="padding:16px;">Completed</th><th style="padding:16px;">Failed</th><th style="padding:16px;">Duration</th></tr>
            </thead>
            <tbody>
<tr style="border-top:1px solid rgba(255,255,255,0.05); transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
                    <td style="padding:16px; vertical-align:top; font-weight:700; color:#fff;">Upload</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">completed</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">yes</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">no</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">-</td>
                </tr><tr style="border-top:1px solid rgba(255,255,255,0.05); transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
                    <td style="padding:16px; vertical-align:top; font-weight:700; color:#fff;">Discovery</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">completed</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">yes</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">no</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">-</td>
                </tr><tr style="border-top:1px solid rgba(255,255,255,0.05); transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
                    <td style="padding:16px; vertical-align:top; font-weight:700; color:#fff;">Preprocess</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">warnings</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">yes</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">no</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">-</td>
                </tr><tr style="border-top:1px solid rgba(255,255,255,0.05); transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
                    <td style="padding:16px; vertical-align:top; font-weight:700; color:#fff;">Parse</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">warnings</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">yes</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">no</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">-</td>
                </tr><tr style="border-top:1px solid rgba(255,255,255,0.05); transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
                    <td style="padding:16px; vertical-align:top; font-weight:700; color:#fff;">IR</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">warnings</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">yes</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">no</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">-</td>
                </tr><tr style="border-top:1px solid rgba(255,255,255,0.05); transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
                    <td style="padding:16px; vertical-align:top; font-weight:700; color:#fff;">Dependency</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">completed</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">yes</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">no</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">-</td>
                </tr><tr style="border-top:1px solid rgba(255,255,255,0.05); transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
                    <td style="padding:16px; vertical-align:top; font-weight:700; color:#fff;">Manifest</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">completed</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">yes</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">no</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">-</td>
                </tr><tr style="border-top:1px solid rgba(255,255,255,0.05); transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
                    <td style="padding:16px; vertical-align:top; font-weight:700; color:#fff;">Program Contract</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">warnings</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">yes</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">no</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">-</td>
                </tr><tr style="border-top:1px solid rgba(255,255,255,0.05); transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
                    <td style="padding:16px; vertical-align:top; font-weight:700; color:#fff;">Previews</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">completed</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">yes</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">no</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">-</td>
                </tr>
                    </tbody>
        </table>
    </div>
    <h4 style='font-size:14px; font-weight:600; margin-bottom:12px; color:#fff;'>Recent Analysis Events</h4>
    <div class="custom-scrollbar" style="overflow-x:auto; margin-bottom:24px; background:rgba(0,0,0,0.15); border-radius:8px; border:1px solid rgba(255,255,255,0.05);">
        <table class="health-table" style="width:100%; border-collapse:collapse; font-size:13px; text-align:left;">
            <thead style="background:rgba(255,255,255,0.02); color:var(--text-muted); font-size:11px; text-transform:uppercase; letter-spacing:0.5px;">
                <tr><th style="padding:16px;">Stage</th><th style="padding:16px;">Status</th><th style="padding:16px;">Event</th><th style="padding:16px;">Time</th></tr>
            </thead>
            <tbody>
<tr style="border-top:1px solid rgba(255,255,255,0.05); transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
                    <td style="padding:16px; vertical-align:top; font-weight:700; color:#fff;">ANALYSIS</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">COMPLETED</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">Analysis run completed</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">2026-05-28T14:48:34.538084+00:00</td>
                </tr><tr style="border-top:1px solid rgba(255,255,255,0.05); transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
                    <td style="padding:16px; vertical-align:top; font-weight:700; color:#fff;">ARTIFACT_INDEX</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">COMPLETED</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">Indexed 62 analysis artifact(s)</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">2026-05-28T14:48:34.513174+00:00</td>
                </tr>
                    </tbody>
        </table>
    </div>
    <h4 style='font-size:14px; font-weight:600; margin-bottom:12px; color:#fff;'>Stage Timeline</h4>
    <div class="custom-scrollbar" style="overflow-x:auto; margin-bottom:24px; background:rgba(0,0,0,0.15); border-radius:8px; border:1px solid rgba(255,255,255,0.05);">
        <table class="health-table" style="width:100%; border-collapse:collapse; font-size:13px; text-align:left;">
            <thead style="background:rgba(255,255,255,0.02); color:var(--text-muted); font-size:11px; text-transform:uppercase; letter-spacing:0.5px;">
                <tr><th style="padding:16px;">Stage</th><th style="padding:16px;">Status</th><th style="padding:16px;">Duration</th><th style="padding:16px;">Artifacts</th><th style="padding:16px;">Metrics</th></tr>
            </thead>
            <tbody>
<tr style="border-top:1px solid rgba(255,255,255,0.05); transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
                    <td style="padding:16px; vertical-align:top; font-weight:700; color:#fff;">Analysis Run</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">completed</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">739ms</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">0</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">run_id=8b69c4d2... requested_by=analysis@ss.com</td>
                </tr><tr style="border-top:1px solid rgba(255,255,255,0.05); transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
                    <td style="padding:16px; vertical-align:top; font-weight:700; color:#fff;">Upload</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">completed</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">-</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">1</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">uploaded_files=1, parsed_program=1...</td>
                </tr><tr style="border-top:1px solid rgba(255,255,255,0.05); transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
                    <td style="padding:16px; vertical-align:top; font-weight:700; color:#fff;">Parse</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">warnings</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">-</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">5</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">programs=1, profile_available=yes...</td>
                </tr>
                    </tbody>
        </table>
    </div>
    <h4 style='font-size:14px; font-weight:600; margin-bottom:12px; color:#fff;'>Failed / Partial Program Dashboard</h4>
    <div class="custom-scrollbar" style="overflow-x:auto; margin-bottom:24px; background:rgba(0,0,0,0.15); border-radius:8px; border:1px solid rgba(255,255,255,0.05);">
        <table class="health-table" style="width:100%; border-collapse:collapse; font-size:13px; text-align:left;">
            <thead style="background:rgba(255,255,255,0.02); color:var(--text-muted); font-size:11px; text-transform:uppercase; letter-spacing:0.5px;">
                <tr><th style="padding:16px;">Program</th><th style="padding:16px;">Stage</th><th style="padding:16px;">Status</th><th style="padding:16px;">Class</th><th style="padding:16px;">Message</th></tr>
            </thead>
            <tbody>
<tr style="border-top:1px solid rgba(255,255,255,0.05); transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
                    <td style="padding:16px; vertical-align:top; font-weight:700; color:#fff;">temp</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">parse</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">failed_or_partial</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">unknown_parser_failure</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">Review parser errors...</td>
                </tr><tr style="border-top:1px solid rgba(255,255,255,0.05); transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
                    <td style="padding:16px; vertical-align:top; font-weight:700; color:#fff;">temp</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">ir</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">passed_warnings</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">ir_quality</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">AST was produced from a partial parse...</td>
                </tr>
                    </tbody>
        </table>
    </div>
    
    </div>
    
    <div id="health-tab-8" class="health-section" style="display:none; background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:12px; padding:24px; margin-bottom:32px;">
        <h3 style="font-size:16px; font-weight:600; color:#fff; margin-top:0; margin-bottom:20px;">Persistence & Artifact I/O Health</h3>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(150px, 1fr)); gap:12px; margin-bottom:16px;">
    <div style="background:#212733; border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Status</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">passed</div>
        
    </div>
    
    <div style="background:#212733; border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Artifacts indexed</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">66</div>
        
    </div>
    
    <div style="background:#212733; border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Total size</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">275.1 KB</div>
        
    </div>
    
    <div style="background:#212733; border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">JSON reads</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">14</div>
        
    </div>
    
    <div style="background:#212733; border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">JSON writes</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">3</div>
        
    </div>
    
    <div style="background:#212733; border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Cache hits</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">13</div>
        
    </div>
    
    <div style="background:#212733; border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Cache misses</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">1</div>
        
    </div>
    
    <div style="background:#212733; border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Slow ops</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">0</div>
        
    </div>
    
    <div style="background:#212733; border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Large warnings</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">0</div>
        
    </div>
    
    <div style="background:#212733; border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Compact AST candidates</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">0</div>
        
    </div>
    </div><div style='background:rgba(255,255,255,0.05); padding:8px 12px; border-radius:4px; font-size:13px; color:var(--text-muted); margin-bottom:24px; border:1px solid rgba(255,255,255,0.1); display:inline-block;'>Centralized artifact helper tracks JSON I/O timing, write-through IR cache activity, size budgets, compact AST companions, and compressed large AST/IR artifacts.</div><h4 style='font-size:14px; font-weight:600; margin-bottom:12px; color:#fff;'>Artifact Types</h4>
    <div class="custom-scrollbar" style="overflow-x:auto; margin-bottom:24px; background:rgba(0,0,0,0.15); border-radius:8px; border:1px solid rgba(255,255,255,0.05);">
        <table class="health-table" style="width:100%; border-collapse:collapse; font-size:13px; text-align:left;">
            <thead style="background:rgba(255,255,255,0.02); color:var(--text-muted); font-size:11px; text-transform:uppercase; letter-spacing:0.5px;">
                <tr><th style="padding:16px;">Type</th><th style="padding:16px;">Count</th><th style="padding:16px;">Total Size</th></tr>
            </thead>
            <tbody>
<tr style="border-top:1px solid rgba(255,255,255,0.05); transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
                    <td style="padding:16px; vertical-align:top; font-weight:700; color:#fff;">ast</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">4</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">39.9 KB</td>
                </tr><tr style="border-top:1px solid rgba(255,255,255,0.05); transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
                    <td style="padding:16px; vertical-align:top; font-weight:700; color:#fff;">ir</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">6</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">58.4 KB</td>
                </tr><tr style="border-top:1px solid rgba(255,255,255,0.05); transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
                    <td style="padding:16px; vertical-align:top; font-weight:700; color:#fff;">json</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">50</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">170.2 KB</td>
                </tr><tr style="border-top:1px solid rgba(255,255,255,0.05); transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
                    <td style="padding:16px; vertical-align:top; font-weight:700; color:#fff;">other</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">6</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">6.6 KB</td>
                </tr>
                    </tbody>
        </table>
    </div>
    <h4 style='font-size:14px; font-weight:600; margin-bottom:12px; color:#fff;'>Largest Artifacts</h4>
    <div class="custom-scrollbar" style="overflow-x:auto; margin-bottom:24px; background:rgba(0,0,0,0.15); border-radius:8px; border:1px solid rgba(255,255,255,0.05);">
        <table class="health-table" style="width:100%; border-collapse:collapse; font-size:13px; text-align:left;">
            <thead style="background:rgba(255,255,255,0.02); color:var(--text-muted); font-size:11px; text-transform:uppercase; letter-spacing:0.5px;">
                <tr><th style="padding:16px;">Artifact</th><th style="padding:16px;">Type</th><th style="padding:16px;">Size</th><th style="padding:16px;">Warnings</th></tr>
            </thead>
            <tbody>
<tr style="border-top:1px solid rgba(255,255,255,0.05); transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
                    <td style="padding:16px; vertical-align:top; font-weight:700; color:#fff;">analysis/batch_temp/ast/temp_ast.json</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">ast</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">35.1 KB</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">-</td>
                </tr><tr style="border-top:1px solid rgba(255,255,255,0.05); transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
                    <td style="padding:16px; vertical-align:top; font-weight:700; color:#fff;">analysis/batch_temp/ir/IR.json</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">ir</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">28.0 KB</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">-</td>
                </tr><tr style="border-top:1px solid rgba(255,255,255,0.05); transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
                    <td style="padding:16px; vertical-align:top; font-weight:700; color:#fff;">analysis/batch_temp/ir/IR.compact.json</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">ir</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">26.8 KB</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">-</td>
                </tr><tr style="border-top:1px solid rgba(255,255,255,0.05); transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
                    <td style="padding:16px; vertical-align:top; font-weight:700; color:#fff;">analysis/unified/project_artifact_health_report.json</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">json</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">23.0 KB</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">-</td>
                </tr>
                    </tbody>
        </table>
    </div>
    <h4 style='font-size:14px; font-weight:600; margin-bottom:12px; color:#fff;'>Slowest JSON I/O Operations</h4>
    <div class="custom-scrollbar" style="overflow-x:auto; margin-bottom:24px; background:rgba(0,0,0,0.15); border-radius:8px; border:1px solid rgba(255,255,255,0.05);">
        <table class="health-table" style="width:100%; border-collapse:collapse; font-size:13px; text-align:left;">
            <thead style="background:rgba(255,255,255,0.02); color:var(--text-muted); font-size:11px; text-transform:uppercase; letter-spacing:0.5px;">
                <tr><th style="padding:16px;">Operation</th><th style="padding:16px;">Artifact</th><th style="padding:16px;">Duration</th><th style="padding:16px;">Cache</th><th style="padding:16px;">Warnings</th></tr>
            </thead>
            <tbody>
<tr style="border-top:1px solid rgba(255,255,255,0.05); transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
                    <td style="padding:16px; vertical-align:top; font-weight:700; color:#fff;">write_json</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">analysis/batch_temp/ast/temp_ast.json</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">1ms</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">write-through</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">-</td>
                </tr>
                    </tbody>
        </table>
    </div>
    <h4 style='font-size:14px; font-weight:600; margin-bottom:12px; color:#fff;'>Large I/O Operation Warnings</h4>
    <div class="custom-scrollbar" style="overflow-x:auto; margin-bottom:24px; background:rgba(0,0,0,0.15); border-radius:8px; border:1px solid rgba(255,255,255,0.05);">
        <table class="health-table" style="width:100%; border-collapse:collapse; font-size:13px; text-align:left;">
            <thead style="background:rgba(255,255,255,0.02); color:var(--text-muted); font-size:11px; text-transform:uppercase; letter-spacing:0.5px;">
                <tr><th style="padding:16px;">Operation</th><th style="padding:16px;">Artifact</th><th style="padding:16px;">Size</th><th style="padding:16px;">Warnings</th></tr>
            </thead>
            <tbody>
<tr style="border-top:1px solid rgba(255,255,255,0.05); transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
                    <td style="padding:16px; vertical-align:top; font-weight:700; color:#fff;">No large read/write operations recorded.</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;"></td><td style="padding:16px; vertical-align:top; color:#cbd5e1;"></td><td style="padding:16px; vertical-align:top; color:#cbd5e1;"></td>
                </tr>
                    </tbody>
        </table>
    </div>
    
    </div>
    
    <div id="health-tab-9" class="health-section" style="display:none; background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:12px; padding:24px; margin-bottom:32px;">
        <h3 style="font-size:16px; font-weight:600; color:#fff; margin-top:0; margin-bottom:20px;">Review Queue & Downloads</h3>
        
    <div style="display:flex; justify-content:space-between; margin-bottom:16px;">
        <div style="font-size:13px; color:var(--text-muted);">Filter the evidence a reviewer needs first, then download the exact report behind it.</div>
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px;">
            <button class="graph-btn" style="justify-content:center;">All evidence</button>
            <button class="graph-btn" style="justify-content:center;">Only blockers</button>
            <button class="graph-btn" style="grid-column: span 2; justify-content:center;">Only skipped files</button>
        </div>
    </div>
    <div style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:24px;">
        <span style="border:1px solid #3498db; color:#3498db; padding:4px 12px; border-radius:12px; font-size:11px;">Performance</span>
        <span style="border:1px solid #3498db; color:#3498db; padding:4px 12px; border-radius:12px; font-size:11px;">Parser</span>
        <span style="border:1px solid #3498db; color:#3498db; padding:4px 12px; border-radius:12px; font-size:11px;">IR Process</span>
        <span style="border:1px solid #3498db; color:#3498db; padding:4px 12px; border-radius:12px; font-size:11px;">IR Accuracy Lifecycle</span>
        <span style="border:1px solid #3498db; color:#3498db; padding:4px 12px; border-radius:12px; font-size:11px;">Dependency Graph</span>
        <span style="border:1px solid #3498db; color:#3498db; padding:4px 12px; border-radius:12px; font-size:11px;">Project Artifacts</span>
    </div>
    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(150px, 1fr)); gap:12px; margin-bottom:24px;">
    <div style="background:#212733; border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">BLOCKERS</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">1</div>
        <div style="font-size:12px; color:var(--text-muted); margin-top:4px;">Findings that can stop or materially weaken conversion readiness.</div>
    </div>
    
    <div style="background:#212733; border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">SKIPPED FILES</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">0</div>
        <div style="font-size:12px; color:var(--text-muted); margin-top:4px;">Uploaded files that were intentionally skipped or rejected.</div>
    </div>
    
    <div style="background:#212733; border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">PROGRAM EVIDENCE</div>
        <div style="font-size:18px; font-weight:700; color:#fff;">4</div>
        <div style="font-size:12px; color:var(--text-muted); margin-top:4px;">Expandable per-program parse, IR, and traceability findings.</div>
    </div>
    </div><h4 style='font-size:14px; font-weight:600; margin-bottom:12px; color:#fff;'>Blocker Findings</h4>
    <div class="custom-scrollbar" style="overflow-x:auto; margin-bottom:24px; background:rgba(0,0,0,0.15); border-radius:8px; border:1px solid rgba(255,255,255,0.05);">
        <table class="health-table" style="width:100%; border-collapse:collapse; font-size:13px; text-align:left;">
            <thead style="background:rgba(255,255,255,0.02); color:var(--text-muted); font-size:11px; text-transform:uppercase; letter-spacing:0.5px;">
                <tr><th style="padding:16px;">Area</th><th style="padding:16px;">Severity</th><th style="padding:16px;">Program/Ref</th><th style="padding:16px;">Message</th></tr>
            </thead>
            <tbody>
<tr style="border-top:1px solid rgba(255,255,255,0.05); transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
                    <td style="padding:16px; vertical-align:top; font-weight:700; color:#fff;">Parse</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">failed</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">temp</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;">Review parser errors and source context, then add preprocessing or grammar support for the failing construct.</td>
                </tr>
                    </tbody>
        </table>
    </div>
    <h4 style='font-size:14px; font-weight:600; margin-bottom:12px; color:#fff;'>Skipped Files</h4>
    <div class="custom-scrollbar" style="overflow-x:auto; margin-bottom:24px; background:rgba(0,0,0,0.15); border-radius:8px; border:1px solid rgba(255,255,255,0.05);">
        <table class="health-table" style="width:100%; border-collapse:collapse; font-size:13px; text-align:left;">
            <thead style="background:rgba(255,255,255,0.02); color:var(--text-muted); font-size:11px; text-transform:uppercase; letter-spacing:0.5px;">
                <tr><th style="padding:16px;">File</th><th style="padding:16px;">Type</th><th style="padding:16px;">Disposition</th><th style="padding:16px;">Reason</th></tr>
            </thead>
            <tbody>
<tr style="border-top:1px solid rgba(255,255,255,0.05); transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
                    <td style="padding:16px; vertical-align:top; font-weight:700; color:#fff;">No skipped files found.</td><td style="padding:16px; vertical-align:top; color:#cbd5e1;"></td><td style="padding:16px; vertical-align:top; color:#cbd5e1;"></td><td style="padding:16px; vertical-align:top; color:#cbd5e1;"></td>
                </tr>
                    </tbody>
        </table>
    </div>
    <h4 style='font-size:14px; font-weight:600; margin-bottom:12px; color:#fff;'>Expandable Program Evidence</h4>
        <div style="background:rgba(0,0,0,0.2); border:1px solid rgba(255,255,255,0.05); padding:12px 16px; border-radius:6px; margin-bottom:8px; display:flex; align-items:center;">
            <div style="background:#e67e22; color:#fff; font-size:10px; font-weight:700; padding:2px 6px; border-radius:4px; margin-right:12px;">WARNING</div>
            <div style="font-size:13px; font-weight:600; color:#fff; width:300px;">Parser evidence: temp</div>
            <div style="font-size:13px; color:var(--text-muted);">unknown_parser_failure</div>
        </div>
        
        <div style="background:rgba(18, 12, 12, 0.2); border:1px solid rgba(255,255,255,0.05); padding:12px 16px; border-radius:6px; margin-bottom:8px; display:flex; align-items:center;">
            <div style="background:#e67e22; color:#fff; font-size:10px; font-weight:700; padding:2px 6px; border-radius:4px; margin-right:12px;">WARNING</div>
            <div style="font-size:13px; font-weight:600; color:#fff; width:300px;">IR quality: temp</div>
            <div style="font-size:13px; color:var(--text-muted);">score : 72 ; issues : 3</div>
        </div>
        
        <div style="background:rgba(0,0,0,0.2); border:1px solid rgba(255,255,255,0.05); padding:12px 16px; border-radius:6px; margin-bottom:8px; display:flex; align-items:center;">
            <div style="background:#e67e22; color:#fff; font-size:10px; font-weight:700; padding:2px 6px; border-radius:4px; margin-right:12px;">WARNING</div>
            <div style="font-size:13px; font-weight:600; color:#fff; width:300px;">IR certification: temp</div>
            <div style="font-size:13px; color:var(--text-muted);">status : certified_with_warnings, risk : LOW</div>
        </div>
        
        <div style="background:rgba(0,0,0,0.2); border:1px solid rgba(255,255,255,0.05); padding:12px 16px; border-radius:6px; margin-bottom:8px; display:flex; align-items:center;">
            <div style="background:#e67e22; color:#fff; font-size:10px; font-weight:700; padding:2px 6px; border-radius:4px; margin-right:12px;">WARNING</div>
            <div style="font-size:13px; font-weight:600; color:#fff; width:300px;">Traceability: READ_FILE_EXAMPLE</div>
            <div style="font-size:13px; color:var(--text-muted);">graph:yes, manifest:yes, blueprint:no</div>
        </div>
        
    </div>
        </div>
    </div>
    `;
      activateMode('Analysis Health', 'Analysis Health', leftHTML, displayHTML, () => {
          const healthTabsContainer = document.getElementById('healthTabs');
          if (healthTabsContainer) {
              const tabs = healthTabsContainer.querySelectorAll('.tab');
              tabs.forEach(tab => {
                  tab.addEventListener('click', (e) => {
                      tabs.forEach(t => t.classList.remove('active'));
                      tab.classList.add('active');
                      const viewId = tab.getAttribute('data-view');
                      document.querySelectorAll('.health-section').forEach(sec => sec.style.setProperty('display', 'none', 'important'));
                      const targetSec = document.getElementById(viewId);
                      if (targetSec) targetSec.style.setProperty('display', 'block', 'important');
                  });
              });
          }
      });
    }

    

syncSidebarActive(window.EQUIVALIC_INITIAL_PAGE);
activateAnalysisHealthMode();
