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

window.selectCodeWikiItem = function(type, name, element) {
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
    } else if (type === 'file') {
        tabsHtml = `
            <div style="font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px;">${name}</div>
            <div style="display: flex; gap: 16px;">
                <span class="wiki-tab" onclick="switchCodeWikiTab('view-file-summary', this)" style="font-size: 11px; font-weight: 500; color: var(--text-muted); cursor: pointer; transition: color 0.2s;">Summary</span>
                <span class="wiki-tab" onclick="switchCodeWikiTab('view-sql', this)" style="font-size: 11px; font-weight: 500; color: var(--text-muted); cursor: pointer; transition: color 0.2s;">SQL</span>
                <span class="wiki-tab" onclick="switchCodeWikiTab('view-tree', this)" style="font-size: 11px; font-weight: 500; color: var(--text-muted); cursor: pointer; transition: color 0.2s;">Tree</span>
                <span class="wiki-tab" onclick="switchCodeWikiTab('view-mindmap', this)" style="font-size: 11px; font-weight: 500; color: var(--text-muted); cursor: pointer; transition: color 0.2s;">Mind Map</span>
                <span class="wiki-tab" onclick="switchCodeWikiTab('view-graph', this)" style="font-size: 11px; font-weight: 500; color: var(--text-muted); cursor: pointer; transition: color 0.2s;">Graph</span>
                <span class="wiki-tab" onclick="switchCodeWikiTab('view-variables', this)" style="font-size: 11px; font-weight: 500; color: var(--text-muted); cursor: pointer; transition: color 0.2s;">Variables</span>
                <span class="wiki-tab" onclick="switchCodeWikiTab('view-file-json', this)" style="font-size: 11px; font-weight: 500; color: var(--text-muted); cursor: pointer; transition: color 0.2s;">JSON</span>
            </div>
        `;
        tabsContainer.innerHTML = tabsHtml;
        const titleEl = document.getElementById('file-summary-title');
        if (titleEl) titleEl.textContent = name;
        const firstTab = tabsContainer.querySelector('.wiki-tab');
        if (firstTab) switchCodeWikiTab('view-file-summary', firstTab);
    }
};

