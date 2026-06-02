/* ============================================================
   Conversion Status page logic
   Source: ChangedAnalysisEngine (2).html
   Contains this page's bootstrap, renderers, handlers, and data only.
============================================================ */
window.EQUIVALIC_INITIAL_PAGE = window.EQUIVALIC_INITIAL_PAGE || 'Conversion Status';

/* ============================================================
   Page bootstrap and shared shell utilities
============================================================ */
const appState = { product: "Product Suite", section: "Convert", page: "Conversion Status", view: "Overview" };
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


function activateConversionStatusMode() {
      document.querySelector(".workspace")?.classList.add("status-dashboard-workspace");
      const leftHTML = "";
      const displayHTML = `
        <div class="status-dashboard">
          <div class="status-header">
            <div class="status-header-content">
              <div>
                <div class="status-title">Conversion Status Dashboard</div>
                <div class="status-tabs">
                  <button class="status-tab active">Overview</button>
                  <button class="status-tab">Conversion Report</button>
                  <button class="status-tab">Gate Details</button>
                  <button class="status-tab">Planning</button>
                  <button class="status-tab">Advanced</button>
                </div>
              </div>
              <div class="status-header-actions">
                <button class="status-button secondary">View Issues</button>
                <button class="status-button primary">Export Report</button>
              </div>
            </div>
          </div>

          <div class="status-top-grid">
            <section class="status-card latest-card">
              <div class="latest-head">
                <div>
                  <h3>Latest Conversion Run</h3>
                  <div class="status-time">6/2/2026, 3:36:48 PM</div>
                </div>
                <span class="review-pill">Needs Review</span>
              </div>
              <div class="conversion-kpis">
                <div class="kpi-box"><strong>60%</strong><span>Success rate</span></div>
                <div class="kpi-box"><strong>3</strong><span>Successful</span></div>
                <div class="kpi-box"><strong>2</strong><span>Partial</span></div>
                <div class="kpi-box"><strong>0</strong><span>Failed</span></div>
              </div>
            </section>

            <section class="status-card next-actions-card">
              <h3>Next Actions</h3>
              <div class="next-action-row">
                <div>
                  <strong>2 item(s) need attention</strong>
                  <span>Review the file table and gate details for supporting evidence.</span>
                </div>
                <button class="status-button secondary">View Issues</button>
              </div>
              <div class="next-action-row">
                <div>
                  <strong>Share conversion evidence</strong>
                  <span>Export a Markdown report for review, audit, or triage.</span>
                </div>
                <button class="status-button primary">Export Report</button>
              </div>
            </section>
          </div>

          <section class="status-card">
            <div class="section-heading">
              <h3>Uploaded files</h3>
              <p>Reconciled with conversion status; every file appears in the list below.</p>
            </div>
            <div class="uploaded-grid">
              <div class="upload-tile">
                <div class="tile-icon document"></div>
                <strong>2</strong>
                <span class="tile-note">(4 Batch, 0 CICS; -2 no conversion)</span>
                <small>COBOL Programs</small>
              </div>
              <div class="upload-tile">
                <div class="tile-icon copybook"></div>
                <strong>3</strong>
                <small>Copybooks</small>
              </div>
              <div class="upload-tile">
                <div class="tile-icon script"></div>
                <strong>1</strong>
                <small>JCL Scripts</small>
              </div>
            </div>
          </section>

          <section class="status-card">
            <div class="section-heading">
              <h3>Conversion Results</h3>
              <p>Success / Partial / Failed = COBOL + JCL only. Copybooks are tracked as dependencies.</p>
            </div>
            <div class="result-bar" aria-label="60 percent successful, 40 percent partial">
              <span class="result-success" style="width: 60%;">60%</span>
              <span class="result-partial" style="width: 40%;">40%</span>
            </div>
            <div class="result-legend">
              <span class="success">&#10003; 3 Successful</span>
              <span class="partial">&#9888; 2 Partial</span>
              <span class="failed">&#10005; 0 Failed</span>
            </div>
            <h4 class="breakdown-title">Detailed Breakdown by File Type</h4>
            <div class="breakdown-grid">
              <div class="breakdown-card cobol-batch">
                <strong>COBOL Batch</strong>
                <span>Success: 2</span>
                <span>Partial: 2</span>
                <span>Failed: 0</span>
              </div>
              <div class="breakdown-card cobol-cics">
                <strong>COBOL CICS</strong>
                <span>Success: 0</span>
                <span>Partial: 0</span>
                <span>Failed: 0</span>
              </div>
              <div class="breakdown-card jcl-scripts">
                <strong>JCL Scripts</strong>
                <span>Success: 1</span>
                <span>Partial: 0</span>
                <span>Failed: 0</span>
              </div>
            </div>
          </section>

          <section class="status-card file-status-card">
            <h3>File Status</h3>
            <div class="file-toolbar">
              <input type="search" placeholder="Search files..." />
              <select aria-label="Filter file status">
                <option>Show All</option>
                <option>Success</option>
                <option>Dependency</option>
                <option>Metadata</option>
              </select>
            </div>
            <div class="status-table-wrap">
              <table class="status-table">
                <thead>
                  <tr>
                    <th>File Name</th>
                    <th>Status</th>
                    <th>Issue</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>ORDINV.cbl</td><td><span class="file-badge success">&#10003; Success</span></td><td>-</td><td><button>View details</button></td></tr>
                  <tr><td>ORDVAL.cbl</td><td><span class="file-badge success">&#10003; Success</span></td><td>-</td><td><button>View details</button></td></tr>
                  <tr><td>INVSTRUC.cpy</td><td><span class="file-badge dependency">Dependency</span></td><td>Included as dependency, not converted separately</td><td><button>View details</button></td></tr>
                  <tr><td>ORDSTRUC.cpy</td><td><span class="file-badge dependency">Dependency</span></td><td>Included as dependency, not converted separately</td><td><button>View details</button></td></tr>
                  <tr><td>SQLCODES.cpy</td><td><span class="file-badge dependency">Dependency</span></td><td>Included as dependency, not converted separately</td><td><button>View details</button></td></tr>
                  <tr><td>EXECUTE.jcl</td><td><span class="file-badge metadata">Metadata</span></td><td>Orchestrates IKJEFT01, ORDVAL, ORDINV | 3 IN, 4 OUT | Class: A</td><td><button>View details</button></td></tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>`;
      activateMode('Conversion Status', 'Conversion Status', leftHTML, displayHTML);
    }
    

