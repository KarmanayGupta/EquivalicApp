/* ============================================================
   Project Summary page logic
   Source: ChangedAnalysisEngine (2).html
   Contains this page's bootstrap, renderers, handlers, and data only.
============================================================ */
window.EQUIVALIC_INITIAL_PAGE = window.EQUIVALIC_INITIAL_PAGE || 'Project Summary';

/* ============================================================
   Page bootstrap and shared shell utilities
============================================================ */
const appState = { product: "Product Suite", section: "Overview", page: "Project Summary", view: "Overview" };
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


function activateProjectSummaryMode(instant) {
      const leftHTML = `
        <div id="repositorySummaryContent" style="overflow-y: auto; flex: 1; min-height: 0; padding-right: 8px;">
          <div class="sub-nav active" style="margin-bottom: 24px; cursor: default; pointer-events: none;">REPOSITORY SUMMARY</div>


          <p style="color: var(--text-muted); line-height: 1.7; margin-bottom: 24px; font-size: 14px; margin-top: 16px;">This COBOL codebase encompasses a mix of interactive CLI utilities, batch processing programs, and CICS online transaction applications.</p>
          <p style="color: var(--text-muted); line-height: 1.7; margin-bottom: 24px; font-size: 14px;">The primary focus areas include student grading systems, sales and banking transactions, order validation and inventory management, and database operations using embedded SQL with DB2.</p>
          <p style="color: var(--text-muted); line-height: 1.7; margin-bottom: 24px; font-size: 14px;">Main themes include batch reporting and processing, interactive calculation utilities, CICS transaction handling, and database connectivity with embedded SQL.</p>
          <p style="color: var(--text-muted); line-height: 1.7; margin-bottom: 24px; font-size: 14px;">Programs like STUGRDSYS, STUDENT-PROCESS, and SALES-PROCESS handle standalone batch tasks, while MAINPROG interacts with CLI users and delegates to calculator subprograms like CALCUTIL.</p>
          <p style="color: var(--text-muted); line-height: 1.7; margin-bottom: 24px; font-size: 14px;">ACCTINQ manages online CICS account inquiries, and ORDINV, ORDVAL, and DISCOUNT-FINAL integrate batch file processing with SQL database validations and updates.</p>
          <p style="color: var(--text-muted); line-height: 1.7; margin-bottom: 24px; font-size: 14px;">Several programs embody modernization challenges such as conversion of embedded SQL to Spring JDBC/JPA, refactoring GO TO statements to structured control flow, and mapping COBOL-specific data constructs (e.g., OCCURS, level-88 conditions, packed decimals) to modern language equivalents.</p>
        </div>
      `;

      const displayHTML = renderProjectSummary();
      activateMode('Project Summary', 'Project Summary', leftHTML, displayHTML, null, instant);
    }


    

