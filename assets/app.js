/* ============================================================
       APP STATE
    ============================================================ */
    const appState = { product: "Product Suite", section: "Analysis Engine", page: "Project Summary", view: "Overview" };
    function renderHeader() {
      const el = document.getElementById("appBreadcrumb");
      el.innerHTML = `${appState.product} > ${appState.section} > ${appState.page}`;
    }
    function setState(newState) { Object.assign(appState, newState); renderHeader(); }

    let charts = [];
    function destroyCharts() { charts.forEach(c => c.destroy()); charts = []; }

    /* ============================================================
       DATA FROM INDEX(3)
    ============================================================ */
    const classificationData = {
      executionEnvironment: [
        { label: "Batch", count: 21 }, 
        { label: "CICS", count: 8 }, 
        { label: "IMS", count: 5 },
        { label: "TSO", count: 3 },
        { label: "WebSphere", count: 2 },
        { label: "DB2 Stored Procedures", count: 4 },
        { label: "MQ Series", count: 6 },
        { label: "JES2", count: 9 }
      ],
      dataAccess: [{ label: "VSAM", count: 1 }, { label: "DB2", count: 8 }],
      functionalRole: [{ label: "Main Programs", count: 19 }, { label: "Subprograms", count: 3 }],
      programmingModel: [{ label: "Structured COBOL", count: 17 }, { label: "Legacy/Unstructured COBOL", count: 5 }],
      hybridTypes: [{ label: "CICS-VSAM", count: 1 }, { label: "Batch-DB2", count: 8 }]
    };

    const sqlAnalysisData = {
      dml: [{ label: "SELECT", count: 4 }, { label: "INSERT", count: 3 }, { label: "UPDATE", count: 1 }, { label: "DELETE", count: 1 }],
      tcl: [{ label: "COMMIT", count: 3 }, { label: "ROLLBACK", count: 3 }],
      connection: [{ label: "CONNECT", count: 2 }, { label: "DISCONNECT", count: 1 }],
      cursor: [{ label: "DECLARE", count: 1 }, { label: "OPEN", count: 1 }, { label: "FETCH", count: 2 }, { label: "CLOSE", count: 1 }],
      tables: ["CUSTOMER", "CUSTOMER_MASTER", "DAILY_DISCOUNTS", "DAILY_SALES", "DUAL", "EMPLOYEES", "INVENTORY", "ORDERS", "ORDER_STATUS"]
    };

    const tableUsageData = [
      { name: "CUSTOMER", usedBy: "ORDVAL", operations: "SELECT(16)" },
      { name: "CUSTOMER_MASTER", usedBy: "DISCOUNT-FINAL", operations: "" },
      { name: "DAILY_DISCOUNTS", usedBy: "DISCOUNT-FINAL", operations: "DELETE(6), INSERT(8)" },
      { name: "DAILY_SALES", usedBy: "DISCOUNT-FINAL", operations: "" },
      { name: "DUAL", usedBy: "sql1", operations: "SELECT(1)" },
      { name: "EMPLOYEES", usedBy: "bhuvan", operations: "INSERT(6)" },
      { name: "INVENTORY", usedBy: "ORDINV", operations: "SELECT(16), UPDATE(6)" },
      { name: "ORDERS", usedBy: "sql2", operations: "SELECT(1)" },
      { name: "ORDER_STATUS", usedBy: "ORDINV", operations: "INSERT(12)" }
    ];

    const emptyFilesData = {
      count: 15,
      files: ["ACCTFILE", "_DS_Store", "ACCOUNTS", "README-GNUCOBOL", "README", "run-demo", "MAINPROG", "test_banking", "cobol_app", "Dockerfile", "entrypoint", "Makefile", "odbc_interface", "odbc", "odbcinst"]
    };

    const recommendationsData = [
      { type: "success", icon: "&#x2705;", title: "DB2 Database: 8 program(s) use DB2", details: ["Plan for DB2 to modern database migration", "Consider connection pooling for 8 program(s)"] },
      { type: "success", icon: "&#x2705;", title: "Moderate Complexity: 9 tables accessed", details: [] },
      { type: "success", icon: "&#x2705;", title: "Moderate SQL Usage: 28 statements", details: [] },
      { type: "success", icon: "&#x2705;", title: "Transaction Control: Explicit COMMIT/ROLLBACK found", details: ["Preserve transaction boundaries in migration"] },
      { type: "info", icon: "&#x1F50D;", title: "Cursor Usage: 1 cursor(s) declared", details: ["Consider converting to result set processing", "May need pagination for large datasets"] },
      { type: "warning", icon: "&#x26A0;&#xFE0F;", title: "Legacy Code: 5 program(s) use GO TO", details: ["Higher refactoring effort required", "Consider code modernization before migration"] }
    ];
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

    /* ============================================================
       RENDER FUNCTIONS
    ============================================================ */
    function renderClassificationHTML() {
      return `
        <div class="classification-breakdown">
          <h3 class="breakdown-title">Classification Breakdown</h3>
          <div class="breakdown-section">
            <h4 class="breakdown-subtitle">Execution Environment</h4>
            <div class="breakdown-tags">${classificationData.executionEnvironment.map(i=>`<span class="breakdown-tag tag-blue">${i.label} <span class="tag-count">${i.count} program(s)</span></span>`).join('')}</div>
          </div>
          <div class="breakdown-section">
            <h4 class="breakdown-subtitle">Data Access</h4>
            <div class="breakdown-tags">${classificationData.dataAccess.map(i=>`<span class="breakdown-tag tag-green">${i.label} <span class="tag-count">${i.count} program(s)</span></span>`).join('')}</div>
          </div>
          <div class="breakdown-section">
            <h4 class="breakdown-subtitle">Functional Role</h4>
            <div class="breakdown-tags">${classificationData.functionalRole.map(i=>`<span class="breakdown-tag tag-orange">${i.label} <span class="tag-count">${i.count} program(s)</span></span>`).join('')}</div>
          </div>
          <div class="breakdown-section">
            <h4 class="breakdown-subtitle">Programming Model</h4>
            <div class="breakdown-tags">${classificationData.programmingModel.map(i=>`<span class="breakdown-tag tag-yellow">${i.label} <span class="tag-count">${i.count} program(s)</span></span>`).join('')}</div>
          </div>
          <div class="breakdown-section">
            <h4 class="breakdown-subtitle">Hybrid Types</h4>
            <div class="breakdown-tags">${classificationData.hybridTypes.map(i=>`<span class="breakdown-tag tag-purple">${i.label} <span class="tag-count">${i.count} program(s)</span></span>`).join('')}</div>
          </div>
        </div>`;
    }

    function renderSQLAnalysisHTML() {
      return `
        <div class="sql-analysis">
          <h3 class="sql-title">SQL Analysis</h3>
          <div class="sql-section"><h4 class="sql-subtitle">DML</h4><div class="sql-tags">${sqlAnalysisData.dml.map(i=>`<span class="sql-tag">${i.label} <span class="sql-tag-count">(${i.count})</span></span>`).join('')}</div></div>
          <div class="sql-section"><h4 class="sql-subtitle">TCL</h4><div class="sql-tags">${sqlAnalysisData.tcl.map(i=>`<span class="sql-tag">${i.label} <span class="sql-tag-count">(${i.count})</span></span>`).join('')}</div></div>
          <div class="sql-section"><h4 class="sql-subtitle">Connection</h4><div class="sql-tags">${sqlAnalysisData.connection.map(i=>`<span class="sql-tag">${i.label} <span class="sql-tag-count">(${i.count})</span></span>`).join('')}</div></div>
          <div class="sql-section"><h4 class="sql-subtitle">Cursor</h4><div class="sql-tags">${sqlAnalysisData.cursor.map(i=>`<span class="sql-tag">${i.label} <span class="sql-tag-count">(${i.count})</span></span>`).join('')}</div></div>
          <div class="sql-section"><h4 class="sql-subtitle">Tables Accessed</h4><div class="sql-tags">${sqlAnalysisData.tables.map(t=>`<span class="sql-tag sql-table-tag">${t}</span>`).join('')}</div></div>
        </div>`;
    }

    function renderTableUsageHTML() {
      return `
        <div class="table-usage">
          <h3 class="table-usage-title">Table Usage</h3>
          <div class="table-usage-list">${tableUsageData.map(t=>`
            <div class="table-card">
              <div class="table-card-header"><span>&#x1F4CA;</span><span class="table-name">${t.name}</span></div>
              <div class="table-card-info">
                <div class="table-info-row"><span class="table-info-label">Used by:</span><span class="table-info-value">${t.usedBy}</span></div>
                ${t.operations ? `<div class="table-info-row"><span class="table-info-label">Operations:</span><span class="table-info-value">${t.operations}</span></div>` : ''}
              </div>
            </div>`).join('')}
          </div>
        </div>`;
    }

    function renderEmptyFilesHTML() {
      return `
        <div class="empty-files">
          <h3 class="empty-files-title">Empty / Placeholder Files</h3>
          <p class="empty-files-description">${emptyFilesData.count} file(s) were discovered but contain no source code.</p>
          <div class="empty-files-subtitle">Programs</div>
          <div class="empty-files-tags">${emptyFilesData.files.map(f=>`<span class="empty-file-tag">${f}</span>`).join('')}</div>
        </div>`;
    }

    function renderRecommendationsHTML() {
      return `
        <div class="recommendations">
          <h3 class="recommendations-title">Recommendations &amp; Insights</h3>
          <div class="recommendations-list">${recommendationsData.map(r=>`
            <div class="recommendation-card ${r.type}">
              <div class="recommendation-header"><span class="recommendation-icon">${r.icon}</span><span class="recommendation-title-text">${r.title}</span></div>
              ${r.details && r.details.length ? `<div class="recommendation-details"><ul>${r.details.map(d=>`<li>${d}</li>`).join('')}</ul></div>` : ''}
            </div>`).join('')}
          </div>
        </div>`;
    }
    function renderOverview() {
      return `
        <div class="stats-grid">
          <div class="stat-card"><div class="stat-value">22</div><div class="stat-label">Total Programs</div></div>
          <div class="stat-card"><div class="stat-value">2,760</div><div class="stat-label">Lines of Code</div></div>
          <div class="stat-card"><div class="stat-value">20.5</div><div class="stat-label">Avg Complexity Score</div></div>
          <div class="stat-card"><div class="stat-value">28</div><div class="stat-label">SQL Statements</div></div>
          <div class="stat-card"><div class="stat-value">9</div><div class="stat-label">Tables Accessed</div></div>
          <div class="stat-card"><div class="stat-value">8</div><div class="stat-label">Dead Programs</div></div>
        </div>
        ${renderClassificationHTML()}
        ${renderSQLAnalysisHTML()}
        ${renderTableUsageHTML()}
        ${renderEmptyFilesHTML()}
        ${renderRecommendationsHTML()}`;
    }

    function renderAnatomy() {
      return `
        <div class="anatomy-grid">
          <div class="anatomy-chart-card">
            <h3 class="anatomy-chart-title">All Files Breakdown</h3>
            <div class="anatomy-chart-container"><canvas id="allFilesChart"></canvas></div>
          </div>
          <div class="anatomy-chart-card">
            <h3 class="anatomy-chart-title">Program Breakdown</h3>
            <div class="anatomy-chart-container"><canvas id="programBreakdownChart"></canvas></div>
          </div>
          <div class="anatomy-chart-card">
            <h3 class="anatomy-chart-title">Complexity Distribution</h3>
            <div class="anatomy-chart-container"><canvas id="complexityDistChart"></canvas></div>
          </div>
          <div class="anatomy-chart-card">
            <h3 class="anatomy-chart-title">Data Access Patterns</h3>
            <div class="anatomy-chart-container"><canvas id="dataAccessChart"></canvas></div>
          </div>
        </div>`;
    }

    function renderGraph() {
      return `
        <div class="graph-controls">
          <button class="graph-btn" id="depZoomIn">+ Zoom In</button>
          <button class="graph-btn" id="depZoomOut">- Zoom Out</button>
          <button class="graph-btn" id="depScrollUp">&#x25B2; Scroll Up</button>
          <button class="graph-btn" id="depScrollDown">&#x25BC; Scroll Down</button>
          <button class="graph-btn" id="depResetView">&#x21BB; Reset</button>
        </div>
        <div class="dep-legend">
          <div class="dep-legend-item"><div class="dep-legend-dot programs"></div><span>Programs</span></div>
          <div class="dep-legend-item"><div class="dep-legend-dot copybooks"></div><span>Copybooks</span></div>
          <div class="dep-legend-item"><div class="dep-legend-dot jcl"></div><span>JCL Scripts</span></div>
        </div>
        <div class="dependency-graph-container">
          <div class="dependency-canvas" id="depCanvas">
            <svg id="depGraphSvg" class="dep-graph-svg" width="1600" height="900"></svg>
          </div>
        </div>`;
    }

    function renderRisk() {
      return `
        <div class="risk-item" style="margin-bottom:20px;">
          <div class="risk-row">
            <div class="risk-text"><div class="risk-title">Dependency Health</div><div class="risk-desc">Overall system dependency score</div></div>
            <div class="risk-value" style="color:#2ecc71;">98</div>
          </div>
        </div>
        <div class="stats-grid" style="margin-bottom:24px;">
          <div class="stat-card"><div class="stat-value">1</div><div class="stat-label">Programs not used</div></div>
          <div class="stat-card"><div class="stat-value">0</div><div class="stat-label">External Calls</div></div>
        </div>
        <div class="chart-wrapper dark">
          <h4>Programs not used in this codebase</h4>
          <div class="table two-col">
            <div class="row header"><span>Program</span><span>Why</span></div>
            <div class="row"><span>MAINPROG</span><span>Not called by any program, JCL, or CICS</span></div>
          </div>
        </div>
        <div class="chart-wrapper dark">
          <h4>Calls to programs outside this project</h4>
          <div class="table four-col">
            <div class="row header"><span>Caller</span><span>Calls</span><span>Note</span><span>Why</span></div>
            <div class="row"><span style="grid-column:span 4;">No calls to missing programs</span></div>
          </div>
        </div>`;
    }
    /* ============================================================
       CHART INIT
    ============================================================ */
    function initCharts(view) {
      destroyCharts();
      Chart.defaults.color = '#94a3b8';
      Chart.defaults.borderColor = 'rgba(255,255,255,0.1)';
      Chart.defaults.font.family = "'Inter', sans-serif";

      if (view === 'anatomy') {
        const allFilesCtx = document.getElementById('allFilesChart');
        if (allFilesCtx) charts.push(new Chart(allFilesCtx, {
          type: 'doughnut',
          data: {
            labels: ['COBOL Programs','Copybooks','BMS Maps','JCL Scripts','Other Files'],
            datasets: [{ data: [22,7,1,1,15], backgroundColor: ['rgba(96,165,250,0.8)','rgba(0,212,255,0.8)','rgba(124,58,237,0.8)','rgba(167,139,250,0.8)','rgba(100,116,139,0.6)'], borderWidth: 2 }]
          },
          options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { padding: 10, usePointStyle: true, color: '#cbd5e1' } } } }
        }));

        const progCtx = document.getElementById('programBreakdownChart');
        if (progCtx) charts.push(new Chart(progCtx, {
          type: 'bar',
          data: {
            labels: ['Batch','CICS','Mixed','Subprograms'],
            datasets: [{ label: 'Programs', data: [21,1,0,3], backgroundColor: ['rgba(96,165,250,0.8)','rgba(0,212,255,0.8)','rgba(124,58,237,0.8)','rgba(167,139,250,0.8)'], borderWidth: 2, borderRadius: 6 }]
          },
          options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } }, x: { ticks: { color: '#cbd5e1' }, grid: { display: false } } }, plugins: { legend: { display: false } } }
        }));

        const compCtx = document.getElementById('complexityDistChart');
        if (compCtx) charts.push(new Chart(compCtx, {
          type: 'pie',
          data: {
            labels: ['Low Complexity','Medium Complexity','High Complexity'],
            datasets: [{ data: [1,7,14], backgroundColor: ['rgba(16,185,129,0.8)','rgba(251,191,36,0.8)','rgba(239,68,68,0.8)'], borderWidth: 2 }]
          },
          options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { padding: 10, usePointStyle: true, color: '#cbd5e1' } } } }
        }));

        const dataCtx = document.getElementById('dataAccessChart');
        if (dataCtx) charts.push(new Chart(dataCtx, {
          type: 'bar',
          data: {
            labels: ['DB2','VSAM','Sequential Files','No Data Access'],
            datasets: [{ label: 'Programs', data: [8,1,5,8], backgroundColor: ['rgba(56,189,248,0.8)','rgba(168,85,247,0.8)','rgba(251,146,60,0.8)','rgba(100,116,139,0.6)'], borderWidth: 2, borderRadius: 6 }]
          },
          options: { indexAxis: 'y', responsive: true, maintainAspectRatio: false, scales: { x: { beginAtZero: true, ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } }, y: { ticks: { color: '#cbd5e1' }, grid: { display: false } } }, plugins: { legend: { display: false } } }
        }));
      }
    }

    /* ============================================================
       DEPENDENCY GRAPH
    ============================================================ */
    function initDependencyGraph() {
      const svg = document.getElementById('depGraphSvg');
      const canvas = document.getElementById('depCanvas');
      if (!svg || !canvas) return;

      let currentZoom = 1;
      const zoomStep = 0.15, minZoom = 0.5, maxZoom = 3;
      const oX = 200, oY = 80;

      const nodes = [
        { id: 'TEST-BMS2', x: 280+oX, y: 100+oY, type: 'program' }, { id: 'ACCTINQ2', x: 350+oX, y: 130+oY, type: 'program' },
        { id: 'ACCTCICS', x: 330+oX, y: 155+oY, type: 'program' }, { id: 'SSACREDIT', x: 700+oX, y: 130+oY, type: 'program' },
        { id: 'DISCOUNT', x: 720+oX, y: 155+oY, type: 'program' }, { id: 'SSALIBRARY', x: 695+oX, y: 100+oY, type: 'program' },
        { id: 'EMPLOYEES', x: 210+oX, y: 255+oY, type: 'program' }, { id: 'JCL-EXTFILE', x: 500+oX, y: 220+oY, type: 'jcl' },
        { id: 'PROG-ORDERS-PROCESS', x: 480+oX, y: 245+oY, type: 'program' }, { id: 'EXTFILE', x: 520+oX, y: 245+oY, type: 'jcl' },
        { id: 'PROG-ORDERS-ERROR', x: 550+oX, y: 250+oY, type: 'program' }, { id: 'PROG-ORDERS-INPUT', x: 630+oX, y: 250+oY, type: 'program' },
        { id: 'PROG-ORDERS-ORDERS', x: 570+oX, y: 225+oY, type: 'program' }, { id: 'DB-CONNECT-SAMPLE', x: 210+oX, y: 290+oY, type: 'program' },
        { id: 'MAINPROG', x: 450+oX, y: 310+oY, type: 'program' }, { id: 'CALCUTIL', x: 630+oX, y: 265+oY, type: 'program' },
        { id: 'CALCSTRUCT', x: 485+oX, y: 340+oY, type: 'copybook' }, { id: 'MASTFILE', x: 450+oX, y: 310+oY, type: 'copybook' },
        { id: 'ORDVAL', x: 490+oX, y: 305+oY, type: 'program' }, { id: 'ORDINV', x: 530+oX, y: 305+oY, type: 'program' },
        { id: 'INVENTORY', x: 555+oX, y: 310+oY, type: 'program' }, { id: 'CUSTOMER', x: 580+oX, y: 500+oY, type: 'program' },
        { id: 'ORDER_STATUS', x: 550+oX, y: 330+oY, type: 'program' }, { id: 'STUORDERS', x: 525+oX, y: 340+oY, type: 'copybook' },
        { id: 'COBOL-CNTL', x: 850+oX, y: 270+oY, type: 'program' }, { id: 'DAILY-DISCOUNTS', x: 830+oX, y: 380+oY, type: 'program' },
        { id: 'DISCOUNT-FINAL', x: 810+oX, y: 400+oY, type: 'program' }, { id: 'DAILY_SALES', x: 780+oX, y: 410+oY, type: 'program' },
        { id: 'CUSTOMER_MASTER', x: 830+oX, y: 425+oY, type: 'program' }, { id: 'POSTING-SAMPLE', x: 450+oX, y: 485+oY, type: 'program' },
        { id: 'MAINPROG2', x: 440+oX, y: 515+oY, type: 'program' }, { id: 'CALCUTIL2', x: 470+oX, y: 505+oY, type: 'program' },
        { id: 'CALCUTIL-TEST-COBOL', x: 500+oX, y: 505+oY, type: 'program' }, { id: 'TEST-VARS', x: 250+oX, y: 565+oY, type: 'program' },
        { id: 'STUDENT-PROCESS', x: 310+oX, y: 545+oY, type: 'program' }, { id: 'DATELOGIC', x: 395+oX, y: 605+oY, type: 'program' },
        { id: 'DATEDATA', x: 420+oX, y: 625+oY, type: 'program' }, { id: 'DUAL', x: 575+oX, y: 605+oY, type: 'program' },
        { id: 'TEST-SPLIT', x: 575+oX, y: 575+oY, type: 'program' }, { id: 'SALES-PROCESS1', x: 660+oX, y: 605+oY, type: 'program' },
        { id: 'PHARMA01', x: 775+oX, y: 510+oY, type: 'program' }, { id: 'PHARMA', x: 765+oX, y: 622+oY, type: 'program' },
        { id: 'TEST-COMMENTS', x: 740+oX, y: 642+oY, type: 'program' }, { id: 'ACCTMAP', x: 375+oX, y: 110+oY, type: 'copybook' },
        { id: 'EXTMAP', x: 685+oX, y: 165+oY, type: 'copybook' }, { id: 'INPUT-REC', x: 300+oX, y: 455+oY, type: 'copybook' }
      ];

      const links = [
        { source: 'TEST-BMS2', target: 'ACCTMAP' }, { source: 'ACCTINQ2', target: 'ACCTMAP' }, { source: 'ACCTINQ2', target: 'ACCTCICS' },
        { source: 'SSACREDIT', target: 'EXTMAP' }, { source: 'DISCOUNT', target: 'EXTMAP' }, { source: 'MAINPROG', target: 'JCL-EXTFILE' },
        { source: 'MAINPROG', target: 'CALCUTIL' }, { source: 'MAINPROG', target: 'CALCSTRUCT' }, { source: 'PROG-ORDERS-PROCESS', target: 'EXTFILE' },
        { source: 'PROG-ORDERS-PROCESS', target: 'PROG-ORDERS-INPUT' }, { source: 'PROG-ORDERS-PROCESS', target: 'PROG-ORDERS-ERROR' },
        { source: 'PROG-ORDERS-PROCESS', target: 'PROG-ORDERS-ORDERS' }, { source: 'ORDVAL', target: 'CUSTOMER' },
        { source: 'ORDINV', target: 'INVENTORY' }, { source: 'ORDINV', target: 'ORDER_STATUS' }, { source: 'MASTFILE', target: 'ORDVAL' },
        { source: 'MASTFILE', target: 'ORDINV' }, { source: 'STUORDERS', target: 'ORDER_STATUS' }, { source: 'POSTING-SAMPLE', target: 'MAINPROG2' },
        { source: 'POSTING-SAMPLE', target: 'CALCUTIL2' }, { source: 'CALCUTIL-TEST-COBOL', target: 'CALCUTIL2' },
        { source: 'DATELOGIC', target: 'DATEDATA' }, { source: 'DISCOUNT-FINAL', target: 'DAILY_SALES' },
        { source: 'DISCOUNT-FINAL', target: 'CUSTOMER_MASTER' }, { source: 'DISCOUNT-FINAL', target: 'DAILY-DISCOUNTS' }
      ];

      function getNodeColor(type) {
        return type === 'program' ? '#60a5fa' : type === 'copybook' ? '#a78bfa' : '#fbbf24';
      }

      function renderDepGraph() {
        svg.innerHTML = '';
        links.forEach(link => {
          const s = nodes.find(n => n.id === link.source), t = nodes.find(n => n.id === link.target);
          if (s && t) {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('class', 'dep-link');
            line.setAttribute('x1', s.x); line.setAttribute('y1', s.y);
            line.setAttribute('x2', t.x); line.setAttribute('y2', t.y);
            svg.appendChild(line);
          }
        });
        nodes.forEach(node => {
          const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
          g.setAttribute('class', 'dep-node');
          g.setAttribute('transform', `translate(${node.x},${node.y})`);
          const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          circle.setAttribute('class', 'dep-node-circle'); circle.setAttribute('r', '6');
          circle.setAttribute('fill', getNodeColor(node.type)); circle.setAttribute('stroke', 'rgba(255,255,255,0.8)'); circle.setAttribute('stroke-width', '1.5');
          circle.style.filter = `drop-shadow(0 0 6px ${getNodeColor(node.type)})`;
          const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          text.setAttribute('class', 'dep-node-text'); text.setAttribute('x', '10'); text.setAttribute('y', '3');
          text.textContent = node.id;
          g.appendChild(circle); g.appendChild(text); svg.appendChild(g);
          g.addEventListener('mouseenter', () => { circle.setAttribute('r', '9'); text.style.fill = '#fff'; text.style.fontWeight = '700'; });
          g.addEventListener('mouseleave', () => { circle.setAttribute('r', '6'); text.style.fill = '#cbd5e1'; text.style.fontWeight = '500'; });
        });
      }

      canvas.addEventListener('wheel', e => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -zoomStep : zoomStep;
        currentZoom = Math.max(minZoom, Math.min(maxZoom, currentZoom + delta));
        svg.style.transform = `scale(${currentZoom})`; svg.style.transformOrigin = 'top left';
      }, { passive: false });

      document.getElementById('depZoomIn').addEventListener('click', () => { currentZoom = Math.min(maxZoom, currentZoom + zoomStep); svg.style.transform = `scale(${currentZoom})`; svg.style.transformOrigin = 'top left'; });
      document.getElementById('depZoomOut').addEventListener('click', () => { currentZoom = Math.max(minZoom, currentZoom - zoomStep); svg.style.transform = `scale(${currentZoom})`; svg.style.transformOrigin = 'top left'; });
      document.getElementById('depResetView').addEventListener('click', () => { currentZoom = 1; svg.style.transform = 'scale(1)'; canvas.scrollTop = 0; canvas.scrollLeft = 0; });
      document.getElementById('depScrollUp').addEventListener('click', () => canvas.scrollBy({ top: -150, behavior: 'smooth' }));
      document.getElementById('depScrollDown').addEventListener('click', () => canvas.scrollBy({ top: 150, behavior: 'smooth' }));

      renderDepGraph();
    }
    /* ============================================================
       UPDATE VIEW
    ============================================================ */
    function updateView(view) {
      setState({ view: view.charAt(0).toUpperCase() + view.slice(1) });
      const previewContent = document.getElementById("previewContent");
      if (!previewContent) return;
      const viewMap = { overview: renderOverview, anatomy: renderAnatomy, graph: renderGraph, risk: renderRisk };
      previewContent.innerHTML = viewMap[view]?.() || '';
      setTimeout(() => {
        initCharts(view);
        if (view === 'graph') initDependencyGraph();
      }, 100);
    }

    function attachDashboardTabEvents() {
      const tabs = document.querySelectorAll(".tab");
      tabs.forEach(tab => {
        tab.addEventListener("click", () => {
          tabs.forEach(t => t.classList.remove("active"));
          tab.classList.add("active");
          updateView(tab.dataset.view);
        });
      });
    }

    /* ============================================================
       MODE SWITCHING
    ============================================================ */
    let isWikiMode = false, isConvertMode = false;
    const leftPanel = document.querySelector(".left-panel");
    const displayPanel = document.querySelector(".display-panel");
    const originalLeftPanel = leftPanel.innerHTML;

    function restoreDashboard() {
      leftPanel.style.display = '';
      if (document.querySelector('.workspace')) {
        document.querySelector('.workspace').style.gridTemplateColumns = '';
      }
      isWikiMode = false; isConvertMode = false;
      setState({ section: "Analysis Engine", page: "Dashboard", view: "Overview" });
      leftPanel.classList.add("fade-transition","fade-out");
      displayPanel.classList.add("fade-transition","fade-out");
      setTimeout(() => {
        leftPanel.innerHTML = originalLeftPanel;
        displayPanel.innerHTML = `
          <div class="dashboard-tabs">
            <button class="tab active" data-view="overview">Overview</button>
            <button class="tab" data-view="anatomy">Anatomy</button>
            <button class="tab" data-view="graph">Dependency Graph</button>
            <button class="tab" data-view="risk">Risk Mitigation</button>
            <div class="tab-indicator"></div>
          </div>
          <div id="previewContent" class="scroll-container"></div>`;
        updateView("overview");
        attachDashboardTabEvents();
        leftPanel.classList.remove("fade-out");
        displayPanel.classList.remove("fade-out");
      }, 200);
    }

    function activateMode(sectionName, pageName, leftHTML, displayHTML, afterFn, instant) {
      isWikiMode = false; isConvertMode = false;
      setState({ section: "Analysis Engine", page: pageName, view: "Overview" });
      if (instant) {
        leftPanel.innerHTML = leftHTML;
        displayPanel.innerHTML = displayHTML;
        document.getElementById("backToDashboard")?.addEventListener("click", restoreDashboard);
        if (afterFn) afterFn();
        return;
      }
      leftPanel.classList.add("fade-transition","fade-out");
      displayPanel.classList.add("fade-transition","fade-out");
      setTimeout(() => {
        leftPanel.innerHTML = leftHTML;
        displayPanel.innerHTML = displayHTML;
        leftPanel.classList.remove("fade-out");
        displayPanel.classList.remove("fade-out");
        document.getElementById("backToDashboard")?.addEventListener("click", restoreDashboard);
        if (afterFn) afterFn();
      }, 200);
    }

    /* ============================================================
       PROJECT SUMMARY MODE
    ============================================================ */
    function activateProjectSummaryMode(instant) {
      const leftHTML = `
        <div id="repositorySummaryContent" style="overflow-y: auto; flex: 1; min-height: 0; padding-right: 14px; padding-bottom: 60px;">
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

          </div>
        </div>

        </div>
      </div>
      `;
    }


    /* ============================================================
       SYSTEM DIAGNOSTICS MODE
    ============================================================ */
    function activateDiagnosticsMode() {
      const leftHTML = `<div class="sub-nav active">Diagnostics Overview</div>`;
      const displayHTML = `<div class="scroll-container">
        <div class="diag-stats">
          <div class="stat-card"><div class="stat-value">3</div><div class="stat-label">Programs</div></div>
          <div class="stat-card"><div class="stat-value">3</div><div class="stat-label">Dependencies</div></div>
          <div class="stat-card"><div class="stat-value">0</div><div class="stat-label">Entry Points</div></div>
        </div>
        <div class="diag-grid">
          <div class="chart-wrapper dark"><h4>Entry Points</h4><div class="empty">0 total: 0 JCL job(s), 0 CICS transaction(s).</div></div>
          <div class="chart-wrapper dark"><h4>Batch Flow</h4><div class="mono">1. SUBTRACT<br>2. MULTIPLY<br>3. DIVIDE</div></div>
          <div class="chart-wrapper dark"><h4>Risk Snapshot</h4><span class="pill green">Good</span><div class="empty">1 unused program(s), 0 missing calls</div></div>
          <div class="chart-wrapper dark"><h4>System Personality</h4><div class="empty">Library / mixed</div></div>
          <div class="diag-card full"><h4>Most Called Programs</h4>
            <div class="table"><div class="row header"><span>Program</span><span>Called</span><span>Callers</span></div><div class="row"><span>CALCUTIL</span><span>1</span><span>MAINPROG</span></div></div>
          </div>
          <div class="diag-card full"><h4>Top Copybooks</h4><div class="empty">DATADEF used by 2 programs</div></div>
          <div class="diag-card full"><h4>Top DB2 Tables</h4><div class="empty">No tables found</div></div>
        </div>
      </div>`;
      activateMode('System Diagnostics', 'System Diagnostics', leftHTML, displayHTML);
    }

    /* ============================================================
       CONVERSION STATUS MODE
    ============================================================ */
    function activateConversionStatusMode() {
      const leftHTML = `<div class="sub-nav active">Conversion Overview</div>`;
      const displayHTML = `<div class="scroll-container" style="gap:16px;">
        <div class="chart-wrapper dark" style="margin-bottom:0;padding:16px;">
          <h4 style="margin-bottom:6px;">Uploaded files</h4>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px;">
            <div style="background:linear-gradient(145deg,rgba(108,92,231,0.15),rgba(108,92,231,0.05));border:1px solid rgba(108,92,231,0.3);border-radius:12px;padding:14px;text-align:center;"><div style="font-size:22px;margin-bottom:6px;">&#x1F4C4;</div><div style="font-size:28px;font-weight:800;color:#fff;">1</div><div style="font-size:12px;color:var(--text-muted);margin-top:4px;">COBOL Programs</div></div>
            <div style="background:linear-gradient(145deg,rgba(108,92,231,0.15),rgba(108,92,231,0.05));border:1px solid rgba(108,92,231,0.3);border-radius:12px;padding:14px;text-align:center;"><div style="font-size:22px;margin-bottom:6px;">&#x1F4CB;</div><div style="font-size:28px;font-weight:800;color:#fff;">0</div><div style="font-size:12px;color:var(--text-muted);margin-top:4px;">Copybooks</div></div>
            <div style="background:linear-gradient(145deg,rgba(108,92,231,0.15),rgba(108,92,231,0.05));border:1px solid rgba(108,92,231,0.3);border-radius:12px;padding:14px;text-align:center;"><div style="font-size:22px;margin-bottom:6px;">&#x1F4DC;</div><div style="font-size:28px;font-weight:800;color:#fff;">0</div><div style="font-size:12px;color:var(--text-muted);margin-top:4px;">JCL Scripts</div></div>
          </div>
        </div>
        <div class="chart-wrapper dark" style="margin-bottom:0;padding:16px;">
          <h4>Conversion Results</h4>
          <div style="background:#2ecc71;color:#fff;font-weight:700;font-size:13px;text-align:center;padding:8px;border-radius:20px;margin-bottom:12px;">100% Success</div>
          <div style="display:flex;justify-content:center;gap:24px;font-size:14px;font-weight:600;margin-bottom:14px;">
            <span style="color:#2ecc71;">&#x2713; 1 Successful</span><span style="color:#f1c40f;">&#x26A0;&#xFE0F; 0 Partial</span><span style="color:#e74c3c;">&#x274C; 0 Failed</span>
          </div>
        </div>
        <div class="chart-wrapper dark" style="margin-bottom:0;padding:16px;">
          <h4>File Status</h4>
          <table style="width:100%;border-collapse:collapse;font-size:13px;">
            <thead><tr><th style="padding:10px;border-bottom:1px solid var(--border);text-align:left;color:var(--text-primary);">File Name</th><th style="padding:10px;border-bottom:1px solid var(--border);text-align:left;color:var(--text-primary);">Status</th><th style="padding:10px;border-bottom:1px solid var(--border);text-align:left;color:var(--text-primary);">Issue</th></tr></thead>
            <tbody><tr><td style="padding:10px;color:var(--text-muted);">temp.cbl</td><td style="padding:10px;color:#2ecc71;">&#x2713; Success</td><td style="padding:10px;color:var(--text-muted);">-</td></tr></tbody>
          </table>
        </div>
      </div>`;
      activateMode('Conversion Status', 'Conversion Status', leftHTML, displayHTML);
    }
    /* ============================================================
       RISK ASSESSMENT MODE
    ============================================================ */
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
    /* ============================================================
       PARSER IMPROVEMENT MODE (with IR Workbench from index3)
    ============================================================ */
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

    /* ============================================================
       CONVERT MODE
    ============================================================ */
    function activateConvertMode() {
      if (isConvertMode) return;
      isConvertMode = true;
      setState({ section: "Analysis", page: "Summary Overview", view: "Overview" });
      leftPanel.classList.add("fade-transition","fade-out");
      displayPanel.classList.add("fade-transition","fade-out");
      setTimeout(() => {
        leftPanel.innerHTML = `
          <div class="sub-nav active" data-convert="overview">Overview</div>
          <div class="sub-nav" data-convert="classification">Classification</div>
          <div class="sub-nav" data-convert="insights">Insights</div>
          <div style="height:16px;"></div>
          <div class="convert-cta" id="moveToConversion">Proceed to Conversion</div>`;
        displayPanel.innerHTML = `<div class="scroll-container"><div id="convertContent">
          <div class="convert-header"><div class="convert-title">Project Summary</div><div class="convert-badge">testing multiple</div></div>
        </div></div>`;
        leftPanel.classList.remove("fade-out"); displayPanel.classList.remove("fade-out");
        document.getElementById("backToDashboard")?.addEventListener("click", restoreDashboard);
        renderConvertOverview();
        document.querySelectorAll("[data-convert]").forEach(item => {
          item.addEventListener("click", () => {
            document.querySelectorAll("[data-convert]").forEach(i => i.classList.remove("active"));
            item.classList.add("active");
            const container = document.getElementById("convertContent");
            container.innerHTML = `<div class="convert-header"><div class="convert-title">Project Summary</div><div class="convert-badge">testing multiple</div></div>`;
            const type = item.dataset.convert;
            if (type === "overview") renderConvertOverview();
            if (type === "classification") renderConvertClassification();
            if (type === "insights") renderConvertInsights();
          });
        });
      }, 200);
    }

    function renderConvertOverview() {
      document.getElementById("convertContent").innerHTML += `
        <div class="stats-grid">
          <div class="stat-card"><div class="stat-value">2</div><div class="stat-label">Total Programs</div></div>
          <div class="stat-card"><div class="stat-value">0</div><div class="stat-label">SQL Statements</div></div>
          <div class="stat-card"><div class="stat-value">0</div><div class="stat-label">Tables Accessed</div></div>
          <div class="stat-card"><div class="stat-value">0</div><div class="stat-label">DB2 Programs</div></div>
        </div>`;
    }
    function renderConvertClassification() {
      document.getElementById("convertContent").innerHTML += `
        <div class="chart-wrapper dark"><h4>Classification Breakdown</h4>
          <div class="convert-row"><span>Execution Environment</span><span class="pill">Batch (2)</span></div>
          <div class="convert-row"><span>Functional Role</span><span class="pill yellow">Main Programs (2)</span></div>
          <div class="convert-row"><span>Programming Model</span><span class="pill orange">Structured COBOL (2)</span></div>
        </div>`;
    }
    function renderConvertInsights() {
      document.getElementById("convertContent").innerHTML += `
        <div class="chart-wrapper dark"><h4>SQL Analysis</h4><div class="empty">No SQL data available</div></div>
        <div class="chart-wrapper dark"><h4>Table Usage</h4><div class="empty">No table usage data available</div></div>
        <div class="chart-wrapper dark"><h4>Recommendations &amp; Insights</h4><div class="empty">No recommendations available</div></div>`;
    }

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

                            <!-- Risk Snapshot -->
                            <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 20px; border-radius: 8px;">
                                <div style="font-size: 14px; font-weight: 700; color: #fff; margin-bottom: 12px;">Risk snapshot</div>
                                <span style="background: rgba(46, 204, 113, 0.15); color: #2ecc71; padding: 4px 12px; border-radius: 20px; font-weight: 700; font-size: 11px; margin-bottom: 12px; display: inline-block;">Good</span>
                                <div style="font-size: 13px; color: var(--text-muted);">0 unused program(s), 0 call(s) to missing programs.</div>
                            </div>

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
                                <button style="background: transparent; color: #fff; border: 1px solid rgba(255,255,255,0.2); border-radius: 6px; padding: 8px 16px; font-size: 13px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.05)'" onmouseout="this.style.background='transparent'">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                                    Vulnerability assessment
                                </button>
                            </div>
                        </div>
                    `;
                } else if (tabName === "Risk") {
                    dummyView.style.padding = '24px';
                    dummyView.style.display = 'block';
                    dummyView.style.alignItems = 'stretch';
                    dummyView.style.justifyContent = 'flex-start';
                    dummyView.style.overflowY = 'auto';

                    dummyView.innerHTML = `
                        <!-- Health Banner -->
                        <div style="display: flex; align-items: center; gap: 16px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 16px 24px; border-radius: 8px; margin-bottom: 24px;">
                            <span style="background: rgba(46, 204, 113, 0.15); color: #2ecc71; padding: 4px 12px; border-radius: 20px; font-weight: 700; font-size: 13px;">Good</span>
                            <span style="font-size: 24px; font-weight: 700; color: #fff;">100</span>
                            <span style="font-size: 14px; color: var(--text-muted); font-weight: 500;">Dependency health</span>
                        </div>

                        <!-- Cards Grid -->
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px;">
                            <!-- Card 1 -->
                            <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 24px; border-radius: 8px;">
                                <div style="font-size: 32px; font-weight: 700; color: #fff; margin-bottom: 12px;">0</div>
                                <div style="font-size: 14px; font-weight: 600; color: #fff; margin-bottom: 8px;">Programs not used in this codebase</div>
                                <div style="font-size: 12px; color: var(--text-muted);">Not called by any program, JCL step, or CICS transaction</div>
                            </div>
                            
                            <!-- Card 2 -->
                            <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 24px; border-radius: 8px;">
                                <div style="font-size: 32px; font-weight: 700; color: #fff; margin-bottom: 12px;">0</div>
                                <div style="font-size: 14px; font-weight: 600; color: #fff; margin-bottom: 8px;">Calls to programs outside this project</div>
                                <div style="font-size: 12px; color: var(--text-muted);">Caller exists but callee is not in the project</div>
                            </div>
                        </div>

                        <!-- Table 1 -->
                        <div style="margin-bottom: 32px;">
                            <div style="font-size: 14px; font-weight: 700; color: #fff; margin-bottom: 4px;">Programs not used in this codebase</div>
                            <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 16px;">Candidates for review or retirement. Expand "Why?" to see evidence.</div>
                            
                            <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; overflow: hidden;">
                                <div style="display: grid; grid-template-columns: 1fr 100px; padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 12px; font-weight: 600; color: var(--text-muted);">
                                    <div>Program</div>
                                    <div>Why?</div>
                                </div>
                                <div style="padding: 16px; font-size: 13px; color: var(--text-muted);">
                                    No unused programs found.
                                </div>
                            </div>
                        </div>

                        <!-- Table 2 -->
                        <div style="margin-bottom: 32px;">
                            <div style="font-size: 14px; font-weight: 700; color: #fff; margin-bottom: 4px;">Calls to programs outside this project</div>
                            <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 16px;">These callers reference a program not in the project. Expand "Why?" for evidence.</div>
                            
                            <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; overflow: hidden;">
                                <div style="display: grid; grid-template-columns: 1fr 1fr 1.5fr 100px; padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 12px; font-weight: 600; color: var(--text-muted);">
                                    <div>Caller</div>
                                    <div>Calls</div>
                                    <div>Note</div>
                                    <div>Why?</div>
                                </div>
                                <div style="padding: 16px; font-size: 13px; color: var(--text-muted);">
                                    No calls to missing programs.
                                </div>
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
          <span style="background: rgba(46, 204, 113, 0.1); color: #2ecc71; border: 1px solid rgba(46, 204, 113, 0.2); padding: 4px 12px; border-radius: 4px; font-size: 10px; font-weight: 700; text-transform: uppercase;">Analysis Completed</span>
        </div>

        <!-- Stats Grid -->
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; margin-bottom: 24px; overflow: hidden; flex-shrink: 0;">
          <div style="background: var(--panel-bg); padding: 16px; text-align: center;">
            <div style="font-size: 11px; color: var(--text-muted); text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px; margin-bottom: 8px;">Programs</div>
            <div style="font-size: 20px; font-weight: 700; color: #fff;">1</div>
          </div>
          <div style="background: var(--panel-bg); padding: 16px; text-align: center;">
            <div style="font-size: 11px; color: var(--text-muted); text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px; margin-bottom: 8px;">Dependencies</div>
            <div style="font-size: 20px; font-weight: 700; color: #fff;">0</div>
          </div>
          <div style="background: var(--panel-bg); padding: 16px; text-align: center;">
            <div style="font-size: 11px; color: var(--text-muted); text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px; margin-bottom: 8px;">Entry Points</div>
            <div style="font-size: 20px; font-weight: 700; color: #fff;">0</div>
          </div>
        </div>

        <!-- Horizontal Main Navigation -->
        <div style="display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 0px; margin-bottom: 16px; flex-shrink: 0;">
          <div class="dashboard-tabs" style="border-bottom: none; margin-bottom: -1px; gap: 24px;">
            <button class="tab active" style="padding-bottom: 12px; font-size: 13px;">Project Structure</button>
            <button class="tab" style="padding-bottom: 12px; font-size: 13px;">Risk</button>
            <button class="tab" style="padding-bottom: 12px; font-size: 13px;">System Diagnostics</button>
            <button class="tab" style="padding-bottom: 12px; font-size: 13px;">Vulnerability assessment</button>
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

    /* global click handler removed — routing handled by subtopic listeners above */
    renderHeader();

    /* ============================================================
       SIDEBAR NAV — collapse/expand + routing
    ============================================================ */
    const pageRouteMap = {
      "Project Summary":           () => activateProjectSummaryMode(),
      "Project DNA":               () => activateProjectDNAMode(),
      "Parser Improvement":        () => activateParserImprovementMode(),
      "Code Wiki":                 () => activateCodeWiki(),
      "Analysis Health":           () => activateAnalysisHealthMode(),
      "Architecture Studio":       () => activateComingSoon("Architecture Studio"),
      "Data Mapping Review":       () => activateComingSoon("Data Mapping Review"),
      "Best Design Practices":     () => activateComingSoon("Best Design Practices"),
      "Migration Risk Assessment":  () => activateRiskAssessmentMode(),
      "Vulnerability Assessment":  () => activateComingSoon("Vulnerability Assessment"),
      "Conversion Workspace":      () => activateConvertMode(),
      "Conversion Status":         () => activateConversionStatusMode(),
      "Results Placeholder":       () => activateConversionStatusMode(),
    };

    // Parent row — toggle children open/close
    document.querySelectorAll(".nav-row").forEach(row => {
      row.addEventListener("click", () => {
        const navKey = row.dataset.nav;
        const childrenEl = document.getElementById("children-" + navKey);
        const isOpen = childrenEl && childrenEl.classList.contains("open");
        // Close all
        document.querySelectorAll(".nav-row").forEach(r => r.classList.remove("active"));
        document.querySelectorAll(".nav-children").forEach(c => c.classList.remove("open"));
        // Open this one (toggle: if already open, stays closed)
        if (!isOpen) {
          row.classList.add("active");
          if (childrenEl) childrenEl.classList.add("open");
        }
      });
    });

    // Child click — mark active, route
    document.querySelectorAll(".nav-child").forEach(child => {
      child.addEventListener("click", e => {
        e.stopPropagation();
        document.querySelectorAll(".nav-child").forEach(c => c.classList.remove("active"));
        child.classList.add("active");
        const fn = pageRouteMap[child.dataset.page];
        if (fn) fn();
      });
    });

    function activateAnalysisHealthMode() {
      leftPanel.style.display = 'none';
      if (document.querySelector('.workspace')) {
        document.querySelector('.workspace').style.gridTemplateColumns = '1fr';
      }
      const displayHTML = `
      <div class="scroll-container" style="display:flex; flex-direction:column; padding:32px; height:100%; overflow-y:auto; background:var(--bg-main);">
        
        <!-- Header -->
        <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:24px;">
            <div>
                <div style="font-size:11px; font-weight:700; color:var(--text-muted); text-transform:uppercase; margin-bottom:4px; letter-spacing:0.5px;">COBOL Analysis Readiness</div>
                <h2 style="font-size:32px; font-weight:700; color:#fff; margin:0 0 8px 0;">Analysis Health</h2>
                <div style="font-size:14px; color:var(--text-muted);">A deterministic pipeline view from repo upload through AST, IR generation, IR accuracy, dependencies, artifacts, optional AI, and conversion readiness.</div>
            </div>
            <div style="display:flex; gap:12px;">
                <button style="background:#6c5ce7; color:#fff; border:none; padding:10px 20px; border-radius:6px; font-size:13px; font-weight:600; cursor:pointer;">Refresh</button>
                <button style="background:#2d3748; color:#fff; border:1px solid rgba(255,255,255,0.1); padding:10px 20px; border-radius:6px; font-size:13px; font-weight:600; cursor:pointer;">Download health bundle</button>
                <button style="background:#2d3748; color:#fff; border:1px solid rgba(255,255,255,0.1); padding:10px 20px; border-radius:6px; font-size:13px; font-weight:600; cursor:pointer;">Project DNA</button>
            </div>
        </div>

        <!-- Alert Banner -->
        <div style="background:rgba(241,196,15,0.1); border:1px solid rgba(241,196,15,0.3); color:#f1c40f; padding:16px 20px; border-radius:8px; font-size:14px; font-weight:600; margin-bottom:24px;">
            Ready with warnings: review partial parses, graph references, project artifact findings, or post-IR warnings before conversion.
        </div>
    <div style="display:grid; grid-template-columns:repeat(5, 1fr); gap:16px; margin-bottom:32px;">
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Timeline Stages</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">10</div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Parser Failures</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">0</div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Partial Parses</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">1</div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">IR Warnings</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">1</div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Graph Unresolved</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">0</div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Artifact Validation Fails</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">0</div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Artifact I/O Reads</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">14</div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Large Artifacts</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">0</div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">I/O Cache Hits</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">13</div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Skipped Files</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">0</div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">AI Calls</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">0</div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">AI Cache Hits</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">0</div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Post-IR Blockers</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">0</div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Initial IR Score</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">-</div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Post-Fix IR Score</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">-</div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">IR Readiness</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">not_checked</div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Resource Nodes</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">0</div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Evidence Edges</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">0</div>
        
    </div>
    </div><div class="dashboard-tabs" id="healthTabs"><button class="tab active" data-view="health-tab-0" style="font-size:12px; padding:0 8px 12px 8px;">Upload, Discovery, Preprocess & IR Generation</button><button class="tab" data-view="health-tab-1" style="font-size:12px; padding:0 8px 12px 8px;">Parser & AST</button><button class="tab" data-view="health-tab-2" style="font-size:12px; padding:0 8px 12px 8px;">IR Accuracy Lifecycle</button><button class="tab" data-view="health-tab-3" style="font-size:12px; padding:0 8px 12px 8px;">Dependency Graph Audit</button><button class="tab" data-view="health-tab-4" style="font-size:12px; padding:0 8px 12px 8px;">Project-Level Artifact Health</button><button class="tab" data-view="health-tab-5" style="font-size:12px; padding:0 8px 12px 8px;">Post-IR Readiness</button><button class="tab" data-view="health-tab-6" style="font-size:12px; padding:0 8px 12px 8px;">AI Assistance Health</button><button class="tab" data-view="health-tab-7" style="font-size:12px; padding:0 8px 12px 8px;">Run Timeline & Performance</button><button class="tab" data-view="health-tab-8" style="font-size:12px; padding:0 8px 12px 8px;">Persistence & Artifact I/O Health</button><button class="tab" data-view="health-tab-9" style="font-size:12px; padding:0 8px 12px 8px;">Review Queue & Downloads</button></div>
    <div id="health-tab-0" class="health-section" style="display:block; background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:12px; padding:24px; margin-bottom:32px;">
        <h3 style="font-size:16px; font-weight:600; color:#fff; margin-top:0; margin-bottom:20px;">Upload, Discovery, Preprocess & IR Generation</h3>
        <div style="display:flex; flex-wrap:wrap; gap:12px; margin-bottom:24px;"><div style='flex:1; min-width:140px;'>
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Uploaded files</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">1</div>
        
    </div>
    </div><div style='flex:1; min-width:140px;'>
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Parsed programs</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">1</div>
        
    </div>
    </div><div style='flex:1; min-width:140px;'>
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Dependency context</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">0</div>
        
    </div>
    </div><div style='flex:1; min-width:140px;'>
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Unsupported skipped</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">0</div>
        
    </div>
    </div><div style='flex:1; min-width:180px;'>
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Discovery cache</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">hit=0, miss=1</div>
        
    </div>
    </div><div style='flex:1; min-width:180px;'>
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Copybooks</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">reg=0, dup=0</div>
        
    </div>
    </div><div style='flex:1; min-width:180px;'>
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Missing copybooks</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">app=0, sys=0</div>
        
    </div>
    </div><div style='flex:1; min-width:180px;'>
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Copybook policy</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">app=warn</div>
        
    </div>
    </div><div style='flex:1; min-width:180px;'>
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">IR quality</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">pass=0, warn=1, fail=0</div>
        
    </div>
    </div><div style='flex:1; min-width:180px;'>
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">IR certification</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">cert=0, warn=1, block=0</div>
        
    </div>
    </div><div style='flex:1; min-width:180px;'>
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Conversion risk</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">low=1, med=0, high=0</div>
        
    </div>
    </div><div style='flex:1; min-width:140px;'>
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Preprocess warnings</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">1</div>
        
    </div>
    </div></div><h4 style='font-size:14px; font-weight:600; margin-bottom:12px; color:#fff;'>Deterministic IR Quality</h4>
    <div style="overflow-x:auto; margin-bottom:24px;">
        <table style="width:100%; border-collapse:collapse; font-size:13px;">
            <tr><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Program</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Status</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Score</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Issues</th></tr>
            <tr><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">temp</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">passed_with_warnings</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">72</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">partial_parse, parse_errors, preprocessing_warnings</td></tr>
        </table>
    </div>
    <h4 style='font-size:14px; font-weight:600; margin-bottom:12px; color:#fff;'>IR Certification</h4>
    <div style="overflow-x:auto; margin-bottom:24px;">
        <table style="width:100%; border-collapse:collapse; font-size:13px;">
            <tr><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Program</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Status</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Score</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Risk</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Blocking</th></tr>
            <tr><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">temp</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">certified_with_warnings</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">99</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">LOW</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">0</td></tr>
        </table>
    </div>
    <h4 style='font-size:14px; font-weight:600; margin-bottom:12px; color:#fff;'>Preprocessing Warnings</h4>
    <div style="overflow-x:auto; margin-bottom:24px;">
        <table style="width:100%; border-collapse:collapse; font-size:13px;">
            <tr><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Program</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Severity</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Type</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Message</th></tr>
            <tr><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">temp</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">INFO</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">DEBUG_INDICATOR_LINE_COMMENTED</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">Commented debug indicator line from column 7 for parser compatibility.</td></tr>
        </table>
    </div>
    <h4 style='font-size:14px; font-weight:600; margin-bottom:12px; color:#fff;'>SQL/CICS Mapping Audit</h4>
    <div style="overflow-x:auto; margin-bottom:24px;">
        <table style="width:100%; border-collapse:collapse; font-size:13px;">
            <tr><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Program</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Extracted</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Mapped</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Unmapped</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Warnings</th></tr>
            <tr><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">temp</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">0</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">0</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">0</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">-</td></tr>
        </table>
    </div>
    <h4 style='font-size:14px; font-weight:600; margin-bottom:12px; color:#fff;'>Copybook Resolution</h4>
    <div style="overflow-x:auto; margin-bottom:24px;">
        <table style="width:100%; border-collapse:collapse; font-size:13px;">
            <tr><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Program</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Copybook</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Status</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Severity</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Selected</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Reason</th></tr>
            <tr><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">No copybook references recorded.</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;"></td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;"></td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;"></td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;"></td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;"></td></tr>
        </table>
    </div>
    <h4 style='font-size:14px; font-weight:600; margin-bottom:12px; color:#fff;'>File Classification</h4>
    <div style="overflow-x:auto; margin-bottom:24px;">
        <table style="width:100%; border-collapse:collapse; font-size:13px;">
            <tr><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">File</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Type</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Disposition</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Confidence</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Reason</th></tr>
            <tr><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">cobol files/temp.cbl</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">program</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">parsed_program</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">0.98</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">program_by_extension</td></tr>
        </table>
    </div>
    
    </div>
    
    <div id="health-tab-1" class="health-section" style="display:none; background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:12px; padding:24px; margin-bottom:32px;">
        <h3 style="font-size:16px; font-weight:600; color:#fff; margin-top:0; margin-bottom:20px;">Parser & AST</h3>
        <div style="display:grid; grid-template-columns:repeat(5, 1fr); gap:12px; margin-bottom:24px;">
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Programs</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">1</div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Success</div>
        <div style="font-size:24px; font-weight:700; color:#fff;"><span style='color:#2ecc71'>0</span></div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Partial</div>
        <div style="font-size:24px; font-weight:700; color:#fff;"><span style='color:#f1c40f'>1</span></div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Failed</div>
        <div style="font-size:24px; font-weight:700; color:#fff;"><span style='color:#e74c3c'>0</span></div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Total parser time</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">233ms</div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Failure triage</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">1</div>
        
    </div>
    </div><h4 style='font-size:14px; font-weight:600; margin-bottom:12px; color:#fff;'>Slowest Parses</h4>
    <div style="overflow-x:auto; margin-bottom:24px;">
        <table style="width:100%; border-collapse:collapse; font-size:13px;">
            <tr><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Program</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Status</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Total Time</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Errors</th></tr>
            <tr><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">temp</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">partial</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">233ms</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">1</td></tr>
        </table>
    </div>
    <h4 style='font-size:14px; font-weight:600; margin-bottom:12px; color:#fff;'>Largest ASTs</h4>
    <div style="overflow-x:auto; margin-bottom:24px;">
        <table style="width:100%; border-collapse:collapse; font-size:13px;">
            <tr><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Program</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">AST Size</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">AST Nodes</th></tr>
            <tr><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">temp</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">35.1 KB</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">291</td></tr>
        </table>
    </div>
    <h4 style='font-size:14px; font-weight:600; margin-bottom:12px; color:#fff;'>Parse Failure Triage</h4>
    <div style="overflow-x:auto; margin-bottom:24px;">
        <table style="width:100%; border-collapse:collapse; font-size:13px;">
            <tr><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Program</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Classification</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Errors</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Suggested Fix</th></tr>
            <tr><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">temp</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">unknown_parser_failure</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">1</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">Review parser errors and source context, then add preprocessing or grammar support for the failing construct.</td></tr>
        </table>
    </div>
    
    </div>
    
    <div id="health-tab-2" class="health-section" style="display:none; background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:12px; padding:24px; margin-bottom:32px;">
        <h3 style="font-size:16px; font-weight:600; color:#fff; margin-top:0; margin-bottom:20px;">IR Accuracy Lifecycle</h3>
        <div style="display:grid; grid-template-columns:repeat(6, 1fr); gap:12px; margin-bottom:16px;">
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Initial IR score</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">not captured</div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Initial chunks</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">pass=0, warn=0, fail=0</div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Fix proposals</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">0</div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Applicable patches</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">0</div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Applied fixes</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">0</div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Post-fix IR score</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">not captured</div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Post-fix chunks</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">pass=0, warn=0, fail=0</div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Conversion readiness</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">not_checked</div>
        
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
    <div style="overflow-x:auto; margin-bottom:24px;">
        <table style="width:100%; border-collapse:collapse; font-size:13px;">
            <tr><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Phase</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Status</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Score</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Pass</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Warn</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Fail</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Semantic Warnings</th></tr>
            <tr><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">Initial</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">not captured</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">-</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">0</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">0</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">0</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">0</td></tr><tr><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">Post-fix</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">not captured</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">-</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">0</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">0</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">0</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">0</td></tr>
        </table>
    </div>
    <h4 style='font-size:14px; font-weight:600; margin-bottom:12px; color:#fff;'>Fix Review</h4><div style='border:1px dashed rgba(255,255,255,0.2); padding:20px; color:var(--text-muted); font-size:13px; border-radius:4px;'>No fix proposals yet. Run Check IR Quality, then Create Fix Review.</div>
    </div>
    
    <div id="health-tab-3" class="health-section" style="display:none; background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:12px; padding:24px; margin-bottom:32px;">
        <h3 style="font-size:16px; font-weight:600; color:#fff; margin-top:0; margin-bottom:20px;">Dependency Graph Audit</h3>
        <div style="display:grid; grid-template-columns:repeat(7, 1fr); gap:12px; margin-bottom:16px;">
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Schema</div>
        <div style="font-size:24px; font-weight:700; color:#fff;"><span style='color:#2ecc71'>yes</span></div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Nodes</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">1</div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Edges</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">0</div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Edge evidence</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">0</div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Unresolved refs</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">0</div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Missing IR edges</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">0</div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Resource nodes</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">0</div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">DB2 nodes</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">0</div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">CICS map nodes</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">0</div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Dataset nodes</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">0</div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">DB2 usage</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">0</div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">JCL lineage</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">0</div>
        
    </div>
    </div><div style='background:rgba(255,255,255,0.05); padding:8px 12px; border-radius:4px; font-size:13px; color:var(--text-muted); margin-bottom:16px; border:1px solid rgba(255,255,255,0.1); display:inline-block;'>Edge types: -</div><h4 style='font-size:14px; font-weight:600; margin-bottom:12px; color:#fff;'>Unresolved References</h4>
    <div style="overflow-x:auto; margin-bottom:24px;">
        <table style="width:100%; border-collapse:collapse; font-size:13px;">
            <tr><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Source</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Type</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Target</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Evidence</th></tr>
            <tr><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">No unresolved graph references recorded.</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;"></td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;"></td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;"></td></tr>
        </table>
    </div>
    <h4 style='font-size:14px; font-weight:600; margin-bottom:12px; color:#fff;'>DB2 Table Usage</h4>
    <div style="overflow-x:auto; margin-bottom:24px;">
        <table style="width:100%; border-collapse:collapse; font-size:13px;">
            <tr><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Table</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Program</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Modes</th></tr>
            <tr><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">No DB2 table usage captured.</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;"></td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;"></td></tr>
        </table>
    </div>
    <h4 style='font-size:14px; font-weight:600; margin-bottom:12px; color:#fff;'>JCL Program Dataset Lineage</h4>
    <div style="overflow-x:auto; margin-bottom:24px;">
        <table style="width:100%; border-collapse:collapse; font-size:13px;">
            <tr><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">JCL</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Step</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Program</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Datasets</th></tr>
            <tr><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">No JCL lineage captured.</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;"></td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;"></td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;"></td></tr>
        </table>
    </div>
    <h4 style='font-size:14px; font-weight:600; margin-bottom:12px; color:#fff;'>CICS Binding Audit</h4>
    <div style="overflow-x:auto; margin-bottom:24px;">
        <table style="width:100%; border-collapse:collapse; font-size:13px;">
            <tr><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Program</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Verb</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Map</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Link Program</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Resource</th></tr>
            <tr><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">No CICS bindings captured.</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;"></td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;"></td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;"></td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;"></td></tr>
        </table>
    </div>
    
    </div>
    
    <div id="health-tab-4" class="health-section" style="display:none; background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:12px; padding:24px; margin-bottom:32px;">
        <h3 style="font-size:16px; font-weight:600; color:#fff; margin-top:0; margin-bottom:20px;">Project-Level Artifact Health</h3>
        <div style="display:grid; grid-template-columns:repeat(7, 1fr); gap:12px; margin-bottom:24px;">
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Status</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">passed_with_warnings</div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Artifacts</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">7</div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Validated</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">6</div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Validation fails</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">0</div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Stamped</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">7</div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Manifest warnings</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">0</div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Contract findings</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">1</div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Preview warnings</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">1</div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Artifact graph nodes</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">7</div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Artifact graph edges</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">20</div>
        
    </div>
    </div><h4 style='font-size:14px; font-weight:600; margin-bottom:12px; color:#fff;'>Artifact Schema Validation</h4>
    <div style="overflow-x:auto; margin-bottom:24px;">
        <table style="width:100%; border-collapse:collapse; font-size:13px;">
            <tr><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Artifact</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Schema</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Status</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Errors</th></tr>
            <tr><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">project_dependency_graph</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">-</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">passed</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">-</td></tr><tr><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">generation_manifest</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">generation_manifest</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">passed</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">-</td></tr><tr><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">enriched_manifest</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">enriched_manifest</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">passed</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">-</td></tr><tr><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">classification_report</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">classification_report</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">passed</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">-</td></tr><tr><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">source_architecture_preview</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">source_architecture_preview</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">passed</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">-</td></tr><tr><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">target_preview</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">target_preview</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">passed</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">-</td></tr><tr><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">post_ir_traceability_report</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">post_ir_traceability_report</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">passed</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">-</td></tr>
        </table>
    </div>
    <h4 style='font-size:14px; font-weight:600; margin-bottom:12px; color:#fff;'>Manifest Enrichment Diff</h4>
    <div style="overflow-x:auto; margin-bottom:24px;">
        <table style="width:100%; border-collapse:collapse; font-size:13px;">
            <tr><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Class</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Before Fields</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">After Fields</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Added Keys</th></tr>
            <tr><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">EmpRecord</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">0</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">3</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">field_enrichment, fields, program_name, source_category</td></tr><tr><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">TempService</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">0</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">0</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">source_category</td></tr>
        </table>
    </div>
    <h4 style='font-size:14px; font-weight:600; margin-bottom:12px; color:#fff;'>Program Contract Consistency</h4>
    <div style="overflow-x:auto; margin-bottom:24px;">
        <table style="width:100%; border-collapse:collapse; font-size:13px;">
            <tr><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Severity</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Code</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Program(s)</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Message</th></tr>
            <tr><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">warn</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">ir_programs_missing_from_classification</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">READ_FILE_EXAMPLE</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">IR programs are missing from classification</td></tr>
        </table>
    </div>
    <h4 style='font-size:14px; font-weight:600; margin-bottom:12px; color:#fff;'>Preview Traceability</h4>
    <div style="overflow-x:auto; margin-bottom:24px;">
        <table style="width:100%; border-collapse:collapse; font-size:13px;">
            <tr><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Program</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Source Preview</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Target Preview</th></tr>
            <tr><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">READ_FILE_EXAMPLE</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">yes</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">no</td></tr>
        </table>
    </div>
    <h4 style='font-size:14px; font-weight:600; margin-bottom:12px; color:#fff;'>Artifact Dependency Graph</h4>
    <div style="overflow-x:auto; margin-bottom:24px;">
        <table style="width:100%; border-collapse:collapse; font-size:13px;">
            <tr><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Artifact</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Producer</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Validation</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Size</th></tr>
            <tr><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">project_dependency_graph</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">CrossFileDependencyResolver</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">passed</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">2.3 KB</td></tr><tr><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">generation_manifest</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">GenerationManifestGenerator</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">passed</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">11.2 KB</td></tr><tr><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">enriched_manifest</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">FieldEnrichmentService</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">passed</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">16.7 KB</td></tr><tr><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">classification_report</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">ClassificationReportGenerator</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">passed</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">1.2 KB</td></tr><tr><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">source_architecture_preview</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">SourceArchitecturePreviewBuilder</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">passed</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">6.7 KB</td></tr><tr><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">target_preview</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">TargetPreviewBuilder</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">passed</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">5.4 KB</td></tr><tr><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">post_ir_traceability_report</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">PostIrHealth</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">passed</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">6.2 KB</td></tr>
        </table>
    </div>
    <div style='background:rgba(255,255,255,0.05); padding:12px; border-radius:4px; font-size:13px; color:var(--text-muted); border:1px solid rgba(255,255,255,0.1);'>Manifest: classes=2, programs=2. Program contract: services=1, domain classes=1. Preview: source=1, target=0.</div>
    </div>
    
    <div id="health-tab-5" class="health-section" style="display:none; background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:12px; padding:24px; margin-bottom:32px;">
        <h3 style="font-size:16px; font-weight:600; color:#fff; margin-top:0; margin-bottom:20px;">Post-IR Readiness</h3>
        <div style="display:grid; grid-template-columns:repeat(7, 1fr); gap:12px; margin-bottom:24px;">
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Status</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">passed</div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">IR programs</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">1</div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Graph nodes</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">1</div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Manifest programs</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">2</div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Manifest services</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">1</div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Blocking issues</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">0</div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Warnings</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">0</div>
        
    </div>
    </div><h4 style='font-size:14px; font-weight:600; margin-bottom:12px; color:#fff;'>Artifact Contracts</h4>
    <div style="overflow-x:auto; margin-bottom:24px;">
        <table style="width:100%; border-collapse:collapse; font-size:13px;">
            <tr><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Artifact</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Status</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Missing Keys</th></tr>
            <tr><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">project_dependency_graph</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">passed</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">-</td></tr><tr><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">generation_manifest</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">passed</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">-</td></tr><tr><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">enriched_manifest</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">passed</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">-</td></tr><tr><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">classification_report</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">passed</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">-</td></tr><tr><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">source_architecture_preview</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">passed</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">-</td></tr><tr><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">target_preview</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">passed</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">-</td></tr>
        </table>
    </div>
    <h4 style='font-size:14px; font-weight:600; margin-bottom:12px; color:#fff;'>Program Traceability</h4>
    <div style="overflow-x:auto; margin-bottom:24px;">
        <table style="width:100%; border-collapse:collapse; font-size:13px;">
            <tr><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Program</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Graph</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Manifest</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Classification</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Program Contract</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Previews</th></tr>
            <tr><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">READ_FILE_EXAMPLE</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">yes</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">yes</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">yes</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">yes</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">source=yes, target=yes</td></tr>
        </table>
    </div>
    <h4 style='font-size:14px; font-weight:600; margin-bottom:12px; color:#fff;'>Readiness Findings</h4>
    <div style="overflow-x:auto; margin-bottom:24px;">
        <table style="width:100%; border-collapse:collapse; font-size:13px;">
            <tr><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Severity</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Code</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Program/Ref</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Message</th></tr>
            <tr><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">No post-IR readiness findings.</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;"></td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;"></td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;"></td></tr>
        </table>
    </div>
    
    </div>
    
    <div id="health-tab-6" class="health-section" style="display:none; background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:12px; padding:24px; margin-bottom:32px;">
        <h3 style="font-size:16px; font-weight:600; color:#fff; margin-top:0; margin-bottom:20px;">AI Assistance Health</h3>
        <div style="display:grid; grid-template-columns:repeat(6, 1fr); gap:12px; margin-bottom:16px;">
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Layer</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">AI-generated / optional</div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Optional layer</div>
        <div style="font-size:24px; font-weight:700; color:#fff;"><span style='color:#2ecc71'>yes</span></div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Deterministic separate</div>
        <div style="font-size:24px; font-weight:700; color:#fff;"><span style='color:#2ecc71'>yes</span></div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Total calls</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">0</div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Cache hits</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">0</div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Budget blocks</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">0</div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Est. tokens</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">0</div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Est. cost</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">$0</div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Timeout</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">180s</div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Retries</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">5</div>
        
    </div>
    </div><div style='background:rgba(255,255,255,0.05); padding:8px 12px; border-radius:4px; font-size:13px; color:var(--text-muted); margin-bottom:24px; border:1px solid rgba(255,255,255,0.1); display:inline-block;'>Deterministic vs AI-generated: deterministic AST, IR, graph, and artifact health are authoritative; AI checks are advisory enhancement jobs.</div><h4 style='font-size:14px; font-weight:600; margin-bottom:12px; color:#fff;'>Feature Budgets</h4>
    <div style="overflow-x:auto; margin-bottom:24px;">
        <table style="width:100%; border-collapse:collapse; font-size:13px;">
            <tr><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Feature</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Calls</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Est. Tokens</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Max Calls</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Max Prompt Tokens</th></tr>
            <tr><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">No LLM feature budgets configured.</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;"></td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;"></td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;"></td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;"></td></tr>
        </table>
    </div>
    <h4 style='font-size:14px; font-weight:600; margin-bottom:12px; color:#fff;'>Recent AI Calls</h4>
    <div style="overflow-x:auto; margin-bottom:24px;">
        <table style="width:100%; border-collapse:collapse; font-size:13px;">
            <tr><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Feature</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Model</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Status</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Cache</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Est. Tokens</th></tr>
            <tr><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">No LLM calls recorded for this project.</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;"></td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;"></td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;"></td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;"></td></tr>
        </table>
    </div>
    <h4 style='font-size:14px; font-weight:600; margin-bottom:12px; color:#fff;'>LLM Background / Queue Status</h4>
    <div style="overflow-x:auto; margin-bottom:24px;">
        <table style="width:100%; border-collapse:collapse; font-size:13px;">
            <tr><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Job</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Kind</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Status</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Retry Policy</th></tr>
            <tr><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">8b69c4d2-977f-40ab-b8c6-874f7498b54c</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">analysis</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">COMPLETED</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">analysis job owns deterministic retry; LLM calls use llm_governance retry/timeout policy</td></tr>
        </table>
    </div>
    
    </div>
    
    <div id="health-tab-7" class="health-section" style="display:none; background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:12px; padding:24px; margin-bottom:32px;">
        <h3 style="font-size:16px; font-weight:600; color:#fff; margin-top:0; margin-bottom:20px;">Run Timeline & Performance</h3>
        <div style="display:grid; grid-template-columns:repeat(7, 1fr); gap:12px; margin-bottom:16px;">
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Status</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">warnings</div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Live run</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">COMPLETED</div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Current stage</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">analysis</div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Timeline stages</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">10</div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Artifacts</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">66</div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Total artifact size</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">275.1 KB</div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Parse time</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">233ms</div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Slow I/O ops</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">0</div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Failed / partial</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">2</div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Skipped files</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">0</div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Run comparison</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">no</div>
        
    </div>
    </div><div style='background:rgba(255,255,255,0.05); padding:8px 12px; border-radius:4px; font-size:13px; color:var(--text-muted); margin-bottom:24px; border:1px solid rgba(255,255,255,0.1); display:inline-block;'>This view answers what happened, what failed or skipped, what changed, and what took time using deterministic health APIs and persisted run metadata.</div><h4 style='font-size:14px; font-weight:600; margin-bottom:12px; color:#fff;'>Live Stage Progress</h4>
    <div style="overflow-x:auto; margin-bottom:24px;">
        <table style="width:100%; border-collapse:collapse; font-size:13px;">
            <tr><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Stage</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Status</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Completed</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Failed</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Duration</th></tr>
            <tr><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">Upload</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">completed</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">yes</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">no</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">-</td></tr><tr><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">Discovery</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">completed</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">yes</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">no</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">-</td></tr><tr><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">Preprocess</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">warnings</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">yes</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">no</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">-</td></tr><tr><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">Parse</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">warnings</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">yes</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">no</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">-</td></tr><tr><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">IR</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">warnings</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">yes</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">no</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">-</td></tr><tr><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">Dependency</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">completed</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">yes</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">no</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">-</td></tr><tr><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">Manifest</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">completed</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">yes</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">no</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">-</td></tr><tr><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">Program Contract</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">warnings</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">yes</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">no</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">-</td></tr><tr><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">Previews</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">completed</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">yes</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">no</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">-</td></tr>
        </table>
    </div>
    <h4 style='font-size:14px; font-weight:600; margin-bottom:12px; color:#fff;'>Recent Analysis Events</h4>
    <div style="overflow-x:auto; margin-bottom:24px;">
        <table style="width:100%; border-collapse:collapse; font-size:13px;">
            <tr><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Stage</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Status</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Event</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Time</th></tr>
            <tr><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">ANALYSIS</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">COMPLETED</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">Analysis run completed</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">2026-05-28T14:48:34.538084+00:00</td></tr><tr><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">ARTIFACT_INDEX</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">COMPLETED</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">Indexed 62 analysis artifact(s)</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">2026-05-28T14:48:34.513174+00:00</td></tr>
        </table>
    </div>
    <h4 style='font-size:14px; font-weight:600; margin-bottom:12px; color:#fff;'>Stage Timeline</h4>
    <div style="overflow-x:auto; margin-bottom:24px;">
        <table style="width:100%; border-collapse:collapse; font-size:13px;">
            <tr><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Stage</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Status</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Duration</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Artifacts</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Metrics</th></tr>
            <tr><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">Analysis Run</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">completed</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">739ms</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">0</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">run_id=8b69c4d2... requested_by=analysis@ss.com</td></tr><tr><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">Upload</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">completed</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">-</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">1</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">uploaded_files=1, parsed_program=1...</td></tr><tr><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">Parse</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">warnings</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">-</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">5</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">programs=1, profile_available=yes...</td></tr>
        </table>
    </div>
    <h4 style='font-size:14px; font-weight:600; margin-bottom:12px; color:#fff;'>Failed / Partial Program Dashboard</h4>
    <div style="overflow-x:auto; margin-bottom:24px;">
        <table style="width:100%; border-collapse:collapse; font-size:13px;">
            <tr><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Program</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Stage</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Status</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Class</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Message</th></tr>
            <tr><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">temp</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">parse</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">failed_or_partial</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">unknown_parser_failure</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">Review parser errors...</td></tr><tr><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">temp</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">ir</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">passed_with_warnings</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">ir_quality</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">AST was produced from a partial parse...</td></tr>
        </table>
    </div>
    
    </div>
    
    <div id="health-tab-8" class="health-section" style="display:none; background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:12px; padding:24px; margin-bottom:32px;">
        <h3 style="font-size:16px; font-weight:600; color:#fff; margin-top:0; margin-bottom:20px;">Persistence & Artifact I/O Health</h3>
        <div style="display:grid; grid-template-columns:repeat(7, 1fr); gap:12px; margin-bottom:16px;">
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Status</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">passed</div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Artifacts indexed</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">66</div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Total size</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">275.1 KB</div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">JSON reads</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">14</div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">JSON writes</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">3</div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Cache hits</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">13</div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Cache misses</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">1</div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Slow ops</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">0</div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Large warnings</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">0</div>
        
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Compact AST candidates</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">0</div>
        
    </div>
    </div><div style='background:rgba(255,255,255,0.05); padding:8px 12px; border-radius:4px; font-size:13px; color:var(--text-muted); margin-bottom:24px; border:1px solid rgba(255,255,255,0.1); display:inline-block;'>Centralized artifact helper tracks JSON I/O timing, write-through IR cache activity, size budgets, compact AST companions, and compressed large AST/IR artifacts.</div><h4 style='font-size:14px; font-weight:600; margin-bottom:12px; color:#fff;'>Artifact Types</h4>
    <div style="overflow-x:auto; margin-bottom:24px;">
        <table style="width:100%; border-collapse:collapse; font-size:13px;">
            <tr><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Type</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Count</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Total Size</th></tr>
            <tr><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">ast</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">4</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">39.9 KB</td></tr><tr><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">ir</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">6</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">58.4 KB</td></tr><tr><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">json</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">50</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">170.2 KB</td></tr><tr><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">other</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">6</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">6.6 KB</td></tr>
        </table>
    </div>
    <h4 style='font-size:14px; font-weight:600; margin-bottom:12px; color:#fff;'>Largest Artifacts</h4>
    <div style="overflow-x:auto; margin-bottom:24px;">
        <table style="width:100%; border-collapse:collapse; font-size:13px;">
            <tr><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Artifact</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Type</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Size</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Warnings</th></tr>
            <tr><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">analysis/batch_temp/ast/temp_ast.json</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">ast</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">35.1 KB</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">-</td></tr><tr><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">analysis/batch_temp/ir/IR.json</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">ir</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">28.0 KB</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">-</td></tr><tr><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">analysis/batch_temp/ir/IR.compact.json</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">ir</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">26.8 KB</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">-</td></tr><tr><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">analysis/unified/project_artifact_health_report.json</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">json</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">23.0 KB</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">-</td></tr>
        </table>
    </div>
    <h4 style='font-size:14px; font-weight:600; margin-bottom:12px; color:#fff;'>Slowest JSON I/O Operations</h4>
    <div style="overflow-x:auto; margin-bottom:24px;">
        <table style="width:100%; border-collapse:collapse; font-size:13px;">
            <tr><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Operation</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Artifact</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Duration</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Cache</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Warnings</th></tr>
            <tr><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">write_json</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">analysis/batch_temp/ast/temp_ast.json</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">1ms</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">write-through</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">-</td></tr>
        </table>
    </div>
    <h4 style='font-size:14px; font-weight:600; margin-bottom:12px; color:#fff;'>Large I/O Operation Warnings</h4>
    <div style="overflow-x:auto; margin-bottom:24px;">
        <table style="width:100%; border-collapse:collapse; font-size:13px;">
            <tr><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Operation</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Artifact</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Size</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Warnings</th></tr>
            <tr><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">No large read/write operations recorded.</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;"></td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;"></td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;"></td></tr>
        </table>
    </div>
    
    </div>
    
    <div id="health-tab-9" class="health-section" style="display:none; background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:12px; padding:24px; margin-bottom:32px;">
        <h3 style="font-size:16px; font-weight:600; color:#fff; margin-top:0; margin-bottom:20px;">Review Queue & Downloads</h3>
        
    <div style="display:flex; justify-content:space-between; margin-bottom:16px;">
        <div style="font-size:13px; color:var(--text-muted);">Filter the evidence a reviewer needs first, then download the exact report behind it.</div>
        <div style="display:flex; gap:8px;">
            <button style="background:var(--accent-1); color:#fff; border:none; padding:4px 12px; border-radius:4px; font-size:12px;">All evidence</button>
            <button style="background:transparent; color:var(--text-muted); border:1px solid rgba(255,255,255,0.2); padding:4px 12px; border-radius:4px; font-size:12px;">Only blockers</button>
            <button style="background:transparent; color:var(--text-muted); border:1px solid rgba(255,255,255,0.2); padding:4px 12px; border-radius:4px; font-size:12px;">Only skipped files</button>
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
    <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:12px; margin-bottom:24px;">
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">BLOCKERS</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">1</div>
        <div style="font-size:12px; color:var(--text-muted); margin-top:4px;">Findings that can stop or materially weaken conversion readiness.</div>
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">SKIPPED FILES</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">0</div>
        <div style="font-size:12px; color:var(--text-muted); margin-top:4px;">Uploaded files that were intentionally skipped or rejected.</div>
    </div>
    
    <div style="background:var(--panel-bg); border:1px solid rgba(255,255,255,0.05); border-radius:8px; padding:16px;">
        <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">PROGRAM EVIDENCE</div>
        <div style="font-size:24px; font-weight:700; color:#fff;">4</div>
        <div style="font-size:12px; color:var(--text-muted); margin-top:4px;">Expandable per-program parse, IR, and traceability findings.</div>
    </div>
    </div><h4 style='font-size:14px; font-weight:600; margin-bottom:12px; color:#fff;'>Blocker Findings</h4>
    <div style="overflow-x:auto; margin-bottom:24px;">
        <table style="width:100%; border-collapse:collapse; font-size:13px;">
            <tr><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Area</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Severity</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Program/Ref</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Message</th></tr>
            <tr><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">Parse</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">failed</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">temp</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">Review parser errors and source context, then add preprocessing or grammar support for the failing construct.</td></tr>
        </table>
    </div>
    <h4 style='font-size:14px; font-weight:600; margin-bottom:12px; color:#fff;'>Skipped Files</h4>
    <div style="overflow-x:auto; margin-bottom:24px;">
        <table style="width:100%; border-collapse:collapse; font-size:13px;">
            <tr><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">File</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Type</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Disposition</th><th style="padding:12px; font-weight:600; text-align:left; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--text-muted);">Reason</th></tr>
            <tr><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;">No skipped files found.</td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;"></td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;"></td><td style="padding:12px; border-bottom:1px solid rgba(255,255,255,0.02); color:#cbd5e1;"></td></tr>
        </table>
    </div>
    <h4 style='font-size:14px; font-weight:600; margin-bottom:12px; color:#fff;'>Expandable Program Evidence</h4>
        <div style="background:rgba(0,0,0,0.2); border:1px solid rgba(255,255,255,0.05); padding:12px 16px; border-radius:6px; margin-bottom:8px; display:flex; align-items:center;">
            <div style="background:#e67e22; color:#fff; font-size:10px; font-weight:700; padding:2px 6px; border-radius:4px; margin-right:12px;">WARNING</div>
            <div style="font-size:13px; font-weight:600; color:#fff; width:300px;">Parser evidence: temp</div>
            <div style="font-size:13px; color:var(--text-muted);">unknown_parser_failure</div>
        </div>
        
        <div style="background:rgba(0,0,0,0.2); border:1px solid rgba(255,255,255,0.05); padding:12px 16px; border-radius:6px; margin-bottom:8px; display:flex; align-items:center;">
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
    </div>`;
      activateMode('Analysis Health', 'Analysis Health', '', displayHTML, () => {
          const healthTabsContainer = document.getElementById('healthTabs');
          if (healthTabsContainer) {
              const tabs = healthTabsContainer.querySelectorAll('.tab');
              tabs.forEach(tab => {
                  tab.addEventListener('click', (e) => {
                      tabs.forEach(t => t.classList.remove('active'));
                      e.target.classList.add('active');
                      const viewId = e.target.getAttribute('data-view');
                      document.querySelectorAll('.health-section').forEach(sec => sec.style.display = 'none');
                      const targetSec = document.getElementById(viewId);
                      if (targetSec) targetSec.style.display = 'block';
                  });
              });
          }
      });
    }

    // Coming-soon fallback
    function activateComingSoon(title) {
      const leftHTML = `<div class="sub-nav active">${title}</div>`;
      const displayHTML = `<div class="scroll-container" style="display:flex;align-items:center;justify-content:center;height:100%;">
        <div style="text-align:center;padding:60px 40px;">
          <h2 style="font-size:28px;font-weight:700;background:linear-gradient(135deg,#6c5ce7,#00d4ff);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-bottom:20px;">${title}</h2>
          <div style="display:inline-block;background:rgba(108,92,231,0.1);border:1px solid rgba(108,92,231,0.3);border-radius:16px;padding:28px 44px;box-shadow:0 8px 24px rgba(108,92,231,0.15);">
            <p style="font-size:18px;color:var(--accent-2);margin:0;font-weight:600;">&#x1F680; This page will be activated soon</p>
            <p style="font-size:14px;color:var(--text-muted);margin-top:10px;margin-bottom:0;">Stay tuned for exciting updates!</p>
          </div>
        </div>
      </div>`;
      activateMode(title, title, leftHTML, displayHTML);
    }

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

      const leftHTML = `<div style="display:flex;flex-direction:column;gap:20px;max-height:100%;overflow-y:auto;overflow-x:hidden;">
        <div>
          <div class="sub-nav active" style="margin-bottom: 24px; cursor: default; pointer-events: none;">IR QUALITY</div>
          <p style="color:#94a3b8;line-height:1.6;margin-bottom:12px;font-size:13px;">Runs only when you click the button. No automatic LLM calls on tab load.</p>
          <div style="background:rgba(59,130,246,0.1);padding:12px;border-radius:8px;border-left:3px solid #3b82f6;margin:12px 0;">
            <p style="margin:0;color:#60a5fa;line-height:1.6;font-size:13px;">Parser, AST, upload-to-IR, dependency graph audit, and post-IR readiness metrics now live in <a href="#" id="analysisHealthLink" style="color:#60a5fa;text-decoration:underline;">Analysis Health</a>.</p>
          </div>
          <p style="color:#94a3b8;line-height:1.8;margin-bottom:14px;font-size:14px;font-family:'Inter',sans-serif;font-weight:500;"><strong style="color:#94a3b8;font-weight:600;">Check IR Quality</strong> runs the LLM verifier (per chunk) and writes reports. <strong style="color:#94a3b8;font-weight:600;">Improve / Update (Draft)</strong> aggregates suggestions from those reports. <strong style="color:#94a3b8;font-weight:600;">Apply</strong> is available only when <span style="background:rgba(255,255,255,0.06);padding:2px 6px;border-radius:4px;font-size:13px;color:#94a3b8;">ir_verification_assisted_apply_enabled</span> is true in server config; it writes <span style="background:rgba(255,255,255,0.06);padding:2px 6px;border-radius:4px;font-size:13px;color:#94a3b8;">IR.json</span> with a timestamped backup.</p>
          <button id="checkIRQualityBtn" style="display:flex;align-items:center;justify-content:center;gap:8px;width:100%;padding:12px 16px;border-radius:20px;font-size:13px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;text-align:center;cursor:pointer;background:#0f141b;border:1px solid transparent;background-image:linear-gradient(#0f141b, #0f141b),linear-gradient(90deg, #6c5ce7, #00d4ff);background-origin:border-box;background-clip:padding-box, border-box;color:var(--accent-2);box-shadow:0 0 16px rgba(0, 212, 255, 0.08);transition:all 0.25s ease;margin-bottom:16px;" onmousedown="this.style.background='linear-gradient(90deg, rgba(108, 92, 231, 0.22), rgba(0, 212, 255, 0.18))';this.style.color='#ffffff';this.style.border='1px solid rgba(0, 212, 255, 0.45)'" onmouseup="this.style.background='#0f141b';this.style.border='1px solid transparent';this.style.backgroundImage='linear-gradient(#0f141b, #0f141b),linear-gradient(90deg, #6c5ce7, #00d4ff)';this.style.color='var(--accent-2)'" onmouseleave="this.style.background='#0f141b';this.style.border='1px solid transparent';this.style.backgroundImage='linear-gradient(#0f141b, #0f141b),linear-gradient(90deg, #6c5ce7, #00d4ff)';this.style.color='var(--accent-2)'">Check IR Quality</button>
          <p style="color:#94a3b8;line-height:1.8;margin-bottom:16px;font-size:14px;font-family:'Inter',sans-serif;font-weight:500;">Label: deterministic pipeline health is authoritative. AI-generated verifier findings are optional advisory enhancements with budget, cache, and usage reporting in Analysis Health.</p>
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
        
        <div id="dependencyContent" style="display:none;height:100%;display:flex;flex-direction:column;">
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

/* ============================================================
   STATIC PAGE BOOTSTRAP
============================================================ */
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

function bootInitialStaticPage() {
  const initialPage = window.EQUIVALIC_INITIAL_PAGE || 'Project Summary';
  const route = pageRouteMap[initialPage] || pageRouteMap['Project Summary'];
  syncSidebarActive(initialPage);
  if (initialPage === 'Project Summary') {
    activateProjectSummaryMode(true);
  } else if (route) {
    route();
  }
}

bootInitialStaticPage();