syncSidebarActive(window.EQUIVALIC_INITIAL_PAGE);
activateConversionStatusMode();

// File Details Modal Functionality
function createFileDetailsModal() {
  const modalHTML = `
    <div class="file-details-modal-overlay" id="fileDetailsModal">
      <div class="file-details-modal">
        <div class="file-details-header">
          <div class="file-details-title">
            <div class="file-icon"></div>
            <span id="modalFileName">ORDSTRUC.cpy</span>
          </div>
          <button class="modal-close-btn" onclick="closeFileDetailsModal()">&times;</button>
        </div>
        <div class="file-details-content" id="modalContent">
          <div class="detail-section">
            <div class="detail-row">
              <div class="detail-label">Status:</div>
              <div class="detail-value">
                <span class="status-badge dependency">Dependency</span>
              </div>
            </div>
            <div class="detail-row">
              <div class="detail-label">File Type:</div>
              <div class="detail-value">copybook</div>
            </div>
          </div>

          <div class="detail-section">
            <div class="detail-section-title">Processing Stages</div>
            <div class="processing-stages">
              <div class="stage-item">
                <div class="stage-icon skipped">⊘</div>
                <div class="stage-name">Dependency</div>
                <div class="stage-status">skipped</div>
              </div>
            </div>
          </div>

          <div class="detail-section">
            <div class="detail-section-title">Issue Details</div>
            <div class="issue-box">
              <div class="issue-label">Problem</div>
              <div class="issue-text">Included as dependency (not converted separately)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Remove existing modal if present
  const existingModal = document.getElementById('fileDetailsModal');
  if (existingModal) {
    existingModal.remove();
  }
  
  // Add modal to body
  document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function openFileDetailsModal(fileName, status, issue) {
  createFileDetailsModal();
  
  const modal = document.getElementById('fileDetailsModal');
  const fileNameEl = document.getElementById('modalFileName');
  
  fileNameEl.textContent = fileName;
  
  // Show modal
  setTimeout(() => {
    modal.classList.add('active');
  }, 10);
  
  // Close on overlay click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeFileDetailsModal();
    }
  });
  
  // Close on Escape key
  document.addEventListener('keydown', handleEscapeKey);
}

function closeFileDetailsModal() {
  const modal = document.getElementById('fileDetailsModal');
  if (modal) {
    modal.classList.remove('active');
    setTimeout(() => {
      modal.remove();
    }, 250);
  }
  document.removeEventListener('keydown', handleEscapeKey);
}

function handleEscapeKey(e) {
  if (e.key === 'Escape') {
    closeFileDetailsModal();
  }
}

// Attach event listeners to View details buttons
setTimeout(() => {
  const detailButtons = document.querySelectorAll('.status-table button');
  detailButtons.forEach((button, index) => {
    button.addEventListener('click', (e) => {
      const row = e.target.closest('tr');
      const fileName = row.cells[0].textContent;
      const status = row.cells[1].textContent.trim();
      const issue = row.cells[2].textContent;
      
      openFileDetailsModal(fileName, status, issue);
    });
  });
}, 500);

// Status Tabs Switching Functionality
setTimeout(() => {
  const statusTabs = document.querySelectorAll('.status-tab');
  
  statusTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active class from all tabs
      statusTabs.forEach(t => t.classList.remove('active'));
      
      // Add active class to clicked tab
      tab.classList.add('active');
      
      // Get the tab name
      const tabName = tab.textContent.trim();
      
      // Update content based on selected tab
      updateStatusContent(tabName);
    });
  });
}, 500);

function updateStatusContent(tabName) {
  const contentArea = document.querySelector('.status-dashboard');
  
  // Store the header
  const header = contentArea.querySelector('.status-header');
  
  // Define content for each tab
  const tabContents = {
    'Overview': getOverviewContent(),
    'Conversion Report': getConversionReportContent(),
    'Gate Details': getGateDetailsContent(),
    'Planning': getPlanningContent(),
    'Advanced': getAdvancedContent()
  };
  
  // Get new content
  const newContent = tabContents[tabName] || tabContents['Overview'];
  
  // Fade out
  contentArea.style.opacity = '0';
  contentArea.style.transition = 'opacity 0.2s ease';
  
  setTimeout(() => {
    // Clear current content except header
    contentArea.innerHTML = '';
    contentArea.appendChild(header);
    
    // Add new content
    contentArea.insertAdjacentHTML('beforeend', newContent);
    
    // Fade in
    contentArea.style.opacity = '1';
    
    // Reattach event listeners based on tab
    if (tabName === 'Overview') {
      attachDetailButtonListeners();
    } else if (tabName === 'Advanced') {
      attachArtifactSelectorListener();
    }
  }, 200);
}

function attachArtifactSelectorListener() {
  setTimeout(() => {
    const selector = document.getElementById('artifactSelect');
    const viewer = document.getElementById('artifactViewer');
    
    if (selector && viewer) {
      selector.addEventListener('change', (e) => {
        const value = e.target.value;
        
        if (!value) {
          viewer.textContent = 'Select an artifact above to view its raw JSON.';
          return;
        }
        
        // Sample JSON data for different artifacts
        const artifacts = {
          'ordinv': {
            "fileName": "ORDINV.cbl",
            "status": "success",
            "conversionDate": "2026-06-02T15:36:48Z",
            "linesOfCode": 342,
            "targetLanguage": "Java",
            "output": "ORDINV.java",
            "issues": []
          },
          'ordval': {
            "fileName": "ORDVAL.cbl",
            "status": "success",
            "conversionDate": "2026-06-02T15:36:48Z",
            "linesOfCode": 218,
            "targetLanguage": "Java",
            "output": "ORDVAL.java",
            "issues": []
          },
          'invstruc': {
            "fileName": "INVSTRUC.cpy",
            "status": "dependency",
            "stage": "skipped",
            "reason": "Included as dependency (not converted separately)",
            "referencedBy": ["ORDINV.cbl", "ORDVAL.cbl"]
          },
          'ordstruc': {
            "fileName": "ORDSTRUC.cpy",
            "status": "dependency",
            "stage": "skipped",
            "reason": "Included as dependency (not converted separately)",
            "referencedBy": ["ORDINV.cbl"]
          },
          'sqlcodes': {
            "fileName": "SQLCODES.cpy",
            "status": "dependency",
            "stage": "skipped",
            "reason": "Included as dependency (not converted separately)",
            "referencedBy": ["ORDINV.cbl", "ORDVAL.cbl"]
          },
          'execute': {
            "fileName": "EXECUTE.jcl",
            "status": "metadata",
            "jobName": "EXECUTE",
            "steps": [
              { "name": "STEP01", "program": "IKJEFT01" },
              { "name": "STEP02", "program": "ORDVAL" },
              { "name": "STEP03", "program": "ORDINV" }
            ],
            "inputs": 3,
            "outputs": 4,
            "class": "A"
          }
        };
        
        const data = artifacts[value];
        viewer.textContent = JSON.stringify(data, null, 2);
      });
    }
  }, 100);
}

function getOverviewContent() {
  return `
    <div class="status-top-grid">
      <section class="status-card latest-card">
        <div class="latest-head">
          <div>
            <h3>Latest Conversion Run</h3>
            <div class="status-time">6/2/2026, 3:36:48 PM</div>
          </div>
          <span class="review-pill">Needs Review</span>
        </div>
        <div class="conversion-kpis">
          <div class="kpi-box"><strong>60%</strong><span>Success rate</span></div>
          <div class="kpi-box"><strong>3</strong><span>Successful</span></div>
          <div class="kpi-box"><strong>2</strong><span>Partial</span></div>
          <div class="kpi-box"><strong>0</strong><span>Failed</span></div>
        </div>
      </section>

      <section class="status-card next-actions-card">
        <h3>Next Actions</h3>
        <div class="next-action-row">
          <div>
            <strong>2 item(s) need attention</strong>
            <span>Review the file table and gate details for supporting evidence.</span>
          </div>
          <button class="status-button secondary">View Issues</button>
        </div>
        <div class="next-action-row">
          <div>
            <strong>Share conversion evidence</strong>
            <span>Export a Markdown report for review, audit, or triage.</span>
          </div>
          <button class="status-button primary">Export Report</button>
        </div>
      </section>
    </div>

    <section class="status-card">
      <div class="section-heading">
        <h3>Uploaded files</h3>
        <p>Reconciled with conversion status; every file appears in the list below.</p>
      </div>
      <div class="uploaded-grid">
        <div class="upload-tile">
          <div class="tile-icon document"></div>
          <strong>2</strong>
          <span class="tile-note">(4 Batch, 0 CICS; -2 no conversion)</span>
          <small>COBOL Programs</small>
        </div>
        <div class="upload-tile">
          <div class="tile-icon copybook"></div>
          <strong>3</strong>
          <small>Copybooks</small>
        </div>
        <div class="upload-tile">
          <div class="tile-icon script"></div>
          <strong>1</strong>
          <small>JCL Scripts</small>
        </div>
      </div>
    </section>

    <section class="status-card">
      <div class="section-heading">
        <h3>Conversion Results</h3>
        <p>Success / Partial / Failed = COBOL + JCL only. Copybooks are tracked as dependencies.</p>
      </div>
      <div class="result-bar" aria-label="60 percent successful, 40 percent partial">
        <span class="result-success" style="width: 60%;">60%</span>
        <span class="result-partial" style="width: 40%;">40%</span>
      </div>
      <div class="result-legend">
        <span class="success">&#10003; 3 Successful</span>
        <span class="partial">&#9888; 2 Partial</span>
        <span class="failed">&#10005; 0 Failed</span>
      </div>
      <h4 class="breakdown-title">Detailed Breakdown by File Type</h4>
      <div class="breakdown-grid">
        <div class="breakdown-card cobol-batch">
          <strong>COBOL Batch</strong>
          <span>Success: 2</span>
          <span>Partial: 2</span>
          <span>Failed: 0</span>
        </div>
        <div class="breakdown-card cobol-cics">
          <strong>COBOL CICS</strong>
          <span>Success: 0</span>
          <span>Partial: 0</span>
          <span>Failed: 0</span>
        </div>
        <div class="breakdown-card jcl-scripts">
          <strong>JCL Scripts</strong>
          <span>Success: 1</span>
          <span>Partial: 0</span>
          <span>Failed: 0</span>
        </div>
      </div>
    </section>

    <section class="status-card file-status-card">
      <h3>File Status</h3>
      <div class="file-toolbar">
        <input type="search" placeholder="Search files..." />
        <select aria-label="Filter file status">
          <option>Show All</option>
          <option>Success</option>
          <option>Dependency</option>
          <option>Metadata</option>
        </select>
      </div>
      <div class="status-table-wrap">
        <table class="status-table">
          <thead>
            <tr>
              <th>File Name</th>
              <th>Status</th>
              <th>Issue</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>ORDINV.cbl</td><td><span class="file-badge success">&#10003; Success</span></td><td>-</td><td><button>View details</button></td></tr>
            <tr><td>ORDVAL.cbl</td><td><span class="file-badge success">&#10003; Success</span></td><td>-</td><td><button>View details</button></td></tr>
            <tr><td>INVSTRUC.cpy</td><td><span class="file-badge dependency">Dependency</span></td><td>Included as dependency, not converted separately</td><td><button>View details</button></td></tr>
            <tr><td>ORDSTRUC.cpy</td><td><span class="file-badge dependency">Dependency</span></td><td>Included as dependency, not converted separately</td><td><button>View details</button></td></tr>
            <tr><td>SQLCODES.cpy</td><td><span class="file-badge dependency">Dependency</span></td><td>Included as dependency, not converted separately</td><td><button>View details</button></td></tr>
            <tr><td>EXECUTE.jcl</td><td><span class="file-badge metadata">Metadata</span></td><td>Orchestrates IKJEFT01, ORDVAL, ORDINV | 3 IN, 4 OUT | Class: A</td><td><button>View details</button></td></tr>
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function getConversionReportContent() {
  return `
    <section class="status-card">
      <h3>Conversion Report</h3>
      <p style="color: var(--text-muted); font-size: 14px;">Content coming soon...</p>
    </section>
  `;
}

function getGateDetailsContent() {
  return `
    <section class="status-card">
      <h3>Gate Details</h3>
      <p style="color: var(--text-muted); font-size: 14px;">Content coming soon...</p>
    </section>
  `;
}

function getPlanningContent() {
  return `
    <section class="status-card">
      <h3>Planning</h3>
      <p style="color: var(--text-muted); font-size: 14px;">Content coming soon...</p>
    </section>
  `;
}

function getAdvancedContent() {
  return `
    <section class="status-card">
      <h3>Advanced Diagnostics</h3>
      <p style="color: var(--text-muted); margin-bottom: 20px;">Raw artifacts are available for debugging and audit trails.</p>
      
      <div style="margin-bottom: 20px;">
        <label for="artifactSelect" style="display: block; color: var(--text-muted); font-size: 13px; margin-bottom: 8px; font-weight: 600;">— Select an artifact —</label>
        <select id="artifactSelect" style="width: 100%; min-height: 42px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.12); background: rgba(20,26,36,0.9); color: var(--text-primary); padding: 0 14px; font-size: 14px; outline: none; cursor: pointer;">
          <option value="">— Select an artifact —</option>
          <option value="ordinv">ORDINV.cbl - Conversion Output</option>
          <option value="ordval">ORDVAL.cbl - Conversion Output</option>
          <option value="invstruc">INVSTRUC.cpy - Dependency Analysis</option>
          <option value="ordstruc">ORDSTRUC.cpy - Dependency Analysis</option>
          <option value="sqlcodes">SQLCODES.cpy - Dependency Analysis</option>
          <option value="execute">EXECUTE.jcl - Metadata Extract</option>
        </select>
      </div>

      <div id="artifactViewer" style="background: #0a0e14; border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 20px; min-height: 280px; font-family: 'Courier New', monospace; font-size: 13px; color: #a0aec0; line-height: 1.6; overflow-x: auto;">
        Select an artifact above to view its raw JSON.
      </div>
    </section>
  `;
}

function attachDetailButtonListeners() {
  setTimeout(() => {
    const detailButtons = document.querySelectorAll('.status-table button');
    detailButtons.forEach((button) => {
      button.addEventListener('click', (e) => {
        const row = e.target.closest('tr');
        const fileName = row.cells[0].textContent;
        const status = row.cells[1].textContent.trim();
        const issue = row.cells[2].textContent;
        
        openFileDetailsModal(fileName, status, issue);
      });
    });
  }, 100);
}

// View Issues Modal Functionality
function openIssuesModal() {
  const modalHTML = `
    <div class="issues-modal-overlay" id="issuesModal">
      <div class="issues-modal">
        <div class="file-details-header">
          <div class="file-details-title">
            <span>Issues Requiring Attention</span>
          </div>
          <button class="modal-close-btn" onclick="closeIssuesModal()">&times;</button>
        </div>
        <div class="file-details-content">
          <div style="margin-bottom: 20px;">
            <div style="font-size: 14px; color: var(--text-muted); margin-bottom: 12px;">
              <strong style="color: var(--text-primary);">2 items</strong> need attention
            </div>
          </div>

          <div class="detail-section">
            <div class="detail-section-title">Files with Issues</div>
            
            <div class="issue-box" style="margin-bottom: 16px;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                <div>
                  <div style="font-size: 14px; font-weight: 700; color: var(--text-primary); margin-bottom: 4px;">INVSTRUC.cpy</div>
                  <div class="issue-label">Dependency Issue</div>
                </div>
                <span class="status-badge dependency">Dependency</span>
              </div>
              <div class="issue-text">Included as dependency (not converted separately)</div>
            </div>

            <div class="issue-box">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                <div>
                  <div style="font-size: 14px; font-weight: 700; color: var(--text-primary); margin-bottom: 4px;">ORDSTRUC.cpy</div>
                  <div class="issue-label">Dependency Issue</div>
                </div>
                <span class="status-badge dependency">Dependency</span>
              </div>
              <div class="issue-text">Included as dependency (not converted separately)</div>
            </div>
          </div>

          <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.08);">
            <h4 style="color: var(--text-primary); font-size: 14px; margin-bottom: 12px;">Recommended Actions</h4>
            <ul style="color: var(--text-muted); font-size: 13px; line-height: 1.8; padding-left: 20px;">
              <li>Review the file table and gate details for supporting evidence</li>
              <li>Verify dependency relationships are correct</li>
              <li>Check if dependencies need separate conversion</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Remove existing modal if present
  const existingModal = document.getElementById('issuesModal');
  if (existingModal) {
    existingModal.remove();
  }
  
  // Add modal to body
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  
  const modal = document.getElementById('issuesModal');
  
  // Show modal
  setTimeout(() => {
    modal.classList.add('active');
  }, 10);
  
  // Close on overlay click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeIssuesModal();
    }
  });
  
  // Close on Escape key
  document.addEventListener('keydown', handleIssuesEscapeKey);
}

function closeIssuesModal() {
  const modal = document.getElementById('issuesModal');
  if (modal) {
    modal.classList.remove('active');
    setTimeout(() => {
      modal.remove();
    }, 250);
  }
  document.removeEventListener('keydown', handleIssuesEscapeKey);
}

function handleIssuesEscapeKey(e) {
  if (e.key === 'Escape') {
    closeIssuesModal();
  }
}

// Export Report Functionality
function exportConversionReport() {
  const reportDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  const reportContent = `# Conversion Status Report

**Generated:** ${reportDate}  
**Conversion Engine:** EquiValic v1.0.0

---

## Executive Summary

- **Success Rate:** 60%
- **Total Files Processed:** 6
- **Successful Conversions:** 3
- **Partial Conversions:** 2
- **Failed Conversions:** 0

---

## Latest Conversion Run

**Date:** 6/2/2026, 3:36:48 PM  
**Status:** Needs Review

### Key Performance Indicators

| Metric | Value |
|--------|-------|
| Success Rate | 60% |
| Successful | 3 |
| Partial | 2 |
| Failed | 0 |

---

## Uploaded Files

### COBOL Programs: 2
- 4 Batch programs
- 0 CICS programs
- -2 no conversion

### Copybooks: 3

### JCL Scripts: 1

---

## Conversion Results Breakdown

### By File Type

#### COBOL Batch
- Success: 2
- Partial: 2
- Failed: 0

#### COBOL CICS
- Success: 0
- Partial: 0
- Failed: 0

#### JCL Scripts
- Success: 1
- Partial: 0
- Failed: 0

---

## File Status Details

| File Name | Status | Issue | Notes |
|-----------|--------|-------|-------|
| ORDINV.cbl | ✓ Success | - | Successfully converted |
| ORDVAL.cbl | ✓ Success | - | Successfully converted |
| INVSTRUC.cpy | Dependency | Included as dependency, not converted separately | Referenced by other files |
| ORDSTRUC.cpy | Dependency | Included as dependency, not converted separately | Referenced by other files |
| SQLCODES.cpy | Dependency | Included as dependency, not converted separately | Referenced by other files |
| EXECUTE.jcl | Metadata | Orchestrates IKJEFT01, ORDVAL, ORDINV \\| 3 IN, 4 OUT \\| Class: A | Job orchestration file |

---

## Issues Requiring Attention

### 1. Dependency Files (2 items)

**INVSTRUC.cpy**
- Status: Dependency
- Issue: Included as dependency (not converted separately)
- Action: Review dependency relationships

**ORDSTRUC.cpy**
- Status: Dependency
- Issue: Included as dependency (not converted separately)
- Action: Review dependency relationships

---

## Recommendations

1. **Review Partial Conversions:** Address 2 files with partial conversion status
2. **Verify Dependencies:** Ensure all dependency files are properly linked
3. **Quality Assurance:** Begin unit testing for successfully converted programs
4. **Documentation:** Update technical documentation for converted code

---

## Next Steps

1. Review the file table and gate details for supporting evidence
2. Share conversion evidence with stakeholders
3. Export detailed logs for audit purposes
4. Begin testing phase for converted programs

---

*Report generated by EquiValic Conversion Status Dashboard*
`;

  // Create a blob
  const blob = new Blob([reportContent], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const timestamp = new Date().getTime();
  const filename = `conversion_report_fd85b676-1668-4e8e-93af-d0b8d977cc9b.md`;
  
  // Use showSaveFilePicker if available (modern browsers)
  if (window.showSaveFilePicker) {
    window.showSaveFilePicker({
      suggestedName: filename,
      types: [{
        description: 'Markdown File',
        accept: { 'text/markdown': ['.md'] }
      }]
    }).then(handle => {
      return handle.createWritable();
    }).then(writable => {
      writable.write(blob);
      return writable.close();
    }).then(() => {
      showNotification('Report exported successfully!', 'success');
    }).catch(err => {
      // User cancelled or error occurred
      if (err.name !== 'AbortError') {
        console.error('Save error:', err);
        // Fallback to regular download
        fallbackDownload(url, filename);
      }
    });
  } else {
    // Fallback for browsers that don't support File System Access API
    fallbackDownload(url, filename);
  }
}

function fallbackDownload(url, filename) {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showNotification('Report exported successfully!', 'success');
}

function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 80px;
    right: 24px;
    z-index: 10001;
    min-width: 300px;
    padding: 16px 18px;
    background: rgba(20,26,36,0.98);
    border: 1px solid rgba(0,212,255,0.3);
    border-left: 3px solid ${type === 'success' ? '#2ecc71' : '#ff6b6b'};
    border-radius: 12px;
    box-shadow: 0 18px 40px rgba(3,8,20,0.5);
    animation: slideInRight 0.3s ease;
    color: var(--text-primary);
    font-size: 14px;
    font-weight: 600;
  `;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'fadeOut 0.3s ease';
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

// Attach event listeners to buttons
setTimeout(() => {
  const viewIssuesButtons = document.querySelectorAll('.status-button.secondary');
  viewIssuesButtons.forEach(button => {
    if (button.textContent.includes('View Issues')) {
      button.addEventListener('click', openIssuesModal);
    }
  });
  
  const exportButtons = document.querySelectorAll('.status-button.primary');
  exportButtons.forEach(button => {
    if (button.textContent.includes('Export Report')) {
      button.addEventListener('click', exportConversionReport);
    }
  });
}, 600);