window.switchCodeWikiTab = function(viewId, tabElement) {
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

function attachWikiEvents() {
    const backBtn = document.getElementById("backToDashboard");
    if (backBtn) backBtn.addEventListener("click", restoreDashboard);

    // Folder toggle and selection
    document.querySelectorAll(".tree-row").forEach(row => {
        row.addEventListener("click", (e) => {
            const folder = row.parentElement;
            if (folder.classList.contains("folder")) {
                folder.classList.toggle("open");
                
                // Select the folder and update tabs
                const nameEl = row.querySelector('.folder-name') || row.querySelector('span:nth-child(3)');
                const name = nameEl ? nameEl.textContent.trim() : 'Folder';
                if (window.selectCodeWikiItem) {
                    window.selectCodeWikiItem('folder', name, row);
                }
            }
        });
    });

    // File selection
    document.querySelectorAll(".file").forEach(file => {
        file.addEventListener("click", (e) => {
            // Find the name. Usually the 2nd span inside the flex div.
            // .tree-item.file -> div -> span(icon), span(name)
            const spans = file.querySelectorAll('span');
            let name = 'File';
            if (spans.length >= 2) {
                // The name is typically the last span inside the inner div
                const innerDiv = file.querySelector('div');
                if (innerDiv) {
                    const innerSpans = innerDiv.querySelectorAll('span');
                    if (innerSpans.length > 1) {
                        name = innerSpans[innerSpans.length - 1].textContent.trim();
                    } else {
                        name = innerSpans[0].textContent.trim();
                    }
                }
            }
            if (window.selectCodeWikiItem) {
                window.selectCodeWikiItem('file', name, file);
            }
            // Stop propagation so it doesn't trigger parent folders if nested
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
      
      leftPanel.classList.add("fade-transition","fade-out");
      displayPanel.classList.add("fade-transition","fade-out");

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
                <span style="background: var(--panel-bg); border: 1px solid var(--border); color: var(--text-muted); font-size: 11px; padding: 2px 8px; border-radius: 12px; font-weight: 600;">1</span>
              </div>

              <div class="tree-children">
                <!-- READ-FILE-EXAMPLE (Selected File) -->
                <div class="tree-item file" style="display: flex; justify-content: space-between; align-items: center; padding: 6px 8px 6px 28px; background: rgba(0, 212, 255, 0.08); border-radius: 6px;">
                  <div style="display: flex; align-items: center; gap: 8px; flex: 1; min-width: 0;">
                    <span style="background: rgba(0, 212, 255, 0.15); width: 24px; height: 24px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 13px; color: var(--accent2); flex-shrink: 0;">📄</span>
                    <span style="font-size: 13px; font-weight: 600; color: var(--accent2); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="READ-FILE-EXAMPLE">READ-FILE-EXAMPLE</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Batch flow (File) -->
            <div class="tree-item file" style="display: flex; justify-content: space-between; align-items: center; padding: 6px 8px 6px 12px;">
              <div style="display: flex; align-items: center; gap: 8px; flex: 1; min-width: 0;">
                <span style="font-size: 14px; color: var(--text-primary); margin-left: 18px; flex-shrink: 0;">📅</span>
                <span style="font-size: 14px; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="Batch flow">Batch flow</span>
              </div>
              <span style="background: var(--panel-bg); border: 1px solid var(--border); color: var(--text-muted); font-size: 11px; padding: 2px 8px; border-radius: 12px; font-weight: 600; flex-shrink: 0;">0</span>
            </div>

            <!-- Screens (BMS) (Closed Folder) -->
            <div class="tree-item folder">
              <div class="tree-row" style="display: flex; justify-content: space-between; align-items: center; padding: 6px 8px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span class="arrow"></span>
                  <span style="font-size: 14px; color: var(--text-primary);">🖥️</span>
                  <span class="folder-name" style="font-size: 14px; font-weight: 500; color: var(--text-primary);">Screens (BMS)</span>
                </div>
                <span style="background: var(--panel-bg); border: 1px solid var(--border); color: var(--text-muted); font-size: 11px; padding: 2px 8px; border-radius: 12px; font-weight: 600;">0</span>
              </div>
              <div class="tree-children"></div>
            </div>

            <!-- CICS (File) -->
            <div class="tree-item file" style="display: flex; justify-content: space-between; align-items: center; padding: 6px 8px 6px 12px;">
              <div style="display: flex; align-items: center; gap: 8px; flex: 1; min-width: 0;">
                <span style="font-size: 14px; color: var(--text-primary); margin-left: 18px; flex-shrink: 0;">🗄️</span>
                <span style="font-size: 14px; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="CICS">CICS</span>
              </div>
              <span style="background: var(--panel-bg); border: 1px solid var(--border); color: var(--text-muted); font-size: 11px; padding: 2px 8px; border-radius: 12px; font-weight: 600; flex-shrink: 0;">0</span>
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

                        <!-- Application vs template (File) -->
            <div class="tree-item file" style="display: flex; justify-content: space-between; align-items: center; padding: 6px 8px 6px 12px;">
              <div style="display: flex; align-items: center; gap: 8px; flex: 1; min-width: 0;">
                <span style="font-size: 14px; color: var(--text-primary); margin-left: 18px; flex-shrink: 0;">📂</span>
                <span style="font-size: 14px; color: var(--text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="Application vs templateeeeeee">Application vs templateeeeeee</span>
              </div>
              <span style="background: var(--panel-bg); border: 1px solid var(--border); color: var(--text-muted); font-size: 11px; padding: 2px 8px; border-radius: 12px; font-weight: 600; flex-shrink: 0;">1</span>
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
            <span style="background: rgba(59, 130, 246, 0.1); color: #3b82f6; border: 1px solid rgba(59, 130, 246, 0.3); padding: 6px 14px; border-radius: 16px; font-size: 11px; font-weight: 700; cursor: pointer; transition: opacity 0.2s;" onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'" onclick="Array.from(document.querySelectorAll('.tab')).find(t => t.textContent.trim() === 'System Diagnostics')?.click()">Mainframe COBOL 66</span>
            <span style="background: rgba(245, 158, 11, 0.1); color: #d97706; border: 1px solid rgba(245, 158, 11, 0.3); padding: 6px 14px; border-radius: 16px; font-size: 11px; font-weight: 700; cursor: pointer; transition: opacity 0.2s;" onmouseover="this.style.opacity='0.8'" onmouseout="this.style.opacity='1'" onclick="Array.from(document.querySelectorAll('.tab')).find(t => t.textContent.trim() === 'System Diagnostics')?.click()">Confidence 98</span>
            <span style="background: rgba(46, 204, 113, 0.1); color: #2ecc71; border: 1px solid rgba(46, 204, 113, 0.2); padding: 6px 14px; border-radius: 4px; font-size: 11px; font-weight: 700; text-transform: uppercase;">Analysis Completed</span>
          </div>
        </div>

        <!-- Stats Grid -->
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; margin-bottom: 24px; overflow: hidden; flex-shrink: 0;">
          <div style="background: var(--panel-bg); padding: 16px; text-align: center;">
            <div style="font-size: 11px; color: var(--text-muted); text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px; margin-bottom: 8px;">Programs</div>
            <div style="font-size: 20px; font-weight: 700; color: #fff;">2</div>
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
             <div id="view-file-summary" class="wiki-view" style="display: none; padding: 24px;">
                <h3 style="color: #fff; margin-bottom: 16px; font-size: 16px;" id="file-summary-title">Program Summary</h3>
                <div style="margin-bottom: 20px;">
                    <strong style="color: var(--text-muted); font-size: 10px; text-transform: uppercase;">Purpose</strong>
                    <p style="margin-top: 4px; color: #fff; font-size: 13px; line-height: 1.6;">This COBOL program reads transaction files and applies daily updates to the master DB2 table. It incorporates standard error handling.</p>
                </div>
                <div style="margin-bottom: 20px;">
                    <strong style="color: var(--text-muted); font-size: 10px; text-transform: uppercase;">Complexity</strong>
                    <p style="margin-top: 4px; color: #fff; font-size: 13px;">Moderate (Cyclomatic Complexity: 12)</p>
                </div>
                <div style="margin-bottom: 20px;">
                    <strong style="color: var(--text-muted); font-size: 10px; text-transform: uppercase;">Key Components</strong>
                    <ul style="margin-top: 4px; color: #fff; font-size: 13px; padding-left: 20px; line-height: 1.6;">
                        <li>INPUT-FILE-HANDLER</li>
                        <li>DB2-UPDATE-ROUTINE</li>
                        <li>ERROR-LOGGING</li>
                    </ul>
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
