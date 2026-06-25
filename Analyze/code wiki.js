/* ============================================================
   Code Wiki page logic
   Source: ChangedAnalysisEngine (2).html
   Contains this page's bootstrap, renderers, handlers, and data only.
============================================================ */
window.EQUIVALIC_INITIAL_PAGE = window.EQUIVALIC_INITIAL_PAGE || 'Code Wiki';

/* ============================================================
   Page bootstrap and shared shell utilities
============================================================ */
const appState = { product: "Product Suite", section: "Analyze", page: "Code Wiki", view: "Overview" };
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


/* ============================================================
       CODE WIKI MODE
    ============================================================ */
// Attach Wiki Events

// Helper: renders Architecture block used by JCL/BMS/Folder views
const WIKI_PROGRAMS = ['STUDENT-PROCESS', 'ACCTINQ', 'CALCUTIL'];
const WIKI_COPYBOOKS = ['DATADEF', 'ACCOUNT', 'ACCTMAP'];
const WIKI_COPYBOOK_USERS = { DATADEF: 1, ACCOUNT: 2, ACCTMAP: 1 };

function wikiProgramTreeItem(name, nested) {
  const pad = nested ? '28px' : '12px';
  return `<div class="tree-item file" style="display:flex;justify-content:space-between;align-items:center;padding:6px 8px 6px ${pad};cursor:pointer;">
    <div style="display:flex;align-items:center;gap:8px;flex:1;min-width:0;">
      <span style="background:rgba(0,212,255,0.1);width:24px;height:24px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:13px;flex-shrink:0;">📄</span>
      <span style="font-size:13px;font-weight:500;color:var(--text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${name}">${name}</span>
    </div>
  </div>`;
}

function wikiCopybookTreeItem(name) {
  return `<div class="tree-item file" style="display:flex;justify-content:space-between;align-items:center;padding:6px 8px 6px 28px;cursor:pointer;">
    <div style="display:flex;align-items:center;gap:8px;flex:1;min-width:0;">
      <span style="background:rgba(162,155,254,0.12);width:24px;height:24px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:13px;flex-shrink:0;">📚</span>
      <span style="font-size:13px;font-weight:500;color:var(--text-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${name}">${name}</span>
    </div>
  </div>`;
}

window._wikiArchBlock = function() {
    return `
      <div style="background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.05);border-radius:10px;padding:16px;margin-bottom:16px;">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
          <span style="font-size:20px;">🏗️</span>
          <div><div style="font-size:14px;font-weight:700;color:#fff;">Project Architecture</div><div style="font-size:11px;color:var(--text-muted);">${WIKI_PROGRAMS.length} programs, ${WIKI_COPYBOOKS.length} copybooks</div></div>
        </div>
      </div>
      <div style="background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.05);border-radius:10px;padding:16px;margin-bottom:16px;">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;"><span style="font-size:14px;">✅</span><span style="font-size:13px;font-weight:700;color:#fff;">Program Call Chain (2)</span></div>
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
          <span style="background:rgba(46,204,113,0.15);color:#2ecc71;font-size:11px;font-weight:600;padding:4px 10px;border-radius:6px;">MAINPROG</span>
          <span style="color:var(--text-muted);">→</span>
          <span style="background:rgba(52,152,219,0.15);color:#60a5fa;font-size:11px;font-weight:600;padding:4px 10px;border-radius:6px;">CALLS</span>
          <span style="color:var(--text-muted);">→</span>
          <span style="background:rgba(46,204,113,0.15);color:#2ecc71;font-size:11px;font-weight:600;padding:4px 10px;border-radius:6px;">BALQUERY</span>
        </div>
        <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:8px;">
          <span style="background:rgba(46,204,113,0.15);color:#2ecc71;font-size:11px;font-weight:600;padding:4px 10px;border-radius:6px;">DATEDAYS</span>
          <span style="color:var(--text-muted);">→</span>
          <span style="background:rgba(243,156,18,0.15);color:#f39c12;font-size:11px;font-weight:600;padding:4px 10px;border-radius:6px;">CALLS</span>
          <span style="color:var(--text-muted);">→</span>
          <span style="background:rgba(46,204,113,0.15);color:#2ecc71;font-size:11px;font-weight:600;padding:4px 10px;border-radius:6px;">DATECALC</span>
        </div>
      </div>
      <div style="background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.05);border-radius:10px;padding:16px;margin-bottom:16px;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
          <div style="display:flex;align-items:center;gap:8px;"><span style="font-size:14px;">📚</span><span style="font-size:13px;font-weight:700;color:#fff;">Copybook Dependencies (${WIKI_COPYBOOKS.length})</span></div>
        </div>
        <div class="wiki-list-scroll">
        ${WIKI_COPYBOOKS.map(c => `
        <div style="display:flex;align-items:center;gap:10px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,0.03);">
          <span style="color:var(--text-muted);font-size:11px;">▶</span>
          <span style="background:rgba(162,155,254,0.12);width:18px;height:18px;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:10px;flex-shrink:0;">📄</span>
          <span style="font-size:12px;font-weight:600;color:#e2e8f0;">${c}</span>
          <span style="background:rgba(46,204,113,0.12);color:#2ecc71;font-size:9px;padding:1px 6px;border-radius:4px;">${WIKI_COPYBOOK_USERS[c]} users</span>
        </div>`).join('')}
        </div>
      </div>
      <div style="background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.05);border-radius:10px;padding:16px;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
          <div style="display:flex;align-items:center;gap:8px;"><span style="font-size:14px;">📄</span><span style="font-size:13px;font-weight:700;color:#fff;">All Programs</span></div>
          <span style="font-size:10px;color:var(--text-muted);background:rgba(255,255,255,0.05);padding:2px 8px;border-radius:8px;">${WIKI_PROGRAMS.length}</span>
        </div>
        <div class="wiki-list-scroll">
        ${WIKI_PROGRAMS.map(p=>`
        <div style="display:flex;align-items:center;gap:10px;padding:5px 0;">
          <span style="background:rgba(0,212,255,0.1);width:18px;height:18px;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:10px;flex-shrink:0;">📄</span>
          <span style="font-size:12px;font-weight:500;color:#e2e8f0;">${p}</span>
        </div>`).join('')}
        </div>
      </div>
    `;
};

