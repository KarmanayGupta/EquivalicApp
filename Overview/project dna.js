/* ============================================================
   Project DNA page logic
   Source: ChangedAnalysisEngine (2).html
   Contains this page's bootstrap, renderers, handlers, and data only.
============================================================ */
window.EQUIVALIC_INITIAL_PAGE = window.EQUIVALIC_INITIAL_PAGE || 'Project DNA';

/* ============================================================
   Page bootstrap and shared shell utilities
============================================================ */
const appState = { product: "Product Suite", section: "Overview", page: "Project DNA", view: "Overview" };
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


const irChunkData = [
      { chunk: "0000-MAIN-PROCESS", sub: "para_0000-MAIN-PROCESS_1", expected: "ACCTINQ", irName: "ACCTINQ", status: "fail", score: "—", reason: "verifier exception: LLM budget exceeded for feature 'ir_verification'", suggestion: "Category: unknown" },
      { chunk: "END-EVALUATE", sub: "para_END-EVALUATE_2", expected: "ACCTINQ", irName: "ACCTINQ", status: "fail", score: "—", reason: "verifier exception: LLM budget exceeded", suggestion: "Category: unknown" },
      { chunk: "1000-FIRST-TIME-PROCESS", sub: "para_1000-FIRST-TIME-PROCESS_3", expected: "ACCTINQ", irName: "ACCTINQ", status: "fail", score: "—", reason: "verifier exception: LLM budget exceeded", suggestion: "Category: unknown" },
      { chunk: "2000-PROCESS-INPUT", sub: "para_2000-PROCESS-INPUT_4", expected: "ACCTINQ", irName: "ACCTINQ", status: "fail", score: "—", reason: "verifier exception: LLM budget exceeded", suggestion: "Category: unknown" },
      { chunk: "3000-VALIDATE-INPUT", sub: "para_3000-VALIDATE-INPUT_6", expected: "ACCTINQ", irName: "ACCTINQ", status: "fail", score: "—", reason: "verifier exception: LLM budget exceeded", suggestion: "Category: unknown" },
      { chunk: "4000-READ-DATABASE", sub: "para_4000-READ-DATABASE_8", expected: "ACCTINQ", irName: "ACCTINQ", status: "fail", score: "—", reason: "verifier exception: LLM budget exceeded", suggestion: "Category: unknown" },
      { chunk: "MAIN-LOGIC", sub: "para_MAIN-LOGIC_1", expected: "BALQUERY", irName: "BALQUERY", status: "fail", score: "—", reason: "verifier exception: LLM budget exceeded", suggestion: "Category: unknown" },
      { chunk: "RETRIEVE-ACCOUNT-DATA", sub: "para_RETRIEVE-ACCOUNT-DATA_3", expected: "BALQUERY", irName: "BALQUERY", status: "fail", score: "—", reason: "verifier exception: LLM budget exceeded", suggestion: "Category: unknown" },
      { chunk: "MAIN-PROGRAM", sub: "para_MAIN-PROGRAM_1", expected: "BANKING", irName: "BANKING", status: "fail", score: "—", reason: "verifier exception: LLM budget exceeded", suggestion: "Category: unknown" },
      { chunk: "EXEC_SQL", sub: "exec_sql_5", expected: "DISCOUNT-FINAL", irName: "DISCOUNT-FINAL", status: "fail", score: "—", reason: "verifier exception: LLM budget exceeded", suggestion: "Category: unknown" },
      { chunk: "EXEC_SQL", sub: "exec_sql_1", expected: "ORDINV", irName: "ORDINV", status: "fail", score: "—", reason: "verifier exception: LLM budget exceeded", suggestion: "Category: unknown" },
      { chunk: "EXEC_SQL", sub: "exec_sql_2", expected: "ORDINV", irName: "ORDINV", status: "fail", score: "—", reason: "verifier exception: LLM budget exceeded", suggestion: "Category: unknown" }
    ];