function renderProjectSummary() {
      return `
      <div style="display:flex;flex-direction:column;height:100%;overflow:hidden;">
        <!-- Fixed Header -->
        <div style="border-bottom: 1px solid var(--border); padding: 0 16px 12px; margin-bottom: 0; flex-shrink: 0;">
          <h2 style="font-size: 24px; font-weight: 700; color: #fff;">Project Summary</h2>
        </div>
        
        <!-- Scrollable Content -->
        <div class="scroll-container" style="flex: 1; overflow-y: auto; overflow-x: hidden; display: flex; flex-direction: column; gap: 24px; padding: 20px 16px 120px 16px;">

        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px;">
          <div class="stat-card" style="padding: 24px; border-left: 4px solid #00d4ff; background: var(--panel-bg); text-align: center;">
            <div style="font-size: 32px; font-weight: 800; color: #fff; margin-bottom: 8px;">1</div>
            <div style="font-size: 11px; color: var(--text-muted); text-transform: uppercase; font-weight: 600; letter-spacing: 1px;">Total Programs</div>
          </div>
          <div class="stat-card" style="padding: 24px; border-left: 4px solid #2ecc71; background: var(--panel-bg); text-align: center;">
            <div style="font-size: 32px; font-weight: 800; color: #fff; margin-bottom: 8px;">0</div>
            <div style="font-size: 11px; color: var(--text-muted); text-transform: uppercase; font-weight: 600; letter-spacing: 1px;">SQL Statements</div>
          </div>
          <div class="stat-card" style="padding: 24px; border-left: 4px solid #f39c12; background: var(--panel-bg); text-align: center;">
            <div style="font-size: 32px; font-weight: 800; color: #fff; margin-bottom: 8px;">0</div>
            <div style="font-size: 11px; color: var(--text-muted); text-transform: uppercase; font-weight: 600; letter-spacing: 1px;">Tables Accessed</div>
          </div>
          <div class="stat-card" style="padding: 24px; border-left: 4px solid #9b59b6; background: var(--panel-bg); text-align: center;">
            <div style="font-size: 32px; font-weight: 800; color: #fff; margin-bottom: 8px;">0</div>
            <div style="font-size: 11px; color: var(--text-muted); text-transform: uppercase; font-weight: 600; letter-spacing: 1px;">DB2 Programs</div>
          </div>
        </div>


        <!-- Classification Breakdown -->
        <h3 style="text-align: center; font-size: 18px; margin-top: 16px;">Classification Breakdown</h3>
        <div class="chart-wrapper dark" style="margin-bottom: 0; padding: 20px;">
          
          <div style="display: flex; flex-direction: column; gap: 16px;">
            <!-- Execution Environment -->
            <div style="border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 10px;">
              <div style="font-size: 14px; font-weight: 600; margin-bottom: 8px;">Execution Environment</div>
              <div style="display: flex; flex-direction: column; gap: 6px;">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <span style="background: rgba(108, 92, 231, 0.15); color: #a29bfe; padding: 4px 12px; border-radius: 16px; font-size: 12px; font-weight: 600;">Batch</span>
                  <span style="font-size: 13px; color: var(--text-muted);">21 program(s)</span>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                  <span style="background: rgba(108, 92, 231, 0.15); color: #a29bfe; padding: 4px 12px; border-radius: 16px; font-size: 12px; font-weight: 600;">CICS</span>
                  <span style="font-size: 13px; color: var(--text-muted);">1 program(s)</span>
                </div>
              </div>
            </div>
            
            <!-- Data Access -->
            <div style="border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 10px;">
              <div style="font-size: 14px; font-weight: 600; margin-bottom: 8px;">Data Access</div>
              <div style="display: flex; flex-direction: column; gap: 6px;">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <span style="background: rgba(46, 204, 113, 0.15); color: #2ecc71; padding: 4px 12px; border-radius: 16px; font-size: 12px; font-weight: 600;">VSAM</span>
                  <span style="font-size: 13px; color: var(--text-muted);">1 program(s)</span>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                  <span style="background: rgba(46, 204, 113, 0.15); color: #2ecc71; padding: 4px 12px; border-radius: 16px; font-size: 12px; font-weight: 600;">DB2</span>
                  <span style="font-size: 13px; color: var(--text-muted);">8 program(s)</span>
                </div>
              </div>
            </div>

            <!-- Functional Role -->
            <div style="border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 10px;">
              <div style="font-size: 14px; font-weight: 600; margin-bottom: 8px;">Functional Role</div>
              <div style="display: flex; flex-direction: column; gap: 6px;">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <span style="background: rgba(243, 156, 18, 0.15); color: #f39c12; padding: 4px 12px; border-radius: 16px; font-size: 12px; font-weight: 600;">Subprograms</span>
                  <span style="font-size: 13px; color: var(--text-muted);">3 program(s)</span>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                  <span style="background: rgba(243, 156, 18, 0.15); color: #f39c12; padding: 4px 12px; border-radius: 16px; font-size: 12px; font-weight: 600;">Main Programs</span>
                  <span style="font-size: 13px; color: var(--text-muted);">19 program(s)</span>
                </div>
              </div>
            </div>

            <!-- Programming Model -->
            <div style="border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 10px;">
              <div style="font-size: 14px; font-weight: 600; margin-bottom: 8px;">Programming Model</div>
              <div style="display: flex; flex-direction: column; gap: 6px;">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <span style="background: rgba(243, 156, 18, 0.15); color: #f39c12; padding: 4px 12px; border-radius: 16px; font-size: 12px; font-weight: 600;">Structured COBOL</span>
                  <span style="font-size: 13px; color: var(--text-muted);">17 program(s)</span>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                  <span style="background: rgba(243, 156, 18, 0.15); color: #f39c12; padding: 4px 12px; border-radius: 16px; font-size: 12px; font-weight: 600;">Legacy/Unstructured COBOL</span>
                  <span style="font-size: 13px; color: var(--text-muted);">5 program(s)</span>
                </div>
              </div>
            </div>

            <!-- Hybrid Types -->
            <div style="padding-bottom: 4px;">
              <div style="font-size: 14px; font-weight: 600; margin-bottom: 8px;">Hybrid Types</div>
              <div style="display: flex; flex-direction: column; gap: 6px;">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <span style="background: rgba(168, 85, 247, 0.15); color: #c4b5fd; padding: 4px 12px; border-radius: 16px; font-size: 12px; font-weight: 600;">CICS-VSAM</span>
                  <span style="font-size: 13px; color: var(--text-muted);">1 program(s)</span>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                  <span style="background: rgba(168, 85, 247, 0.15); color: #c4b5fd; padding: 4px 12px; border-radius: 16px; font-size: 12px; font-weight: 600;">Batch-DB2</span>
                  <span style="font-size: 13px; color: var(--text-muted);">8 program(s)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- SQL Analysis -->
        <h3 style="text-align: center; font-size: 18px; margin-top: 16px;">SQL Analysis</h3>
        <div class="chart-wrapper dark" style="margin-bottom: 0; padding: 20px;">
          
          <div style="display: flex; flex-direction: column; gap: 16px;">
            <!-- DML -->
            <div style="border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 10px;">
              <div style="font-size: 14px; font-weight: 600; margin-bottom: 8px; color: var(--text-muted);">DML</div>
              <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                <span style="background: rgba(100, 116, 139, 0.15); color: #cbd5e1; padding: 6px 14px; border-radius: 16px; font-size: 12px; font-weight: 600;">INSERT (1)</span>
                <span style="background: rgba(100, 116, 139, 0.15); color: #cbd5e1; padding: 6px 14px; border-radius: 16px; font-size: 12px; font-weight: 600;">DELETE (1)</span>
              </div>
            </div>
            
            <!-- TCL -->
            <div style="border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 10px;">
              <div style="font-size: 14px; font-weight: 600; margin-bottom: 8px; color: var(--text-muted);">TCL</div>
              <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                <span style="background: rgba(100, 116, 139, 0.15); color: #cbd5e1; padding: 6px 14px; border-radius: 16px; font-size: 12px; font-weight: 600;">COMMIT (1)</span>
                <span style="background: rgba(100, 116, 139, 0.15); color: #cbd5e1; padding: 6px 14px; border-radius: 16px; font-size: 12px; font-weight: 600;">ROLLBACK (1)</span>
              </div>
            </div>

            <!-- Connection -->
            <div style="border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 10px;">
              <div style="font-size: 14px; font-weight: 600; margin-bottom: 8px; color: var(--text-muted);">Connection</div>
              <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                <span style="background: rgba(100, 116, 139, 0.15); color: #cbd5e1; padding: 6px 14px; border-radius: 16px; font-size: 12px; font-weight: 600;">CONNECT (1)</span>
                <span style="background: rgba(100, 116, 139, 0.15); color: #cbd5e1; padding: 6px 14px; border-radius: 16px; font-size: 12px; font-weight: 600;">DISCONNECT (1)</span>
              </div>
            </div>

            <!-- Cursor -->
            <div style="border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 10px;">
              <div style="font-size: 14px; font-weight: 600; margin-bottom: 8px; color: var(--text-muted);">Cursor</div>
              <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                <span style="background: rgba(100, 116, 139, 0.15); color: #cbd5e1; padding: 6px 14px; border-radius: 16px; font-size: 12px; font-weight: 600;">DECLARE (1)</span>
                <span style="background: rgba(100, 116, 139, 0.15); color: #cbd5e1; padding: 6px 14px; border-radius: 16px; font-size: 12px; font-weight: 600;">OPEN (1)</span>
                <span style="background: rgba(100, 116, 139, 0.15); color: #cbd5e1; padding: 6px 14px; border-radius: 16px; font-size: 12px; font-weight: 600;">FETCH (1)</span>
                <span style="background: rgba(100, 116, 139, 0.15); color: #cbd5e1; padding: 6px 14px; border-radius: 16px; font-size: 12px; font-weight: 600;">CLOSE (1)</span>
              </div>
            </div>

            <!-- Tables Accessed -->
            <div style="padding-bottom: 4px;">
              <div style="font-size: 14px; font-weight: 600; margin-bottom: 8px; color: var(--text-muted);">Tables Accessed</div>
              <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                <span style="background: rgba(56, 189, 248, 0.15); color: #7dd3fc; padding: 6px 14px; border-radius: 16px; font-size: 12px; font-weight: 600;">CUSTOMER_MASTER</span>
                <span style="background: rgba(56, 189, 248, 0.15); color: #7dd3fc; padding: 6px 14px; border-radius: 16px; font-size: 12px; font-weight: 600;">DAILY_DISCOUNTS</span>
                <span style="background: rgba(56, 189, 248, 0.15); color: #7dd3fc; padding: 6px 14px; border-radius: 16px; font-size: 12px; font-weight: 600;">DAILY_SALES</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Table Usage -->
        <h3 style="text-align: center; font-size: 18px; margin-top: 16px;">Table Usage</h3>
        <div class="chart-wrapper dark" style="margin-bottom: 0; padding: 26px; border-radius: 22px; background: linear-gradient(180deg, rgba(20, 26, 36, 0.75), rgba(12, 15, 20, 0.55)); border: 1px solid rgba(255, 255, 255, 0.06); box-shadow: 0 14px 44px rgba(0,0,0,0.35);">
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <!-- Table Card 1 -->
            <div style="background: linear-gradient(180deg, rgba(15, 20, 28, 0.78), rgba(10, 13, 18, 0.55)); border: 1px solid rgba(255, 255, 255, 0.07); border-left: 4px solid #00d4ff; border-radius: 16px; padding: 18px 18px; box-shadow: inset 0 0 0 1px rgba(0, 212, 255, 0.08); transition: all 0.3s ease; cursor: pointer;">
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e5e7eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0; opacity: 0.9;">
                  <polygon points="12 2 22 12 12 22 2 12"></polygon>
                  <path d="M10 9a2 2 0 0 1 4 0c0 1.6-2 1.9-2 4"></path>
                  <circle cx="12" cy="17" r="1" fill="#e5e7eb" stroke="none"></circle>
                </svg>
                <span style="font-size: 15px; font-weight: 700; color: #66d9ff; letter-spacing: 0.3px;">CUSTOMER_MASTER</span>
              </div>
              <div style="display: flex; flex-direction: column; gap: 4px; font-size: 12px; color: var(--text-muted);">
                <div style="display: flex; align-items: center; gap: 6px;">
                  <span style="font-weight: 500; color: #94a3b8;">Used by:</span>
                  <span style="color: #cbd5e1;">DISCOUNT-FINAL, STUDENT-PROCESS</span>
                </div>
                <div style="display: flex; align-items: center; gap: 6px;">
                  <span style="font-weight: 500; color: #94a3b8;">Operations:</span>
                  <span style="color: #cbd5e1;">READ, UPDATE</span>
                </div>
              </div>
            </div>

            <!-- Table Card 2 -->
            <div style="background: linear-gradient(180deg, rgba(15, 20, 28, 0.78), rgba(10, 13, 18, 0.55)); border: 1px solid rgba(255, 255, 255, 0.07); border-left: 4px solid #00d4ff; border-radius: 16px; padding: 18px 18px; box-shadow: inset 0 0 0 1px rgba(0, 212, 255, 0.08); transition: all 0.3s ease; cursor: pointer;">
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e5e7eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0; opacity: 0.9;">
                  <polygon points="12 2 22 12 12 22 2 12"></polygon>
                  <path d="M10 9a2 2 0 0 1 4 0c0 1.6-2 1.9-2 4"></path>
                  <circle cx="12" cy="17" r="1" fill="#e5e7eb" stroke="none"></circle>
                </svg>
                <span style="font-size: 15px; font-weight: 700; color: #66d9ff; letter-spacing: 0.3px;">DAILY_DISCOUNTS</span>
              </div>
              <div style="display: flex; flex-direction: column; gap: 4px; font-size: 12px; color: var(--text-muted);">
                <div style="display: flex; align-items: center; gap: 6px;">
                  <span style="font-weight: 500; color: #94a3b8;">Used by:</span>
                  <span style="color: #cbd5e1;">DISCOUNT-FINAL</span>
                </div>
                <div style="display: flex; align-items: center; gap: 6px;">
                  <span style="font-weight: 500; color: #94a3b8;">Operations:</span>
                  <span style="color: #cbd5e1;">READ, WRITE</span>
                </div>
              </div>
            </div>

            <!-- Table Card 3 -->
            <div style="background: linear-gradient(180deg, rgba(15, 20, 28, 0.78), rgba(10, 13, 18, 0.55)); border: 1px solid rgba(255, 255, 255, 0.07); border-left: 4px solid #00d4ff; border-radius: 16px; padding: 18px 18px; box-shadow: inset 0 0 0 1px rgba(0, 212, 255, 0.08); transition: all 0.3s ease; cursor: pointer;">
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e5e7eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink: 0; opacity: 0.9;">
                  <polygon points="12 2 22 12 12 22 2 12"></polygon>
                  <path d="M10 9a2 2 0 0 1 4 0c0 1.6-2 1.9-2 4"></path>
                  <circle cx="12" cy="17" r="1" fill="#e5e7eb" stroke="none"></circle>
                </svg>
                <span style="font-size: 15px; font-weight: 700; color: #66d9ff; letter-spacing: 0.3px;">DAILY_SALES</span>
              </div>
              <div style="display: flex; flex-direction: column; gap: 4px; font-size: 12px; color: var(--text-muted);">
                <div style="display: flex; align-items: center; gap: 6px;">
                  <span style="font-weight: 500; color: #94a3b8;">Used by:</span>
                  <span style="color: #cbd5e1;">SALES-PROCESS</span>
                </div>
                <div style="display: flex; align-items: center; gap: 6px;">
                  <span style="font-weight: 500; color: #94a3b8;">Operations:</span>
                  <span style="color: #cbd5e1;">READ, INSERT, UPDATE</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty / Placeholder Files (below Table Usage) -->
        <h3 style="text-align: center; font-size: 18px; margin-top: 16px; margin-bottom: 10px;">Empty / Placeholder Files</h3>
        <div style="padding: 20px; border-radius: 18px; background: radial-gradient(circle at 20% 20%, rgba(245, 158, 11, 0.10), transparent 50%), linear-gradient(180deg, rgba(20, 26, 36, 0.70), rgba(12, 15, 20, 0.55)); border: 1px solid rgba(245, 158, 11, 0.30); box-shadow: 0 14px 44px rgba(0,0,0,0.35);">
          <div style="font-size: 13px; color: rgba(229, 231, 235, 0.65); margin-bottom: 14px;">15 file(s) were discovered but contain no source code.</div>

          <div style="font-size: 12px; font-weight: 700; letter-spacing: 0.8px; color: rgba(148, 163, 184, 0.85); margin-bottom: 10px;">PROGRAMS</div>

          <div style="display: flex; flex-wrap: wrap; gap: 10px;">
            <span style="padding: 8px 14px; border-radius: 999px; background: rgba(245, 158, 11, 0.10); border: 1px solid rgba(245, 158, 11, 0.35); color: #fbbf24; font-size: 12px; font-weight: 700;">ACCTFILE</span>
            <span style="padding: 8px 14px; border-radius: 999px; background: rgba(245, 158, 11, 0.10); border: 1px solid rgba(245, 158, 11, 0.35); color: #fbbf24; font-size: 12px; font-weight: 700;">_DS_Store</span>
            <span style="padding: 8px 14px; border-radius: 999px; background: rgba(245, 158, 11, 0.10); border: 1px solid rgba(245, 158, 11, 0.35); color: #fbbf24; font-size: 12px; font-weight: 700;">ACCOUNTS</span>
            <span style="padding: 8px 14px; border-radius: 999px; background: rgba(245, 158, 11, 0.10); border: 1px solid rgba(245, 158, 11, 0.35); color: #fbbf24; font-size: 12px; font-weight: 700;">README-GNUCOBOL</span>
            <span style="padding: 8px 14px; border-radius: 999px; background: rgba(245, 158, 11, 0.10); border: 1px solid rgba(245, 158, 11, 0.35); color: #fbbf24; font-size: 12px; font-weight: 700;">README</span>
            <span style="padding: 8px 14px; border-radius: 999px; background: rgba(245, 158, 11, 0.10); border: 1px solid rgba(245, 158, 11, 0.35); color: #fbbf24; font-size: 12px; font-weight: 700;">run-demo</span>
            <span style="padding: 8px 14px; border-radius: 999px; background: rgba(245, 158, 11, 0.10); border: 1px solid rgba(245, 158, 11, 0.35); color: #fbbf24; font-size: 12px; font-weight: 700;">MAINPROG</span>
            <span style="padding: 8px 14px; border-radius: 999px; background: rgba(245, 158, 11, 0.10); border: 1px solid rgba(245, 158, 11, 0.35); color: #fbbf24; font-size: 12px; font-weight: 700;">test_banking</span>
            <span style="padding: 8px 14px; border-radius: 999px; background: rgba(245, 158, 11, 0.10); border: 1px solid rgba(245, 158, 11, 0.35); color: #fbbf24; font-size: 12px; font-weight: 700;">cobol_app</span>
            <span style="padding: 8px 14px; border-radius: 999px; background: rgba(245, 158, 11, 0.10); border: 1px solid rgba(245, 158, 11, 0.35); color: #fbbf24; font-size: 12px; font-weight: 700;">Dockerfile</span>
            <span style="padding: 8px 14px; border-radius: 999px; background: rgba(245, 158, 11, 0.10); border: 1px solid rgba(245, 158, 11, 0.35); color: #fbbf24; font-size: 12px; font-weight: 700;">entrypoint</span>
            <span style="padding: 8px 14px; border-radius: 999px; background: rgba(245, 158, 11, 0.10); border: 1px solid rgba(245, 158, 11, 0.35); color: #fbbf24; font-size: 12px; font-weight: 700;">Makefile</span>
            <span style="padding: 8px 14px; border-radius: 999px; background: rgba(245, 158, 11, 0.10); border: 1px solid rgba(245, 158, 11, 0.35); color: #fbbf24; font-size: 12px; font-weight: 700;">odbc_interface</span>
            <span style="padding: 8px 14px; border-radius: 999px; background: rgba(245, 158, 11, 0.10); border: 1px solid rgba(245, 158, 11, 0.35); color: #fbbf24; font-size: 12px; font-weight: 700;">odbc</span>
            <span style="padding: 8px 14px; border-radius: 999px; background: rgba(245, 158, 11, 0.10); border: 1px solid rgba(245, 158, 11, 0.35); color: #fbbf24; font-size: 12px; font-weight: 700;">odbcinst</span>
          </div>
        </div>

        <!-- Recommendations & Insights -->
        <h3 style="text-align: center; font-size: 18px; margin-top: 16px;">Recommendations & Insights</h3>
        <div class="chart-wrapper dark" style="margin-bottom: 0; padding: 24px;">
          <div style="display: flex; flex-direction: column; gap: 16px;">
            
            <div style="padding: 16px; background: linear-gradient(135deg, rgba(108, 92, 231, 0.1), rgba(0, 212, 255, 0.05)); border-left: 4px solid #6c5ce7; border-radius: 8px;">
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                <span style="font-size: 20px;">🎯</span>
                <strong style="color: var(--accent-2); font-size: 14px;">Modernization Priority</strong>
              </div>
              <p style="font-size: 13px; color: var(--text-muted); line-height: 1.6; margin: 0;">
                Consider migrating batch file processing to a microservices architecture with REST APIs. This will improve scalability and enable real-time data processing capabilities.
              </p>
            </div>

            <div style="padding: 16px; background: linear-gradient(135deg, rgba(46, 204, 113, 0.1), rgba(46, 204, 113, 0.05)); border-left: 4px solid #2ecc71; border-radius: 8px;">
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                <span style="font-size: 20px;">⚡</span>
                <strong style="color: #2ecc71; font-size: 14px;">Performance Optimization</strong>
              </div>
              <p style="font-size: 13px; color: var(--text-muted); line-height: 1.6; margin: 0;">
                Implement connection pooling for database operations and add caching layer for frequently accessed employee records. Expected performance improvement: 40-60%.
              </p>
            </div>

            <div style="padding: 16px; background: linear-gradient(135deg, rgba(243, 156, 18, 0.1), rgba(243, 156, 18, 0.05)); border-left: 4px solid #f39c12; border-radius: 8px;">
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                <span style="font-size: 20px;">🔒</span>
                <strong style="color: #f39c12; font-size: 14px;">Security Enhancement</strong>
              </div>
              <p style="font-size: 13px; color: var(--text-muted); line-height: 1.6; margin: 0;">
                Add encryption for sensitive employee data fields (SSN, salary information) and implement role-based access control (RBAC) for database operations.
              </p>
            </div>

            <div style="padding: 16px; background: linear-gradient(135deg, rgba(155, 89, 182, 0.1), rgba(155, 89, 182, 0.05)); border-left: 4px solid #9b59b6; border-radius: 8px;">
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                <span style="font-size: 20px;">📊</span>
                <strong style="color: #9b59b6; font-size: 14px;">Code Quality</strong>
              </div>
              <p style="font-size: 13px; color: var(--text-muted); line-height: 1.6; margin: 0;">
                Refactor EMPPROC module to reduce cyclomatic complexity (currently 42). Break down into smaller, testable functions following single responsibility principle.
              </p>
            </div>

            <div style="padding: 16px; background: linear-gradient(135deg, rgba(255, 107, 107, 0.1), rgba(255, 107, 107, 0.05)); border-left: 4px solid #ff6b6b; border-radius: 8px;">
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                <span style="font-size: 20px;">⚠️</span>
                <strong style="color: #ff6b6b; font-size: 14px;">Technical Debt</strong>
              </div>
              <p style="font-size: 13px; color: var(--text-muted); line-height: 1.6; margin: 0;">
                Replace hardcoded file paths and database connection strings with environment variables. Add comprehensive error handling and logging framework for production monitoring.
              </p>
            </div>

            <div style="padding: 16px; background: linear-gradient(135deg, rgba(46, 204, 113, 0.1), rgba(46, 204, 113, 0.05)); border-left: 4px solid #2ecc71; border-radius: 8px;">
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                <span style="font-size: 20px;">⚡</span>
                <strong style="color: #2ecc71; font-size: 14px;">Performance Optimization</strong>
              </div>
              <p style="font-size: 13px; color: var(--text-muted); line-height: 1.6; margin: 0;">
                Implement connection pooling for database operations and add caching layer for frequently accessed employee records. Expected performance improvement: 40-60%.
              </p>
            </div>

            <div style="padding: 16px; background: linear-gradient(135deg, rgba(243, 156, 18, 0.1), rgba(243, 156, 18, 0.05)); border-left: 4px solid #f39c12; border-radius: 8px;">
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                <span style="font-size: 20px;">🔒</span>
                <strong style="color: #f39c12; font-size: 14px;">Security Enhancement</strong>
              </div>
              <p style="font-size: 13px; color: var(--text-muted); line-height: 1.6; margin: 0;">
                Add encryption for sensitive employee data fields (SSN, salary information) and implement role-based access control (RBAC) for database operations.
              </p>
            </div>

            <div style="padding: 16px; background: linear-gradient(135deg, rgba(155, 89, 182, 0.1), rgba(155, 89, 182, 0.05)); border-left: 4px solid #9b59b6; border-radius: 8px;">
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                <span style="font-size: 20px;">📊</span>
                <strong style="color: #9b59b6; font-size: 14px;">Code Quality</strong>
              </div>
              <p style="font-size: 13px; color: var(--text-muted); line-height: 1.6; margin: 0;">
                Refactor EMPPROC module to reduce cyclomatic complexity (currently 42). Break down into smaller, testable functions following single responsibility principle.
              </p>
            </div>

            <div style="padding: 16px; background: linear-gradient(135deg, rgba(255, 107, 107, 0.1), rgba(255, 107, 107, 0.05)); border-left: 4px solid #ff6b6b; border-radius: 8px;">
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                <span style="font-size: 20px;">⚠️</span>
                <strong style="color: #ff6b6b; font-size: 14px;">Technical Debt</strong>
              </div>
              <p style="font-size: 13px; color: var(--text-muted); line-height: 1.6; margin: 0;">
                Replace hardcoded file paths and database connection strings with environment variables. Add comprehensive error handling and logging framework for production monitoring.
              </p>
            </div>

          </div>
        </div>

        </div>
      </div>
      `;
    }


    

syncSidebarActive(window.EQUIVALIC_INITIAL_PAGE);
activateProjectSummaryMode(true);
