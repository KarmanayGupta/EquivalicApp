/* ============================================================
   Parser Improvement page logic
   Contains this page's bootstrap, renderers, handlers, and data only.
============================================================ */
window.EQUIVALIC_INITIAL_PAGE = window.EQUIVALIC_INITIAL_PAGE || 'Parser Improvement';

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

    function activateParserImprovementMode() {
      leftPanel.style.display = 'none';
      if (document.querySelector('.workspace')) {
        document.querySelector('.workspace').style.gridTemplateColumns = '1fr';
      }
      const leftHTML = `<div class="sub-nav active">Parser Improvement Engine</div>`;
      const irRows = irChunkData.map(row => {
        const statusHtml = row.status === "fail" ? `<span class="ir-wb-status-fail">&#x2715; Not matching</span>` : `<span class="ir-wb-status-pass">&#x2713; Matching</span>`;
        return `<tr>
          <td><div class="ir-wb-chunk-name">${row.chunk}</div><div class="ir-wb-chunk-sub">${row.sub}</div></td>
          <td><div><span class="ir-wb-prog-label">EXPECTED</span><span class="ir-wb-prog-value">${row.expected}</span></div><div><span class="ir-wb-prog-label">IR NAME</span><span class="ir-wb-prog-value">${row.irName}</span></div></td>
          <td>${statusHtml}</td>
          <td style="color:#94a3b8;">${row.score}</td>
          <td style="color:#94a3b8;font-size:11px;">${row.reason}</td>
          <td style="color:#94a3b8;font-size:11px;">${row.suggestion}</td>
        </tr>`;
      }).join('');

      const displayHTML = `<div class="scroll-container" style="display:flex;flex-direction:column;gap:20px;padding:0 4px 32px;">
        <div style="background:linear-gradient(135deg,#1e293b,#0f172a);border-radius:12px;padding:22px;display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:14px;border:1px solid rgba(255,255,255,0.05);">
          <div>
            <h2 style="font-size:22px;font-weight:700;color:#fff;margin:0 0 6px 0;">Parser Improvement: <span style="color:#00d4ff;">cobol_files</span></h2>
            <div style="font-size:13px;color:var(--text-muted);">Governed parser learning, file-level evidence, proposed fixes, and promotion tests</div>
          </div>
          <div style="font-size:11px;color:var(--text-muted);font-family:monospace;">Generated: ${new Date().toLocaleString()}</div>
        </div>

        <div class="chart-wrapper dark" style="margin-bottom:0;padding:22px;border-top:2px solid #6c5ce7;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:12px;">
            <div><h3 style="font-size:17px;font-weight:700;color:#fff;margin-bottom:4px;">Parser Improvement Engine</h3><div style="font-size:12px;color:var(--text-muted);">Shows parser failures, IR fallback gaps, proposed safe fixes, and the tests required before any parser rule is promoted.</div></div>
            <div style="display:flex;gap:10px;"><button class="graph-btn">Refresh parser gaps</button><button class="graph-btn">Analysis Health</button></div>
          </div>
          <div style="background:rgba(108,92,231,0.1);border-left:3px solid #6c5ce7;border-radius:0 8px 8px 0;padding:10px 14px;font-size:12px;color:#a29bfe;margin-bottom:20px;">
            &#x2139;&#xFE0F; This is a governed learning view: it can draft candidates and evidence, but it does not auto mutate grammar or silently change IR.
          </div>
<!-- Top Metric Cards Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 16px; margin-bottom: 24px;">
        
        <div class="stat-card" style="padding: 16px; border-left: 3px solid #f39c12; background: rgba(0,0,0,0.2);">
          <div style="font-size: 11px; font-weight: 600; color: var(--text-muted); margin-bottom: 8px; text-transform: uppercase;">Status</div>
          <span style="background: rgba(243, 156, 18, 0.1); color: #f39c12; border: 1px solid rgba(243, 156, 18, 0.2); padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: 600; display: inline-block;">Candidates pending</span>
        </div>

        <div class="stat-card" style="padding: 16px; border-left: 3px solid #00d4ff; background: rgba(0,0,0,0.2);">
          <div style="font-size: 11px; font-weight: 600; color: var(--text-muted); margin-bottom: 8px; text-transform: uppercase;">Gaps</div>
          <div style="font-size: 24px; font-weight: 700; color: #fff;">1</div>
        </div>

        <div class="stat-card" style="padding: 16px; border-left: 3px solid #00d4ff; background: rgba(0,0,0,0.2);">
          <div style="font-size: 11px; font-weight: 600; color: var(--text-muted); margin-bottom: 8px; text-transform: uppercase;">Fix proposals</div>
          <div style="font-size: 24px; font-weight: 700; color: #fff;">1</div>
        </div>

        <div class="stat-card" style="padding: 16px; border-left: 3px solid #e74c3c; background: rgba(0,0,0,0.2);">
          <div style="font-size: 11px; font-weight: 600; color: var(--text-muted); margin-bottom: 8px; text-transform: uppercase;">Gap families</div>
          <div style="font-size: 13px; font-weight: 600; color: #e74c3c;">antlr_grammar_gap=1</div>
        </div>

        <div class="stat-card" style="padding: 16px; border-left: 3px solid #2ecc71; background: rgba(0,0,0,0.2);">
          <div style="font-size: 11px; font-weight: 600; color: var(--text-muted); margin-bottom: 8px; text-transform: uppercase;">Fix families</div>
          <div style="font-size: 13px; font-weight: 600; color: #2ecc71; word-break: break-all;">grammarCandidate</div>
        </div>

        <div class="stat-card" style="padding: 16px; border-left: 3px solid #e74c3c; background: rgba(0,0,0,0.2);">
          <div style="font-size: 11px; font-weight: 600; color: var(--text-muted); margin-bottom: 8px; text-transform: uppercase;">Parser failures</div>
          <div style="font-size: 13px; font-weight: 600; color: #e74c3c;">unsupported=1</div>
        </div>

      </div>

      <!-- Tag labels row -->
      <div style="display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 8px; align-items: center;">
        <span style="font-size: 12px; font-weight: 600; color: var(--text-muted); text-transform: uppercase;">Flags:</span>
        <span style="background: rgba(255,255,255,0.05); color: #cbd5e1; border: 1px solid rgba(255,255,255,0.1); padding: 4px 12px; border-radius: 4px; font-size: 11px; font-weight: 600;">LLM apply: false</span>
        <span style="background: rgba(255,255,255,0.05); color: #cbd5e1; border: 1px solid rgba(255,255,255,0.1); padding: 4px 12px; border-radius: 4px; font-size: 11px; font-weight: 600;">Auto grammar mutation: false</span>
        <span style="background: rgba(243, 156, 18, 0.1); color: #f39c12; border: 1px solid rgba(243, 156, 18, 0.2); padding: 4px 12px; border-radius: 4px; font-size: 11px; font-weight: 600;">Human promotion required</span>
        <span style="background: rgba(231, 76, 60, 0.1); color: #e74c3c; border: 1px solid rgba(231, 76, 60, 0.2); padding: 4px 12px; border-radius: 4px; font-size: 11px; font-weight: 600;">Regression pack required</span>
      </div>
      <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 24px; font-style: italic; opacity: 0.7;">
        * Regression pack pass means the workbench is healthy. Fixture parse fixed means this exact parser gap is resolved.
      </div>
          <h4 style="font-size:14px;font-weight:600;color:#fff;margin-bottom:10px;border-bottom:1px solid rgba(255,255,255,0.05);padding-bottom:7px;">Per-file parser and IR improvement candidates</h4>
          <style>
        .parser-table th:not(:last-child),
        .parser-table td:not(:last-child) {
          border-right: 1px solid rgba(255,255,255,0.05);
        }
      </style>
      <div class="custom-scrollbar" style="overflow-x: auto; background: rgba(0,0,0,0.15); border-radius: 8px; border: 1px solid rgba(255,255,255,0.05);">
        <table class="parser-table" style="width: 100%; border-collapse: collapse; font-size: 13px; text-align: left;">
          <thead style="background: rgba(255,255,255,0.02); color: var(--text-muted); font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px;">
            <tr>
              <th style="padding: 16px;">Program / File</th>
              <th style="padding: 16px;">Gap</th>
              <th style="padding: 16px;">Owner</th>
              <th style="padding: 16px;">Proposed Fix</th>
              <th style="padding: 16px;">Fix Status</th>
              <th style="padding: 16px;">Tests After Fix</th>
              <th style="padding: 16px; text-align: right;">Evidence</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-top: 1px solid rgba(255,255,255,0.05); transition: background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.02)'" onmouseout="this.style.background='transparent'">
              <td style="padding: 20px 16px; vertical-align: top;">
                <div style="font-weight: 700; color: #fff; margin-bottom: 6px; font-size: 14px;">temp</div>
                <div style="color: var(--text-muted); font-size: 11px; font-family: monospace; word-break: break-all; max-width: 180px; line-height: 1.4;">...java/output/a9c96054-a75e-4c35-9931-fa08057a508e/sources/cobol_files/temp.cbl</div>
              </td>
              <td style="padding: 20px 16px; vertical-align: top; color: var(--text-muted); line-height: 1.6;">
                <span style="color: #e74c3c; font-weight: 600;">antlr_grammar_gap</span><br>
                line 35<br>
                cluster: 1
              </td>
              <td style="padding: 20px 16px; vertical-align: top;">
                <span style="background: rgba(108, 92, 231, 0.1); color: #a29bfe; padding: 4px 8px; border-radius: 4px; font-size: 11px;">antlr_proleap_parser</span>
              </td>
              <td style="padding: 20px 16px; vertical-align: top; min-width: 240px;">
                <div style="color: #2ecc71; font-weight: 600; margin-bottom: 12px; font-size: 12px;">grammar_or_preprocessor_candidate</div>
                
                <div style="margin-bottom: 16px;">
                  <span style="background: rgba(243, 156, 18, 0.1); color: #f39c12; border: 1px solid rgba(243, 156, 18, 0.3); padding: 2px 8px; border-radius: 4px; font-size: 10px; font-weight: 700; text-transform: uppercase;">next: Fix parser grammar</span>
                  <div style="color: var(--text-muted); font-size: 11px; margin-top: 6px; line-height: 1.4;">Parser/preprocessor quality is the blocker for downstream analysis.</div>
                </div>

                <div>
                  <span style="background: rgba(231, 76, 60, 0.1); color: #e74c3c; border: 1px solid rgba(231, 76, 60, 0.3); padding: 2px 8px; border-radius: 4px; font-size: 10px; font-weight: 700; text-transform: uppercase;">route: parser_first_required</span>
                  <div style="color: var(--text-muted); font-size: 11px; margin-top: 6px; line-height: 1.4;">Parser/preprocessor quality must improve before downstream IR fixes are safe.</div>
                </div>
              </td>
              <td style="padding: 20px 16px; vertical-align: top;">
                <span style="background: rgba(52, 152, 219, 0.1); color: #3498db; border: 1px solid rgba(52, 152, 219, 0.3); padding: 4px 12px; border-radius: 12px; font-size: 11px; font-weight: 600;">Candidate</span>
              </td>
              <td style="padding: 20px 16px; vertical-align: top;">
                <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 16px;">
                  <span style="background: rgba(52, 152, 219, 0.1); color: #3498db; border: 1px solid rgba(52, 152, 219, 0.2); padding: 2px 8px; border-radius: 4px; font-size: 10px;">fixture: needed</span>
                  <span style="background: rgba(243, 156, 18, 0.1); color: #f39c12; border: 1px solid rgba(243, 156, 18, 0.2); padding: 2px 8px; border-radius: 4px; font-size: 10px;">fixture parse: not_run</span>
                  <span style="background: rgba(243, 156, 18, 0.1); color: #f39c12; border: 1px solid rgba(243, 156, 18, 0.2); padding: 2px 8px; border-radius: 4px; font-size: 10px;">pack: not_run</span>
                  <span style="background: rgba(243, 156, 18, 0.1); color: #f39c12; border: 1px solid rgba(243, 156, 18, 0.2); padding: 2px 8px; border-radius: 4px; font-size: 10px;">semantic: not_run</span>
                  <span style="background: rgba(243, 156, 18, 0.1); color: #f39c12; border: 1px solid rgba(243, 156, 18, 0.2); padding: 2px 8px; border-radius: 4px; font-size: 10px;">overall: not_run</span>
                </div>
                
                <div style="font-size: 11px; color: var(--text-muted); font-family: monospace; margin-bottom: 4px;">antlr_grammar_gap_0b1b31...</div>
                <div style="font-size: 11px; color: #a29bfe; font-weight: 600; margin-bottom: 16px;">Promotion checks: 7</div>

                <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 8px;">
                  <button class="graph-btn" style="background: linear-gradient(135deg, #6c5ce7, #4a3f9e); color: #fff; border: none; border-radius: 4px; padding: 4px 10px; font-size: 11px; cursor: pointer;">Create Fixture</button>
                  <button class="graph-btn" style="background: rgba(255,255,255,0.05); color: #fff; border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; padding: 4px 10px; font-size: 11px; cursor: pointer;">Run Regression</button>
                  <button class="graph-btn" style="background: rgba(255,255,255,0.05); color: #fff; border: 1px solid rgba(255,255,255,0.1); border-radius: 4px; padding: 4px 10px; font-size: 11px; cursor: pointer;">Create Fix Attempt</button>
                </div>
                <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 8px;">
                  <button style="background: none; color: var(--text-muted); border: 1px dashed rgba(255,255,255,0.1); border-radius: 4px; padding: 4px 10px; font-size: 11px; cursor: not-allowed; opacity: 0.4;">Validate Attempt</button>
                  <button style="background: none; color: var(--text-muted); border: 1px dashed rgba(255,255,255,0.1); border-radius: 4px; padding: 4px 10px; font-size: 11px; cursor: not-allowed; opacity: 0.4;">Rollback Attempt</button>
                  <button style="background: none; color: var(--text-muted); border: 1px dashed rgba(255,255,255,0.1); border-radius: 4px; padding: 4px 10px; font-size: 11px; cursor: not-allowed; opacity: 0.4;">Promote Attempt</button>
                </div>
                <div>
                  <button style="background: none; color: var(--text-muted); border: 1px dashed rgba(255,255,255,0.1); border-radius: 4px; padding: 4px 10px; font-size: 11px; cursor: not-allowed; opacity: 0.4;">Mark Verified</button>
                </div>
              </td>
              <td style="padding: 20px 16px; vertical-align: top; text-align: right;">
                <button class="graph-btn" onclick="toggleEvidenceRow(this)" style="background: rgba(108, 92, 231, 0.1); color: #a29bfe; border: 1px solid rgba(108, 92, 231, 0.3); border-radius: 4px; padding: 6px 16px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s;">View</button>
              </td>
            </tr>
            <tr class="evidence-details-row" style="display: none; background: rgba(0,0,0,0.3); border-top: 1px solid rgba(255,255,255,0.02);">
              <td colspan="7" style="padding: 24px;">
                <div style="font-size: 13px; color: #cbd5e1; line-height: 1.6; margin-bottom: 16px;">
                  <div><strong style="color: #fff;">Reason:</strong> The parser grammar did not accept one or more COBOL dialect constructs.</div>
                  <div><strong style="color: #fff;">Artifact:</strong> <span style="font-family: monospace; color: var(--text-muted);">/workspace/Code_converter_analysis/c2j_analysis_engine/backend_engine_cbl_java/output/a9c96054-a75e-4c35-9931-fa08057a508e/analysis/analysis/batch_temp/ast/parser_failure_report.json</span></div>
                  <div><strong style="color: #fff;">Allowed actions:</strong> <span style="color: #2ecc71;">create_fixture, draft_rule, run_regression_pack, request_human_promotion</span></div>
                  <div><strong style="color: #fff;">Forbidden actions:</strong> <span style="color: #e74c3c;">auto_modify_core_grammar, auto_enable_rule_globally, silently_mutate_ir</span></div>
                  <div><strong style="color: #fff;">Required tests:</strong> minimal COBOL fixture reproduces the gap; expected AST metadata/node assertion; expected IR semantic assertion; golden repo remains certified; accepted grammar-gap fixtures remain passing; parser runtime does not regress beyond threshold; ANTLR ambiguity/regression check</div>
                  <div><strong style="color: #fff;">History:</strong> <span style="font-family: monospace; font-size: 11px;">regression_run@2026-05-23T19:25:38 -> fixture_created@2026-05-23T19:25:38 -> fixture_created@2026-05-23T19:25:55 -> regression_run@2026-05-23T19:26:02 -> fixture_created@2026-05-23T19:26:28</span></div>
                </div>
                <div style="background: #0f172a; padding: 16px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05); font-family: monospace; font-size: 12px; color: #e2e8f0; white-space: pre; overflow-x: auto;" class="hide-scrollbar">
           DISPLAY "ID: " EMP-ID " Name: " EMP-NAME
       END-READ
       END-PERFORM.
       CLOSE EMP-FILE.
       STOP RUN.
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
        </div>
      </div>`;
      activateMode('Parser Improvement', 'Parser Improvement', leftHTML, displayHTML);
    }


syncSidebarActive(window.EQUIVALIC_INITIAL_PAGE);
activateParserImprovementMode();