window.selectCodeWikiItem = function (type, name, element) {
  const tabsContainer = document.getElementById('codeWikiSubTabs');
  if (!tabsContainer) return;

  // Update active state in the tree UI
  document.querySelectorAll('.tree-item').forEach(el => el.style.background = 'transparent');
  if (element) {
    // If it's a folder, we style the tree-row, if it's a file we style the tree-item itself.
    const item = element.closest('.tree-item.file') || element.closest('.tree-row');
    if (item) {
      item.style.background = 'rgba(0, 212, 255, 0.08)';
      item.style.borderRadius = '6px';
    }
  }

  let tabsHtml = '';
  if (type === 'folder') {
    tabsHtml = `
            <div style="font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px;">${name}</div>
            <div style="display: flex; gap: 16px;">
                <span class="wiki-tab" onclick="switchCodeWikiTab('view-overview', this)" style="font-size: 11px; font-weight: 500; color: var(--text-muted); cursor: pointer; transition: color 0.2s;">Overview</span>
                <span class="wiki-tab" onclick="switchCodeWikiTab('view-orchestration', this)" style="font-size: 11px; font-weight: 500; color: var(--text-muted); cursor: pointer; transition: color 0.2s;">Orchestration</span>
                <span class="wiki-tab" onclick="switchCodeWikiTab('view-datasets', this)" style="font-size: 11px; font-weight: 500; color: var(--text-muted); cursor: pointer; transition: color 0.2s;">Datasets</span>
                <span class="wiki-tab" onclick="switchCodeWikiTab('view-dependencies', this)" style="font-size: 11px; font-weight: 500; color: var(--text-muted); cursor: pointer; transition: color 0.2s;">Dependencies</span>
                <span class="wiki-tab" onclick="switchCodeWikiTab('view-source', this)" style="font-size: 11px; font-weight: 500; color: var(--text-muted); cursor: pointer; transition: color 0.2s;">Source</span>
                <span class="wiki-tab" onclick="switchCodeWikiTab('view-folder-json', this)" style="font-size: 11px; font-weight: 500; color: var(--text-muted); cursor: pointer; transition: color 0.2s;">JSON</span>
            </div>
        `;
    tabsContainer.innerHTML = tabsHtml;
    const firstTab = tabsContainer.querySelector('.wiki-tab');
    if (firstTab) switchCodeWikiTab('view-overview', firstTab);

  } else if (type === 'batch') {
    const mkPill = (label, viewId, icon) => `<span class="wiki-tab" onclick="switchCodeWikiTab('${viewId}',this)" style="display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:600;color:var(--text-muted);cursor:pointer;padding:4px 10px;border-radius:12px;border:1px solid rgba(255,255,255,0.08);background:rgba(255,255,255,0.03);transition:all 0.2s;">${icon}${label}</span>`;
    const icons = {
      Summary: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>',
      JSON: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
      VSAM: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>',
      IMS: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>'
    };
    tabsHtml = `
      <div style="font-size:13px;font-weight:700;color:#fff;letter-spacing:0.02em;">WIKI-BATCH-SCHEDULE</div>
      <div style="display:flex;gap:6px;">
        ${mkPill('Summary','view-batch-summary',icons.Summary)}
        ${mkPill('JSON','view-file-json',icons.JSON)}
        ${mkPill('VSAM','view-mindmap',icons.VSAM)}
        ${mkPill('IMS','view-tree',icons.IMS)}
      </div>`;
    tabsContainer.innerHTML = tabsHtml;
    const bv = document.getElementById('view-batch-summary');
    if (bv) bv.innerHTML = `
      <div style="padding:20px 24px;">
        <div style="font-size:14px;font-weight:700;color:#fff;margin-bottom:6px;">Source: <span style="color:#a29bfe;">PRCSEQ (DATADEF.cpy)</span></div>
        <div style="font-size:13px;font-weight:700;color:#fff;margin:16px 0 10px;">Sequence (execution order):</div>
        ${['SUBTRACT','MULTIPLY','DIVIDE'].map((s,i)=>`<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.04);"><span style="width:20px;height:20px;border-radius:50%;background:rgba(108,92,231,0.2);color:#a29bfe;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;">${i+1}</span><span style="color:#e2e8f0;font-size:13px;font-weight:600;">${s}</span></div>`).join('')}
      </div>`;
    switchCodeWikiTab('view-batch-summary', tabsContainer.querySelector('.wiki-tab'));

  } else if (type === 'jcl') {
    const mkPill = (label, viewId) => `<span class="wiki-tab" onclick="switchCodeWikiTab('${viewId}',this)" style="display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:600;color:var(--text-muted);cursor:pointer;padding:4px 10px;border-radius:12px;border:1px solid rgba(255,255,255,0.08);background:rgba(255,255,255,0.03);transition:all 0.2s;">${label}</span>`;
    tabsHtml = `
      <div style="font-size:13px;font-weight:700;color:#fff;letter-spacing:0.02em;">${name}</div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;">
        ${mkPill('Overview','view-jcl-overview')}
        ${mkPill('Orchestration','view-jcl-orch')}
        ${mkPill('Datasets','view-jcl-datasets')}
        ${mkPill('Dependencies','view-jcl-deps')}
        ${mkPill('Source','view-source')}
        ${mkPill('JSON','view-file-json')}
      </div>`;
    tabsContainer.innerHTML = tabsHtml;
    const jv = document.getElementById('view-jcl-overview');
    if (jv) jv.innerHTML = `
      <div style="padding:20px 24px;">
        <div style="font-size:14px;font-weight:700;color:#fff;margin-bottom:6px;">Source: <span style="color:#a29bfe;">jcl (${name}.jcl)</span></div>
        <div style="font-size:13px;font-weight:700;color:#fff;margin:16px 0 10px;">Steps (execution order):</div>
        ${['ORDVAL','ORDINV'].map((s,i)=>`<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.04);"><span style="width:20px;height:20px;border-radius:50%;background:rgba(243,156,18,0.2);color:#f39c12;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;">${i+1}</span><span style="color:#e2e8f0;font-size:13px;font-weight:600;">${s}</span></div>`).join('')}
      </div>`;
    switchCodeWikiTab('view-jcl-overview', tabsContainer.querySelector('.wiki-tab'));

  } else if (type === 'bms') {
    const mkPill = (label, viewId, icon) => `<span class="wiki-tab" onclick="switchCodeWikiTab('${viewId}',this)" style="display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:600;color:var(--text-muted);cursor:pointer;padding:4px 10px;border-radius:12px;border:1px solid rgba(255,255,255,0.08);background:rgba(255,255,255,0.03);transition:all 0.2s;">${icon}${label}</span>`;
    const icons = {
      Summary: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>',
      SQL: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>',
      VSAM: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>',
      IMS: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>',
      Tree: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>',
      'Mind Map': '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="2" x2="12" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
      Graph: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>',
      Variables: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>',
      JSON: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>'
    };
    tabsHtml = `
      <div style="font-size:13px;font-weight:700;color:#fff;letter-spacing:0.02em;">WIKI-SCREENS-BMS</div>
      <div style="display:grid;grid-template-columns:repeat(4,max-content);gap:6px 8px;">
        ${mkPill('Summary','view-bms-summary',icons.Summary)}
        ${mkPill('SQL','view-sql',icons.SQL)}
        ${mkPill('VSAM','view-mindmap',icons.VSAM)}
        ${mkPill('IMS','view-tree',icons.IMS)}
        ${mkPill('Tree','view-graph',icons.Tree)}
        ${mkPill('Mind Map','view-variables',icons['Mind Map'])}
        ${mkPill('Graph','view-source',icons.Graph)}
        ${mkPill('Variables','view-dependencies',icons.Variables)}
        ${mkPill('JSON','view-file-json',icons.JSON)}
      </div>`;
    tabsContainer.innerHTML = tabsHtml;
    const bmsArch = `<div style="padding:20px 24px;">${_wikiArchBlock()}</div>`;
    const bmsv = document.getElementById('view-bms-summary');
    const bmsTree = document.getElementById('view-graph');
    if (bmsv) bmsv.innerHTML = bmsArch;
    if (bmsTree) bmsTree.innerHTML = bmsArch;
    switchCodeWikiTab('view-bms-summary', tabsContainer.querySelector('.wiki-tab'));

  } else if (type === 'cics') {
    const mkPill = (label, viewId) => `<span class="wiki-tab" onclick="switchCodeWikiTab('${viewId}',this)" style="display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:600;color:var(--text-muted);cursor:pointer;padding:4px 10px;border-radius:12px;border:1px solid rgba(255,255,255,0.08);background:rgba(255,255,255,0.03);transition:all 0.2s;">${label}</span>`;
    tabsHtml = `
      <div style="font-size:13px;font-weight:700;color:#fff;letter-spacing:0.02em;">WIKI-CICS</div>
      <div style="display:flex;gap:6px;">
        ${mkPill('Summary','view-cics-summary')}
        ${mkPill('JSON','view-file-json')}
        ${mkPill('VSAM','view-mindmap')}
        ${mkPill('IMS','view-tree')}
      </div>`;
    tabsContainer.innerHTML = tabsHtml;
    const cv = document.getElementById('view-cics-summary');
    if (cv) cv.innerHTML = `
      <div style="padding:20px 24px;">
        <div style="margin-bottom:16px;">
          <span style="font-size:12px;font-weight:700;color:var(--text-muted);text-transform:uppercase;">EXEC CICS commands:</span>
          <span style="margin-left:10px;">${['READ 1','RECEIVE 1','RETURN 2','SEND 3'].map(c=>`<span style="background:rgba(108,92,231,0.15);color:#a29bfe;font-size:11px;font-weight:600;padding:3px 8px;border-radius:4px;margin-right:6px;">${c}</span>`).join('')}</span>
        </div>
        ${[['Transactions','ACCT → ACCTINQ'],['Programs','ACCTINQ'],['Mapsets','ACCTSCR, ACCTMAP'],['Files','ACCTFILE']].map(([label,val])=>`<div style="margin-bottom:10px;"><div style="font-size:12px;font-weight:700;color:#fff;margin-bottom:4px;">${label}</div><div style="font-size:13px;color:#e2e8f0;">${val}</div></div>`).join('')}
        <div style="font-size:12px;font-weight:700;color:#fff;margin:16px 0 10px;">Command evidence</div>
        <div style="border:1px solid rgba(255,255,255,0.06);border-radius:8px;overflow:hidden;">
          <div style="display:grid;grid-template-columns:90px 70px 80px 1fr 50px 1fr;background:rgba(0,0,0,0.25);padding:8px 12px;border-bottom:1px solid rgba(255,255,255,0.06);font-size:10px;font-weight:700;text-transform:uppercase;color:var(--text-muted);gap:8px;"><div>Program</div><div>Command</div><div>File</div><div>Paragraph</div><div>Line</div><div>Statement</div></div>
          ${[
            ['ACCTINQ','RETURN','—','END-EVALUATE','173',"EXEC CICS RETURN TRANSID('ACCT') COMMAREA(WS-COMMAREA) LENGTH(1)"],
            ['ACCTINQ','SEND','—','1000-FIRST-TIME-PROCESS','188',"EXEC CICS SEND MAP('ACCTSCR') MAPSET('ACCTMAP') FROM(ACCTSCR) ERASE CURSOR"],
            ['ACCTINQ','SEND','—','2090-PROCESS-INPUT','181','EXEC CICS SEND CONTROL ERASE ERROR'],
            ['ACCTINQ','RETURN','—','2090-PROCESS-INPUT','201','EXEC CICS RETURN'],
            ['ACCTINQ','RECEIVE','—','2100-RECEIVE-MAP','271',"EXEC CICS RECEIVE MAP('ACCTSCR') MAPSET('ACCTMAP') INTO(ACCTSCR)"],
            ['ACCTINQ','READ','ACCTFILE','4000-READ-DATABASE','253',"EXEC CICS READ FILE('ACCTFILE') INTO(ACCOUNT-RECORD) RIDFLD(WS-ACCOUNT-NUMBER) RESP(WS-RESPONSE)"],
            ['ACCTINQ','SEND','—','5000-SEND-MAP','288',"EXEC CICS SEND MAP('ACCTSCR') MAPSET('ACCTMAP') FROM(ACCTSCR) DATAONLY CURSOR"],
          ].map(r=>`<div style="display:grid;grid-template-columns:90px 70px 80px 1fr 50px 1fr;padding:8px 12px;border-bottom:1px solid rgba(255,255,255,0.04);gap:8px;font-size:10px;align-items:start;">
            <div style="color:#60a5fa;font-weight:600;">${r[0]}</div>
            <div><span style="background:rgba(108,92,231,0.2);color:#a29bfe;font-size:9px;font-weight:700;padding:2px 6px;border-radius:4px;">${r[1]}</span></div>
            <div style="color:var(--text-muted);">${r[2]}</div>
            <div style="color:#94a3b8;font-family:monospace;font-size:9px;">${r[3]}</div>
            <div style="color:var(--text-muted);">${r[4]}</div>
            <div style="color:#e2e8f0;font-family:monospace;font-size:9px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${r[5]}</div>
          </div>`).join('')}
        </div>
      </div>`;
    switchCodeWikiTab('view-cics-summary', tabsContainer.querySelector('.wiki-tab'));

  } else if (type === 'file') {
    tabsHtml = `
            <div style="font-size: 13px; font-weight: 700; color: #fff; letter-spacing: 0.02em;">${name}</div>
            <div style="display: grid; grid-template-columns: repeat(4, max-content); gap: 6px 8px;">
                <span class="wiki-tab" onclick="switchCodeWikiTab('view-file-summary', this)" style="display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:600;color:var(--text-muted);cursor:pointer;padding:4px 10px;border-radius:12px;border:1px solid rgba(255,255,255,0.08);background:rgba(255,255,255,0.03);transition:all 0.2s;"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>Summary</span>
                <span class="wiki-tab" onclick="switchCodeWikiTab('view-sql', this)" style="display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:600;color:var(--text-muted);cursor:pointer;padding:4px 10px;border-radius:12px;border:1px solid rgba(255,255,255,0.08);background:rgba(255,255,255,0.03);transition:all 0.2s;"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>SQL</span>
                <span class="wiki-tab" onclick="switchCodeWikiTab('view-orchestration-file', this)" style="display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:600;color:var(--text-muted);cursor:pointer;padding:4px 10px;border-radius:12px;border:1px solid rgba(255,255,255,0.08);background:rgba(255,255,255,0.03);transition:all 0.2s;"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>VSAM</span>
                <span class="wiki-tab" onclick="switchCodeWikiTab('view-mindmap', this)" style="display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:600;color:var(--text-muted);cursor:pointer;padding:4px 10px;border-radius:12px;border:1px solid rgba(255,255,255,0.08);background:rgba(255,255,255,0.03);transition:all 0.2s;"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>IMS</span>
                <span class="wiki-tab" onclick="switchCodeWikiTab('view-tree', this)" style="display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:600;color:var(--text-muted);cursor:pointer;padding:4px 10px;border-radius:12px;border:1px solid rgba(255,255,255,0.08);background:rgba(255,255,255,0.03);transition:all 0.2s;"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>Tree</span>
                <span class="wiki-tab" onclick="switchCodeWikiTab('view-variables', this)" style="display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:600;color:var(--text-muted);cursor:pointer;padding:4px 10px;border-radius:12px;border:1px solid rgba(255,255,255,0.08);background:rgba(255,255,255,0.03);transition:all 0.2s;"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="2" x2="12" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>Mind Map</span>
                <span class="wiki-tab" onclick="switchCodeWikiTab('view-graph', this)" style="display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:600;color:var(--text-muted);cursor:pointer;padding:4px 10px;border-radius:12px;border:1px solid rgba(255,255,255,0.08);background:rgba(255,255,255,0.03);transition:all 0.2s;"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>Graph</span>
                <span class="wiki-tab" onclick="switchCodeWikiTab('view-source', this)" style="display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:600;color:var(--text-muted);cursor:pointer;padding:4px 10px;border-radius:12px;border:1px solid rgba(255,255,255,0.08);background:rgba(255,255,255,0.03);transition:all 0.2s;"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>Variables</span>
                <span class="wiki-tab" onclick="switchCodeWikiTab('view-file-json', this)" style="display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:600;color:var(--text-muted);cursor:pointer;padding:4px 10px;border-radius:12px;border:1px solid rgba(255,255,255,0.08);background:rgba(255,255,255,0.03);transition:all 0.2s;"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>JSON</span>
            </div>
        `;
    tabsContainer.innerHTML = tabsHtml;
    // update summary title and dependency list for selected file
    const currentFileName = name;
    window._selectedWikiFile = currentFileName;
    const firstTab = tabsContainer.querySelector('.wiki-tab');
    if (firstTab) switchCodeWikiTab('view-file-summary', firstTab);
    // Populate file summary with program-specific data
    const summaryView = document.getElementById('view-file-summary');
    if (summaryView) {
      const deps = {
        'STUDENT-PROCESS': [{ icon: '📄', name: 'REPORT-FILE', color: '#f39c12' }, { icon: '📄', name: 'STUDENT-FILE', color: '#3498db' }],
        'ACCTINQ': [{ icon: '📄', name: 'ACCTCOPY', color: '#9b59b6' }, { icon: '📄', name: 'DFHCOMMAREA', color: '#2ecc71' }, { icon: '📄', name: 'DB2-ACCOUNTS', color: '#3498db' }],
        'CALCUTIL': [{ icon: '📄', name: 'MATHLIB', color: '#e74c3c' }]
      };
      const fileDeps = deps[currentFileName] || [];
      summaryView.innerHTML = `
                <div style="padding: 0;">
                    <div style="padding: 20px 24px; border-bottom: 1px solid rgba(255,255,255,0.05);">
                        <div style="font-size: 18px; font-weight: 700; color: #fff; margin-bottom: 2px;">${currentFileName}</div>
                        <div style="font-size: 12px; color: var(--text-muted);">program</div>
                    </div>
                    <div style="padding: 16px 24px;">
                        <div style="font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 12px;">DEPENDENCIES (${fileDeps.length})</div>
                        ${fileDeps.map(dep => `
                        <div style="display: flex; align-items: center; gap: 10px; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.04);">
                            <span style="background: rgba(${dep.color === '#f39c12' ? '243,156,18' : dep.color === '#3498db' ? '52,152,219' : dep.color === '#9b59b6' ? '155,89,182' : dep.color === '#2ecc71' ? '46,204,113' : '231,76,60'},0.15); width: 28px; height: 28px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0;">${dep.icon}</span>
                            <span style="font-size: 13px; font-weight: 500; color: #e2e8f0;">${dep.name}</span>
                        </div>`).join('')}
                        ${fileDeps.length === 0 ? '<div style="color: var(--text-muted); font-size: 13px;">No dependencies found.</div>' : ''}
                    </div>
                </div>
            `;
    }
  }
};

window.switchCodeWikiTab = function (viewId, tabElement) {
  // Hide all views
  document.querySelectorAll('.wiki-view').forEach(v => v.style.display = 'none');

  // Show selected view
  const view = document.getElementById(viewId);
  if (view) {
    view.style.display = view.classList.contains('flex-center') ? 'flex' : 'block';
  }

  // Update active tab styling
  document.querySelectorAll('.wiki-tab').forEach(t => {
    t.style.color = 'var(--text-muted)';
    t.style.fontWeight = '500';
  });
  if (tabElement) {
    tabElement.style.color = '#a29bfe';
    tabElement.style.fontWeight = '600';
  }
};

const WIKI_CONFIDENCE_ROWS = [
  { area: 'COBOL Parse', score: 15, status: 'Failed', gaps: ['parser_failures', 'partial_parser_success'] },
  { area: 'IR Quality', score: 20, status: 'Failed', gaps: ['ir_blocking_reasons', 'ir_warnings_present'] },
  { area: 'Copybooks', score: 91, status: 'Passed With Warnings', gaps: ['missing_application_copybooks', 'missing_system_copybooks'] },
  { area: 'CICS', score: 88, status: 'Passed With Warnings', gaps: ['partial_cics_resource_coverage'] },
  { area: 'DB2 SQL / DDL', score: 76, status: 'Passed With Warnings', gaps: ['sql_mapping_incomplete', 'db2_ddl_tables_missing'] },
  { area: 'VSAM', score: 100, status: 'Passed', gaps: [] },
  { area: 'BMS Screens', score: 100, status: 'Passed', gaps: [] },
  { area: 'JCL Orchestration', score: 100, status: 'Passed', gaps: [] },
  { area: 'IMS', score: 100, status: 'Passed', gaps: [] },
  { area: 'MQ', score: 100, status: 'Passed', gaps: [] },
  { area: 'Traceability / Artifact Health', score: 80, status: 'Passed With Warnings', gaps: ['traceability_warnings'] },
  { area: 'NetCOBOL Profile', score: 91, status: 'Passed With Warnings', gaps: ['partial_upload_possible', 'secret_like_values_redacted'] },
  { area: 'NetCOBOL Runtime Binding', score: 78, status: 'Passed With Warnings', gaps: ['netcobol_runtime_config_missing'] },
  { area: 'NetCOBOL Open File I/O', score: 100, status: 'Passed', gaps: [] },
  { area: 'NetCOBOL SQL', score: 92, status: 'Passed', gaps: [] },
];

function _wikiDiagStatusColor(status) {
  if (status === 'Failed') return '#e74c3c';
  if (status === 'Passed With Warnings') return '#f39c12';
  return '#2ecc71';
}

function _wikiDiagGapsHtml(gaps) {
  if (!gaps.length) return '<span style="color:var(--text-muted);font-size:12px;">None</span>';
  return gaps.map(g => `<span class="wiki-gap-pill">${g}</span>`).join('');
}

function _wikiSystemDiagnosticsConfidence() {
  const rowsHtml = WIKI_CONFIDENCE_ROWS.map(r => `
    <div class="wiki-diag-row">
      <div style="font-size:13px;font-weight:600;color:#e2e8f0;">${r.area}</div>
      <div style="font-size:13px;font-weight:700;color:#fff;">${r.score}</div>
      <div style="font-size:12px;font-weight:600;color:${_wikiDiagStatusColor(r.status)};">${r.status}</div>
      <div>${_wikiDiagGapsHtml(r.gaps)}</div>
    </div>`).join('');

  return `
    <div class="wiki-diag-panel">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:16px;margin-bottom:4px;">
        <div>
          <div style="font-size:18px;font-weight:700;color:#fff;margin-bottom:6px;">Analysis confidence</div>
          <div style="font-size:13px;color:var(--text-muted);">Failed across 17 subsystem(s). Generated from deterministic analysis artifacts.</div>
        </div>
        <div style="background:rgba(231,76,60,0.12);border:1px solid rgba(231,76,60,0.25);border-radius:10px;min-width:56px;padding:10px 14px;text-align:center;">
          <div style="font-size:28px;font-weight:800;color:#e74c3c;line-height:1;">82</div>
        </div>
      </div>

      <div class="wiki-diag-stat-grid">
        <div class="wiki-diag-stat-card"><div style="font-size:22px;font-weight:800;color:#fff;">22</div><div style="font-size:11px;color:var(--text-muted);margin-top:6px;">Programs assessed</div></div>
        <div class="wiki-diag-stat-card"><div style="font-size:22px;font-weight:800;color:#fff;">7</div><div style="font-size:11px;color:var(--text-muted);margin-top:6px;">Clean subsystems</div></div>
        <div class="wiki-diag-stat-card"><div style="font-size:22px;font-weight:800;color:#fff;">7</div><div style="font-size:11px;color:var(--text-muted);margin-top:6px;">Subsystems with warnings</div></div>
        <div class="wiki-diag-stat-card"><div style="font-size:22px;font-weight:800;color:#fff;">21</div><div style="font-size:11px;color:var(--text-muted);margin-top:6px;">Open analysis gaps</div></div>
      </div>

      <div class="wiki-diag-table">
        <div class="wiki-diag-row wiki-diag-row-head">
          <div>Area</div><div>Score</div><div>Status</div><div>Open gaps</div>
        </div>
        <div class="wiki-diag-table-scroll">
          ${rowsHtml}
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 2fr;gap:20px;margin-top:20px;padding-top:20px;border-top:1px solid rgba(255,255,255,0.06);">
        <div>
          <div style="font-size:12px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;">NetCOBOL Readiness</div>
          <div style="font-size:32px;font-weight:800;color:#fff;">78</div>
        </div>
        <div>
          <div style="font-size:12px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;">Risk Gaps</div>
          <div style="margin-bottom:16px;">
            <span class="wiki-gap-pill">profile_classification</span>
            <span class="wiki-gap-pill">host_runtime_split</span>
            <span class="wiki-gap-pill">+4 more</span>
          </div>
          <div style="font-size:13px;font-weight:700;color:#fff;margin-bottom:8px;">Recommendations:</div>
          <ul style="margin:0;padding-left:18px;color:var(--text-muted);font-size:13px;line-height:1.7;">
            <li style="margin-bottom:6px;">Review unmapped SQL/CICS lines and extend statement-to-IR mapping coverage.</li>
            <li>Enhance DB2 DDL extraction from JCL SYSIN/in-stream SQL so db2_ddl.json contains table, key, and relationship definitions.</li>
          </ul>
        </div>
      </div>
    </div>`;
}

function attachWikiEvents() {
  const backBtn = document.getElementById("backToDashboard");
  if (backBtn) backBtn.addEventListener("click", restoreDashboard);

  // Folder toggle and selection
  document.querySelectorAll(".tree-row").forEach(row => {
    row.addEventListener("click", (e) => {
      const folder = row.parentElement;
      if (folder.classList.contains("folder")) {
        folder.classList.toggle("open");

        const nameEl = row.querySelector('.folder-name') || row.querySelector('span:nth-child(3)');
        const name = nameEl ? nameEl.textContent.trim() : 'Folder';
        const wikiType = folder.dataset.wikiType;
        if (wikiType && window.selectCodeWikiItem) {
          window.selectCodeWikiItem(wikiType, name, row);
        } else if (window.selectCodeWikiItem) {
          window.selectCodeWikiItem('folder', name, row);
        }
      }
    });
  });

  // File selection (including special wiki types: batch, bms, cics)
  document.querySelectorAll(".file").forEach(file => {
    file.addEventListener("click", (e) => {
      const wikiType = file.dataset.wikiType;
      const nameEl = file.querySelector('[title]');
      const name = nameEl ? nameEl.getAttribute('title') : 'File';

      if (wikiType && window.selectCodeWikiItem) {
        window.selectCodeWikiItem(wikiType, name, file);
        e.stopPropagation();
        return;
      }

      if (window.selectCodeWikiItem) {
        window.selectCodeWikiItem('file', name, file);
      }
      e.stopPropagation();
    });
  });

  // Top horizontal tabs (Project Structure, Risk, etc.)
  document.querySelectorAll(".tab").forEach(tab => {
    tab.addEventListener("click", () => {
      // Remove active class from all tabs
      document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      const tabName = tab.textContent.trim();

      if (tabName === "Project Structure") {
        // Restore the Code Wiki layout
        const leftPanel = document.querySelector('.left-panel');
        if (leftPanel) leftPanel.style.display = 'block';

        const workspace = document.querySelector('.workspace');
        if (workspace) workspace.style.gridTemplateColumns = "";

        document.getElementById("codeWikiSubTabs").style.display = 'flex';

        // Show the default empty state or last active view
        document.querySelectorAll('.wiki-view').forEach(v => v.style.display = 'none');
        const emptyView = document.getElementById('view-empty');
        if (emptyView) emptyView.style.display = 'flex';

        // Hide any temporary dummy views
        const dummyView = document.getElementById('top-tab-dummy-view');
        if (dummyView) dummyView.style.display = 'none';

      } else {
        // Hide the left panel tree and sub-tabs for Risk/Diagnostics/Vulnerability
        const leftPanel = document.querySelector('.left-panel');
        if (leftPanel) leftPanel.style.display = 'none';

        const workspace = document.querySelector('.workspace');
        if (workspace) workspace.style.gridTemplateColumns = "1fr";

        document.getElementById("codeWikiSubTabs").style.display = 'none';
        document.querySelectorAll('.wiki-view').forEach(v => v.style.display = 'none');

        // Check if dummy view exists, else create it
        let dummyView = document.getElementById('top-tab-dummy-view');
        if (!dummyView) {
          dummyView = document.createElement('div');
          dummyView.id = 'top-tab-dummy-view';
          dummyView.className = 'wiki-view';
          dummyView.style.display = 'flex';
          dummyView.style.flexDirection = 'column';
          dummyView.style.alignItems = 'center';
          dummyView.style.justifyContent = 'center';
          dummyView.style.height = '100%';
          dummyView.style.paddingTop = '100px';

          const wikiContent = document.getElementById('wikiContent');
          if (wikiContent) wikiContent.appendChild(dummyView);
        }

        dummyView.style.display = 'flex';
        if (tabName === "System Diagnostics") {
          dummyView.style.padding = '24px';
          dummyView.style.display = 'block';
          dummyView.style.alignItems = 'stretch';
          dummyView.style.justifyContent = 'flex-start';
          dummyView.style.overflowY = 'auto';

          dummyView.innerHTML = `
                        ${_wikiSystemDiagnosticsConfidence()}

                        <!-- 2x2 Grid Section -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px;">
                            <!-- Entry Points -->
                            <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 20px; border-radius: 8px;">
                                <div style="font-size: 14px; font-weight: 700; color: #fff; margin-bottom: 8px;">Entry points</div>
                                <div style="font-size: 13px; color: var(--text-muted); margin-bottom: 12px;">1 total: 1 JCL job(s), 0 CICS transaction(s).</div>
                                <ul style="margin: 0; padding-left: 20px; color: #fff; font-size: 13px; font-family: monospace;">
                                    <li style="margin-bottom: 4px;"><strong>JCL:</strong> EXECUTE</li>
                                </ul>
                            </div>
                            
                            <!-- Batch Flow -->
                            <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 20px; border-radius: 8px;">
                                <div style="font-size: 14px; font-weight: 700; color: #fff; margin-bottom: 8px;">Batch flow</div>
                                <div style="font-size: 13px; color: var(--text-muted); margin-bottom: 12px;">Source: jcl (EXECUTE.jcl)</div>
                                <ol style="margin: 0; padding-left: 20px; color: #fff; font-size: 13px; font-family: monospace;">
                                    <li style="margin-bottom: 4px;">ORDVAL</li>
                                    <li style="margin-bottom: 4px;">ORDINV</li>
                                </ol>
                            </div>

                            <!-- Risk Snapshot Removed -->
                            <!-- System Personality -->
                            <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 20px; border-radius: 8px;">
                                <div style="font-size: 14px; font-weight: 700; color: #fff; margin-bottom: 8px;">System personality</div>
                                <div style="font-size: 13px; color: var(--text-muted);">Batch-heavy</div>
                            </div>
                        </div>

                        <!-- Most Called Programs Table -->
                        <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; margin-bottom: 24px; padding: 20px;">
                            <div style="font-size: 14px; font-weight: 700; color: #fff; margin-bottom: 4px;">Most called programs</div>
                            <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 16px;">Programs invoked most often (CALLs and JCL steps)</div>
                            
                            <div style="border-radius: 6px; overflow: hidden; border: 1px solid rgba(255,255,255,0.05);">
                                <div style="display: grid; grid-template-columns: 1fr 1fr 2fr; background: rgba(0,0,0,0.2); padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.5px;">
                                    <div>Program</div>
                                    <div>Called by (count)</div>
                                    <div>Callers</div>
                                </div>
                                <div style="display: grid; grid-template-columns: 1fr 1fr 2fr; padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 13px; color: #fff; font-family: monospace;">
                                    <div>ORDVAL</div>
                                    <div>1</div>
                                    <div>JCL:EXECUTE</div>
                                </div>
                                <div style="display: grid; grid-template-columns: 1fr 1fr 2fr; padding: 12px 16px; font-size: 13px; color: #fff; font-family: monospace;">
                                    <div>ORDINV</div>
                                    <div>1</div>
                                    <div>JCL:EXECUTE</div>
                                </div>
                            </div>
                        </div>

                        <!-- Top Copybooks Table -->
                        <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; margin-bottom: 24px; padding: 20px;">
                            <div style="font-size: 14px; font-weight: 700; color: #fff; margin-bottom: 4px;">Top copybooks (by usage)</div>
                            <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 16px;">Most referenced copybooks in this codebase</div>
                            
                            <div style="border-radius: 6px; overflow: hidden; border: 1px solid rgba(255,255,255,0.05);">
                                <div style="display: grid; grid-template-columns: 1fr 2fr; background: rgba(0,0,0,0.2); padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.5px;">
                                    <div>Copybook</div>
                                    <div>Used by</div>
                                </div>
                                <div style="display: grid; grid-template-columns: 1fr 2fr; padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 13px; color: #fff; font-family: monospace;">
                                    <div>ORDSTRUC</div>
                                    <div>1 program(s): ORDVAL</div>
                                </div>
                                <div style="display: grid; grid-template-columns: 1fr 2fr; padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 13px; color: #fff; font-family: monospace;">
                                    <div>INVSTRUC</div>
                                    <div>1 program(s): ORDVAL</div>
                                </div>
                                <div style="display: grid; grid-template-columns: 1fr 2fr; padding: 12px 16px; font-size: 13px; color: #fff; font-family: monospace;">
                                    <div>SQLCODES</div>
                                    <div>1 program(s): ORDINV</div>
                                </div>
                            </div>
                        </div>

                        <!-- Top DB2 Tables -->
                        <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; margin-bottom: 24px; padding: 20px;">
                            <div style="font-size: 14px; font-weight: 700; color: #fff; margin-bottom: 4px;">Top DB2 tables</div>
                            <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 16px;">Tables defined in this project</div>
                            
                            <div style="border-radius: 6px; overflow: hidden; border: 1px solid rgba(255,255,255,0.05);">
                                <div style="display: grid; grid-template-columns: 2fr 1fr; background: rgba(0,0,0,0.2); padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.5px;">
                                    <div>Table</div>
                                    <div>Columns</div>
                                </div>
                                <div style="display: grid; grid-template-columns: 2fr 1fr; padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 13px; color: #fff; font-family: monospace;">
                                    <div>CUSTOMER</div>
                                    <div>3</div>
                                </div>
                                <div style="display: grid; grid-template-columns: 2fr 1fr; padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 13px; color: #fff; font-family: monospace;">
                                    <div>INVENTORY</div>
                                    <div>3</div>
                                </div>
                                <div style="display: grid; grid-template-columns: 2fr 1fr; padding: 12px 16px; font-size: 13px; color: #fff; font-family: monospace;">
                                    <div>ORDER_STATUS</div>
                                    <div>4</div>
                                </div>
                            </div>
                        </div>

                        <!-- Planning and preview -->
                        <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; padding: 24px;">
                            <div style="font-size: 14px; font-weight: 700; color: #fff; margin-bottom: 8px;">Planning and preview</div>
                            <div style="font-size: 13px; color: var(--text-muted); margin-bottom: 24px;">COBOL architecture preview and dependency-wave planning use the same project context as Code Wiki.</div>
                            
                            <div style="display: flex; gap: 16px;">
                                <button style="background: #6c5ce7; color: #fff; border: none; border-radius: 6px; padding: 8px 16px; font-size: 13px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: opacity 0.2s;" onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                    Preview Architecture
                                </button>
                                <button style="background: transparent; color: #fff; border: 1px solid rgba(255,255,255,0.2); border-radius: 6px; padding: 8px 16px; font-size: 13px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.05)'" onmouseout="this.style.background='transparent'">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"></path><path d="M2 12l10 5 10-5"></path><path d="M2 17l10 5 10-5"></path></svg>
                                    Wave plan
                                </button>
                            </div>
                        </div>
                    `;
        } else {
          dummyView.style.display = 'flex';
          dummyView.style.flexDirection = 'column';
          dummyView.style.alignItems = 'center';
          dummyView.style.justifyContent = 'center';
          dummyView.style.paddingTop = '100px';

          dummyView.innerHTML = `
                        <div style="font-size: 48px; margin-bottom: 16px;">🚧</div>
                        <div style="color:var(--text-primary);font-size:18px;font-weight:600;margin-bottom:10px;">
                            ${tabName} View
                        </div>
                        <div style="color:var(--text-muted);font-size:14px;">Data fetching soon...</div>
                    `;
        }
      }
    });
  });
}

function activateCodeWiki() {
  leftPanel.style.display = '';
  if (document.querySelector('.workspace')) {
    const ws = document.querySelector('.workspace');
    ws.style.gridTemplateColumns = '';
    ws.style.gridTemplateRows = '';
    const topH = document.getElementById('codeWikiTopHeader');
    if (topH) topH.remove();
  }

  isWikiMode = true; isConvertMode = false;
  setState({ section: "Analysis Engine", page: "Code Wiki", view: "Summary" });

  leftPanel.classList.add("fade-transition", "fade-out");
  displayPanel.classList.add("fade-transition", "fade-out");

  setTimeout(() => {
    leftPanel.innerHTML = `
      <div class="tree" style="display: block;">
        
        <div style="font-size: 12px; font-weight: 700; color: var(--text-primary); letter-spacing: 0.5px; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid var(--border); text-transform: uppercase;">
          PROJECT STRUCTURE
        </div>

        <!-- Project (Open Folder) -->
        <div class="tree-item folder open">
          <div class="tree-row" style="display: flex; justify-content: space-between; align-items: center; padding: 6px 8px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="arrow"></span>
              <span style="background: rgba(243, 156, 18, 0.2); width: 24px; height: 24px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 13px; color: #f39c12;">📁</span>
              <span class="folder-name" style="font-size: 14px; font-weight: 500; color: var(--text-primary);">Project</span>
            </div>
            <span style="background: var(--panel-bg); border: 1px solid var(--border); color: var(--text-muted); font-size: 11px; padding: 2px 8px; border-radius: 12px; font-weight: 600;">1</span>
          </div>

          <div class="tree-children">

            <!-- COBOL Programs (Open Folder) -->
            <div class="tree-item folder open">
              <div class="tree-row" style="display: flex; justify-content: space-between; align-items: center; padding: 6px 8px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span class="arrow"></span>
                  <span style="font-size: 14px; color: var(--text-primary);">📄</span>
                  <span class="folder-name" style="font-size: 14px; font-weight: 500; color: var(--text-primary);">COBOL Programs</span>
                </div>
                <span style="background: var(--panel-bg); border: 1px solid var(--border); color: var(--text-muted); font-size: 11px; padding: 2px 8px; border-radius: 12px; font-weight: 600;">${WIKI_PROGRAMS.length}</span>
              </div>
              <div class="tree-children">
                ${WIKI_PROGRAMS.map(p => wikiProgramTreeItem(p, true)).join('')}
              </div>
            </div>

            <!-- Copybooks (Open Folder) -->
            <div class="tree-item folder open">
              <div class="tree-row" style="display: flex; justify-content: space-between; align-items: center; padding: 6px 8px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span class="arrow"></span>
                  <span style="background: rgba(162,155,254,0.15); width: 24px; height: 24px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 13px; flex-shrink: 0;">📚</span>
                  <span class="folder-name" style="font-size: 14px; font-weight: 500; color: var(--text-primary);">Copybooks</span>
                </div>
                <span style="background: var(--panel-bg); border: 1px solid var(--border); color: var(--text-muted); font-size: 11px; padding: 2px 8px; border-radius: 12px; font-weight: 600;">${WIKI_COPYBOOKS.length}</span>
              </div>
              <div class="tree-children">
                ${WIKI_COPYBOOKS.map(wikiCopybookTreeItem).join('')}
              </div>
            </div>

            <!-- JCL Files (Open Folder) -->
            <div class="tree-item folder open">
              <div class="tree-row" style="display: flex; justify-content: space-between; align-items: center; padding: 6px 8px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span class="arrow"></span>
                  <span style="background: rgba(243,156,18,0.2); width: 24px; height: 24px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 13px; color: #f39c12;">🖥️</span>
                  <span class="folder-name" style="font-size: 14px; font-weight: 500; color: var(--text-primary);">JCL Files</span>
                </div>
                <span style="background: var(--panel-bg); border: 1px solid var(--border); color: var(--text-muted); font-size: 11px; padding: 2px 8px; border-radius: 12px; font-weight: 600;">1</span>
              </div>
              <div class="tree-children">
                <div class="tree-item file" data-wiki-type="jcl" style="display: flex; justify-content: space-between; align-items: center; padding: 6px 8px 6px 28px; cursor: pointer;">
                  <div style="display: flex; align-items: center; gap: 8px; flex: 1; min-width: 0;">
                    <span style="background: rgba(243,156,18,0.15); width: 24px; height: 24px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 13px; flex-shrink: 0;">🖥️</span>
                    <span style="font-size: 13px; font-weight: 500; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="EXECUTE">EXECUTE</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Batch flow (File) -->
            <div class="tree-item file" data-wiki-type="batch" style="display: flex; justify-content: space-between; align-items: center; padding: 6px 8px 6px 12px; cursor: pointer;">
              <div style="display: flex; align-items: center; gap: 8px; flex: 1; min-width: 0;">
                <span style="font-size: 14px; color: var(--text-primary); margin-left: 18px; flex-shrink: 0;">📅</span>
                <span style="font-size: 14px; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="Batch flow">Batch flow</span>
              </div>
              <span style="background: var(--panel-bg); border: 1px solid var(--border); color: var(--text-muted); font-size: 11px; padding: 2px 8px; border-radius: 12px; font-weight: 600; flex-shrink: 0;">3</span>
            </div>

            <!-- Screens (BMS) -->
            <div class="tree-item file" data-wiki-type="bms" style="display: flex; justify-content: space-between; align-items: center; padding: 6px 8px 6px 12px; cursor: pointer;">
              <div style="display: flex; align-items: center; gap: 8px; flex: 1; min-width: 0;">
                <span style="font-size: 14px; color: var(--text-primary); margin-left: 18px; flex-shrink: 0;">🖥️</span>
                <span style="font-size: 14px; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="Screens (BMS)">Screens (BMS)</span>
              </div>
              <span style="background: var(--panel-bg); border: 1px solid var(--border); color: var(--text-muted); font-size: 11px; padding: 2px 8px; border-radius: 12px; font-weight: 600;">1</span>
            </div>

            <!-- CICS (File) -->
            <div class="tree-item file" data-wiki-type="cics" style="display: flex; justify-content: space-between; align-items: center; padding: 6px 8px 6px 12px; cursor: pointer;">
              <div style="display: flex; align-items: center; gap: 8px; flex: 1; min-width: 0;">
                <span style="font-size: 14px; color: var(--text-primary); margin-left: 18px; flex-shrink: 0;">🗄️</span>
                <span style="font-size: 14px; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="CICS">CICS</span>
              </div>
              <span style="background: var(--panel-bg); border: 1px solid var(--border); color: var(--text-muted); font-size: 11px; padding: 2px 8px; border-radius: 12px; font-weight: 600; flex-shrink: 0;">5</span>
            </div>

            <!-- Data model (DB2) (Closed Folder) -->
            <div class="tree-item folder">
              <div class="tree-row" style="display: flex; justify-content: space-between; align-items: center; padding: 6px 8px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span class="arrow"></span>
                  <span style="font-size: 14px; color: var(--text-primary);">🛢️</span>
                  <span class="folder-name" style="font-size: 14px; font-weight: 500; color: var(--text-primary);">Data model (DB2)</span>
                </div>
                <span style="background: var(--panel-bg); border: 1px solid var(--border); color: var(--text-muted); font-size: 11px; padding: 2px 8px; border-radius: 12px; font-weight: 600;">0</span>
              </div>
              <div class="tree-children"></div>
            </div>

            <!-- Data model (VSAM) (Closed Folder) -->
            <div class="tree-item folder">
              <div class="tree-row" style="display: flex; justify-content: space-between; align-items: center; padding: 6px 8px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span class="arrow"></span>
                  <span style="font-size: 14px; color: var(--text-primary);">▦</span>
                  <span class="folder-name" style="font-size: 14px; font-weight: 500; color: var(--text-primary);">Data model (VSAM)</span>
                </div>
                <span style="background: var(--panel-bg); border: 1px solid var(--border); color: var(--text-muted); font-size: 11px; padding: 2px 8px; border-radius: 12px; font-weight: 600;">3</span>
              </div>
              <div class="tree-children"></div>
            </div>

            <!-- Data model (IMS) (Closed Folder) -->
            <div class="tree-item folder">
              <div class="tree-row" style="display: flex; justify-content: space-between; align-items: center; padding: 6px 8px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span class="arrow"></span>
                  <span style="font-size: 14px; color: var(--text-primary);">▦</span>
                  <span class="folder-name" style="font-size: 14px; font-weight: 500; color: var(--text-primary);">Data model (IMS)</span>
                </div>
                <span style="background: var(--panel-bg); border: 1px solid var(--border); color: var(--text-muted); font-size: 11px; padding: 2px 8px; border-radius: 12px; font-weight: 600;">0</span>
              </div>
              <div class="tree-children"></div>
            </div>

            <!-- Application vs template -->
            <div class="tree-item folder">
              <div class="tree-row" style="display: flex; justify-content: space-between; align-items: center; padding: 6px 8px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span class="arrow"></span>
                  <span style="font-size: 14px; color: var(--text-primary);">📂</span>
                  <span class="folder-name" style="font-size: 14px; font-weight: 500; color: var(--text-primary);">Application vs template</span>
                </div>
                <span style="background: var(--panel-bg); border: 1px solid var(--border); color: var(--text-muted); font-size: 11px; padding: 2px 8px; border-radius: 12px; font-weight: 600;">38</span>
              </div>
              <div class="tree-children"></div>
            </div>

          </div>
        </div>

      </div>
    `;

    const workspace = document.querySelector('.workspace');
    if (workspace) workspace.style.gridTemplateRows = "";
    let topHeader = document.getElementById('codeWikiTopHeader');
    if (topHeader) topHeader.remove();

    displayPanel.innerHTML = `
      <div style="padding-right: 16px; height: 100%; display: flex; flex-direction: column;">
        
        <!-- Project Info -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
          <span style="font-size: 16px; font-weight: 600; color: #fff;">Project: <span style="color: var(--text-muted);">Project</span></span>
          <button style="background: rgba(108, 92, 231, 0.15); color: #a29bfe; border: 1px solid rgba(108, 92, 231, 0.3); border-radius: 6px; padding: 6px 12px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s;" onmouseover="this.style.background='rgba(108,92,231,0.25)'" onmouseout="this.style.background='rgba(108,92,231,0.15)'">Download Artifacts</button>
        </div>

        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <h1 style="font-size: 16px; font-weight: 700; color: #fff; margin: 0; letter-spacing: 0.5px;">CODE WIKI</h1>
          <div style="display: flex; gap: 12px; align-items: center;">
            <span style="background: rgba(59, 130, 246, 0.1); color: #3b82f6; border: 1px solid rgba(59, 130, 246, 0.3); padding: 6px 14px; border-radius: 4px; font-size: 11px; font-weight: 700; text-transform: uppercase;">Mainframe COBOL 66</span>
            <span style="background: rgba(245, 158, 11, 0.1); color: #d97706; border: 1px solid rgba(245, 158, 11, 0.3); padding: 6px 14px; border-radius: 4px; font-size: 11px; font-weight: 700; text-transform: uppercase;">Confidence 98</span>
            <span style="background: rgba(46, 204, 113, 0.1); color: #2ecc71; border: 1px solid rgba(46, 204, 113, 0.2); padding: 6px 14px; border-radius: 4px; font-size: 11px; font-weight: 700; text-transform: uppercase;">Analysis Completed</span>
          </div>
        </div>

        <!-- Stats Grid -->
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; margin-bottom: 24px; overflow: hidden; flex-shrink: 0;">
          <div style="background: var(--panel-bg); padding: 16px; text-align: center;">
            <div style="font-size: 11px; color: var(--text-muted); text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px; margin-bottom: 8px;">Programs</div>
            <div style="font-size: 20px; font-weight: 700; color: #fff;">${WIKI_PROGRAMS.length}</div>
          </div>
          <div style="background: var(--panel-bg); padding: 16px; text-align: center;">
            <div style="font-size: 11px; color: var(--text-muted); text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px; margin-bottom: 8px;">Dependencies</div>
            <div style="font-size: 20px; font-weight: 700; color: #fff;">23</div>
          </div>
          <div style="background: var(--panel-bg); padding: 16px; text-align: center;">
            <div style="font-size: 11px; color: var(--text-muted); text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px; margin-bottom: 8px;">Entry Points</div>
            <div style="font-size: 20px; font-weight: 700; color: #fff;">1</div>
          </div>
        </div>

        <!-- Horizontal Main Navigation -->
        <div style="display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 0px; margin-bottom: 16px; flex-shrink: 0;">
          <div class="dashboard-tabs" style="border-bottom: none; margin-bottom: -1px; gap: 24px;">
            <button class="tab active" style="padding-bottom: 12px; font-size: 13px;">Project Structure</button>
            <button class="tab" style="padding-bottom: 12px; font-size: 13px;">System Diagnostics</button>
          </div>
          <button style="background: rgba(0, 212, 255, 0.1); color: #00d4ff; border: 1px solid rgba(0, 212, 255, 0.2); border-radius: 6px; padding: 6px 12px; font-size: 12px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 6px; margin-bottom: 8px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 12l10 5 10-5" /><path d="M2 17l10 5 10-5" /></svg>
            Waves
          </button>
        </div>

        <!-- The Content Area -->
        <div style="background: var(--panel-bg); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; padding: 0; flex: 1; min-height: 0; display: flex; flex-direction: column;">
          
          <!-- Sub-tabs Header (Dynamically updated) -->
          <div id="codeWikiSubTabs" style="display: flex; justify-content: space-between; align-items: center; padding: 12px 20px; border-bottom: 1px solid rgba(255,255,255,0.05);">
            <div style="font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px;">Select an item</div>
          </div>

          <!-- Main Content Area -->
          <div id="wikiContent" style="flex: 1; position: relative; overflow-y: auto;">
             
             <!-- Empty State -->
             <div id="view-empty" class="wiki-view flex-center" style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: var(--text-muted); padding-top: 100px;">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="1.5" style="margin-bottom: 16px;">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path><line x1="8" y1="7" x2="16" y2="7"></line><line x1="8" y1="11" x2="12" y2="11"></line>
                </svg>
                <div style="font-size: 14px;">Select an item in the tree to see its details</div>
             </div>
             
             <!-- Folder Views -->
             <div id="view-overview" class="wiki-view" style="display: none; padding: 24px;">
                <h3 style="color: #fff; margin-bottom: 16px; font-size: 16px;">Project Architecture Overview</h3>
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px;">
                    <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 16px; border-radius: 8px; text-align: center;">
                        <div style="font-size: 24px; color: #3498db; font-weight: 700;">42</div>
                        <div style="font-size: 10px; color: var(--text-muted); text-transform: uppercase; margin-top: 4px;">Programs</div>
                    </div>
                    <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 16px; border-radius: 8px; text-align: center;">
                        <div style="font-size: 24px; color: #2ecc71; font-weight: 700;">128</div>
                        <div style="font-size: 10px; color: var(--text-muted); text-transform: uppercase; margin-top: 4px;">SQL Statements</div>
                    </div>
                    <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 16px; border-radius: 8px; text-align: center;">
                        <div style="font-size: 24px; color: #f39c12; font-weight: 700;">15</div>
                        <div style="font-size: 10px; color: var(--text-muted); text-transform: uppercase; margin-top: 4px;">Tables</div>
                    </div>
                    <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 16px; border-radius: 8px; text-align: center;">
                        <div style="font-size: 24px; color: #9b59b6; font-weight: 700;">8</div>
                        <div style="font-size: 10px; color: var(--text-muted); text-transform: uppercase; margin-top: 4px;">DB2 Programs</div>
                    </div>
                </div>
                <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 16px; border-radius: 8px;">
                    <div style="font-size: 12px; font-weight: 600; color: #a29bfe; margin-bottom: 12px; text-transform: uppercase;">System Classification</div>
                    <p style="color: var(--text-muted); font-size: 13px; line-height: 1.6;">This folder contains core mainframe processing logic including batch jobs and CICS transactions connecting to DB2.</p>
                </div>
             </div>
             <div id="view-orchestration" class="wiki-view flex-center" style="display: none; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: var(--text-muted);">
                <div style="font-size: 32px; margin-bottom: 16px;">🔄</div>
                <div>Orchestration Flowchart mapping for this folder will be rendered here.</div>
             </div>
             <div id="view-datasets" class="wiki-view flex-center" style="display: none; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: var(--text-muted);">
                <div style="font-size: 32px; margin-bottom: 16px;">📊</div>
                <div>Datasets identified within this folder will be listed here.</div>
             </div>
             <div id="view-dependencies" class="wiki-view flex-center" style="display: none; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: var(--text-muted);">
                <div style="font-size: 32px; margin-bottom: 16px;">🔗</div>
                <div>External dependencies and calls will be visualized here.</div>
             </div>
             <div id="view-source" class="wiki-view flex-center" style="display: none; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: var(--text-muted);">
                <div style="font-size: 32px; margin-bottom: 16px;">💻</div>
                <div>Aggregated source code viewer for the directory.</div>
             </div>
             <div id="view-folder-json" class="wiki-view" style="display: none; padding: 24px; color: var(--text-muted);">
                <pre style="background: rgba(0,0,0,0.3); padding: 16px; border-radius: 8px; font-family: monospace; color: #a29bfe; font-size: 12px; overflow-x: auto;">
{
  "type": "folder",
  "childrenCount": 12,
  "hasDb2": true,
  "status": "Analyzed"
}
                </pre>
             </div>

             <!-- File Views -->
             <div id="view-file-summary" class="wiki-view" style="display: none;">
                <!-- content injected dynamically by selectCodeWikiItem -->
                <div style="padding: 20px 24px; border-bottom: 1px solid rgba(255,255,255,0.05);">
                    <div style="font-size: 18px; font-weight: 700; color: #fff; margin-bottom: 2px;">STUDENT-PROCESS</div>
                    <div style="font-size: 12px; color: var(--text-muted);">program</div>
                </div>
                <div style="padding: 16px 24px;">
                    <div style="font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 12px;">DEPENDENCIES (2)</div>
                    <div style="display: flex; align-items: center; gap: 10px; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.04);">
                        <span style="background: rgba(243,156,18,0.15); width: 28px; height: 28px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0;">📄</span>
                        <span style="font-size: 13px; font-weight: 500; color: #e2e8f0;">REPORT-FILE</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 10px; padding: 10px 0;">
                        <span style="background: rgba(52,152,219,0.15); width: 28px; height: 28px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0;">📄</span>
                        <span style="font-size: 13px; font-weight: 500; color: #e2e8f0;">STUDENT-FILE</span>
                    </div>
                </div>
             </div>
             <div id="view-sql" class="wiki-view" style="display: none; padding: 24px;">
                <div style="background: rgba(0,0,0,0.3); padding: 16px; border-radius: 8px; font-family: monospace; color: #2ecc71; font-size: 13px; border: 1px solid rgba(46, 204, 113, 0.2);">
                    SELECT ACCOUNT_ID, BALANCE, STATUS<br>
                    FROM MASTER_ACCOUNTS<br>
                    WHERE STATUS = 'ACTIVE'<br>
                    AND LAST_UPDATED < CURRENT_DATE;
                </div>
             </div>
             <div id="view-tree" class="wiki-view flex-center" style="display: none; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: var(--text-muted);">
                <div style="font-size: 32px; margin-bottom: 16px;">🌲</div>
                <div>AST Tree visualization will be rendered here.</div>
             </div>
             <div id="view-mindmap" class="wiki-view flex-center" style="display: none; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: var(--text-muted);">
                <div style="font-size: 32px; margin-bottom: 16px;">🧠</div>
                <div>Interactive Mind Map connecting related copybooks and JCLs.</div>
             </div>
             <div id="view-graph" class="wiki-view flex-center" style="display: none; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: var(--text-muted);">
                <div style="font-size: 32px; margin-bottom: 16px;">🕸️</div>
                <div>Force-directed dependency graph canvas.</div>
             </div>
             <div id="view-variables" class="wiki-view flex-center" style="display: none; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: var(--text-muted);">
                <div style="font-size: 32px; margin-bottom: 16px;">{x}</div>
                <div>Data division variables extracted and mapped.</div>
             </div>
             <div id="view-file-json" class="wiki-view" style="display: none; padding: 24px; color: var(--text-muted);">
                <pre style="background: rgba(0,0,0,0.3); padding: 16px; border-radius: 8px; font-family: monospace; color: #a29bfe; font-size: 12px; overflow-x: auto;">
{
  "type": "program",
  "language": "COBOL",
  "loc": 1250,
  "complexity": 12,
  "dependencies": ["COPYBOOK-A", "DB2-TABLE-B"]
}
                </pre>
             </div>

             <!-- JCL Views -->
             <div id="view-jcl-overview" class="wiki-view" style="display: none;"></div>
             <div id="view-jcl-orch" class="wiki-view flex-center" style="display: none; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: var(--text-muted);">
                <div style="font-size: 32px; margin-bottom: 16px;">🔄</div>
                <div>JCL Orchestration flow will be rendered here.</div>
             </div>
             <div id="view-jcl-datasets" class="wiki-view flex-center" style="display: none; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: var(--text-muted);">
                <div style="font-size: 32px; margin-bottom: 16px;">📊</div>
                <div>Datasets referenced in this JCL will be listed here.</div>
             </div>
             <div id="view-jcl-deps" class="wiki-view flex-center" style="display: none; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: var(--text-muted);">
                <div style="font-size: 32px; margin-bottom: 16px;">🔗</div>
                <div>Dependencies for this JCL will be shown here.</div>
             </div>

             <!-- Batch View -->
             <div id="view-batch-summary" class="wiki-view" style="display: none;"></div>

             <!-- BMS View -->
             <div id="view-bms-summary" class="wiki-view" style="display: none;"></div>

             <!-- CICS View -->
             <div id="view-cics-summary" class="wiki-view" style="display: none;"></div>
          </div>
        </div>
      </div>
    `;

    leftPanel.classList.remove("fade-out");
    displayPanel.classList.remove("fade-out");

    attachWikiEvents();
  }, 200);
}

syncSidebarActive(window.EQUIVALIC_INITIAL_PAGE);
activateCodeWiki();