// Project DNA mode (IR Workbench)
    function activateProjectDNAMode() {
      const irRows = irChunkData.map(row => {
        const statusHtml = row.status === "fail" ? `<span class="ir-wb-status-fail">&#x2715; Not matching</span>` : `<span class="ir-wb-status-pass">&#x2713; Matching</span>`;
        return `<tr>
          <td><div class="ir-wb-chunk-name">${row.chunk}</div><div class="ir-wb-chunk-sub">${row.sub}</div></td>
          <td><div><span class="ir-wb-prog-label">EXPECTED</span><span class="ir-wb-prog-value">${row.expected}</span></div></td>
          <td>${statusHtml}</td>
          <td style="color:#94a3b8;">${row.score}</td>
          <td style="color:#94a3b8;font-size:11px;">${row.reason}</td>
          <td style="color:#94a3b8;font-size:11px;">${row.suggestion}</td>
        </tr>`;
      }).join('');

      const leftHTML = `<div style="display:flex;flex-direction:column;gap:20px;max-height:100%;overflow-y:auto;overflow-x:hidden;padding-right:8px;">
        <div>
          <div class="sub-nav active" style="margin-bottom: 24px; cursor: default; pointer-events: none;">IR QUALITY</div>
          <p style="color:#94a3b8;line-height:1.6;margin-bottom:12px;font-size:13px;padding-right:4px;">Runs only when you click the button. No automatic LLM calls on tab load.</p>
          <div style="background:rgba(59,130,246,0.1);padding:12px;border-radius:8px;border-left:3px solid #3b82f6;margin:12px 0;">
            <p style="margin:0;color:#60a5fa;line-height:1.6;font-size:13px;">Parser, AST, upload-to-IR, dependency graph audit, and post-IR readiness metrics now live in <a href="#" id="analysisHealthLink" style="color:#60a5fa;text-decoration:underline;">Analysis Health</a>.</p>
          </div>
          <p style="color:#94a3b8;line-height:1.8;margin-bottom:14px;font-size:14px;font-family:'Inter',sans-serif;font-weight:500;padding-right:4px;"><strong style="color:#94a3b8;font-weight:600;">Check IR Quality</strong> runs the LLM verifier (per chunk) and writes reports. <strong style="color:#94a3b8;font-weight:600;">Improve / Update (Draft)</strong> aggregates suggestions from those reports. <strong style="color:#94a3b8;font-weight:600;">Apply</strong> is available only when <span style="background:rgba(255,255,255,0.06);padding:2px 6px;border-radius:4px;font-size:13px;color:#94a3b8;">ir_verification_assisted_apply_enabled</span> is true in server config; it writes <span style="background:rgba(255,255,255,0.06);padding:2px 6px;border-radius:4px;font-size:13px;color:#94a3b8;">IR.json</span> with a timestamped backup.</p>
          <button id="checkIRQualityBtn" style="display:flex;align-items:center;justify-content:center;gap:8px;width:100%;padding:12px 16px;border-radius:20px;font-size:13px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;text-align:center;cursor:pointer;background:#0f141b;border:1px solid transparent;background-image:linear-gradient(#0f141b, #0f141b),linear-gradient(90deg, #6c5ce7, #00d4ff);background-origin:border-box;background-clip:padding-box, border-box;color:var(--accent-2);box-shadow:0 0 16px rgba(0, 212, 255, 0.08);transition:all 0.25s ease;margin-bottom:16px;" onmousedown="this.style.background='linear-gradient(90deg, rgba(108, 92, 231, 0.22), rgba(0, 212, 255, 0.18))';this.style.color='#ffffff';this.style.border='1px solid rgba(0, 212, 255, 0.45)'" onmouseup="this.style.background='#0f141b';this.style.border='1px solid transparent';this.style.backgroundImage='linear-gradient(#0f141b, #0f141b),linear-gradient(90deg, #6c5ce7, #00d4ff)';this.style.color='var(--accent-2)'" onmouseleave="this.style.background='#0f141b';this.style.border='1px solid transparent';this.style.backgroundImage='linear-gradient(#0f141b, #0f141b),linear-gradient(90deg, #6c5ce7, #00d4ff)';this.style.color='var(--accent-2)'">Check IR Quality</button>
          <p style="color:#94a3b8;line-height:1.8;margin-bottom:16px;font-size:14px;font-family:'Inter',sans-serif;font-weight:500;padding-right:4px;">Label: deterministic pipeline health is authoritative. AI-generated verifier findings are optional advisory enhancements with budget, cache, and usage reporting in Analysis Health.</p>
          <div style="background:rgba(16,185,129,0.08);padding:12px;border-radius:8px;border-left:3px solid #10b981;margin-bottom:16px;">
            <p style="margin:0;font-size:13px;color:#6ee7b7;line-height:1.6;">Safe repair mode: safe_repair. Assisted apply is on for validated structured draft patches; advisory findings remain non-mutating.</p>
          </div>
          <div id="irQualityStatus" style="margin-top:16px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:14px 16px;font-size:13px;color:#94a3b8;line-height:1.8;display:none;">
            <p style="margin:0;color:#94a3b8;font-weight:500;">Status: not_matching | Score: 0 | Programs: 20/20 | Chunks: 105 (pass=0, warn=0, fail=105)</p>
            <p style="margin:8px 0 0;color:#94a3b8;">105 chunk(s) failed verification</p>
            <p style="margin:8px 0 0;color:#94a3b8;">Safe repair preflight (safe_repair): 2 repair(s), 5 program(s) updated, remaining SQL/CICS gaps=4, native fallbacks=2.</p>
            <p style="margin:8px 0 0;color:#94a3b8;">Detailed results are in the IR Quality workbench below (use Hide details / Show details). Press Esc to collapse details.</p>
          </div>
        </div>
      </div>`;

      const displayHTML = `<div style="display:flex;flex-direction:column;height:100%;overflow:hidden;">
        <div style="border-bottom: 1px solid var(--border); padding: 0 4px 12px; margin-bottom: 0; flex-shrink: 0;">
          <h2 style="font-size: 24px; font-weight: 700; color: #fff; margin: 0 0 4px 0; letter-spacing: 0.05em;">Project  DNA</h2>
          <p style="font-size: 14px; color: var(--text-muted); margin: 0; font-weight: 500;">Executive Summary & Business Impact Analysis</p>
        </div>
        <div class="dashboard-tabs" style="flex-shrink: 0; padding: 0 4px; margin-bottom: 0;">
          <button class="tab active" data-view="overview">Overview</button>
          <button class="tab" data-view="anatomy">Anatomy</button>
          <button class="tab" data-view="dependency">Dependency Graph</button>
        </div>
        <div class="scroll-container" style="flex: 1; overflow-y: auto; overflow-x: hidden; padding: 20px 4px 32px;">
        <div id="overviewContent" style="display: block;">
          <div class="stats-grid">
            <div class="stat-card">
              <div style="font-size: 24px; margin-bottom: 8px; color: var(--accent-2);">⊞</div>
              <div class="stat-value" style="font-size: 36px;">22</div>
              <div class="stat-label" style="font-size: 13px;">Total Programs</div>
              <div style="font-size: 11px; color: var(--text-muted); margin-top: 4px;">21 Batch • 1 CICS • 0 Mixed</div>
            </div>
            <div class="stat-card">
              <div style="font-size: 24px; margin-bottom: 8px; color: var(--accent-2);">📄</div>
              <div class="stat-value" style="font-size: 36px;">2,760</div>
              <div class="stat-label" style="font-size: 13px;">Lines Of Code</div>
              <div style="font-size: 11px; color: var(--text-muted); margin-top: 4px;">100% Active • 0% Dead</div>
            </div>
            <div class="stat-card">
              <div style="font-size: 24px; margin-bottom: 8px; color: var(--accent-2);">◉</div>
              <div class="stat-value" style="font-size: 36px;">20.5</div>
              <div class="stat-label" style="font-size: 13px;">Complexity Score</div>
              <div style="font-size: 11px; color: var(--text-muted); margin-top: 4px;">1 Low • 7 Med • 14 High</div>
            </div>
            <div class="stat-card">
              <div style="font-size: 24px; margin-bottom: 8px; color: var(--accent-2);">☰</div>
              <div class="stat-value" style="font-size: 36px;">7</div>
              <div class="stat-label" style="font-size: 13px;">Copybooks</div>
              <div style="font-size: 11px; color: var(--text-muted); margin-top: 4px;">7 shared data definitions</div>
            </div>
            <div class="stat-card">
              <div style="font-size: 24px; margin-bottom: 8px; color: var(--accent-2);">�</div>
              <div class="stat-value" style="font-size: 36px;">1</div>
              <div class="stat-label" style="font-size: 13px;">BMS Maps</div>
              <div style="font-size: 11px; color: var(--text-muted); margin-top: 4px;">1 screen layout</div>
            </div>
            <div class="stat-card">
              <div style="font-size: 24px; margin-bottom: 8px; color: var(--accent-2);">✱</div>
              <div class="stat-value" style="font-size: 36px;">1</div>
              <div class="stat-label" style="font-size: 13px;">JCL Scripts</div>
              <div style="font-size: 11px; color: var(--text-muted); margin-top: 4px;">1 job definition</div>
            </div>
          </div>
          
          <div style="display:flex;gap:12px;margin-top:24px;margin-bottom:20px;">
            <button id="showDetailsBtn" disabled style="display:flex;align-items:center;justify-content:center;gap:8px;flex:1;padding:12px 16px;border-radius:20px;font-size:13px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;text-align:center;cursor:not-allowed;background:#0f141b;border:1px solid transparent;background-image:linear-gradient(#0f141b, #0f141b),linear-gradient(90deg, #6c5ce7, #00d4ff);background-origin:border-box;background-clip:padding-box, border-box;color:var(--accent-2);box-shadow:0 0 16px rgba(0, 212, 255, 0.08);opacity:0.5;transition:all 0.25s ease;">Show details</button>
            
            <button id="improveDraftBtn" disabled style="display:flex;align-items:center;justify-content:center;gap:8px;flex:1;padding:12px 16px;border-radius:20px;font-size:13px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;text-align:center;cursor:not-allowed;background:#0f141b;border:1px solid transparent;background-image:linear-gradient(#0f141b, #0f141b),linear-gradient(90deg, #6c5ce7, #00d4ff);background-origin:border-box;background-clip:padding-box, border-box;color:var(--accent-2);box-shadow:0 0 16px rgba(0, 212, 255, 0.08);opacity:0.5;transition:all 0.25s ease;">Improve / Update (Draft)</button>
            
            <button id="noSelectablePatchesBtn" style="display:flex;align-items:center;justify-content:center;gap:8px;flex:1;padding:12px 16px;border-radius:20px;font-size:13px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;text-align:center;cursor:pointer;background:linear-gradient(90deg, rgba(108, 92, 231, 0.22), rgba(0, 212, 255, 0.18));color:#ffffff;border:1px solid rgba(0, 212, 255, 0.45);box-shadow:0 0 16px rgba(0, 212, 255, 0.12);transition:all 0.25s ease;">No selectable patches</button>
          </div>
          
          <div id="irWorkbench" class="chart-wrapper dark" style="display:none;margin-top:20px;padding:20px;">
            <h4>Detailed chunk results</h4>
            <div class="ir-wb-summary">
              <div><div class="ir-wb-summary-label">OVERALL</div><div class="ir-wb-summary-value"><span class="ir-status-fail">&#x2715; Not matching</span></div></div>
              <div><div class="ir-wb-summary-label">QUALITY SCORE</div><div class="ir-wb-summary-value">0</div></div>
              <div><div class="ir-wb-summary-label">PROGRAMS VERIFIED</div><div class="ir-wb-summary-value">20 / 20</div></div>
              <div><div class="ir-wb-summary-label">CHUNKS</div><div class="ir-wb-summary-value">105</div></div>
              <div><div class="ir-wb-summary-label">PASS / WARN / FAIL</div><div class="ir-wb-summary-value">0 / 0 / 105</div></div>
              <div><div class="ir-wb-summary-label">SAFE REPAIRS</div><div class="ir-wb-summary-value">2 repair(s), 5 program(s) updated</div></div>
              <div><div class="ir-wb-summary-label">REMAINING EXECUTABLE GAPS</div><div class="ir-wb-summary-value">SQL/CICS 4 · Native 2</div></div>
            </div>
            <div class="ir-wb-note">105 chunk(s) failed verification</div>
            <div class="ir-wb-table-wrap">
              <table class="ir-wb-table">
                <thead><tr><th>Chunk</th><th>Program</th><th>Status</th><th>Score</th><th>Reason</th><th>Suggested improvement</th></tr></thead>
                <tbody>${irRows}</tbody>
              </table>
            </div>
          </div>
          
          <div id="irDraftPanel" style="display:none;background:rgba(15,20,28,0.95);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:24px;margin-top:16px;">
            <div style="background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.3);border-radius:10px;padding:14px 18px;font-size:13px;color:#6ee7b7;margin-bottom:20px;">
              1 draft row(s) have selectable structured patches. Use the checkbox shown on those rows, then Apply selected patches.
            </div>
            <div id="irDraftList" style="display:flex;flex-direction:column;gap:16px;"></div>
            <div style="padding:12px;display:flex;gap:10px;">
              <button id="applyPatchesBtn" onclick="applySelectedPatches()" disabled style="flex:1;padding:12px 16px;border-radius:20px;font-size:13px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;text-align:center;cursor:not-allowed;background:#0f141b;border:1px solid transparent;background-image:linear-gradient(#0f141b, #0f141b),linear-gradient(90deg, #6c5ce7, #00d4ff);background-origin:border-box;background-clip:padding-box, border-box;color:var(--accent-2);box-shadow:0 0 16px rgba(0, 212, 255, 0.08);opacity:0.5;transition:all 0.25s ease;font-family:'Inter',sans-serif;">Apply selected patches</button>
            </div>
            <div style="background:rgba(20,26,36,0.9);border:1px solid rgba(108,92,231,0.3);border-radius:12px;padding:20px;margin-top:24px;">
              <h4 style="font-size:14px;font-weight:700;color:#8b5cf6;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:14px;">Suggested Patch Structure</h4>
              <div style="background:rgba(13,13,23,0.95);border:1px solid rgba(108,92,231,0.2);border-radius:10px;overflow-x:auto;max-height:350px;overflow-y:auto;">
                <pre style="color:#cbd5e1;font-size:12px;line-height:1.6;padding:16px;margin:0;font-family:monospace;">{
  "op": "pointer_map",
  "map": {
    "/control_flow/paragraphs/0/statements": [
      {
        "stype": "DISPLAY",
        "data": {
          "items": ["\"No SQL here\""],
          "upon": null,
          "line": 10,
          "antlr_node_type": "display_statement"
        }
      }
    ]
  }
}</pre>
              </div>
            </div>
          </div>
        </div>
        
        <div id="anatomyContent" style="display:none;">
          <div style="margin-bottom:32px;">
            <h4 style="color:var(--text-primary);font-weight:700;margin-bottom:16px;font-family:'Inter',sans-serif;text-align:center;font-size:18px;">Files Breakdown</h4>
            <div class="chart-wrapper" style="background:rgb(255,248,232);border:1px solid var(--border);border-radius:var(--radius);padding:24px;overflow:hidden;">
              <div class="chart-container" style="position:relative;height:300px;width:100%;max-width:100%;"><canvas id="filesChart"></canvas></div>
            </div>
          </div>
          
          <div style="margin-bottom:32px;">
            <h4 style="color:var(--text-primary);font-weight:700;margin-bottom:16px;font-family:'Inter',sans-serif;text-align:center;font-size:18px;">Complexity Distribution</h4>
            <div class="chart-wrapper" style="background:rgb(255,248,232);border:1px solid var(--border);border-radius:var(--radius);padding:24px;overflow:hidden;">
              <div class="chart-container" style="position:relative;height:300px;width:100%;max-width:100%;"><canvas id="complexityDistChart"></canvas></div>
            </div>
          </div>
          
          <div style="margin-bottom:32px;">
            <h4 style="color:var(--text-primary);font-weight:700;margin-bottom:16px;font-family:'Inter',sans-serif;text-align:center;font-size:18px;">Program Breakdown</h4>
            <div class="chart-wrapper" style="background:rgb(255,248,232);border:1px solid var(--border);border-radius:var(--radius);padding:24px;overflow:hidden;">
              <div class="chart-container" style="position:relative;height:300px;width:100%;max-width:100%;"><canvas id="programsChart"></canvas></div>
            </div>
          </div>
          
          <div style="margin-bottom:32px;">
            <h4 style="color:var(--text-primary);font-weight:700;margin-bottom:16px;font-family:'Inter',sans-serif;text-align:center;font-size:18px;">Complexity Trend</h4>
            <div class="chart-wrapper" style="background:rgb(255,248,232);border:1px solid var(--border);border-radius:var(--radius);padding:24px;overflow:hidden;">
              <div class="chart-container" style="position:relative;height:300px;width:100%;max-width:100%;"><canvas id="trendChart"></canvas></div>
            </div>
          </div>
        </div>
        
        <div id="dependencyContent" style="display:none;flex-direction:column;height:100%;overflow:hidden;">
          <div style="display:flex;justify-content:center;gap:12px;padding:12px 0;flex-wrap:wrap;flex-shrink:0;background:var(--panel-bg);position:sticky;top:0;z-index:10;">
            <button id="zoomInBtn" style="background:linear-gradient(145deg,rgba(108,92,231,0.12),rgba(0,212,255,0.04));border:1px solid var(--accent-1);color:var(--text-primary);padding:6px 12px;border-radius:10px;font-size:12px;font-weight:500;cursor:pointer;display:flex;align-items:center;gap:4px;transition:all 0.2s ease;font-family:'Inter',sans-serif;" onmouseover="this.style.background='linear-gradient(145deg,rgba(108,92,231,0.22),rgba(0,212,255,0.12))';this.style.borderColor='var(--accent-2)'" onmouseout="this.style.background='linear-gradient(145deg,rgba(108,92,231,0.12),rgba(0,212,255,0.04))';this.style.borderColor='var(--accent-1)'">+ Zoom In</button>
            <button id="zoomOutBtn" style="background:linear-gradient(145deg,rgba(108,92,231,0.12),rgba(0,212,255,0.04));border:1px solid var(--accent-1);color:var(--text-primary);padding:6px 12px;border-radius:10px;font-size:12px;font-weight:500;cursor:pointer;display:flex;align-items:center;gap:4px;transition:all 0.2s ease;font-family:'Inter',sans-serif;" onmouseover="this.style.background='linear-gradient(145deg,rgba(108,92,231,0.22),rgba(0,212,255,0.12))';this.style.borderColor='var(--accent-2)'" onmouseout="this.style.background='linear-gradient(145deg,rgba(108,92,231,0.12),rgba(0,212,255,0.04))';this.style.borderColor='var(--accent-1)'">- Zoom Out</button>
            <button id="scrollUpBtn" style="background:linear-gradient(145deg,rgba(108,92,231,0.12),rgba(0,212,255,0.04));border:1px solid var(--accent-1);color:var(--text-primary);padding:6px 12px;border-radius:10px;font-size:12px;font-weight:500;cursor:pointer;display:flex;align-items:center;gap:4px;transition:all 0.2s ease;font-family:'Inter',sans-serif;" onmouseover="this.style.background='linear-gradient(145deg,rgba(108,92,231,0.22),rgba(0,212,255,0.12))';this.style.borderColor='var(--accent-2)'" onmouseout="this.style.background='linear-gradient(145deg,rgba(108,92,231,0.12),rgba(0,212,255,0.04))';this.style.borderColor='var(--accent-1)'">▲ Scroll Up</button>
            <button id="scrollDownBtn" style="background:linear-gradient(145deg,rgba(108,92,231,0.12),rgba(0,212,255,0.04));border:1px solid var(--accent-1);color:var(--text-primary);padding:6px 12px;border-radius:10px;font-size:12px;font-weight:500;cursor:pointer;display:flex;align-items:center;gap:4px;transition:all 0.2s ease;font-family:'Inter',sans-serif;" onmouseover="this.style.background='linear-gradient(145deg,rgba(108,92,231,0.22),rgba(0,212,255,0.12))';this.style.borderColor='var(--accent-2)'" onmouseout="this.style.background='linear-gradient(145deg,rgba(108,92,231,0.12),rgba(0,212,255,0.04))';this.style.borderColor='var(--accent-1)'">▼ Scroll Down</button>
            <button id="resetBtn" style="background:linear-gradient(145deg,rgba(108,92,231,0.12),rgba(0,212,255,0.04));border:1px solid var(--accent-1);color:var(--text-primary);padding:6px 12px;border-radius:10px;font-size:12px;font-weight:500;cursor:pointer;display:flex;align-items:center;gap:4px;transition:all 0.2s ease;font-family:'Inter',sans-serif;" onmouseover="this.style.background='linear-gradient(145deg,rgba(108,92,231,0.22),rgba(0,212,255,0.12))';this.style.borderColor='var(--accent-2)'" onmouseout="this.style.background='linear-gradient(145deg,rgba(108,92,231,0.12),rgba(0,212,255,0.04))';this.style.borderColor='var(--accent-1)'">Reset View</button>
          </div>
          
          <div id="graphContainer" style="flex:1;width:100%;background:rgb(255,248,232);border-radius:var(--radius);border:1px solid var(--border);overflow:auto;position:relative;display:flex;align-items:center;justify-content:center;">
            <svg id="depGraphSvg" viewBox="0 0 1400 800" style="width:100%;height:100%;min-height:500px;transform-origin:center center;transition:transform 0.2s ease-out;"></svg>
          </div>
        </div>
        </div>
      </div>`;

      activateMode('Project DNA', 'Project DNA', leftHTML, displayHTML);
      
      // Tab switching for Overview/Anatomy/Dependency - use event delegation
      displayPanel.addEventListener('click', function(e) {
        const tab = e.target.closest('.dashboard-tabs .tab');
        if (!tab) return;
        
        const view = tab.dataset.view;
        const allTabs = displayPanel.querySelectorAll('.dashboard-tabs .tab');
        allTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        const overviewContent = document.getElementById('overviewContent');
        const anatomyContent = document.getElementById('anatomyContent');
        const dependencyContent = document.getElementById('dependencyContent');
        
        if (overviewContent) overviewContent.style.display = 'none';
        if (anatomyContent) anatomyContent.style.display = 'none';
        if (dependencyContent) dependencyContent.style.display = 'none';
        
        if (view === 'overview' && overviewContent) {
          overviewContent.style.display = 'block';
        } else if (view === 'anatomy' && anatomyContent) {
          anatomyContent.style.display = 'block';
          setTimeout(() => initAnatomyCharts(), 50);
        } else if (view === 'dependency' && dependencyContent) {
          dependencyContent.style.display = 'flex';
          dependencyContent.style.height = '100%';
          initGraphControls();
        }
      });
    }

    // Anatomy Charts
    let anatomyCharts = [];
    
    function initAnatomyCharts() {
      anatomyCharts.forEach(chart => chart.destroy());
      anatomyCharts = [];
      
      const filesCanvas = document.getElementById('filesChart');
      if (filesCanvas) {
        anatomyCharts.push(new Chart(filesCanvas, {
          type: 'doughnut',
          data: {
            labels: ['Programs', 'Copybooks', 'JCL'],
            datasets: [{
              data: [22, 7, 1],
              backgroundColor: ['#6c5ce7', '#00d4ff', '#ff6b6b'],
              borderWidth: 0
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'top',
                labels: { color: '#000', font: { size: 12, family: 'Inter' } }
              }
            }
          }
        }));
      }
      
      const programsCanvas = document.getElementById('programsChart');
      if (programsCanvas) {
        anatomyCharts.push(new Chart(programsCanvas, {
          type: 'pie',
          data: {
            labels: ['Batch', 'Online', 'Subroutines'],
            datasets: [{
              data: [21, 1, 0],
              backgroundColor: ['#6c5ce7', '#00d4ff', '#ff6b6b'],
              borderWidth: 0
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'top',
                labels: { color: '#000', font: { size: 12, family: 'Inter' } }
              }
            }
          }
        }));
      }
      
      const complexityCanvas = document.getElementById('complexityDistChart');
      if (complexityCanvas) {
        anatomyCharts.push(new Chart(complexityCanvas, {
          type: 'bar',
          data: {
            labels: ['Low', 'Medium', 'High', 'Critical'],
            datasets: [{
              data: [1, 7, 14, 0],
              backgroundColor: ['#00d4ff', '#6c5ce7', '#ff6b6b', '#ff4757'],
              borderWidth: 0
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false }
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: { color: '#000', font: { family: 'Inter' } },
                grid: { color: 'rgba(0,0,0,0.1)' }
              },
              x: {
                ticks: { color: '#000', font: { family: 'Inter' } },
                grid: { display: false }
              }
            }
          }
        }));
      }
      
      const trendCanvas = document.getElementById('trendChart');
      if (trendCanvas) {
        anatomyCharts.push(new Chart(trendCanvas, {
          type: 'line',
          data: {
            labels: ['1-10', '11-20', '21-30', '31-40', '41-50', '50+'],
            datasets: [{
              data: [5, 8, 6, 2, 1, 0],
              borderColor: '#6c5ce7',
              backgroundColor: 'rgba(108,92,231,0.1)',
              fill: true,
              tension: 0.4,
              pointRadius: 4,
              pointBackgroundColor: '#6c5ce7'
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false }
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: { color: '#000', font: { family: 'Inter' } },
                grid: { color: 'rgba(0,0,0,0.1)' }
              },
              x: {
                ticks: { color: '#000', font: { family: 'Inter' } },
                grid: { display: false }
              }
            }
          }
        }));
      }
    }

    // ====== Delegated click handler for Check IR Quality button ======
    leftPanel.addEventListener("click", function(e) {
      const btn = e.target.closest("#checkIRQualityBtn");
      if (!btn) return;
      if (btn.dataset.loading === "true") return;
      btn.dataset.loading = "true";

      const statusDiv = document.getElementById("irQualityStatus");
      const workbench = document.getElementById("irWorkbench");

      btn.textContent = "Checking...";
      btn.style.cursor = "not-allowed";
      btn.style.opacity = "0.85";
      if (statusDiv) statusDiv.style.display = "none";
      if (workbench) workbench.style.display = "none";

      setTimeout(() => {
        btn.textContent = "Processing...";
      }, 1600);

      setTimeout(() => {
        btn.textContent = "Analysing...";
      }, 3200);

      setTimeout(() => {
        btn.textContent = "Check IR Quality";
        btn.style.cursor = "pointer";
        btn.style.opacity = "1";
        btn.dataset.loading = "false";
        if (statusDiv) {
          statusDiv.style.display = "block";
        }
        // Keep workbench hidden until Show details is clicked
        const showDetailsBtn = document.getElementById("showDetailsBtn");
        const improveDraftBtn = document.getElementById("improveDraftBtn");
        
        // Enable Show details and Improve buttons
        if (showDetailsBtn) {
          showDetailsBtn.disabled = false;
          showDetailsBtn.style.opacity = "1";
          showDetailsBtn.style.cursor = "pointer";
          showDetailsBtn.textContent = "Show details";
        }
        if (improveDraftBtn) {
          improveDraftBtn.disabled = false;
          improveDraftBtn.style.opacity = "1";
          improveDraftBtn.style.cursor = "pointer";
        }
      }, 5200);
    });

    // ====== Show details / Hide details toggle ======
    displayPanel.addEventListener("click", function(e) {
      const btn = e.target.closest("#showDetailsBtn");
      if (!btn) return;
      if (btn.disabled) return;
      
      const workbench = document.getElementById("irWorkbench");
      const draftPanel = document.getElementById("irDraftPanel");
      const isShowing = btn.textContent.trim() === "Hide details";
      
      if (isShowing) {
        btn.textContent = "Show details";
        if (workbench) workbench.style.display = "none";
        if (draftPanel) draftPanel.style.display = "none";
      } else {
        btn.textContent = "Hide details";
        if (workbench) {
          workbench.style.display = "block";
          workbench.style.animation = "dnaFadeUp 0.3s ease both";
        }
        // Show draft panel if it has content
        if (draftPanel && draftPanel.querySelector("#irDraftList").innerHTML.trim() !== "") {
          draftPanel.style.display = "block";
          draftPanel.style.animation = "dnaFadeUp 0.3s ease both 0.1s";
        }
      }
    });

    // ====== Improve / Update (Draft) button handler ======
    displayPanel.addEventListener("click", function(e) {
      const btn = e.target.closest("#improveDraftBtn");
      if (!btn) return;
      if (btn.disabled) return;
      
      const draftPanel = document.getElementById("irDraftPanel");
      const showDetailsBtn = document.getElementById("showDetailsBtn");
      const draftList = document.getElementById("irDraftList");
      
      // Show loading state without spinner
      btn.innerHTML = 'Processing...';
      btn.style.cursor = "not-allowed";
      btn.style.opacity = "0.6";
      if (draftPanel) draftPanel.style.display = "none";
      
      // After 2 seconds, show draft panel with content
      setTimeout(() => {
        btn.innerHTML = "Improve / Update (Draft)";
        btn.style.cursor = "pointer";
        btn.style.opacity = "1";
        
        // Populate draft list with sample data
        if (draftList) {
          draftList.innerHTML = `
            <div style="background:rgba(20,26,36,0.8);border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:18px;">
              <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;flex-wrap:wrap;">
                <div style="font-size:14px;font-weight:700;color:#f1f3f8;font-family:'Inter',sans-serif;">ACCTINQ / <span style="color:#60a5fa;">para_0000-MAIN-PROCESS_1</span></div>
                <span style="background:rgba(255,107,107,0.15);color:#ff6b6b;padding:4px 8px;border-radius:6px;font-size:11px;font-weight:600;">status=fail</span>
                <span style="font-size:12px;color:#64748b;">category=unknown · confidence=—</span>
              </div>
              <div style="margin-bottom:12px;">
                <div style="font-size:11px;font-weight:700;color:#8b5cf6;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:6px;font-family:'Inter',sans-serif;">Verifier issues</div>
                <div style="font-size:12px;color:#cbd5e1;line-height:1.6;font-family:'Inter',sans-serif;">
                  <ul style="margin:6px 0 0 18px;padding:0;">
                    <li style="margin:4px 0;color:#94a3b8;">[medium] verifier_exception: LLM budget exceeded for feature 'ir_verification'</li>
                  </ul>
                </div>
              </div>
              <div style="font-size:12px;color:#64748b;font-style:italic;margin-top:8px;font-family:'Inter',sans-serif;">No structured suggested_patch for this chunk. The verifier still flagged problems; fixing them usually means parser/rules updates or refining the patch format.</div>
            </div>
            
            <div style="background:rgba(20,26,36,0.8);border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:18px;">
              <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;flex-wrap:wrap;">
                <div style="font-size:14px;font-weight:700;color:#f1f3f8;font-family:'Inter',sans-serif;">ACCTINQ / <span style="color:#60a5fa;">para_END-EVALUATE_2</span></div>
                <span style="background:rgba(255,107,107,0.15);color:#ff6b6b;padding:4px 8px;border-radius:6px;font-size:11px;font-weight:600;">status=fail</span>
                <span style="font-size:12px;color:#64748b;">category=unknown · confidence=—</span>
              </div>
              <div style="margin-bottom:12px;">
                <div style="font-size:11px;font-weight:700;color:#8b5cf6;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:6px;font-family:'Inter',sans-serif;">Verifier issues</div>
                <div style="font-size:12px;color:#cbd5e1;line-height:1.6;font-family:'Inter',sans-serif;">
                  <ul style="margin:6px 0 0 18px;padding:0;">
                    <li style="margin:4px 0;color:#94a3b8;">[medium] verifier_exception: LLM budget exceeded for feature 'ir_verification'</li>
                  </ul>
                </div>
              </div>
              <div style="font-size:12px;color:#64748b;font-style:italic;margin-top:8px;font-family:'Inter',sans-serif;">No structured suggested_patch for this chunk. The verifier still flagged problems; fixing them usually means parser/rules updates or refining the patch format.</div>
            </div>
            
            <div style="background:rgba(20,26,36,0.8);border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:18px;">
              <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;flex-wrap:wrap;">
                <div style="font-size:14px;font-weight:700;color:#f1f3f8;font-family:'Inter',sans-serif;">ACCTINQ / <span style="color:#60a5fa;">para_1000-FIRST-TIME-PROCESS_3</span></div>
                <span style="background:rgba(255,107,107,0.15);color:#ff6b6b;padding:4px 8px;border-radius:6px;font-size:11px;font-weight:600;">status=fail</span>
                <span style="font-size:12px;color:#64748b;">category=unknown · confidence=—</span>
              </div>
              <div style="margin-bottom:12px;">
                <div style="font-size:11px;font-weight:700;color:#8b5cf6;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:6px;font-family:'Inter',sans-serif;">Verifier issues</div>
                <div style="font-size:12px;color:#cbd5e1;line-height:1.6;font-family:'Inter',sans-serif;">
                  <ul style="margin:6px 0 0 18px;padding:0;">
                    <li style="margin:4px 0;color:#94a3b8;">[medium] verifier_exception: LLM budget exceeded for feature 'ir_verification'</li>
                  </ul>
                </div>
              </div>
              <div style="font-size:12px;color:#64748b;font-style:italic;margin-top:8px;font-family:'Inter',sans-serif;">No structured suggested_patch for this chunk. The verifier still flagged problems; fixing them usually means parser/rules updates or refining the patch format.</div>
            </div>
            
            <div style="background:rgba(20,26,36,0.8);border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:18px;">
              <div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:10px;flex-wrap:wrap;">
                <input type="checkbox" id="patch-3" onchange="togglePatch(3)" style="margin-top:2px;cursor:pointer;width:18px;height:18px;accent-color:#60a5fa;">
                <div style="flex:1;">
                  <div style="font-size:14px;font-weight:700;color:#f1f3f8;font-family:'Inter',sans-serif;margin-bottom:4px;">
                    <strong>TEST-FAKE</strong> / <span style="background:#0f172a;padding:2px 6px;border-radius:2px;color:#60a5fa;">whole_file</span>
                    <span style="margin-left:8px;">·</span>
                    <span style="margin-left:8px;background:#f59e0b;color:white;padding:2px 6px;border-radius:2px;font-size:11px;">status=warn</span>
                    <span style="margin-left:4px;">·</span>
                    <span style="margin-left:4px;color:#64748b;">category=parser_bug</span>
                    <span style="margin-left:4px;">·</span>
                    <span style="margin-left:4px;color:#64748b;">confidence=0.97</span>
                  </div>
                </div>
              </div>
              <div style="margin-left:30px;margin-bottom:12px;">
                <div style="font-size:11px;font-weight:700;color:#8b5cf6;text-transform:uppercase;letter-spacing:0.8px;margin-bottom:6px;font-family:'Inter',sans-serif;">Verifier issues</div>
                <div style="font-size:12px;color:#cbd5e1;line-height:1.6;font-family:'Inter',sans-serif;">
                  <ul style="margin:6px 0 0 18px;padding:0;">
                    <li style="margin:4px 0;color:#94a3b8;">[high] spurious_statement_from_comment: IR introduces a CONTINUE at line 5, but COBOL line 5 is a comment</li>
                  </ul>
                </div>
                <div style="font-size:12px;color:#cbd5e1;margin-top:8px;font-family:'Inter',sans-serif;">Suggested patch (draft — use Apply when enabled)</div>
                <div style="display:flex;justify-content:center;margin-top:16px;">
                  <button onclick="previewDiff(3)" style="padding:12px 28px;background:rgba(20,26,36,0.8);color:#60a5fa;border:1px solid rgba(96,165,250,0.3);border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;font-family:'Inter',sans-serif;transition:all 0.3s ease;box-shadow:0 2px 8px rgba(0,0,0,0.2);" onmouseover="this.style.background='rgba(30,41,59,0.9)';this.style.borderColor='rgba(96,165,250,0.5)';this.style.boxShadow='0 4px 12px rgba(96,165,250,0.2)'" onmouseout="this.style.background='rgba(20,26,36,0.8)';this.style.borderColor='rgba(96,165,250,0.3)';this.style.boxShadow='0 2px 8px rgba(0,0,0,0.2)'">Preview Difference</button>
                </div>
              </div>
            </div>
          `;
        }
        
        if (draftPanel) {
          draftPanel.style.display = "block";
          draftPanel.style.animation = "dnaFadeUp 0.4s ease both";
          
          // Update Show details button to "Hide details" since we're showing content
          if (showDetailsBtn && showDetailsBtn.textContent.trim() === "Show details") {
            showDetailsBtn.textContent = "Hide details";
            // Also show the workbench
            const workbench = document.getElementById("irWorkbench");
            if (workbench) workbench.style.display = "block";
          }
          
          // Scroll to draft panel
          setTimeout(() => {
            draftPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
          }, 100);
        }
      }, 2000);
    });

    // ====== Escape key handler to hide details ======
    document.addEventListener("keydown", function(e) {
      if (e.key === "Escape") {
        const showDetailsBtn = document.getElementById("showDetailsBtn");
        const workbench = document.getElementById("irWorkbench");
        const draftPanel = document.getElementById("irDraftPanel");
        
        if (showDetailsBtn && showDetailsBtn.textContent.trim() === "Hide details") {
          showDetailsBtn.textContent = "Show details";
          if (workbench) workbench.style.display = "none";
          if (draftPanel) draftPanel.style.display = "none";
        }
      }
    });

    // ====== Patch selection management ======
    let selectedPatches = new Set();

    window.togglePatch = function(idx) {
      if (selectedPatches.has(idx)) {
        selectedPatches.delete(idx);
      } else {
        selectedPatches.add(idx);
      }
      updateApplyButton();
    };

    function updateApplyButton() {
      // Update Apply button in draft panel
      const applyBtn = document.getElementById("applyPatchesBtn");
      if (applyBtn) {
        if (selectedPatches.size > 0) {
          applyBtn.textContent = "Apply selected patches (" + selectedPatches.size + ")";
          applyBtn.style.background = "linear-gradient(90deg, #7c3aed, #a78bfa)";
          applyBtn.style.backgroundImage = "";
          applyBtn.style.border = "1px solid rgba(167, 139, 250, 0.5)";
          applyBtn.style.color = "#ffffff";
          applyBtn.style.opacity = "1";
          applyBtn.style.cursor = "pointer";
          applyBtn.style.boxShadow = "0 0 20px rgba(124, 58, 237, 0.3)";
          applyBtn.disabled = false;
        } else {
          applyBtn.textContent = "Apply selected patches";
          applyBtn.style.background = "#0f141b";
          applyBtn.style.backgroundImage = "linear-gradient(#0f141b, #0f141b),linear-gradient(90deg, #6c5ce7, #00d4ff)";
          applyBtn.style.border = "1px solid transparent";
          applyBtn.style.color = "var(--accent-2)";
          applyBtn.style.opacity = "0.5";
          applyBtn.style.cursor = "not-allowed";
          applyBtn.style.boxShadow = "0 0 16px rgba(0, 212, 255, 0.08)";
          applyBtn.disabled = true;
        }
      }
      
      // Update "No selectable patches" button in top actions
      const noSelectableBtn = document.getElementById("noSelectablePatchesBtn");
      if (noSelectableBtn) {
        if (selectedPatches.size > 0) {
          noSelectableBtn.textContent = "Selected patches (" + selectedPatches.size + ")";
          noSelectableBtn.style.background = "linear-gradient(90deg, #7c3aed, #a78bfa)";
          noSelectableBtn.style.border = "1px solid rgba(167, 139, 250, 0.5)";
          noSelectableBtn.style.color = "#ffffff";
          noSelectableBtn.style.boxShadow = "0 0 20px rgba(124, 58, 237, 0.3)";
        } else {
          noSelectableBtn.textContent = "No selectable patches";
          noSelectableBtn.style.background = "linear-gradient(90deg, rgba(108, 92, 231, 0.22), rgba(0, 212, 255, 0.18))";
          noSelectableBtn.style.border = "1px solid rgba(0, 212, 255, 0.45)";
          noSelectableBtn.style.color = "#ffffff";
          noSelectableBtn.style.boxShadow = "0 0 16px rgba(0, 212, 255, 0.12)";
        }
      }
    }

    // ====== Preview Difference Modal ======
    function escapeHtml(text) {
      var div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }

    window.previewDiff = function(idx) {
      // Sample data for TEST-FAKE
      const data = {
        program: "TEST-FAKE",
        chunk: "whole_file",
        currentFragment: {
          "program_name": "TEST-FAKE",
          "data_model": {
            "records": []
          },
          "io": {
            "files": []
          },
          "control_flow": {
            "entry_point": "MAIN",
            "paragraphs": [
              {
                "name": "MAIN",
                "statements": [
                  {
                    "stype": "DISPLAY",
                    "data": {
                      "items": ["\"No SQL here\""],
                      "upon": null,
                      "line": 10
                    }
                  }
                ]
              }
            ]
          }
        },
        patchedFragment: {
          "program_name": "TEST-FAKE",
          "data_model": {
            "records": []
          },
          "io": {
            "files": []
          },
          "control_flow": {
            "entry_point": "MAIN",
            "paragraphs": [
              {
                "name": "MAIN",
                "statements": [
                  {
                    "stype": "DISPLAY",
                    "data": {
                      "items": ["\"Yes SQL here!\""],
                      "upon": null,
                      "line": 10
                    }
                  }
                ]
              }
            ]
          }
        }
      };
      
      // Function to highlight differences
      function highlightDiff(text, isPatched) {
        if (isPatched) {
          // Highlight the changed line in patched version
          return text.replace(/"items": \[\s*"\\\"Yes SQL here!\\\""\s*\]/g, 
            '<span style="background:rgba(16,185,129,0.2);border-bottom:2px solid #10b981;padding:2px 0;">"items": [\n          "\\"Yes SQL here!\\""\n        ]</span>');
        } else {
          // Highlight the original line in current version
          return text.replace(/"items": \[\s*"\\\"No SQL here\\\""\s*\]/g, 
            '<span style="background:rgba(239,68,68,0.2);border-bottom:2px solid #ef4444;padding:2px 0;">"items": [\n          "\\"No SQL here\\""\n        ]</span>');
        }
      }
      
      const currentJSON = JSON.stringify(data.currentFragment, null, 2);
      const patchedJSON = JSON.stringify(data.patchedFragment, null, 2);
      
      // Check if panel already exists
      const existingPanel = document.getElementById('diffSlidePanel');
      if (existingPanel) {
        existingPanel.remove();
      }
      
      // Add animation keyframes if not already added
      if (!document.getElementById('diffPanelAnimations')) {
        const style = document.createElement('style');
        style.id = 'diffPanelAnimations';
        style.textContent = `
          @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
          }
          .diff-scroll::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }
          .diff-scroll::-webkit-scrollbar-track {
            background: rgba(15, 23, 42, 0.5);
            border-radius: 4px;
          }
          .diff-scroll::-webkit-scrollbar-thumb {
            background: rgba(96, 165, 250, 0.4);
            border-radius: 4px;
          }
          .diff-scroll::-webkit-scrollbar-thumb:hover {
            background: rgba(96, 165, 250, 0.6);
          }
        `;
        document.head.appendChild(style);
      }
      
      // Create slide-in panel
      const panel = document.createElement('div');
      panel.id = 'diffSlidePanel';
      panel.style.cssText = `
        position: fixed;
        top: 0;
        right: 0;
        width: 85%;
        max-width: 1400px;
        height: 100vh;
        background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
        border-left: 1px solid rgba(96, 165, 250, 0.3);
        box-shadow: -10px 0 40px rgba(0, 0, 0, 0.5), 0 0 60px rgba(96, 165, 250, 0.15);
        z-index: 10000;
        display: flex;
        flex-direction: column;
        animation: slideInRight 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
      `;
      
      // Header
      panel.innerHTML = `
        <div style="padding:24px 32px;border-bottom:1px solid rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:space-between;background:rgba(15,23,42,0.6);backdrop-filter:blur(10px);">
          <div>
            <h2 style="font-size:22px;font-weight:700;color:#f1f3f8;margin:0 0 6px 0;font-family:'Inter',sans-serif;">IR Patch Preview</h2>
            <p style="font-size:14px;color:#94a3b8;margin:0;font-family:'Inter',sans-serif;">
              <span style="color:#60a5fa;font-weight:600;">${data.program}</span>
              <span style="margin:0 8px;color:#475569;">•</span>
              <code style="background:rgba(96,165,250,0.1);padding:4px 8px;border-radius:4px;color:#93c5fd;font-size:13px;">${data.chunk}</code>
            </p>
          </div>
          <button onclick="closeDiffPanel()" style="width:40px;height:40px;border-radius:10px;border:1px solid rgba(255,255,255,0.15);background:rgba(20,26,36,0.8);color:#f1f3f8;font-size:22px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.3s ease;font-weight:300;" onmouseover="this.style.background='rgba(239,68,68,0.2)';this.style.borderColor='rgba(239,68,68,0.5)';this.style.color='#fca5a5';" onmouseout="this.style.background='rgba(20,26,36,0.8)';this.style.borderColor='rgba(255,255,255,0.15)';this.style.color='#f1f3f8';">×</button>
        </div>
        <div style="flex:1;display:grid;grid-template-columns:1fr 1fr;gap:1px;background:rgba(255,255,255,0.05);overflow:hidden;">
          <div style="background:#0a0e14;display:flex;flex-direction:column;overflow:hidden;">
            <div style="padding:16px 24px;background:rgba(15,23,42,0.8);border-bottom:1px solid rgba(255,255,255,0.08);flex-shrink:0;">
              <h3 style="font-size:13px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:0.8px;margin:0;font-family:'Inter',sans-serif;">Current IR Fragment</h3>
            </div>
            <div class="diff-scroll" style="flex:1;overflow:auto;padding:24px;font-family:'Courier New',monospace;font-size:13px;line-height:1.7;color:#cbd5e1;">
              <pre style="margin:0;white-space:pre-wrap;word-wrap:break-word;">${highlightDiff(escapeHtml(currentJSON), false)}</pre>
            </div>
          </div>
          <div style="background:#0a0e14;display:flex;flex-direction:column;overflow:hidden;">
            <div style="padding:16px 24px;background:rgba(15,23,42,0.8);border-bottom:1px solid rgba(255,255,255,0.08);flex-shrink:0;">
              <h3 style="font-size:13px;font-weight:600;color:#6ee7b7;text-transform:uppercase;letter-spacing:0.8px;margin:0;font-family:'Inter',sans-serif;">Patched IR Fragment</h3>
            </div>
            <div class="diff-scroll" style="flex:1;overflow:auto;padding:24px;font-family:'Courier New',monospace;font-size:13px;line-height:1.7;color:#cbd5e1;">
              <pre style="margin:0;white-space:pre-wrap;word-wrap:break-word;">${highlightDiff(escapeHtml(patchedJSON), true)}</pre>
            </div>
          </div>
        </div>
        <div style="padding:18px 32px;border-top:1px solid rgba(255,255,255,0.1);background:rgba(15,23,42,0.6);font-size:12px;color:#94a3b8;text-align:center;display:flex;align-items:center;justify-content:center;gap:8px;font-family:'Inter',sans-serif;">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style="opacity:0.6;">
            <path d="M8 1C4.13 1 1 4.13 1 8s3.13 7 7 7 7-3.13 7-7-3.13-7-7-7zm0 13c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm-.5-9h1v5h-1V5zm0 6h1v1h-1v-1z" fill="currentColor"/>
          </svg>
          <span>No material JSON difference detected</span>
        </div>
      `;
      
      // Close on Escape key
      const escapeHandler = (e) => {
        if (e.key === 'Escape') {
          closeDiffPanel();
          document.removeEventListener('keydown', escapeHandler);
        }
      };
      document.addEventListener('keydown', escapeHandler);
      
      document.body.appendChild(panel);
    };

    window.closeDiffPanel = function() {
      const panel = document.getElementById('diffSlidePanel');
      if (panel) {
        panel.style.animation = 'slideOutRight 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)';
        setTimeout(() => panel.remove(), 300);
      }
    };

    // ====== Apply Selected Patches ======
    window.applySelectedPatches = function() {
      if (selectedPatches.size === 0) {
        showToast("Please select patches to apply", "warning");
        return;
      }
      
      const itemCount = selectedPatches.size;
      
      // Show confirmation
      if (!confirm("Apply " + itemCount + " patch(es)? This will update the IR data and re-generate suggestions.")) {
        return;
      }
      
      // Show loading overlay
      showLoadingOverlay("Applying " + itemCount + " patch(es)...");
      
      // Simulate apply operation
      setTimeout(() => {
        hideLoadingOverlay();
        showToast("✓ " + itemCount + " patch(es) applied successfully!", "success");
        
        // Clear selections and uncheck all checkboxes
        selectedPatches.forEach(idx => {
          const checkbox = document.getElementById("patch-" + idx);
          if (checkbox) {
            checkbox.checked = false;
          }
        });
        selectedPatches.clear();
        updateApplyButton();
        
        // Auto-update draft suggestions
        setTimeout(() => {
          showLoadingOverlay("Updating draft suggestions...");
          setTimeout(() => {
            hideLoadingOverlay();
            showToast("✓ Draft updated with new suggestions", "success");
          }, 1500);
        }, 500);
      }, 1000);
    };

    // ====== Toast Notification System ======
    function showToast(message, type = "info") {
      let toastContainer = document.getElementById("toast-container");
      if (!toastContainer) {
        toastContainer = document.createElement("div");
        toastContainer.id = "toast-container";
        toastContainer.style.cssText = "position:fixed;top:20px;right:20px;z-index:50000;display:flex;flex-direction:column;gap:10px;";
        document.body.appendChild(toastContainer);
      }

      const toast = document.createElement("div");
      const bgColor = type === "success" ? "#10b981" : type === "error" ? "#ef4444" : type === "warning" ? "#f59e0b" : "#3b82f6";
      const icon = type === "success" ? "✓" : type === "error" ? "✕" : type === "warning" ? "⚠" : "ℹ";
      
      toast.style.cssText = `
        background:${bgColor};
        color:white;
        padding:12px 20px;
        border-radius:6px;
        box-shadow:0 4px 12px rgba(0,0,0,0.15);
        font-size:14px;
        font-weight:500;
        animation:slideIn 0.3s ease;
        min-width:300px;
        font-family:'Inter',sans-serif;
      `;
      toast.textContent = icon + " " + message;
      toastContainer.appendChild(toast);

      setTimeout(() => {
        toast.style.animation = "slideOut 0.3s ease";
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    }

    // ====== Loading Overlay ======
    function showLoadingOverlay(message = "Processing...") {
      let overlay = document.getElementById("loading-overlay");
      if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "loading-overlay";
        overlay.style.cssText = `
          position:fixed;
          top:0;
          left:0;
          right:0;
          bottom:0;
          background:rgba(15,23,42,0.7);
          backdrop-filter:blur(2px);
          z-index:40000;
          display:flex;
          align-items:center;
          justify-content:center;
          animation:fadeIn 0.2s ease;
        `;
        document.body.appendChild(overlay);
      }
      
      overlay.innerHTML = `
        <div style="background:#1e293b;border:1px solid #334155;border-radius:8px;padding:32px;text-align:center;box-shadow:0 10px 40px rgba(0,0,0,0.3);">
          <div style="width:48px;height:48px;border:3px solid rgba(96,165,250,0.2);border-top-color:#60a5fa;border-radius:50%;animation:spin 0.8s linear infinite;margin:0 auto 16px;"></div>
          <div style="color:#e2e8f0;font-size:16px;font-weight:600;font-family:'Inter',sans-serif;">` + message + `</div>
        </div>
      `;
      overlay.style.display = "flex";
    }

    function hideLoadingOverlay() {
      let overlay = document.getElementById("loading-overlay");
      if (overlay) {
        overlay.style.animation = "fadeOut 0.2s ease";
        setTimeout(() => overlay.style.display = "none", 200);
      }
    }

    // Add toast and overlay animations
    if (!document.getElementById("toast-animations")) {
      const style = document.createElement("style");
      style.id = "toast-animations";
      style.textContent = `
        @keyframes slideIn {
          from { transform: translateX(400px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(400px); opacity: 0; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }

    function toggleEvidenceRow(btn) {
      const row = btn.closest('tr').nextElementSibling;
      if (row && row.classList.contains('evidence-details-row')) {
        if (row.style.display === 'none') {
          row.style.display = 'table-row'; btn.innerText = 'Hide';
          btn.style.background = 'rgba(231,76,60,0.1)'; btn.style.color = '#e74c3c'; btn.style.borderColor = 'rgba(231,76,60,0.3)';
        } else {
          row.style.display = 'none'; btn.innerText = 'View';
          btn.style.background = 'rgba(108,92,231,0.1)'; btn.style.color = '#a29bfe'; btn.style.borderColor = 'rgba(108,92,231,0.3)';
        }
      }
    }
    
    // ====== Initialize Dependency Graph ======
    function initGraphControls() {
      const svg = document.getElementById('depGraphSvg');
      const canvas = document.getElementById('graphContainer');
      if (!svg || !canvas) return;

      let currentZoom = 1;
      const zoomStep = 0.15;
      const minZoom = 0.5;
      const maxZoom = 3;

      const offsetX = 50;
      const offsetY = 50;
      
      const nodes = [
        { id: 'TEST-BMS2', x: 280 + offsetX, y: 100 + offsetY, type: 'program', label: 'TEST-BMS2' },
        { id: 'ACCTINQ2', x: 350 + offsetX, y: 130 + offsetY, type: 'program', label: 'ACCTINQ2' },
        { id: 'ACCTCICS', x: 330 + offsetX, y: 155 + offsetY, type: 'program', label: 'ACCTCICS' },
        { id: 'SSACREDIT', x: 700 + offsetX, y: 130 + offsetY, type: 'program', label: 'SSACREDIT' },
        { id: 'DISCOUNT', x: 720 + offsetX, y: 155 + offsetY, type: 'program', label: 'DISCOUNT' },
        { id: 'SSALIBRARY', x: 695 + offsetX, y: 100 + offsetY, type: 'program', label: 'SSALIBRARY' },
        { id: 'EMPLOYEES', x: 210 + offsetX, y: 255 + offsetY, type: 'program', label: 'EMPLOYEES' },
        { id: 'JCL-EXTFILE', x: 500 + offsetX, y: 220 + offsetY, type: 'jcl', label: 'JCL-EXTFILE' },
        { id: 'PROG-ORDERS-PROCESS', x: 480 + offsetX, y: 245 + offsetY, type: 'program', label: 'PROG-ORDERS-PROCESS' },
        { id: 'EXTFILE', x: 520 + offsetX, y: 245 + offsetY, type: 'jcl', label: 'EXTFILE' },
        { id: 'PROG-ORDERS-ERROR', x: 550 + offsetX, y: 250 + offsetY, type: 'program', label: 'PROG-ORDERS-ERROR' },
        { id: 'PROG-ORDERS-INPUT', x: 630 + offsetX, y: 250 + offsetY, type: 'program', label: 'PROG-ORDERS-INPUT' },
        { id: 'PROG-ORDERS-ORDERS', x: 570 + offsetX, y: 225 + offsetY, type: 'program', label: 'PROG-ORDERS-ORDERS' },
        { id: 'DB-CONNECT-SAMPLE', x: 210 + offsetX, y: 290 + offsetY, type: 'program', label: 'DB-CONNECT-SAMPLE' },
        { id: 'MAINPROG', x: 450 + offsetX, y: 310 + offsetY, type: 'program', label: 'MAINPROG' },
        { id: 'CALCUTIL', x: 630 + offsetX, y: 265 + offsetY, type: 'program', label: 'CALCUTIL' },
        { id: 'CALCSTRUCT', x: 485 + offsetX, y: 340 + offsetY, type: 'copybook', label: 'CALCSTRUCT' },
        { id: 'MASTFILE', x: 450 + offsetX, y: 310 + offsetY, type: 'copybook', label: 'MASTFILE' },
        { id: 'ORDVAL', x: 490 + offsetX, y: 305 + offsetY, type: 'program', label: 'ORDVAL' },
        { id: 'ORDINV', x: 530 + offsetX, y: 305 + offsetY, type: 'program', label: 'ORDINV' },
        { id: 'INVENTORY', x: 555 + offsetX, y: 310 + offsetY, type: 'program', label: 'INVENTORY' },
        { id: 'CUSTOMER', x: 580 + offsetX, y: 500 + offsetY, type: 'program', label: 'CUSTOMER' },
        { id: 'ORDER_STATUS', x: 550 + offsetX, y: 330 + offsetY, type: 'program', label: 'ORDER_STATUS' },
        { id: 'STUORDERS', x: 525 + offsetX, y: 340 + offsetY, type: 'copybook', label: 'STUORDERS' },
        { id: 'COBOL-CNTL', x: 850 + offsetX, y: 270 + offsetY, type: 'program', label: 'COBOL-CNTL' },
        { id: 'DAILY-DISCOUNTS', x: 830 + offsetX, y: 380 + offsetY, type: 'program', label: 'DAILY-DISCOUNTS' },
        { id: 'DISCOUNT-FINAL', x: 810 + offsetX, y: 400 + offsetY, type: 'program', label: 'DISCOUNT-FINAL' },
        { id: 'DAILY_SALES', x: 780 + offsetX, y: 410 + offsetY, type: 'program', label: 'DAILY_SALES' },
        { id: 'CUSTOMER_MASTER', x: 830 + offsetX, y: 425 + offsetY, type: 'program', label: 'CUSTOMER_MASTER' },
        { id: 'POSTING-SAMPLE', x: 450 + offsetX, y: 485 + offsetY, type: 'program', label: 'POSTING-SAMPLE' },
        { id: 'MAINPROG2', x: 440 + offsetX, y: 515 + offsetY, type: 'program', label: 'MAINPROG2' },
        { id: 'CALCUTIL2', x: 470 + offsetX, y: 505 + offsetY, type: 'program', label: 'CALCUTIL2' },
        { id: 'CALCUTIL-TEST-COBOL', x: 500 + offsetX, y: 505 + offsetY, type: 'program', label: 'CALCUTIL-TEST-COBOL' },
        { id: 'TEST-VARS', x: 250 + offsetX, y: 565 + offsetY, type: 'program', label: 'TEST-VARS' },
        { id: 'STUDENT-PROCESS', x: 310 + offsetX, y: 545 + offsetY, type: 'program', label: 'STUDENT-PROCESS' },
        { id: 'DATELOGIC', x: 395 + offsetX, y: 605 + offsetY, type: 'program', label: 'DATELOGIC' },
        { id: 'DATEDATA', x: 420 + offsetX, y: 625 + offsetY, type: 'program', label: 'DATEDATA' },
        { id: 'DUAL', x: 575 + offsetX, y: 605 + offsetY, type: 'program', label: 'DUAL' },
        { id: 'TEST-SPLIT', x: 575 + offsetX, y: 575 + offsetY, type: 'program', label: 'TEST-SPLIT' },
        { id: 'SALES-PROCESS1', x: 660 + offsetX, y: 605 + offsetY, type: 'program', label: 'SALES-PROCESS1' },
        { id: 'PHARMA01', x: 775 + offsetX, y: 510 + offsetY, type: 'program', label: 'PHARMA01' },
        { id: 'PHARMA', x: 765 + offsetX, y: 622 + offsetY, type: 'program', label: 'PHARMA' },
        { id: 'TEST-COMMENTS', x: 740 + offsetX, y: 642 + offsetY, type: 'program', label: 'TEST-COMMENTS' },
        { id: 'ACCTMAP', x: 375 + offsetX, y: 110 + offsetY, type: 'copybook', label: 'ACCTMAP' },
        { id: 'EXTMAP', x: 685 + offsetX, y: 165 + offsetY, type: 'copybook', label: 'EXTMAP' },
        { id: 'INPUT-REC', x: 300 + offsetX, y: 455 + offsetY, type: 'copybook', label: 'INPUT-REC' }
      ];

      const links = [
        { source: 'TEST-BMS2', target: 'ACCTMAP' },
        { source: 'ACCTINQ2', target: 'ACCTMAP' },
        { source: 'ACCTINQ2', target: 'ACCTCICS' },
        { source: 'SSACREDIT', target: 'EXTMAP' },
        { source: 'DISCOUNT', target: 'EXTMAP' },
        { source: 'SSALIBRARY', target: 'SSACREDIT' },
        { source: 'SSALIBRARY', target: 'DISCOUNT' },
        { source: 'EMPLOYEES', target: 'DB-CONNECT-SAMPLE' },
        { source: 'EMPLOYEES', target: 'TEST-VARS' },
        { source: 'JCL-EXTFILE', target: 'PROG-ORDERS-ORDERS' },
        { source: 'JCL-EXTFILE', target: 'EXTFILE' },
        { source: 'PROG-ORDERS-PROCESS', target: 'PROG-ORDERS-INPUT' },
        { source: 'PROG-ORDERS-PROCESS', target: 'PROG-ORDERS-ERROR' },
        { source: 'PROG-ORDERS-PROCESS', target: 'PROG-ORDERS-ORDERS' },
        { source: 'PROG-ORDERS-PROCESS', target: 'CALCUTIL' },
        { source: 'PROG-ORDERS-ERROR', target: 'CALCUTIL' },
        { source: 'MAINPROG', target: 'JCL-EXTFILE' },
        { source: 'MAINPROG', target: 'CALCUTIL' },
        { source: 'MAINPROG', target: 'CALCSTRUCT' },
        { source: 'MAINPROG', target: 'MASTFILE' },
        { source: 'MAINPROG', target: 'ORDVAL' },
        { source: 'CALCUTIL', target: 'CALCSTRUCT' },
        { source: 'ORDINV', target: 'INVENTORY' },
        { source: 'ORDINV', target: 'ORDER_STATUS' },
        { source: 'ORDVAL', target: 'CUSTOMER' },
        { source: 'MASTFILE', target: 'ORDVAL' },
        { source: 'MASTFILE', target: 'ORDINV' },
        { source: 'STUORDERS', target: 'ORDER_STATUS' },
        { source: 'CALCSTRUCT', target: 'ORDINV' },
        { source: 'COBOL-CNTL', target: 'PHARMA01' },
        { source: 'COBOL-CNTL', target: 'DAILY-DISCOUNTS' },
        { source: 'PHARMA01', target: 'PHARMA' },
        { source: 'DISCOUNT-FINAL', target: 'DAILY_SALES' },
        { source: 'DISCOUNT-FINAL', target: 'CUSTOMER_MASTER' },
        { source: 'DISCOUNT-FINAL', target: 'DAILY-DISCOUNTS' },
        { source: 'DAILY-DISCOUNTS', target: 'DAILY_SALES' },
        { source: 'CUSTOMER_MASTER', target: 'DAILY_SALES' },
        { source: 'POSTING-SAMPLE', target: 'MAINPROG2' },
        { source: 'POSTING-SAMPLE', target: 'CALCUTIL2' },
        { source: 'CALCUTIL2', target: 'CALCUTIL-TEST-COBOL' },
        { source: 'MAINPROG2', target: 'CALCUTIL2' },
        { source: 'TEST-VARS', target: 'STUDENT-PROCESS' },
        { source: 'STUDENT-PROCESS', target: 'INPUT-REC' },
        { source: 'INPUT-REC', target: 'DATELOGIC' },
        { source: 'DATELOGIC', target: 'DATEDATA' },
        { source: 'DATEDATA', target: 'DUAL' },
        { source: 'DUAL', target: 'TEST-SPLIT' },
        { source: 'TEST-SPLIT', target: 'SALES-PROCESS1' },
        { source: 'SALES-PROCESS1', target: 'PHARMA' },
        { source: 'SALES-PROCESS1', target: 'TEST-COMMENTS' },
        { source: 'PHARMA', target: 'TEST-COMMENTS' }
      ];

      const linkBaseColor = 'rgba(239, 68, 68, 0.5)';
      const linkDimColor = 'rgba(239, 68, 68, 0.18)';
      const linkActiveColor = 'rgba(239, 68, 68, 0.95)';
      const linkBaseWidth = '2';
      const linkActiveWidth = '2.5';
      let selectedNode = null;

      const adjacency = new Map();
      links.forEach(({ source, target }) => {
        if (!adjacency.has(source)) adjacency.set(source, new Set());
        if (!adjacency.has(target)) adjacency.set(target, new Set());
        adjacency.get(source).add(target);
        adjacency.get(target).add(source);
      });

      function getNodeColor(type) {
        switch(type) {
          case 'program': return '#60a5fa';
          case 'copybook': return '#a78bfa';
          case 'jcl': return '#fbbf24';
          default: return '#64748b';
        }
      }

      function getReachableNodes(startId) {
        const visited = new Set([startId]);
        const queue = [startId];
        while (queue.length) {
          const current = queue.shift();
          const neighbors = adjacency.get(current);
          if (!neighbors) continue;
          neighbors.forEach(next => {
            if (!visited.has(next)) {
              visited.add(next);
              queue.push(next);
            }
          });
        }
        return visited;
      }

      function renderGraph() {
        svg.innerHTML = '';
        
        links.forEach(link => {
          const sourceNode = nodes.find(n => n.id === link.source);
          const targetNode = nodes.find(n => n.id === link.target);
          if (sourceNode && targetNode) {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('class', 'dep-link');
            line.setAttribute('data-source', link.source);
            line.setAttribute('data-target', link.target);
            line.setAttribute('x1', sourceNode.x);
            line.setAttribute('y1', sourceNode.y);
            line.setAttribute('x2', targetNode.x);
            line.setAttribute('y2', targetNode.y);
            line.setAttribute('stroke', linkBaseColor);
            line.setAttribute('stroke-width', linkBaseWidth);
            line.setAttribute('opacity', '1');
            svg.appendChild(line);
          }
        });

        function highlightConnections(nodeId) {
          const allNodes = svg.querySelectorAll('.dep-node');
          const allLinks = svg.querySelectorAll('.dep-link');
          const reachableNodes = getReachableNodes(nodeId);

          allNodes.forEach(n => {
            n.style.opacity = reachableNodes.has(n.getAttribute('data-node-id')) ? '1' : '0.2';
          });

          allLinks.forEach(l => {
            const source = l.getAttribute('data-source');
            const target = l.getAttribute('data-target');
            const isConnected = reachableNodes.has(source) && reachableNodes.has(target);
            l.style.stroke = isConnected ? linkActiveColor : linkDimColor;
            l.style.strokeWidth = isConnected ? linkActiveWidth : '1.5';
            l.style.opacity = isConnected ? '1' : '0.25';
          });
        }

        function resetHighlight() {
          const allNodes = svg.querySelectorAll('.dep-node');
          const allLinks = svg.querySelectorAll('.dep-link');
          allNodes.forEach(n => {
            n.style.opacity = '1';
          });
          allLinks.forEach(l => {
            l.style.stroke = linkBaseColor;
            l.style.strokeWidth = linkBaseWidth;
            l.style.opacity = '1';
          });
          selectedNode = null;
        }

        nodes.forEach(node => {
          const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
          g.setAttribute('class', 'dep-node');
          g.setAttribute('data-node-id', node.id);
          g.setAttribute('transform', `translate(${node.x}, ${node.y})`);

          const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          circle.setAttribute('r', '6');
          circle.setAttribute('fill', getNodeColor(node.type));
          circle.setAttribute('stroke', 'rgba(255, 255, 255, 0.8)');
          circle.setAttribute('stroke-width', '1.5');

          const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          text.setAttribute('x', '10');
          text.setAttribute('y', '3');
          text.setAttribute('font-size', '10');
          text.setAttribute('fill', '#1f2937');
          text.textContent = node.label;

          g.appendChild(circle);
          g.appendChild(text);
          svg.appendChild(g);

          g.addEventListener('click', (e) => {
            e.stopPropagation();
            if (selectedNode === node.id) {
              resetHighlight();
            } else {
              selectedNode = node.id;
              highlightConnections(node.id);
            }
          });
        });

        svg.addEventListener('click', () => {
          resetHighlight();
        });
      }

      renderGraph();

      document.getElementById('zoomInBtn').addEventListener('click', () => {
        if (currentZoom < maxZoom) {
          currentZoom += zoomStep;
          svg.style.transform = `scale(${currentZoom})`;
        }
      });

      document.getElementById('zoomOutBtn').addEventListener('click', () => {
        if (currentZoom > minZoom) {
          currentZoom -= zoomStep;
          svg.style.transform = `scale(${currentZoom})`;
        }
      });

      document.getElementById('scrollUpBtn').addEventListener('click', () => {
        canvas.scrollBy({ top: -150, behavior: 'smooth' });
      });

      document.getElementById('scrollDownBtn').addEventListener('click', () => {
        canvas.scrollBy({ top: 150, behavior: 'smooth' });
      });

      document.getElementById('resetBtn').addEventListener('click', () => {
        currentZoom = 1;
        svg.style.transform = 'scale(1)';
        canvas.scrollTop = 0;
        canvas.scrollLeft = 0;
      });
    }

syncSidebarActive(window.EQUIVALIC_INITIAL_PAGE);
activateProjectDNAMode();
