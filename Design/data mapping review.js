/* ============================================================
   Data Mapping Review page logic
   Source: ChangedAnalysisEngine (2).html
   Contains this page's bootstrap, renderers, handlers, and data only.
============================================================ */
window.EQUIVALIC_INITIAL_PAGE = window.EQUIVALIC_INITIAL_PAGE || 'Data Mapping Review';

/* ============================================================
   Page bootstrap and shared shell utilities
============================================================ */
const appState = { product: "Product Suite", section: "Analysis Engine", page: "Data Mapping Review", view: "Overview" };
function renderHeader() {
  const el = document.getElementById("appBreadcrumb");
  if (el) el.innerHTML = `${appState.product} > ${appState.section} > ${appState.page}`;
}
function setState(newState) { Object.assign(appState, newState); renderHeader(); }

let charts = [];
function destroyCharts() { charts.forEach(c => c.destroy()); charts = []; }
let isWikiMode = false, isConvertMode = false;
const displayPanel = document.querySelector(".display-panel");

function restoreDashboard() {
  window.location.href = "../Overview/project%20summary.html";
}

function activateMode(sectionName, pageName, displayHTML, afterFn, instant) {
  isWikiMode = false;
  isConvertMode = false;
  setState({ section: "Analysis Engine", page: pageName, view: "Overview" });
  if (instant) {
    displayPanel.innerHTML = displayHTML;
    document.getElementById("backToDashboard")?.addEventListener("click", restoreDashboard);
    if (afterFn) afterFn();
    return;
  }
  displayPanel.classList.add("fade-transition", "fade-out");
  setTimeout(() => {
    displayPanel.innerHTML = displayHTML;
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


function activateComingSoon(title) {
      const displayHTML = `<div class="scroll-container" style="display:flex;align-items:center;justify-content:center;height:100%;">
        <div style="text-align:center;padding:60px 40px;">
          <h2 style="font-size:28px;font-weight:700;background:linear-gradient(135deg,#6c5ce7,#00d4ff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-bottom:20px;">${title}</h2>
          <div style="display:inline-block;background:rgba(108,92,231,0.1);border:1px solid rgba(108,92,231,0.3);border-radius:16px;padding:28px 44px;box-shadow:0 8px 24px rgba(108,92,231,0.15);">
            <p style="font-size:18px;color:var(--accent-2);margin:0;font-weight:600;">&#x1F680; This page will be activated soon</p>
            <p style="font-size:14px;color:var(--text-muted);margin-top:10px;margin-bottom:0;">Stay tuned for exciting updates!</p>
          </div>
        </div>
      </div>`;
      activateMode(title, title, displayHTML);
    }

    

syncSidebarActive(window.EQUIVALIC_INITIAL_PAGE);

// Render Data Mapping Review page
function renderDataMappingReview() {
  return `
    <div style="display:flex;flex-direction:column;height:100%;overflow:hidden;">
      <!-- Fixed Header with Title -->
      <div style="border-bottom: 1px solid var(--border); padding: 32px 48px 16px 48px; margin-bottom: 0; flex-shrink: 0;">
        <div>
          <h2 style="font-size: 28px; font-weight: 700; color: #fff; margin: 0 0 8px 0; letter-spacing: -0.5px;">Data Mapping Review</h2>
          <p style="font-size: 14px; color: #8f9bad; margin: 0; font-weight: 500;">Target Java data-model design checkpoint</p>
        </div>
      </div>
      
      <!-- Content Area -->
      <div style="padding: 20px 48px 40px 48px; display: flex; flex-direction: column; gap: 20px; flex: 1; overflow: hidden; min-height: 0;">

        <!-- Stats Cards -->
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; flex-shrink: 0;">
          <div style="padding: 20px; border-left: 4px solid #00d4ff; background: var(--panel-bg); border-radius: 8px;">
            <div style="font-size: 11px; color: var(--text-muted); text-transform: uppercase; font-weight: 600; letter-spacing: 1px; margin-bottom: 8px;">TOTAL FIELDS</div>
            <div style="font-size: 32px; font-weight: 800; color: #fff;">403</div>
          </div>
          <div style="padding: 20px; border-left: 4px solid #ff4d4f; background: var(--panel-bg); border-radius: 8px;">
            <div style="font-size: 11px; color: var(--text-muted); text-transform: uppercase; font-weight: 600; letter-spacing: 1px; margin-bottom: 8px;">NEEDS REVIEW</div>
            <div style="font-size: 32px; font-weight: 800; color: #fff;">0</div>
          </div>
          <div style="padding: 20px; border-left: 4px solid #ff4d4f; background: var(--panel-bg); border-radius: 8px;">
            <div style="font-size: 11px; color: var(--text-muted); text-transform: uppercase; font-weight: 600; letter-spacing: 1px; margin-bottom: 8px;">HIGH RISK</div>
            <div style="font-size: 32px; font-weight: 800; color: #fff;">0</div>
          </div>
          <div style="padding: 20px; border-left: 4px solid #2ecc71; background: var(--panel-bg); border-radius: 8px;">
            <div style="font-size: 11px; color: var(--text-muted); text-transform: uppercase; font-weight: 600; letter-spacing: 1px; margin-bottom: 8px;">COVERAGE</div>
            <div style="font-size: 32px; font-weight: 800; color: #fff;">100.0%</div>
          </div>
        </div>

        <!-- Refresh Button -->
        <div style="display: flex; justify-content: center; align-items: center; gap: 20px; flex-shrink: 0;">
          <div style="flex: 1; height: 1px; background: linear-gradient(to right, transparent, rgba(108, 92, 231, 0.5));"></div>
          <button onclick="refreshDataMapping()" style="padding: 10px 24px; background: rgba(108, 92, 231, 0.15); border: 1px solid rgba(108, 92, 231, 0.3); border-radius: 8px; color: #a29bfe; font-size: 13px; font-weight: 600; cursor: pointer; box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.3);">
            Refresh Mapping
          </button>
          <div style="flex: 1; height: 1px; background: linear-gradient(to left, transparent, rgba(108, 92, 231, 0.5));"></div>
        </div>

        <!-- Filters Section -->
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; padding: 16px; background: var(--panel-bg); border-radius: 8px; border: 1px solid var(--border); flex-shrink: 0;">
          <div>
            <label style="font-size: 12px; color: var(--text-muted); font-weight: 600; margin-bottom: 6px; display: block;">Program</label>
            <input type="text" id="mapping-filter-program" placeholder="ORDCHK" style="width: 100%; padding: 8px 12px; background: var(--panel-bg-light); border: 1px solid var(--border); border-radius: 6px; color: var(--text-primary); font-size: 13px; outline: none;" />
          </div>
          <div>
            <label style="font-size: 12px; color: var(--text-muted); font-weight: 600; margin-bottom: 6px; display: block;">Risk</label>
            <select id="mapping-filter-risk" style="width: 100%; padding: 8px 12px; background: var(--panel-bg-light); border: 1px solid var(--border); border-radius: 6px; color: var(--text-primary); font-size: 13px; cursor: pointer;">
              <option value="">All</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div>
            <label style="font-size: 12px; color: var(--text-muted); font-weight: 600; margin-bottom: 6px; display: block;">Review</label>
            <select id="mapping-filter-review" style="width: 100%; padding: 8px 12px; background: var(--panel-bg-light); border: 1px solid var(--border); border-radius: 6px; color: var(--text-primary); font-size: 13px; cursor: pointer;">
              <option value="">All</option>
              <option value="needs_review">Needs review</option>
              <option value="auto_accepted">Auto accepted</option>
            </select>
          </div>
        </div>

        <!-- Data Table with Scroll -->
        <div style="background: var(--panel-bg); border-radius: 8px; border: 1px solid var(--border); overflow: hidden; flex: 1; display: flex; flex-direction: column; min-height: 400px;">
          <div style="overflow-y: scroll; overflow-x: auto; height: 100%; scrollbar-width: thin; scrollbar-color: rgba(108, 92, 231, 0.6) rgba(255, 255, 255, 0.05);">
            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
              <thead style="position: sticky; top: 0; z-index: 10; background: var(--panel-bg);">
                <tr style="background: var(--panel-bg); border-bottom: 2px solid rgba(108, 92, 231, 0.3);">
                  <th style="padding: 14px 16px; text-align: left; font-weight: 700; color: #00d4ff; text-transform: uppercase; font-size: 11px; letter-spacing: 1px;">PROGRAM</th>
                  <th style="padding: 14px 16px; text-align: left; font-weight: 700; color: #00d4ff; text-transform: uppercase; font-size: 11px; letter-spacing: 1px;">FIELD</th>
                  <th style="padding: 14px 16px; text-align: left; font-weight: 700; color: #00d4ff; text-transform: uppercase; font-size: 11px; letter-spacing: 1px;">PIC</th>
                  <th style="padding: 14px 16px; text-align: left; font-weight: 700; color: #00d4ff; text-transform: uppercase; font-size: 11px; letter-spacing: 1px;">USAGE</th>
                  <th style="padding: 14px 16px; text-align: left; font-weight: 700; color: #00d4ff; text-transform: uppercase; font-size: 11px; letter-spacing: 1px;">JAVA TYPE</th>
                  <th style="padding: 14px 16px; text-align: left; font-weight: 700; color: #00d4ff; text-transform: uppercase; font-size: 11px; letter-spacing: 1px;">CONFIDENCE</th>
                  <th style="padding: 14px 16px; text-align: left; font-weight: 700; color: #00d4ff; text-transform: uppercase; font-size: 11px; letter-spacing: 1px;">RISK</th>
                  <th style="padding: 14px 16px; text-align: left; font-weight: 700; color: #00d4ff; text-transform: uppercase; font-size: 11px; letter-spacing: 1px;">REVIEW</th>
                </tr>
              </thead>
              <tbody id="dataMappingTableBody">
                ${generateTableRows()}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  `;
}

function generateTableRows() {
  const data = [
    // ACCTINQ program
    { program: 'ACCTINQ', field: 'WS-FIRST-TIME-FLAG', pic: 'X ( X8 )', usage: 'DISPLAY', javaType: 'String', confidence: 'high', risk: 'low', review: 'auto_assigned' },
    { program: 'ACCTINQ', field: 'WS-RESPONSE', pic: 'X', usage: 'COMP', javaType: 'Integer', confidence: 'high', risk: 'low', review: 'auto_assigned' },
    { program: 'ACCTINQ', field: 'WS-ACCOUNT-NUMBER', pic: 'X ( 18 )', usage: '', javaType: 'BigDecimal', confidence: 'high', risk: 'low', review: 'auto_assigned' },
    { program: 'ACCTINQ', field: 'WS-ERROR-FLAG', pic: 'X ( X1 )', usage: '', javaType: 'String', confidence: 'high', risk: 'low', review: 'auto_assigned' },
    { program: 'ACCTINQ', field: 'WS-VALID-FLAG', pic: 'X ( X1 )', usage: '', javaType: 'String', confidence: 'high', risk: 'low', review: 'auto_assigned' },
    { program: 'ACCTINQ', field: 'ACCT-NUMBER', pic: 'S ( 18 )', usage: '', javaType: 'BigDecimal', confidence: 'high', risk: 'low', review: 'auto_assigned' },
    { program: 'ACCTINQ', field: 'ACCT-NAME', pic: 'X ( 30 )', usage: 'DISPLAY', javaType: 'String', confidence: 'high', risk: 'low', review: 'auto_assigned' },
    { program: 'ACCTINQ', field: 'ACCT-TYPE', pic: 'X ( 15 )', usage: '', javaType: 'String', confidence: 'high', risk: 'low', review: 'auto_assigned' },
    { program: 'ACCTINQ', field: 'ACCT-BALANCE', pic: 'S9 ( 13 ) V99', usage: 'COMP-3', javaType: 'BigDecimal', confidence: 'high', risk: 'medium', review: 'auto_assigned' },
    { program: 'ACCTINQ', field: 'ACCT-STATUS', pic: 'X ( 10 )', usage: 'DISPLAY', javaType: 'String', confidence: 'high', risk: 'low', review: 'auto_assigned' },
    { program: 'ACCTINQ', field: 'WS-BALANCE-DISPLAY', pic: 'ZZZ , ZZZ , ZZZ .99', usage: '', javaType: 'BigDecimal', confidence: 'high', risk: 'low', review: 'auto_assigned' },
    { program: 'ACCTINQ', field: 'ERR-INVALID-INPUT', pic: 'X ( 60 )', usage: 'DISPLAY', javaType: 'String', confidence: 'high', risk: 'low', review: 'auto_assigned' },
    { program: 'ACCTINQ', field: 'ERR-NOT-FOUND', pic: 'X ( 60 )', usage: 'DISPLAY', javaType: 'String', confidence: 'high', risk: 'low', review: 'auto_assigned' },
    { program: 'ACCTINQ', field: 'ERR-NO-INPUT', pic: 'X ( 60 )', usage: 'DISPLAY', javaType: 'String', confidence: 'high', risk: 'low', review: 'auto_assigned' },
    { program: 'ACCTINQ', field: 'ERR-DATABASE', pic: 'X ( 60 )', usage: 'DISPLAY', javaType: 'String', confidence: 'high', risk: 'low', review: 'auto_assigned' },
    { program: 'ACCTINQ', field: 'LITERAL-001', pic: 'X ( 30 )', usage: 'DISPLAY', javaType: 'String', confidence: 'high', risk: 'low', review: 'auto_assigned' },
    { program: 'ACCTINQ', field: 'LITERAL-002', pic: 'X ( 15 )', usage: 'DISPLAY', javaType: 'String', confidence: 'high', risk: 'low', review: 'auto_assigned' },
    { program: 'ACCTINQ', field: 'LITERAL-003', pic: 'X ( 1 )', usage: 'DISPLAY', javaType: 'String', confidence: 'high', risk: 'low', review: 'auto_assigned' },
    { program: 'ACCTINQ', field: 'LITERAL-004', pic: 'X ( 15 )', usage: 'DISPLAY', javaType: 'String', confidence: 'high', risk: 'low', review: 'auto_assigned' },
    { program: 'ACCTINQ', field: 'ACCTNAMEO', pic: 'X ( 30 )', usage: 'DISPLAY', javaType: 'String', confidence: 'high', risk: 'low', review: 'auto_assigned' },
    { program: 'ACCTINQ', field: 'LITERAL-005', pic: 'X ( 15 )', usage: '', javaType: 'String', confidence: 'high', risk: 'low', review: 'auto_assigned' },
    { program: 'ACCTINQ', field: 'ACCTTYPEO', pic: 'X ( 15 )', usage: '', javaType: 'String', confidence: 'high', risk: 'low', review: 'auto_assigned' },
    { program: 'ACCTINQ', field: 'LITERAL-006', pic: 'X ( 15 )', usage: '', javaType: 'String', confidence: 'high', risk: 'low', review: 'auto_assigned' },
    { program: 'ACCTINQ', field: 'BALANCEO', pic: 'X ( 15 )', usage: 'DISPLAY', javaType: 'String', confidence: 'high', risk: 'low', review: 'auto_assigned' },
    { program: 'ACCTINQ', field: 'LITERAL-007', pic: 'X ( 15 )', usage: '', javaType: 'String', confidence: 'high', risk: 'low', review: 'auto_assigned' },
    { program: 'ACCTINQ', field: 'STATUSO', pic: 'X ( 10 )', usage: '', javaType: 'String', confidence: 'high', risk: 'low', review: 'auto_assigned' },
    { program: 'ACCTINQ', field: 'LITERAL-008', pic: 'X ( 60 )', usage: 'DISPLAY', javaType: 'String', confidence: 'high', risk: 'low', review: 'auto_assigned' },
    { program: 'ACCTINQ', field: 'ERRMSGO', pic: 'X ( 60 )', usage: 'DISPLAY', javaType: 'String', confidence: 'high', risk: 'low', review: 'auto_assigned' },
    { program: 'ACCTINQ', field: 'DFHCOMMAREA', pic: 'X ( 01 )', usage: '', javaType: 'String', confidence: 'high', risk: 'low', review: 'auto_assigned' },
    
    // ACCTINQ-SCREEN program
    { program: 'ACCTINQ-SCREEN', field: 'ACCT-KEY', pic: 'S ( 18 )', usage: 'DISPLAY', javaType: 'BigDecimal', confidence: 'high', risk: 'low', review: 'auto_assigned' },
    { program: 'ACCTINQ-SCREEN', field: 'ACCT-NAME', pic: 'X ( 30 )', usage: 'DISPLAY', javaType: 'String', confidence: 'high', risk: 'low', review: 'auto_assigned' },
    { program: 'ACCTINQ-SCREEN', field: 'ACCT-TYPE', pic: 'X ( 15 )', usage: 'DISPLAY', javaType: 'String', confidence: 'high', risk: 'low', review: 'auto_assigned' },
    { program: 'ACCTINQ-SCREEN', field: 'ACCT-BALANCE', pic: 'S9 ( 11 ) V99', usage: 'DISPLAY', javaType: 'BigDecimal', confidence: 'high', risk: 'medium', review: 'auto_assigned' },
    { program: 'ACCTINQ-SCREEN', field: 'ACCT-STATUS', pic: 'X ( 10 )', usage: 'DISPLAY', javaType: 'String', confidence: 'high', risk: 'low', review: 'auto_assigned' },
    { program: 'ACCTINQ-SCREEN', field: 'WS-FILE-STATUS', pic: 'XX', usage: '', javaType: 'String', confidence: 'high', risk: 'low', review: 'auto_assigned' },
    
    // BALQUERY program
    { program: 'BALQUERY', field: 'ACCT-NUMBER', pic: 'S ( 18 )', usage: 'DISPLAY', javaType: 'BigDecimal', confidence: 'high', risk: 'low', review: 'auto_assigned' },
    { program: 'BALQUERY', field: 'ACCT-HOLDER-NAME', pic: 'X ( 30 )', usage: 'DISPLAY', javaType: 'String', confidence: 'high', risk: 'low', review: 'auto_assigned' },
    { program: 'BALQUERY', field: 'ACCT-TYPE', pic: 'X ( 10 )', usage: 'DISPLAY', javaType: 'String', confidence: 'high', risk: 'low', review: 'auto_assigned' },
    { program: 'BALQUERY', field: 'ACCT-BALANCE', pic: 'S ( 9 ) V99', usage: 'DISPLAY', javaType: 'BigDecimal', confidence: 'high', risk: 'medium', review: 'auto_assigned' },
    { program: 'BALQUERY', field: 'ACCT-STATUS', pic: 'X ( 01 )', usage: 'DISPLAY', javaType: 'String', confidence: 'high', risk: 'low', review: 'auto_assigned' },
    { program: 'BALQUERY', field: 'RESP-CODE', pic: 'S ( 02 )', usage: 'DISPLAY', javaType: 'BigDecimal', confidence: 'high', risk: 'low', review: 'auto_assigned' },
    { program: 'BALQUERY', field: 'RESP-MESSAGE', pic: 'X ( 50 )', usage: '', javaType: 'String', confidence: 'high', risk: 'low', review: 'auto_assigned' },
    { program: 'BALQUERY', field: 'RESP-BALANCE', pic: 'S ( 9 ) V99', usage: 'DISPLAY', javaType: 'BigDecimal', confidence: 'high', risk: 'medium', review: 'auto_assigned' },
    { program: 'BALQUERY', field: 'WS-FOUND-FLAG', pic: 'X ( 01 )', usage: '', javaType: 'String', confidence: 'high', risk: 'low', review: 'auto_assigned' },
    
    // BANKING program
    { program: 'BANKING', field: 'TRANS-ERROR', pic: 'X', usage: 'DISPLAY', javaType: 'String', confidence: 'high', risk: 'low', review: 'auto_assigned' },
    { program: 'BANKING', field: 'ZERO-BALANCE', pic: 'S ( 10 ) V99', usage: 'DISPLAY', javaType: 'BigDecimal', confidence: 'high', risk: 'medium', review: 'auto_assigned' },
    
    // CALCUTIL program
    { program: 'CALCUTIL', field: 'WS-TEMP-RESULT', pic: 'S9 ( 15 ) V99', usage: 'COMP-3', javaType: 'BigDecimal', confidence: 'high', risk: 'medium', review: 'auto_assigned' },
    { program: 'CALCUTIL', field: 'WS-OPERATION', pic: 'X ( 10 )', usage: 'DISPLAY', javaType: 'String', confidence: 'high', risk: 'low', review: 'auto_assigned' },
    { program: 'CALCUTIL', field: 'WS-OPERAND-1', pic: 'S9 ( 9 ) V99', usage: 'COMP-3', javaType: 'BigDecimal', confidence: 'high', risk: 'medium', review: 'auto_assigned' },
    { program: 'CALCUTIL', field: 'WS-OPERAND-2', pic: 'S9 ( 9 ) V99', usage: 'COMP-3', javaType: 'BigDecimal', confidence: 'high', risk: 'medium', review: 'auto_assigned' },
    { program: 'CALCUTIL', field: 'WS-RESULT', pic: 'S9 ( 9 ) V99', usage: 'COMP-3', javaType: 'BigDecimal', confidence: 'high', risk: 'medium', review: 'auto_assigned' },
    { program: 'CALCUTIL', field: 'WS-WS-RETURN-CODE', pic: 'S ( 2 )', usage: 'DISPLAY', javaType: 'BigDecimal', confidence: 'high', risk: 'low', review: 'auto_assigned' },
    { program: 'CALCUTIL', field: 'WS-ERROR-MESSAGE', pic: 'X ( 50 )', usage: 'DISPLAY', javaType: 'String', confidence: 'high', risk: 'low', review: 'auto_assigned' }
  ];

  return data.map((row, index) => `
    <tr style="border-bottom: 1px solid rgba(255,255,255,0.05); background: ${index % 2 === 0 ? 'rgba(255,255,255,0.08)' : 'rgba(108, 92, 231, 0.08)'}; transition: background 0.2s ease;" onmouseover="this.style.background='rgba(108, 92, 231, 0.15)'" onmouseout="this.style.background='${index % 2 === 0 ? 'rgba(255,255,255,0.08)' : 'rgba(108, 92, 231, 0.08)'}'">
      <td style="padding: 14px 16px; color: var(--text-primary);">${row.program}</td>
      <td style="padding: 14px 16px; color: var(--text-primary);">${row.field}</td>
      <td style="padding: 14px 16px; color: var(--text-muted); font-family: monospace; font-size: 12px;">${row.pic}</td>
      <td style="padding: 14px 16px; color: var(--text-muted);">${row.usage}</td>
      <td style="padding: 14px 16px; color: var(--text-muted);">${row.javaType}</td>
      <td style="padding: 14px 16px;">
        <span style="padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 600; background: ${row.confidence === 'high' ? 'rgba(46, 204, 113, 0.15)' : 'rgba(243, 156, 18, 0.15)'}; color: ${row.confidence === 'high' ? '#2ecc71' : '#f39c12'};">
          ${row.confidence}
        </span>
      </td>
      <td style="padding: 14px 16px;">
        <span style="padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 600; background: ${row.risk === 'low' ? 'rgba(46, 204, 113, 0.15)' : 'rgba(243, 156, 18, 0.15)'}; color: ${row.risk === 'low' ? '#2ecc71' : '#f39c12'};">
          ${row.risk}
        </span>
      </td>
      <td style="padding: 14px 16px;">
        <span style="padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 600; background: rgba(46, 204, 113, 0.15); color: #2ecc71;">
          ${row.review}
        </span>
      </td>
    </tr>
  `).join('');
}

// Initialize the page
const previewContent = document.querySelector('.display-panel');
if (previewContent) {
  previewContent.innerHTML = renderDataMappingReview();
}


// Refresh mapping function
function refreshDataMapping() {
  showToast('Refreshing data mapping...', 'info');
  setTimeout(() => {
    renderDatatypeMappingRows();
    showToast('Data mapping refreshed successfully', 'success');
  }, 1000);
}

// Filter rows based on user input
function renderDatatypeMappingRows() {
  const body = document.getElementById('dataMappingTableBody');
  if (!body) return;

  const progFilter = (document.getElementById('mapping-filter-program') || {}).value || '';
  const riskFilter = (document.getElementById('mapping-filter-risk') || {}).value || '';
  const reviewFilter = (document.getElementById('mapping-filter-review') || {}).value || '';

  // Get all data
  const allData = getAllMappingData();
  
  // Filter the data
  const filtered = allData.filter(row => {
    const prog = row.program.toUpperCase();
    const risk = row.risk.toLowerCase();
    const review = row.review.toLowerCase().replace(' ', '_');
    
    // Check program filter (text search)
    if (progFilter && !prog.includes(progFilter.trim().toUpperCase())) return false;
    
    // Check risk filter (exact match)
    if (riskFilter && risk !== riskFilter) return false;
    
    // Check review filter (exact match)
    if (reviewFilter && review !== reviewFilter) return false;
    
    return true;
  });

  // If no results, show empty state
  if (filtered.length === 0) {
    body.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 40px; color: var(--text-muted);">No rows match current filters.</td></tr>';
    return;
  }

  // Render filtered rows
  body.innerHTML = filtered.map((row, index) => `
    <tr style="border-bottom: 1px solid rgba(255,255,255,0.05); background: ${index % 2 === 0 ? 'rgba(255,255,255,0.08)' : 'rgba(108, 92, 231, 0.08)'}; transition: background 0.2s ease;" onmouseover="this.style.background='rgba(108, 92, 231, 0.15)'" onmouseout="this.style.background='${index % 2 === 0 ? 'rgba(255,255,255,0.08)' : 'rgba(108, 92, 231, 0.08)'}'">
      <td style="padding: 14px 16px; color: var(--text-primary);">${escapeHtml(row.program)}</td>
      <td style="padding: 14px 16px; color: var(--text-primary);">${escapeHtml(row.field)}</td>
      <td style="padding: 14px 16px; color: var(--text-muted); font-family: monospace; font-size: 12px;">${escapeHtml(row.pic)}</td>
      <td style="padding: 14px 16px; color: var(--text-muted);">${escapeHtml(row.usage)}</td>
      <td style="padding: 14px 16px; color: var(--text-muted);">${escapeHtml(row.javaType)}</td>
      <td style="padding: 14px 16px;">
        <span style="padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 600; background: ${row.confidence === 'high' ? 'rgba(46, 204, 113, 0.15)' : 'rgba(243, 156, 18, 0.15)'}; color: ${row.confidence === 'high' ? '#2ecc71' : '#f39c12'};">
          ${escapeHtml(row.confidence)}
        </span>
      </td>
      <td style="padding: 14px 16px;">
        <span style="padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 600; background: ${row.risk === 'low' ? 'rgba(46, 204, 113, 0.15)' : row.risk === 'medium' ? 'rgba(243, 156, 18, 0.15)' : 'rgba(239, 68, 68, 0.15)'}; color: ${row.risk === 'low' ? '#2ecc71' : row.risk === 'medium' ? '#f39c12' : '#ef4444'};">
          ${escapeHtml(row.risk)}
        </span>
      </td>
      <td style="padding: 14px 16px;">
        <span style="padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 600; background: ${row.review === 'auto_accepted' ? 'rgba(46, 204, 113, 0.15)' : 'rgba(239, 68, 68, 0.15)'}; color: ${row.review === 'auto_accepted' ? '#2ecc71' : '#ef4444'};">
          ${escapeHtml(row.review)}
        </span>
      </td>
    </tr>
  `).join('');
}

// Helper function to escape HTML
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Get all mapping data
function getAllMappingData() {
  return [
    // ACCTINQ program
    { program: 'ACCTINQ', field: 'WS-FIRST-TIME-FLAG', pic: 'X ( X8 )', usage: 'DISPLAY', javaType: 'String', confidence: 'high', risk: 'low', review: 'auto_accepted' },
    { program: 'ACCTINQ', field: 'WS-RESPONSE', pic: 'X', usage: 'COMP', javaType: 'Integer', confidence: 'high', risk: 'low', review: 'auto_accepted' },
    { program: 'ACCTINQ', field: 'WS-ACCOUNT-NUMBER', pic: 'X ( 18 )', usage: '', javaType: 'BigDecimal', confidence: 'high', risk: 'low', review: 'auto_accepted' },
    { program: 'ACCTINQ', field: 'WS-ERROR-FLAG', pic: 'X ( X1 )', usage: '', javaType: 'String', confidence: 'high', risk: 'low', review: 'auto_accepted' },
    { program: 'ACCTINQ', field: 'WS-VALID-FLAG', pic: 'X ( X1 )', usage: '', javaType: 'String', confidence: 'high', risk: 'low', review: 'auto_accepted' },
    { program: 'ACCTINQ', field: 'ACCT-NUMBER', pic: 'S ( 18 )', usage: '', javaType: 'BigDecimal', confidence: 'high', risk: 'low', review: 'auto_accepted' },
    { program: 'ACCTINQ', field: 'ACCT-NAME', pic: 'X ( 30 )', usage: 'DISPLAY', javaType: 'String', confidence: 'high', risk: 'low', review: 'auto_accepted' },
    { program: 'ACCTINQ', field: 'ACCT-TYPE', pic: 'X ( 15 )', usage: '', javaType: 'String', confidence: 'high', risk: 'low', review: 'auto_accepted' },
    { program: 'ACCTINQ', field: 'ACCT-BALANCE', pic: 'S9 ( 13 ) V99', usage: 'COMP-3', javaType: 'BigDecimal', confidence: 'high', risk: 'medium', review: 'auto_accepted' },
    { program: 'ACCTINQ', field: 'ACCT-STATUS', pic: 'X ( 10 )', usage: 'DISPLAY', javaType: 'String', confidence: 'high', risk: 'low', review: 'auto_accepted' },
    { program: 'ACCTINQ', field: 'WS-BALANCE-DISPLAY', pic: 'ZZZ , ZZZ , ZZZ .99', usage: '', javaType: 'BigDecimal', confidence: 'high', risk: 'low', review: 'auto_accepted' },
    { program: 'ACCTINQ', field: 'ERR-INVALID-INPUT', pic: 'X ( 60 )', usage: 'DISPLAY', javaType: 'String', confidence: 'high', risk: 'low', review: 'auto_accepted' },
    { program: 'ACCTINQ', field: 'ERR-NOT-FOUND', pic: 'X ( 60 )', usage: 'DISPLAY', javaType: 'String', confidence: 'high', risk: 'low', review: 'auto_accepted' },
    { program: 'ACCTINQ', field: 'ERR-NO-INPUT', pic: 'X ( 60 )', usage: 'DISPLAY', javaType: 'String', confidence: 'high', risk: 'low', review: 'auto_accepted' },
    { program: 'ACCTINQ', field: 'ERR-DATABASE', pic: 'X ( 60 )', usage: 'DISPLAY', javaType: 'String', confidence: 'high', risk: 'low', review: 'auto_accepted' },
    { program: 'ACCTINQ', field: 'LITERAL-001', pic: 'X ( 30 )', usage: 'DISPLAY', javaType: 'String', confidence: 'high', risk: 'low', review: 'auto_accepted' },
    { program: 'ACCTINQ', field: 'LITERAL-002', pic: 'X ( 15 )', usage: 'DISPLAY', javaType: 'String', confidence: 'high', risk: 'low', review: 'auto_accepted' },
    { program: 'ACCTINQ', field: 'LITERAL-003', pic: 'X ( 1 )', usage: 'DISPLAY', javaType: 'String', confidence: 'high', risk: 'low', review: 'auto_accepted' },
    { program: 'ACCTINQ', field: 'LITERAL-004', pic: 'X ( 15 )', usage: 'DISPLAY', javaType: 'String', confidence: 'high', risk: 'low', review: 'auto_accepted' },
    { program: 'ACCTINQ', field: 'ACCTNAMEO', pic: 'X ( 30 )', usage: 'DISPLAY', javaType: 'String', confidence: 'high', risk: 'low', review: 'auto_accepted' },
    { program: 'ACCTINQ', field: 'LITERAL-005', pic: 'X ( 15 )', usage: '', javaType: 'String', confidence: 'high', risk: 'low', review: 'auto_accepted' },
    { program: 'ACCTINQ', field: 'ACCTTYPEO', pic: 'X ( 15 )', usage: '', javaType: 'String', confidence: 'high', risk: 'low', review: 'auto_accepted' },
    { program: 'ACCTINQ', field: 'LITERAL-006', pic: 'X ( 15 )', usage: '', javaType: 'String', confidence: 'high', risk: 'low', review: 'auto_accepted' },
    { program: 'ACCTINQ', field: 'BALANCEO', pic: 'X ( 15 )', usage: 'DISPLAY', javaType: 'String', confidence: 'high', risk: 'low', review: 'auto_accepted' },
    { program: 'ACCTINQ', field: 'LITERAL-007', pic: 'X ( 15 )', usage: '', javaType: 'String', confidence: 'high', risk: 'low', review: 'auto_accepted' },
    { program: 'ACCTINQ', field: 'STATUSO', pic: 'X ( 10 )', usage: '', javaType: 'String', confidence: 'high', risk: 'low', review: 'auto_accepted' },
    { program: 'ACCTINQ', field: 'LITERAL-008', pic: 'X ( 60 )', usage: 'DISPLAY', javaType: 'String', confidence: 'high', risk: 'low', review: 'auto_accepted' },
    { program: 'ACCTINQ', field: 'ERRMSGO', pic: 'X ( 60 )', usage: 'DISPLAY', javaType: 'String', confidence: 'high', risk: 'low', review: 'auto_accepted' },
    { program: 'ACCTINQ', field: 'DFHCOMMAREA', pic: 'X ( 01 )', usage: '', javaType: 'String', confidence: 'high', risk: 'low', review: 'auto_accepted' },
    
    // ACCTINQ-SCREEN program
    { program: 'ACCTINQ-SCREEN', field: 'ACCT-KEY', pic: 'S ( 18 )', usage: 'DISPLAY', javaType: 'BigDecimal', confidence: 'high', risk: 'low', review: 'auto_accepted' },
    { program: 'ACCTINQ-SCREEN', field: 'ACCT-NAME', pic: 'X ( 30 )', usage: 'DISPLAY', javaType: 'String', confidence: 'high', risk: 'low', review: 'auto_accepted' },
    { program: 'ACCTINQ-SCREEN', field: 'ACCT-TYPE', pic: 'X ( 15 )', usage: 'DISPLAY', javaType: 'String', confidence: 'high', risk: 'low', review: 'auto_accepted' },
    { program: 'ACCTINQ-SCREEN', field: 'ACCT-BALANCE', pic: 'S9 ( 11 ) V99', usage: 'DISPLAY', javaType: 'BigDecimal', confidence: 'high', risk: 'medium', review: 'auto_accepted' },
    { program: 'ACCTINQ-SCREEN', field: 'ACCT-STATUS', pic: 'X ( 10 )', usage: 'DISPLAY', javaType: 'String', confidence: 'high', risk: 'low', review: 'auto_accepted' },
    { program: 'ACCTINQ-SCREEN', field: 'WS-FILE-STATUS', pic: 'XX', usage: '', javaType: 'String', confidence: 'high', risk: 'low', review: 'auto_accepted' },
    
    // BALQUERY program
    { program: 'BALQUERY', field: 'ACCT-NUMBER', pic: 'S ( 18 )', usage: 'DISPLAY', javaType: 'BigDecimal', confidence: 'high', risk: 'low', review: 'auto_accepted' },
    { program: 'BALQUERY', field: 'ACCT-HOLDER-NAME', pic: 'X ( 30 )', usage: 'DISPLAY', javaType: 'String', confidence: 'high', risk: 'low', review: 'auto_accepted' },
    { program: 'BALQUERY', field: 'ACCT-TYPE', pic: 'X ( 10 )', usage: 'DISPLAY', javaType: 'String', confidence: 'high', risk: 'low', review: 'auto_accepted' },
    { program: 'BALQUERY', field: 'ACCT-BALANCE', pic: 'S ( 9 ) V99', usage: 'DISPLAY', javaType: 'BigDecimal', confidence: 'high', risk: 'medium', review: 'auto_accepted' },
    { program: 'BALQUERY', field: 'ACCT-STATUS', pic: 'X ( 01 )', usage: 'DISPLAY', javaType: 'String', confidence: 'high', risk: 'low', review: 'auto_accepted' },
    { program: 'BALQUERY', field: 'RESP-CODE', pic: 'S ( 02 )', usage: 'DISPLAY', javaType: 'BigDecimal', confidence: 'high', risk: 'low', review: 'auto_accepted' },
    { program: 'BALQUERY', field: 'RESP-MESSAGE', pic: 'X ( 50 )', usage: '', javaType: 'String', confidence: 'high', risk: 'low', review: 'auto_accepted' },
    { program: 'BALQUERY', field: 'RESP-BALANCE', pic: 'S ( 9 ) V99', usage: 'DISPLAY', javaType: 'BigDecimal', confidence: 'high', risk: 'medium', review: 'auto_accepted' },
    { program: 'BALQUERY', field: 'WS-FOUND-FLAG', pic: 'X ( 01 )', usage: '', javaType: 'String', confidence: 'high', risk: 'low', review: 'auto_accepted' },
    
    // BANKING program
    { program: 'BANKING', field: 'TRANS-ERROR', pic: 'X', usage: 'DISPLAY', javaType: 'String', confidence: 'high', risk: 'low', review: 'auto_accepted' },
    { program: 'BANKING', field: 'ZERO-BALANCE', pic: 'S ( 10 ) V99', usage: 'DISPLAY', javaType: 'BigDecimal', confidence: 'high', risk: 'medium', review: 'auto_accepted' },
    
    // CALCUTIL program
    { program: 'CALCUTIL', field: 'WS-TEMP-RESULT', pic: 'S9 ( 15 ) V99', usage: 'COMP-3', javaType: 'BigDecimal', confidence: 'high', risk: 'medium', review: 'auto_accepted' },
    { program: 'CALCUTIL', field: 'WS-OPERATION', pic: 'X ( 10 )', usage: 'DISPLAY', javaType: 'String', confidence: 'high', risk: 'low', review: 'auto_accepted' },
    { program: 'CALCUTIL', field: 'WS-OPERAND-1', pic: 'S9 ( 9 ) V99', usage: 'COMP-3', javaType: 'BigDecimal', confidence: 'high', risk: 'medium', review: 'auto_accepted' },
    { program: 'CALCUTIL', field: 'WS-OPERAND-2', pic: 'S9 ( 9 ) V99', usage: 'COMP-3', javaType: 'BigDecimal', confidence: 'high', risk: 'medium', review: 'auto_accepted' },
    { program: 'CALCUTIL', field: 'WS-RESULT', pic: 'S9 ( 9 ) V99', usage: 'COMP-3', javaType: 'BigDecimal', confidence: 'high', risk: 'medium', review: 'auto_accepted' },
    { program: 'CALCUTIL', field: 'WS-WS-RETURN-CODE', pic: 'S ( 2 )', usage: 'DISPLAY', javaType: 'BigDecimal', confidence: 'high', risk: 'low', review: 'auto_accepted' },
    { program: 'CALCUTIL', field: 'WS-ERROR-MESSAGE', pic: 'X ( 50 )', usage: 'DISPLAY', javaType: 'String', confidence: 'high', risk: 'low', review: 'auto_accepted' }
  ];
}

// Toast notification function
function showToast(message, type) {
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.style.cssText = 'position: fixed; top: 20px; right: 48px; z-index: 10000; display: flex; flex-direction: column; align-items: flex-end; max-width: 500px;';
    document.body.appendChild(toastContainer);
  }
  
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  const colors = {
    success: { bg: 'rgba(16, 185, 129, 0.15)', border: '#10b981', text: '#d1fae5' },
    info: { bg: 'rgba(59, 130, 246, 0.15)', border: '#3b82f6', text: '#dbeafe' },
    error: { bg: 'rgba(239, 68, 68, 0.15)', border: '#ef4444', text: '#fecaca' },
    warning: { bg: 'rgba(245, 158, 11, 0.15)', border: '#f59e0b', text: '#fef3c7' }
  };
  
  const colorScheme = colors[type] || colors.info;
  
  toast.style.cssText = `
    padding: 16px 28px;
    margin-bottom: 10px;
    border-radius: 12px;
    color: ${colorScheme.text};
    font-size: 15px;
    font-weight: 500;
    background: ${colorScheme.bg};
    border: 2px solid ${colorScheme.border};
    box-shadow: 0 4px 16px rgba(0,0,0,0.3);
    white-space: nowrap;
  `;
  toast.textContent = message;
  
  toastContainer.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Add event listeners for filters
document.addEventListener('DOMContentLoaded', () => {
  const progFilter = document.getElementById('mapping-filter-program');
  const riskFilter = document.getElementById('mapping-filter-risk');
  const reviewFilter = document.getElementById('mapping-filter-review');
  
  if (progFilter) progFilter.addEventListener('input', renderDatatypeMappingRows);
  if (riskFilter) riskFilter.addEventListener('change', renderDatatypeMappingRows);
  if (reviewFilter) reviewFilter.addEventListener('change', renderDatatypeMappingRows);
});
