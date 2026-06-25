/* ============================================================
   Architecture Studio page logic
   Source: ChangedAnalysisEngine (2).html
   Contains this page's bootstrap, renderers, handlers, and data only.
============================================================ */
window.EQUIVALIC_INITIAL_PAGE = window.EQUIVALIC_INITIAL_PAGE || 'Architecture Studio';

/* ============================================================
   Page bootstrap and shared shell utilities
============================================================ */
const appState = { product: "Product Suite", section: "Design", page: "Architecture Studio", view: "Overview" };
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

    

syncSidebarActive(window.EQUIVALIC_INITIAL_PAGE);



/* PORTED FROM PREVIEW */

// Update navigation links with project context
function updateNavigationLinks() {
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('project');
    
    if (projectId) {
        // Update all navigation links to include project ID
        const links = {
            '/static/index.html': `/static/index.html?project=${projectId}&page=analytics`,
            '/static/conversion-status.html': `/static/conversion-status.html?project=${projectId}`,
            '/static/project-dna.html': `/static/project-dna.html?project=${projectId}`,
            '/static/architecture-preview.html': `/static/architecture-preview.html?project=${projectId}`,
            '/static/risk-assessment.html': `/static/risk-assessment.html?project=${projectId}`,
            '/static/best-practices.html': `/static/best-practices.html?project=${projectId}`,
            '/static/security-assessment.html': `/static/security-assessment.html?project=${projectId}`,
            '/static/plan-conversion.html': `/static/plan-conversion.html?project=${projectId}`
        };
        
        Object.keys(links).forEach(href => {
            const link = document.querySelector(`a[href="${href}"]`);
            if (link) link.href = links[href];
        });
    }
}

var architectureProjectId = new URLSearchParams(window.location.search).get('project') || 'dummy-project';
var initialArchitectureView = new URLSearchParams(window.location.search).get('view') || 'source';
var sourceArchitecturePreview = null;
var targetArchitecturePreview = null;
var javaArchitecturePreview = null;
var architectureComparisonPreview = null;
var bmsScreenPreview = { mapsets: [], linkage: {} };
var selectedBmsMapKey = null;
var selectedBmsFieldKey = null;
var architectureZoom = 1;
var baseFitScale = 1.0;
var activeArchitectureTab = 'diagram';
var activeArchitectureView = ['java', 'transform'].indexOf(initialArchitectureView) >= 0 ? initialArchitectureView : 'source';
var selectedArchitectureNodeId = null;
var selectedTransformationMappingId = null;
var transformationFilter = 'all';

function handleArchitectureLogout(e) {
    e.preventDefault();
    if (confirm('The process will be stopped. Do you want to close the analysis and logout?')) {
        try { localStorage.removeItem('shiftscripts_session_id'); } catch (err) {}
        window.location.href = '/?logout=1';
    }
}

function getSessionHeaders() {
    var headers = { 'Content-Type': 'application/json' };
    try {
        var sid = localStorage.getItem('shiftscripts_session_id');
        if (sid) headers['X-Session-ID'] = sid;
    } catch (e) {}
    return headers;
}

function escapeHtml(str) {
    return String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function showToast(message, type) {
    var container = document.getElementById('toast-container');
    if (!container) return;
    var toast = document.createElement('div');
    toast.className = 'toast ' + (type || 'success');
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(function() { toast.remove(); }, 4000);
}

function apiPrefix() {
    return '/api/v1/cobol';
}


/* ============================================================
   DUMMY BACKEND MOCK DATA
   ============================================================ */

const mockWikiDashboard = {
    summary: { system_type: "Batch COBOL application with DB2 data access" },
    meta: { project_name: "test3", mode: "auto", binding: "advisory" }
};

const mockSourceArchitecture = {
    summary: {
        system_type: "Batch COBOL application with DB2 data access",
        entry_points: 1,
        programs: 2,
        copybooks: 3,
        datastores: 5,
        relationships: 16
    },
    meta: { project_name: "test3" },
    layers: [
        { id: "entry", label: "ENTRY POINTS", node_ids: ["JCL_EXECUTE"] },
        { id: "programs", label: "COBOL PROGRAMS", node_ids: ["COB_ORDVAL", "COB_ORDINV"] },
        { id: "data", label: "COPYBOOKS / SHARED DATA", node_ids: ["CPY_INVSTRUC", "CPY_ORDSTRUC", "CPY_SQLCODES"] },
        { id: "resources", label: "FILES, DB2, AND EXTERNAL RESOURCES", node_ids: ["EXT_IKJEFT01", "FILE_LOADLIB", "FILE_ERROR", "FILE_INPUT", "FILE_PROCESSED", "FILE_VALID"] }
    ],
    nodes: [
        { id: "JCL_EXECUTE", kind: "JCL", label: "EXECUTE", role: "Batch entry point / job orchestration" },
        { id: "COB_ORDVAL", kind: "COBOL_PROGRAM", label: "ORDVAL", role: "Main Program Batch DB2" },
        { id: "COB_ORDINV", kind: "COBOL_PROGRAM", label: "ORDINV", role: "Main Program Batch DB2" },
        { id: "CPY_INVSTRUC", kind: "COPYBOOK", label: "INVSTRUC", role: "Shared data definition" },
        { id: "CPY_ORDSTRUC", kind: "COPYBOOK", label: "ORDSTRUC", role: "Shared data definition" },
        { id: "CPY_SQLCODES", kind: "COPYBOOK", label: "SQLCODES", role: "Shared data definition" },
        { id: "EXT_IKJEFT01", kind: "EXTERNAL_RESOURCE", label: "IKJEFT01", role: "External runtime" },
        { id: "FILE_LOADLIB", kind: "FILE_RESOURCE", label: "PROD.LOADLIB", role: "File resource" },
        { id: "FILE_ERROR", kind: "FILE_RESOURCE", label: "PROD.ORDERS.ERROR", role: "File resource" },
        { id: "FILE_INPUT", kind: "FILE_RESOURCE", label: "PROD.ORDERS.INPUT", role: "File resource" },
        { id: "FILE_PROCESSED", kind: "FILE_RESOURCE", label: "PROD.ORDERS.PROCESSED", role: "File resource" },
        { id: "FILE_VALID", kind: "FILE_RESOURCE", label: "PROD.ORDERS.VALID", role: "File resource" }
    ],
    edges: [
        { from: "JCL_EXECUTE", to: "COB_ORDVAL", type: "jcl_runs_program", label: "executes" },
        { from: "JCL_EXECUTE", to: "COB_ORDINV", type: "jcl_runs_program", label: "executes" },
        { from: "COB_ORDVAL", to: "CPY_ORDSTRUC", type: "program_uses_copybook", label: "uses copybook" },
        { from: "COB_ORDINV", to: "CPY_INVSTRUC", type: "program_uses_copybook", label: "uses copybook" },
        { from: "COB_ORDINV", to: "CPY_SQLCODES", type: "program_uses_copybook", label: "uses copybook" },
        { from: "COB_ORDVAL", to: "FILE_INPUT", type: "reads_file", label: "reads" },
        { from: "COB_ORDVAL", to: "FILE_VALID", type: "writes_file", label: "writes" },
        { from: "COB_ORDVAL", to: "FILE_ERROR", type: "writes_file", label: "writes" },
        { from: "COB_ORDINV", to: "FILE_VALID", type: "reads_file", label: "reads" },
        { from: "COB_ORDINV", to: "FILE_PROCESSED", type: "writes_file", label: "writes" }
    ],
    flows: [
        { name: "EXECUTE execution flow", steps: ["JCL_EXECUTE", "COB_ORDVAL", "COB_ORDINV"], resources: ["FILE_INPUT", "FILE_VALID", "FILE_PROCESSED"] }
    ],
    insights: [
        { type: "system_pattern", title: "Batch COBOL application with DB2 data access", description: "Architecture is inferred from the project dependency graph." },
        { type: "entrypoint", title: "JCL-driven orchestration", description: "One or more JCL artifacts act as execution entry." }
    ]
};

const mockTargetPreview = {
    endpoints: [
        { http: { method: "POST", path: "/api/v1/orders/validate" }, category: "Business Logic", enabled: true },
        { http: { method: "POST", path: "/api/v1/inventory/update" }, category: "Business Logic", enabled: true }
    ],
    folderStructure: {
        root: "project_converted",
        modules: [
            { name: "order-validation-service", type: "Spring Boot Microservice", paths: { pom: "pom.xml", srcMainJava: "src/main/java/com/equivalic/orders" } },
            { name: "inventory-service", type: "Spring Boot Microservice", paths: { pom: "pom.xml", srcMainJava: "src/main/java/com/equivalic/inventory" } }
        ]
    }
};

const mockJavaArchitecture = {
    summary: {
        system_type: "Target Java architecture",
        mode: "auto",
        binding: "advisory",
        modules: 2,
        classes: 12,
        services: 4,
        repositories: 4,
        entities: 2,
        relationships: 18
    },
    meta: { project_name: "test3" },
    layers: [
        { id: "api", label: "CONTROLLERS", node_ids: ["CTRL_ORDER", "CTRL_INV"] },
        { id: "service", label: "SERVICES", node_ids: ["SVC_ORDER", "SVC_INV"] },
        { id: "data", label: "REPOSITORIES / ENTITIES", node_ids: ["REPO_ORDER", "ENT_ORDER", "REPO_INV", "ENT_INV"] }
    ],
    nodes: [
        { id: "CTRL_ORDER", kind: "REST_CONTROLLER", label: "OrderController", role: "REST API Endpoint" },
        { id: "CTRL_INV", kind: "REST_CONTROLLER", label: "InventoryController", role: "REST API Endpoint" },
        { id: "SVC_ORDER", kind: "SERVICE", label: "OrderValidationService", role: "Business Logic" },
        { id: "SVC_INV", kind: "SERVICE", label: "InventoryUpdateService", role: "Business Logic" },
        { id: "REPO_ORDER", kind: "REPOSITORY", label: "OrderRepository", role: "Data Access" },
        { id: "ENT_ORDER", kind: "ENTITY", label: "OrderEntity", role: "Data Model" },
        { id: "REPO_INV", kind: "REPOSITORY", label: "InventoryRepository", role: "Data Access" },
        { id: "ENT_INV", kind: "ENTITY", label: "InventoryEntity", role: "Data Model" }
    ],
    edges: [
        { from: "CTRL_ORDER", to: "SVC_ORDER", type: "calls", label: "calls" },
        { from: "CTRL_INV", to: "SVC_INV", type: "calls", label: "calls" },
        { from: "SVC_ORDER", to: "REPO_ORDER", type: "uses", label: "uses" },
        { from: "REPO_ORDER", to: "ENT_ORDER", type: "manages", label: "manages" },
        { from: "SVC_INV", to: "REPO_INV", type: "uses", label: "uses" },
        { from: "REPO_INV", to: "ENT_INV", type: "manages", label: "manages" }
    ]
};

const mockComparisonArchitecture = {
    summary: {
        system_type: "Architecture Transformation Map",
        confidence_score: 14,
        programs_mapped: 2, programs_total: 2,
        datastores_mapped: 0, datastores_total: 3,
        jcl_mapped: 0, jcl_total: 1,
        cics_mapped: 0, cics_total: 0,
        new_target_components: 8
    },
    meta: { mode: "planned / advisory", binding: "none" },
    layers: [
        { id: "source", label: "SOURCE COBOL", node_ids: ["COB_ORDVAL", "COB_ORDINV", "FILE_INPUT", "FILE_VALID"] },
        { id: "mapping", label: "TRANSFORMATION MAPPING", node_ids: ["MAP_ORDVAL", "MAP_ORDINV"] },
        { id: "target", label: "TARGET JAVA", node_ids: ["SVC_ORDER", "SVC_INV", "REPO_ORDER"] }
    ],
    nodes: [
        { id: "COB_ORDVAL", kind: "COBOL_PROGRAM", label: "ORDVAL" },
        { id: "COB_ORDINV", kind: "COBOL_PROGRAM", label: "ORDINV" },
        { id: "FILE_INPUT", kind: "FILE_RESOURCE", label: "PROD.ORDERS.INPUT" },
        { id: "FILE_VALID", kind: "FILE_RESOURCE", label: "PROD.ORDERS.VALID" },
        { id: "MAP_ORDVAL", kind: "EXTERNAL_RESOURCE", label: "100% mapped", role: "Direct translation" },
        { id: "MAP_ORDINV", kind: "EXTERNAL_RESOURCE", label: "92% mapped", role: "Refactored" },
        { id: "SVC_ORDER", kind: "SERVICE", label: "OrderValidationService" },
        { id: "SVC_INV", kind: "SERVICE", label: "InventoryUpdateService" },
        { id: "REPO_ORDER", kind: "REPOSITORY", label: "OrderRepository" }
    ],
    edges: [
        { from: "COB_ORDVAL", to: "MAP_ORDVAL", type: "mapped_to", label: "mapped" },
        { from: "MAP_ORDVAL", to: "SVC_ORDER", type: "produces", label: "produces" },
        { from: "COB_ORDINV", to: "MAP_ORDINV", type: "mapped_to", label: "mapped" },
        { from: "MAP_ORDINV", to: "SVC_INV", type: "produces", label: "produces" }
    ],
    mappings: [
        {
            id: "m_execute", status: "unmapped",
            source: { id: "EXECUTE", label: "EXECUTE", kind: "JCL" },
            targets: [{ kind: "EXTERNAL_RESOURCE" }],
            transformation: "JCL/Job orchestration -> Java batch runner",
            reason: "No batch runner was found.",
            evidence: [{ artifact: "analysis/project_dependency_graph.json", note: "nodes" }]
        },
        {
            id: "m_ordinv", status: "mapped",
            source: { id: "ORDINV", label: "ORDINV", kind: "COBOL_PROGRAM" },
            targets: [{ id: "OrdinvService", label: "OrdinvService (Service), OrdinvProgramContext (Context)", kind: "SERVICE" }],
            transformation: "COBOL program -> Java service/context",
            reason: "Mapped based on structural equivalence.",
            confidence_score: 94
        },
        {
            id: "m_ordval", status: "mapped",
            source: { id: "ORDVAL", label: "ORDVAL", kind: "COBOL_PROGRAM" },
            targets: [{ id: "OrdvalService", label: "OrdvalService (Service), OrdvalProgramContext (Context)", kind: "SERVICE" }],
            transformation: "COBOL program -> Java service/context",
            reason: "Mapped based on structural equivalence.",
            confidence_score: 94
        },
        {
            id: "m_customer", status: "unmapped",
            source: { id: "CUSTOMER", label: "CUSTOMER", kind: "DB2_TABLE" },
            targets: [{ kind: "EXTERNAL_RESOURCE" }],
            transformation: "DB2 table -> Java entity/repository/database node",
            reason: "No Java target found",
            confidence_score: 0
        },
        {
            id: "m_inventory", status: "unmapped",
            source: { id: "INVENTORY", label: "INVENTORY", kind: "DB2_TABLE" },
            targets: [{ kind: "EXTERNAL_RESOURCE" }],
            transformation: "DB2 table -> Java entity/repository/database node",
            reason: "No Java target found",
            confidence_score: 0
        },
        {
            id: "m_order_status", status: "unmapped",
            source: { id: "ORDER STATUS", label: "ORDER STATUS", kind: "DB2_TABLE" },
            targets: [{ kind: "EXTERNAL_RESOURCE" }],
            transformation: "DB2 table -> Java entity/repository/database node",
            reason: "No Java target found",
            confidence_score: 0
        },
        {
            id: "m_invstruc", status: "unmapped",
            source: { id: "INVSTRUC", label: "INVSTRUC", kind: "COPYBOOK" },
            targets: [{ kind: "EXTERNAL_RESOURCE" }],
            transformation: "Copybook -> Java DTO/context",
            reason: "No Java target found",
            confidence_score: 0
        },
        {
            id: "m_ordstruc", status: "unmapped",
            source: { id: "ORDSTRUC", label: "ORDSTRUC", kind: "COPYBOOK" },
            targets: [{ kind: "EXTERNAL_RESOURCE" }],
            transformation: "Copybook -> Java DTO/context",
            reason: "No Java target found",
            confidence_score: 0
        },
        {
            id: "m_sqlcodes", status: "unmapped",
            source: { id: "SQLCODES", label: "SQLCODES", kind: "COPYBOOK" },
            targets: [{ kind: "EXTERNAL_RESOURCE" }],
            transformation: "Copybook -> Java DTO/context",
            reason: "No Java target found",
            confidence_score: 0
        },
        {
            id: "m_prod_loadlib", status: "unmapped",
            source: { id: "PROD.LOADLIB", label: "PROD.LOADLIB", kind: "FILE_RESOURCE" },
            targets: [{ kind: "EXTERNAL_RESOURCE" }],
            transformation: "File/dataset dependency -> Java adapter/support code",
            reason: "No Java target found",
            confidence_score: 0
        },
        {
            id: "m_prod_orders_error", status: "unmapped",
            source: { id: "PROD.ORDERS.ERROR", label: "PROD.ORDERS.ERROR", kind: "FILE_RESOURCE" },
            targets: [{ kind: "EXTERNAL_RESOURCE" }],
            transformation: "File/dataset dependency -> Java adapter/support code",
            reason: "No Java target found",
            confidence_score: 0
        },
        {
            id: "m_prod_orders_input", status: "unmapped",
            source: { id: "PROD.ORDERS.INPUT", label: "PROD.ORDERS.INPUT", kind: "FILE_RESOURCE" },
            targets: [{ kind: "EXTERNAL_RESOURCE" }],
            transformation: "File/dataset dependency -> Java adapter/support code",
            reason: "No Java target found",
            confidence_score: 0
        },
        {
            id: "m_prod_orders_processed", status: "unmapped",
            source: { id: "PROD.ORDERS.PROCESSED", label: "PROD.ORDERS.PROCESSED", kind: "FILE_RESOURCE" },
            targets: [{ kind: "EXTERNAL_RESOURCE" }],
            transformation: "File/dataset dependency -> Java adapter/support code",
            reason: "No Java target found",
            confidence_score: 0
        },
        {
            id: "m_prod_orders_valid", status: "unmapped",
            source: { id: "PROD.ORDERS.VALID", label: "PROD.ORDERS.VALID", kind: "FILE_RESOURCE" },
            targets: [{ kind: "EXTERNAL_RESOURCE" }],
            transformation: "File/dataset dependency -> Java adapter/support code",
            reason: "No Java target found",
            confidence_score: 0
        },
        {
            id: "m_gen_main", status: "generated_new",
            source: { id: "Generated Java", label: "Generated Java", kind: "EXTERNAL_RESOURCE" },
            targets: [{ id: "main-module", label: "main-module (Module)", kind: "MAVEN_MODULE" }],
            transformation: "Generated Java framework/support component",
            confidence_score: 100
        },
        {
            id: "m_gen_shared", status: "generated_new",
            source: { id: "Generated Java", label: "Generated Java", kind: "EXTERNAL_RESOURCE" },
            targets: [{ id: "shared-module", label: "shared module (Module)", kind: "MAVEN_MODULE" }],
            transformation: "Generated Java framework/support component",
            confidence_score: 100
        },
        {
            id: "m_gen_util", status: "generated_new",
            source: { id: "Generated Java", label: "Generated Java", kind: "EXTERNAL_RESOURCE" },
            targets: [{ id: "util-module", label: "util-module (Module)", kind: "MAVEN_MODULE" }],
            transformation: "Generated Java framework/support component",
            confidence_score: 100
        },
        {
            id: "m_gen_test3", status: "generated_new",
            source: { id: "Generated Java", label: "Generated Java", kind: "EXTERNAL_RESOURCE" },
            targets: [{ id: "test3.converted", label: "test3.converted (Maven)", kind: "MAVEN_MODULE" }],
            transformation: "Generated Java framework/support component",
            confidence_score: 100
        },
        {
            id: "m_gen_mainapp", status: "generated_new",
            source: { id: "Generated Java", label: "Generated Java", kind: "EXTERNAL_RESOURCE" },
            targets: [{ id: "MainApplication", label: "MainApplication (Spring Boot)", kind: "SPRING_BOOT_APP" }],
            transformation: "Generated Java framework/support component",
            confidence_score: 100
        },
        {
            id: "m_gen_invstruc", status: "generated_new",
            source: { id: "Generated Java", label: "Generated Java", kind: "EXTERNAL_RESOURCE" },
            targets: [{ id: "InventoryStructure", label: "InventoryStructure (External)", kind: "EXTERNAL_RESOURCE" }],
            transformation: "Generated Java framework/support component",
            confidence_score: 100
        },
        {
            id: "m_gen_ordstruc", status: "generated_new",
            source: { id: "Generated Java", label: "Generated Java", kind: "EXTERNAL_RESOURCE" },
            targets: [{ id: "OrderStructure", label: "OrderStructure (External)", kind: "EXTERNAL_RESOURCE" }],
            transformation: "Generated Java framework/support component",
            confidence_score: 100
        },
        {
            id: "m_gen_sqlcodes", status: "generated_new",
            source: { id: "Generated Java", label: "Generated Java", kind: "EXTERNAL_RESOURCE" },
            targets: [{ id: "SqlReturnCodes", label: "SqlReturnCodes (External)", kind: "EXTERNAL_RESOURCE" }],
            transformation: "Generated Java framework/support component",
            confidence_score: 100
        }
    ],
    lanes: [
        { id: "entrypoints", label: "ENTRYPOINTS", mapping_ids: ["m_execute"] },
        { id: "business_programs", label: "BUSINESS PROGRAMS", mapping_ids: ["m_ordinv", "m_ordval"] },
        { id: "data_resources", label: "DATA & RESOURCES", mapping_ids: ["m_customer", "m_inventory", "m_order_status", "m_invstruc", "m_ordstruc", "m_sqlcodes", "m_prod_loadlib", "m_prod_orders_error", "m_prod_orders_input", "m_prod_orders_processed", "m_prod_orders_valid"] },
        { id: "generated_java", label: "GENERATED JAVA SUPPORT", mapping_ids: ["m_gen_main", "m_gen_shared", "m_gen_util", "m_gen_test3", "m_gen_mainapp", "m_gen_invstruc", "m_gen_ordstruc", "m_gen_sqlcodes"] }
    ],
    gaps: [
        { severity: 'high', component: 'EXECUTE', description: 'No batch runner was found.' },
        { severity: 'high', component: 'CUSTOMER', description: 'No generated persistence component matched this table.' }
    ]
};

// Override fetchJson to use mock data
async function fetchJson(url) {
    console.log('Mock intercepting fetch for:', url);
    if (url.includes('/source-architecture-preview')) return mockSourceArchitecture;
    if (url.includes('/wiki/dashboard')) return mockWikiDashboard;
    if (url.includes('/target-preview')) return mockTargetPreview;
    if (url.includes('/java-architecture-preview')) return mockJavaArchitecture;
    if (url.includes('/architecture-comparison-preview')) return mockComparisonArchitecture;
    throw new Error('Endpoint not mocked: ' + url);
}


function normalizeKind(kind) {
    var value = String(kind || 'EXTERNAL_RESOURCE').toUpperCase().replace(/[-\s]+/g, '_');
    if (value.indexOf('SPRING') >= 0 || value === 'MAIN_APPLICATION') return 'SPRING_BOOT_APP';
    if (value.indexOf('MAVEN_PARENT') >= 0) return 'MAVEN_PARENT';
    if (value.indexOf('MAVEN_MODULE') >= 0 || value === 'MODULE') return 'MAVEN_MODULE';
    if (value.indexOf('REST_CONTROLLER') >= 0 || value === 'CONTROLLER') return 'REST_CONTROLLER';
    if (value.indexOf('CICS_GATEWAY') >= 0) return 'CICS_GATEWAY';
    if (value.indexOf('UNBOUND_ENTRYPOINT') >= 0 || value.indexOf('ENTRYPOINT_CANDIDATE') >= 0 || value.indexOf('DIRECT_ENTRYPOINT') >= 0) return 'UNBOUND_ENTRYPOINT';
    if (value.indexOf('BATCH_RUNNER') >= 0 || value.indexOf('RUNNER') >= 0) return 'BATCH_RUNNER';
    if (value === 'SERVICE' || value.indexOf('_SERVICE') >= 0) return 'SERVICE';
    if (value.indexOf('PROGRAM_CONTEXT') >= 0) return 'PROGRAM_CONTEXT';
    if (value === 'DTO' || value.indexOf('_DTO') >= 0) return 'DTO';
    if (value === 'ENTITY' || value.indexOf('_ENTITY') >= 0) return 'ENTITY';
    if (value === 'REPOSITORY' || value.indexOf('_REPOSITORY') >= 0) return 'REPOSITORY';
    if (value === 'CONFIG' || value.indexOf('CONFIGURATION') >= 0) return 'CONFIG';
    if (value === 'DATABASE') return 'DATABASE';
    if (value.indexOf('JCL') >= 0 || value.indexOf('JOB') >= 0) return 'JCL';
    if (value.indexOf('CICS') >= 0 || value.indexOf('TRANSACTION') >= 0) return 'CICS_TRANSACTION';
    if (value.indexOf('COBOL') >= 0 || value.indexOf('PROGRAM') >= 0) return 'COBOL_PROGRAM';
    if (value.indexOf('COPYBOOK') >= 0 || value === 'CPY' || value === 'COPY') return 'COPYBOOK';
    if (value.indexOf('BMS') >= 0 || value.indexOf('MAP') >= 0 || value.indexOf('SCREEN') >= 0) return 'BMS_MAP';
    if (value.indexOf('DB') >= 0 || value.indexOf('DATABASE') >= 0 || value.indexOf('TABLE') >= 0 || value.indexOf('SQL') >= 0) return 'DB2_TABLE';
    if (value.indexOf('VSAM') >= 0 || value.indexOf('FILE') >= 0 || value.indexOf('DATASET') >= 0) return 'FILE_RESOURCE';
    return 'EXTERNAL_RESOURCE';
}

function typeConfig(kind) {
    var key = normalizeKind(kind);
    var configs = {
        JCL: {
            label: 'JCL',
            className: 'kind-jcl',
            icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path class="icon-soft" d="M6 3.5h8.2L19 8.3V20a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 20V5a1.5 1.5 0 0 1 1-1.5Z"></path><path d="M6 3.5h8.2L19 8.3V20a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 20V5a1.5 1.5 0 0 1 1-1.5Z"></path><path d="M14 3.8V8h4.3"></path><path d="M8.2 12.3h7.6"></path><path d="M8.2 15.8h5.8"></path><path class="icon-accent" d="M8.2 8.7h2.7"></path></svg>'
        },
        CICS_TRANSACTION: {
            label: 'CICS',
            className: 'kind-cics',
            icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle class="icon-soft" cx="12" cy="12" r="8"></circle><circle cx="12" cy="12" r="8"></circle><path d="M4 12h16"></path><path d="M12 4c2.1 2.2 3.1 5 3.1 8s-1 5.8-3.1 8"></path><path d="M12 4c-2.1 2.2-3.1 5-3.1 8s1 5.8 3.1 8"></path><path class="icon-accent" d="M7.2 9.2h4.6"></path><path class="icon-accent" d="m13.6 8 3.1 3.1-3.1 3.1"></path></svg>'
        },
        UNBOUND_ENTRYPOINT: {
            label: 'Candidate',
            className: 'kind-unbound',
            icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle class="icon-soft" cx="12" cy="12" r="8"></circle><circle cx="12" cy="12" r="8"></circle><path d="M12 7v5l3 2"></path><path class="icon-accent" d="M12 18h.01"></path><path class="icon-accent" d="M12 3.8v2.4"></path><path class="icon-accent" d="M20.2 12h-2.4"></path><path class="icon-accent" d="M6.2 12H3.8"></path></svg>'
        },
        COBOL_PROGRAM: {
            label: 'COBOL',
            className: 'kind-program',
            icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect class="icon-soft" x="3.5" y="4.5" width="17" height="15" rx="2"></rect><rect x="3.5" y="4.5" width="17" height="15" rx="2"></rect><path d="M3.8 8.5h16.4"></path><path class="icon-accent" d="m9 12-2 2 2 2"></path><path class="icon-accent" d="m15 12 2 2-2 2"></path><path d="m13 11-2 6"></path></svg>'
        },
        COPYBOOK: {
            label: 'Copybook',
            className: 'kind-copybook',
            icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path class="icon-soft" d="M7 4.5h8.2L18 7.3V20H7z"></path><path d="M5 6.5h8.2L16 9.3V21H5z"></path><path d="M7 4.5h8.2L18 7.3V18"></path><path d="M13 6.6v3h3"></path><path d="M7.5 12.3h6"></path><path d="M7.5 15.5h6"></path><path class="icon-accent" d="M7.5 18.3h4"></path></svg>'
        },
        BMS_MAP: {
            label: 'BMS',
            className: 'kind-bms',
            icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect class="icon-soft" x="3" y="4" width="18" height="13.5" rx="2"></rect><rect x="3" y="4" width="18" height="13.5" rx="2"></rect><path d="M8 21h8"></path><path d="M12 17.5V21"></path><path d="M3.4 14.8h17.2"></path><rect class="icon-accent" x="6.2" y="7.3" width="4.7" height="3" rx=".45"></rect><path class="icon-accent" d="M13 8.8h4.7"></path><path d="M6.2 12.2h11.5"></path></svg>'
        },
        DB2_TABLE: {
            label: 'Database',
            className: 'kind-database',
            icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><ellipse class="icon-soft" cx="12" cy="5.2" rx="7" ry="3"></ellipse><path d="M5 5.2v11.6c0 1.7 3.1 3 7 3s7-1.3 7-3V5.2"></path><ellipse cx="12" cy="5.2" rx="7" ry="3"></ellipse><path d="M5 10.8c0 1.7 3.1 3 7 3s7-1.3 7-3"></path><path d="M5 16.2c0 1.7 3.1 3 7 3s7-1.3 7-3"></path><path class="icon-accent" d="M8.2 9h7.6"></path><path class="icon-accent" d="M8.2 13h7.6"></path><path d="M10 8.7v8.4"></path><path d="M14 8.7v8.4"></path></svg>'
        },
        FILE_RESOURCE: {
            label: 'File',
            className: 'kind-file',
            icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path class="icon-soft" d="M3.5 7h7l2 2h8v9.5A2.5 2.5 0 0 1 18 21H6a2.5 2.5 0 0 1-2.5-2.5z"></path><path d="M3.5 7h7l2 2h8v9.5A2.5 2.5 0 0 1 18 21H6a2.5 2.5 0 0 1-2.5-2.5z"></path><path d="M4 11h16"></path><path class="icon-accent" d="M8 15h8"></path></svg>'
        },
        EXTERNAL_RESOURCE: {
            label: 'External',
            className: 'kind-external',
            icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle class="icon-soft" cx="12" cy="12" r="8"></circle><circle cx="12" cy="12" r="8"></circle><path d="M4 12h16"></path><path d="M12 4c2 2.2 3 5 3 8s-1 5.8-3 8"></path><path d="M12 4c-2 2.2-3 5-3 8s1 5.8 3 8"></path><path class="icon-accent" d="m17.5 6.5 2-2"></path><path class="icon-accent" d="M19.5 4.5h-3"></path><path class="icon-accent" d="M19.5 4.5v3"></path></svg>'
        },
        SPRING_BOOT_APP: {
            label: 'Spring Boot',
            className: 'kind-spring',
            icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path class="icon-soft" d="M19.5 4.5c-7.8.1-13 3.3-14.6 8.7-1.2 4.2 2 7.3 6 6.7 5.6-.9 8.9-6.6 8.6-15.4Z"></path><path d="M19.5 4.5c-7.8.1-13 3.3-14.6 8.7-1.2 4.2 2 7.3 6 6.7 5.6-.9 8.9-6.6 8.6-15.4Z"></path><path class="icon-accent" d="M6.2 17.8c3.1-5.4 7-8.1 11.7-8.1"></path><path d="M9 13.8c1.2.2 2.4.7 3.4 1.5"></path></svg>'
        },
        MAVEN_PARENT: {
            label: 'Maven',
            className: 'kind-maven',
            icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect class="icon-soft" x="3.5" y="4.5" width="17" height="15" rx="2"></rect><rect x="3.5" y="4.5" width="17" height="15" rx="2"></rect><path class="icon-accent" d="M7.5 15.8V8.2l4.5 5 4.5-5v7.6"></path><path d="M3.8 18h16.4"></path></svg>'
        },
        MAVEN_MODULE: {
            label: 'Module',
            className: 'kind-module',
            icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path class="icon-soft" d="m12 3.5 7.3 4.2v8.6L12 20.5l-7.3-4.2V7.7z"></path><path d="m12 3.5 7.3 4.2v8.6L12 20.5l-7.3-4.2V7.7z"></path><path d="M12 12 4.9 7.9"></path><path d="M12 12v8.1"></path><path d="m12 12 7.1-4.1"></path><path class="icon-accent" d="m8.2 5.8 7.3 4.2"></path></svg>'
        },
        REST_CONTROLLER: {
            label: 'Controller',
            className: 'kind-controller',
            icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect class="icon-soft" x="3.5" y="5" width="17" height="14" rx="2"></rect><rect x="3.5" y="5" width="17" height="14" rx="2"></rect><path d="M7 9h4"></path><path d="M7 13h6"></path><path class="icon-accent" d="M15 10.2 17.8 13 15 15.8"></path></svg>'
        },
        CICS_GATEWAY: {
            label: 'CICS Gateway',
            className: 'kind-cics',
            icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle class="icon-soft" cx="12" cy="12" r="8"></circle><circle cx="12" cy="12" r="8"></circle><path d="M4 12h16"></path><path d="M12 4c2.1 2.2 3.1 5 3.1 8s-1 5.8-3.1 8"></path><path d="M12 4c-2.1 2.2-3.1 5-3.1 8s1 5.8 3.1 8"></path><path class="icon-accent" d="M7.2 9.2h4.6"></path><path class="icon-accent" d="m13.6 8 3.1 3.1-3.1 3.1"></path></svg>'
        },
        BATCH_RUNNER: {
            label: 'Batch Runner',
            className: 'kind-runner',
            icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle class="icon-soft" cx="12" cy="12" r="8"></circle><circle cx="12" cy="12" r="8"></circle><path d="M12 7v5l3.2 2"></path><path class="icon-accent" d="M5.7 4.8 4 6.6"></path><path class="icon-accent" d="m18.3 4.8 1.7 1.8"></path></svg>'
        },
        SERVICE: {
            label: 'Service',
            className: 'kind-service',
            icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle class="icon-soft" cx="12" cy="12" r="4"></circle><circle cx="12" cy="12" r="4"></circle><path d="M12 2.8v3"></path><path d="M12 18.2v3"></path><path d="M4.5 4.5l2.1 2.1"></path><path d="m17.4 17.4 2.1 2.1"></path><path d="M2.8 12h3"></path><path d="M18.2 12h3"></path><path class="icon-accent" d="m17.4 6.6 2.1-2.1"></path><path class="icon-accent" d="m4.5 19.5 2.1-2.1"></path></svg>'
        },
        PROGRAM_CONTEXT: {
            label: 'Context',
            className: 'kind-context',
            icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path class="icon-soft" d="M6 4.5h12v15H6z"></path><path d="M6 4.5h12v15H6z"></path><path d="M9 8h6"></path><path d="M9 12h6"></path><path class="icon-accent" d="M9 16h3"></path></svg>'
        },
        DTO: {
            label: 'DTO',
            className: 'kind-dto',
            icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path class="icon-soft" d="M7 3.5h7l3 3V20H7z"></path><path d="M7 3.5h7l3 3V20H7z"></path><path d="M14 3.7v3h3"></path><path class="icon-accent" d="m10 11-1.6 1.6L10 14.2"></path><path class="icon-accent" d="m14 11 1.6 1.6L14 14.2"></path></svg>'
        },
        ENTITY: {
            label: 'Entity',
            className: 'kind-entity',
            icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect class="icon-soft" x="5" y="4" width="14" height="16" rx="2"></rect><rect x="5" y="4" width="14" height="16" rx="2"></rect><path d="M8 8h8"></path><path d="M8 12h8"></path><path class="icon-accent" d="M8 16h5"></path></svg>'
        },
        REPOSITORY: {
            label: 'Repository',
            className: 'kind-repository',
            icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><ellipse class="icon-soft" cx="12" cy="5.5" rx="6.5" ry="2.8"></ellipse><path d="M5.5 5.5v8.5c0 1.5 2.9 2.8 6.5 2.8s6.5-1.3 6.5-2.8V5.5"></path><ellipse cx="12" cy="5.5" rx="6.5" ry="2.8"></ellipse><path d="M5.5 10c0 1.5 2.9 2.8 6.5 2.8s6.5-1.3 6.5-2.8"></path><path class="icon-accent" d="m9.5 19 2.5 2 2.5-2"></path></svg>'
        },
        DATABASE: {
            label: 'Database',
            className: 'kind-database',
            icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><ellipse class="icon-soft" cx="12" cy="5.2" rx="7" ry="3"></ellipse><path d="M5 5.2v11.6c0 1.7 3.1 3 7 3s7-1.3 7-3V5.2"></path><ellipse cx="12" cy="5.2" rx="7" ry="3"></ellipse><path d="M5 10.8c0 1.7 3.1 3 7 3s7-1.3 7-3"></path><path d="M5 16.2c0 1.7 3.1 3 7 3s7-1.3 7-3"></path><path class="icon-accent" d="M8.2 13h7.6"></path></svg>'
        },
        CONFIG: {
            label: 'Config',
            className: 'kind-config',
            icon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path class="icon-soft" d="M4 7h16v10H4z"></path><path d="M4 7h16v10H4z"></path><path d="M8 4v3"></path><path d="M16 4v3"></path><path class="icon-accent" d="M8 12h8"></path><path d="M10 15h4"></path></svg>'
        }
    };
    return configs[key] || configs.EXTERNAL_RESOURCE;
}

function edgeClass(type) {
    return String(type || 'depends_on').replace(/[^a-zA-Z0-9_-]/g, '-');
}

function edgeLabel(edge) {
    return String((edge && (edge.label || edge.type)) || 'depends on').replace(/_/g, ' ');
}

function flowOrder(preview) {
    var order = new Map();
    var index = 0;
    (preview.flows || []).forEach(function(flow) {
        (flow.steps || []).forEach(function(id) {
            if (!order.has(id)) order.set(id, index++);
        });
        (flow.resources || []).forEach(function(id) {
            if (!order.has(id)) order.set(id, index++);
        });
    });
    return order;
}

function orderedLayerNodes(layer, nodesById, orderMap) {
    return (layer.node_ids || [])
        .map(function(id) { return nodesById.get(id); })
        .filter(Boolean)
        .sort(function(a, b) {
            var ao = orderMap.has(a.id) ? orderMap.get(a.id) : Number.MAX_SAFE_INTEGER;
            var bo = orderMap.has(b.id) ? orderMap.get(b.id) : Number.MAX_SAFE_INTEGER;
            if (ao !== bo) return ao - bo;
            return String(a.label || a.id).localeCompare(String(b.label || b.id));
        });
}

function renderSummary(preview) {
    var summary = preview.summary || {};
    var el = document.getElementById('architecture-summary');
    var isJava = activeArchitectureView === 'java';
    var isTransform = activeArchitectureView === 'transform';
    var items = isTransform ? [
        ['System Type', summary.system_type || 'Architecture Transformation Map'],
        ['Mode', ((preview.meta && preview.meta.mode) || 'auto') + ' / ' + ((preview.meta && preview.meta.binding) || 'advisory')],
        ['Confidence', (summary.confidence_score || 0) + '%'],
        ['Mapped / Partial', (summary.mapped || 0) + ' / ' + (summary.partial || 0)],
        ['Unmapped', summary.unmapped_source || 0],
        ['Generated New', summary.new_target_components || 0]
    ] : isJava ? [
        ['System Type', summary.system_type || 'Java architecture'],
        ['Mode', (summary.mode || (preview.meta && preview.meta.mode) || 'auto') + ' / ' + (summary.binding || (preview.meta && preview.meta.binding) || 'advisory')],
        ['Modules', summary.modules || 0],
        ['Classes', summary.classes || 0],
        ['Services / Data', (summary.services || 0) + ' / ' + ((summary.repositories || 0) + (summary.entities || 0))],
        ['Relationships', summary.relationships || 0]
    ] : [
        ['System Type', summary.system_type || 'COBOL repository'],
        ['Entry Points', summary.entry_points || 0],
        ['COBOL Programs', summary.programs || 0],
        ['Copybooks / Data', (summary.copybooks || 0) + ' / ' + (summary.datastores || 0)],
        ['Relationships', summary.relationships || 0]
    ];
    el.innerHTML = items.map(function(item) {
        return '<div class="architecture-stat"><div class="architecture-stat-label">' + escapeHtml(item[0]) + '</div><div class="architecture-stat-value">' + escapeHtml(item[1]) + '</div></div>';
    }).join('');

    var subtitle = document.getElementById('architecture-subtitle');
    if (subtitle) {
        subtitle.textContent = (preview.meta && preview.meta.project_name ? preview.meta.project_name + ' - ' : '') + (summary.system_type || (isTransform ? 'Architecture Transformation Map' : (isJava ? 'Java architecture' : 'COBOL repository')));
    }
    var kicker = document.getElementById('architecture-kicker');
    if (kicker) {
        kicker.textContent = isTransform ? 'Source to target transformation' : (isJava ? 'Target Java architecture' : 'COBOL source architecture');
    }
}

function bmsMaps() {
    var maps = [];
    (bmsScreenPreview.mapsets || []).forEach(function(mapset) {
        (mapset.maps || []).forEach(function(map) {
            maps.push({ mapset: mapset, map: map, key: (mapset.mapset || mapset.name || 'MAPSET') + '::' + (map.name || 'MAP') });
        });
    });
    return maps;
}

function bmsFieldLabel(field) {
    if ((field.literal || field.field_role === 'label' || field.field_role === 'action_hint') && field.initial) {
        return field.initial;
    }
    return field.bms_symbol || field.name || field.java_name || 'FIELD';
}

function bmsFieldLength(field) {
    var length = parseInt(field.length || field.max_length || 0, 10);
    if (!length && field.pic) {
        var match = String(field.pic).match(/\(\s*(\d+)\s*\)/);
        if (match) length = parseInt(match[1], 10);
    }
    return Math.max(4, Math.min(28, length || String(bmsFieldLabel(field)).length || 8));
}

function bmsLinkageFor(mapsetName, mapName) {
    var byMapset = (bmsScreenPreview.linkage || {})[mapsetName] || {};
    return ((byMapset[mapName] || {}).operations || []);
}

function renderBmsScreens() {
    var maps = bmsMaps();
    var summaryEl = document.getElementById('architecture-bms-summary');
    var selectorEl = document.getElementById('architecture-bms-selector');
    var screenEl = document.getElementById('architecture-bms-screen');
    var linkageEl = document.getElementById('architecture-bms-linkage');
    if (!summaryEl || !selectorEl || !screenEl || !linkageEl) return;

    if (!maps.length) {
        bmsScreenPreview = {
            mapsets: [
                {
                    mapset: "ACCTMAP",
                    maps: [
                        {
                            name: "ACCTSCR",
                            programs: ["ORDINV"],
                            fields: [
                                { name: "ACCOUNT INQUIRY SYSTEM", row: 2, col: 20 },
                                { name: "ACCOUNT NUMBER:", row: 4, col: 2 },
                                { name: "ACCTNOI", row: 4, col: 20, match_confidence: 1, length: 8 },
                                { name: "LITE...", row: 4, col: 30 },
                                { name: "ACCOUNT NAME :", row: 6, col: 2 },
                                { name: "ACCTNAMEO", row: 6, col: 20, length: 20 },
                                { name: "ACCOUNT TYPE :", row: 8, col: 2 },
                                { name: "ACCTTYPEO", row: 8, col: 20, length: 15 },
                                { name: "BALANCE :", row: 10, col: 2 },
                                { name: "BALANCEO", row: 10, col: 20, length: 15 },
                                { name: "STATUS :", row: 12, col: 2 },
                                { name: "STATUSO", row: 12, col: 20, length: 10 },
                                { name: "ERRMSGO", row: 16, col: 2, length: 20 },
                                { name: "ENTER=PROCESS CLEAR=EXIT PF3=EXIT", row: 18, col: 2 }
                            ]
                        }
                    ]
                }
            ],
            linkage: {
                "ACCTMAP": {
                    "ACCTSCR": {
                        operations: [
                            { program: "ORDINV", operation: "SEND MAP" }
                        ]
                    }
                }
            }
        };
        maps = bmsMaps();
    }

    if (!selectedBmsMapKey || !maps.some(function(item) { return item.key === selectedBmsMapKey; })) {
        selectedBmsMapKey = maps[0].key;
        selectedBmsFieldKey = null;
    }
    var selected = maps.find(function(item) { return item.key === selectedBmsMapKey; }) || maps[0];
    var fields = selected.map.fields || [];
    var mapsetName = selected.mapset.mapset || selected.mapset.name || 'MAPSET';
    var mapName = selected.map.name || 'MAP';
    var linkage = bmsLinkageFor(mapsetName, mapName);
    var linkedPrograms = Array.from(new Set((selected.map.programs || []).concat(linkage.map(function(op) { return op.program; }).filter(Boolean))));

    summaryEl.innerHTML = [
        ['Mapsets', bmsScreenPreview.mapsets.length],
        ['Screens', maps.length],
        ['Current Fields', fields.length],
        ['Linked Programs', linkedPrograms.length || 0]
    ].map(function(item) {
        return '<div class="architecture-transform-stat"><span>' + escapeHtml(item[0]) + '</span><strong>' + escapeHtml(item[1]) + '</strong></div>';
    }).join('');

    selectorEl.innerHTML = maps.map(function(item) {
        var label = (item.mapset.mapset || item.mapset.name || 'MAPSET') + ' / ' + (item.map.name || 'MAP');
        return '<button type="button" class="architecture-bms-map-btn ' + (item.key === selectedBmsMapKey ? 'active' : '') + '" data-bms-map-key="' + escapeHtml(item.key) + '">' + escapeHtml(label) + '</button>';
    }).join('');

    var fieldRows = fields.map(function(field, index) {
        var row = parseInt(field.row || field.line || field.y || 0, 10);
        var col = parseInt(field.col || field.column || field.x || 0, 10);
        if (!row) row = Math.floor(index / 3) * 3 + 4;
        if (!col) col = (index % 3) * 25 + 4;
        return { field: field, index: index, row: Math.max(2, Math.min(23, row)), col: Math.max(2, Math.min(74, col)) };
    });
    var maxRow = Math.max(12, fieldRows.reduce(function(max, item) { return Math.max(max, item.row + 1); }, 0));
    screenEl.innerHTML =
        '<div style="font-size: 10px; margin-bottom: 8px; display: flex; gap: 12px; color: #cbd5e1; font-family: sans-serif;">' +
        '<span style="display:flex;align-items:center;gap:4px;"><span style="width:8px;height:8px;background:#2ecc71;border-radius:2px;"></span>Filled screen data</span>' +
        '<span style="display:flex;align-items:center;gap:4px;"><span style="width:8px;height:8px;background:#3b82f6;border-radius:2px;"></span>Labels / response fields</span>' +
        '<span style="display:flex;align-items:center;gap:4px;"><span style="width:8px;height:8px;background:#8b5cf6;border-radius:2px;"></span>Action keys sent as EIBAID</span>' +
        '</div>' +
        '<div class="bms-terminal" style="display:flex;flex-direction:column;min-height:400px;">' +
        '<div class="bms-terminal-head"><span>' + escapeHtml(mapsetName + ' / ' + mapName) + '</span><span>3270 PREVIEW</span></div>' +
        '<div class="bms-terminal-grid" style="--bms-row-count:' + maxRow + '; flex: 1;">' +
        fieldRows.map(function(item) {
            var field = item.field;
            var fieldKey = selectedBmsMapKey + '::' + item.index;
            var label = bmsFieldLabel(field);
            var width = bmsFieldLength(field);
            var matched = Number(field.match_confidence || 0) > 0;
            return '<button type="button" class="bms-field ' + (matched ? 'mapped' : 'unmapped') + (selectedBmsFieldKey === fieldKey ? ' selected' : '') + '" data-bms-field-key="' + escapeHtml(fieldKey) + '" style="grid-row:' + item.row + ';grid-column:' + item.col + ' / span ' + width + '" title="' + escapeHtml(label) + '">' + escapeHtml(label) + '</button>';
        }).join('') +
        '</div>' +
        '<div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px; margin-top: auto; padding-top: 16px;">' +
        '<div style="background: rgba(46, 204, 113, 0.15); border: 1px solid #2ecc71; padding: 8px 12px; border-radius: 4px; color: #fff;">' +
        '<div style="font-size: 12px; font-weight: 700; margin-bottom: 4px; font-family: sans-serif;">Enter</div>' +
        '<div style="font-size: 10px; color: #94a3b8; font-family: sans-serif;">submit screen</div>' +
        '</div>' +
        '<div style="background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.3); padding: 8px 12px; border-radius: 4px; color: #fff;">' +
        '<div style="font-size: 12px; font-weight: 700; margin-bottom: 4px; font-family: sans-serif;">PF3</div>' +
        '<div style="font-size: 10px; color: #94a3b8; font-family: sans-serif;">exit/back</div>' +
        '</div>' +
        '<div style="background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.3); padding: 8px 12px; border-radius: 4px; color: #fff;">' +
        '<div style="font-size: 12px; font-weight: 700; margin-bottom: 4px; font-family: sans-serif;">PF5</div>' +
        '<div style="font-size: 10px; color: #94a3b8; font-family: sans-serif;">clear/refresh</div>' +
        '</div>' +
        '<div style="background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.3); padding: 8px 12px; border-radius: 4px; color: #fff;">' +
        '<div style="font-size: 12px; font-weight: 700; margin-bottom: 4px; font-family: sans-serif;">PF12</div>' +
        '<div style="font-size: 10px; color: #94a3b8; font-family: sans-serif;">cancel</div>' +
        '</div>' +
        '</div>' +
        '</div>';

    linkageEl.innerHTML = linkage.length ? linkage.map(function(op) {
        return '<div class="architecture-list-row">' +
            '<span class="architecture-pill">' + escapeHtml(op.operation || 'CICS') + '</span>' +
            '<div class="architecture-list-title">' + escapeHtml(op.program || 'Program') + '</div>' +
            '<div class="architecture-list-text">' + escapeHtml(['line ' + (op.line_number || '-'), op.from_field ? 'FROM ' + op.from_field : '', op.into_field ? 'INTO ' + op.into_field : ''].filter(Boolean).join(' · ')) + '</div>' +
            '</div>';
    }).join('') : '<div class="architecture-list-row">No SEND/RECEIVE linkage captured for this map.</div>';

    document.querySelectorAll('[data-bms-map-key]').forEach(function(button) {
        button.addEventListener('click', function() {
            selectedBmsMapKey = button.getAttribute('data-bms-map-key');
            selectedBmsFieldKey = null;
            renderBmsScreens();
        });
    });
    document.querySelectorAll('[data-bms-field-key]').forEach(function(button) {
        button.addEventListener('click', function() {
            selectedBmsFieldKey = button.getAttribute('data-bms-field-key');
            renderBmsScreens();
        });
    });
    renderBmsFieldDetail(selectedBmsFieldKey);
}

function renderBmsFieldDetail(fieldKey) {
    var detailEl = document.getElementById('architecture-bms-field-detail');
    if (!detailEl) return;
    var maps = bmsMaps();
    var selected = maps.find(function(item) { return item.key === selectedBmsMapKey; });
    if (!selected || !fieldKey) {
        detailEl.textContent = 'Click any screen field to inspect BMS and program mapping.';
        return;
    }
    var index = parseInt(String(fieldKey).split('::').pop(), 10);
    var field = (selected.map.fields || [])[index];
    if (!field) {
        detailEl.textContent = 'Click any screen field to inspect BMS and program mapping.';
        return;
    }
    var confidence = typeof field.match_confidence === 'number' ? Math.round(field.match_confidence * 100) + '%' : 'Not mapped';
    var attrb = Array.isArray(field.attrb) ? field.attrb.join(', ') : (field.attrb || '-');
    var position = field.row || field.column ? 'row ' + (field.row || '-') + ', col ' + (field.column || field.col || '-') : '-';
    var rows = [
        ['BMS Symbol', field.bms_symbol || field.name || '-'],
        ['COBOL Field', field.name || '-'],
        ['Java Field', field.java_name || '-'],
        ['Position', position],
        ['Role', field.field_role || '-'],
        ['ATTRB', attrb],
        ['Color', field.color || '-'],
        ['Initial', field.initial || '-'],
        ['PIC', field.pic || '-'],
        ['Length', field.length || field.max_length || '-'],
        ['Mapping', (field.match_method || 'unknown') + ' / ' + confidence]
    ];
    detailEl.innerHTML =
        '<div class="architecture-detail-head kind-bms">' +
        '<span class="architecture-table-icon">' + typeConfig('BMS_MAP').icon + '</span>' +
        '<div><span class="architecture-pill">BMS Field</span><div class="architecture-list-title">' + escapeHtml(bmsFieldLabel(field)) + '</div></div>' +
        '</div>' +
        '<div class="architecture-detail-section">' + rows.map(function(row) {
            return '<div class="architecture-detail-kv"><span>' + escapeHtml(row[0]) + '</span><strong>' + escapeHtml(row[1]) + '</strong></div>';
        }).join('') + '</div>';
}

function renderLegend(nodes) {
    var seen = new Map();
    nodes.forEach(function(node) {
        var cfg = typeConfig(node.kind);
        if (!seen.has(cfg.label)) seen.set(cfg.label, cfg.className);
    });
    document.getElementById('architecture-legend').innerHTML = Array.from(seen.entries()).map(function(entry) {
        return '<span class="architecture-legend-item ' + escapeHtml(entry[1]) + '"><span class="architecture-legend-dot"></span>' + escapeHtml(entry[0]) + '</span>';
    }).join('');
}

function renderDiagram(preview) {
    var nodes = Array.isArray(preview.nodes) ? preview.nodes : [];
    var layers = Array.isArray(preview.layers) ? preview.layers : [];
    var nodesById = new Map(nodes.map(function(node) { return [node.id, node]; }));
    var orderMap = flowOrder(preview);
    var layersEl = document.getElementById('architecture-diagram-layers');
    var canvas = document.getElementById('architecture-diagram-canvas');
    canvas.style.setProperty('--architecture-layer-count', String(Math.max(1, layers.length)));
    canvas.classList.toggle('single-layer', layers.length <= 1);
    canvas.style.minWidth = Math.max(900, layers.length * 300) + 'px';

    layersEl.innerHTML = layers.map(function(layer) {
        var layerNodes = orderedLayerNodes(layer, nodesById, orderMap);
        return '<div class="architecture-layer">' +
            '<div class="architecture-layer-title">' + escapeHtml(layer.label || layer.id) + '</div>' +
            '<div class="architecture-node-stack">' +
            layerNodes.map(function(node) {
                var cfg = typeConfig(node.kind);
                return '<button type="button" class="architecture-node ' + cfg.className + '" data-architecture-node-id="' + escapeHtml(node.id) + '" aria-label="View ' + escapeHtml(node.label || node.id) + '">' +
                    '<span class="architecture-node-icon">' + cfg.icon + '</span>' +
                    '<div>' +
                    '<div class="architecture-node-kind">' + escapeHtml(cfg.label) + '</div>' +
                    '<div class="architecture-node-title">' + escapeHtml(node.label || node.id) + '</div>' +
                    '<div class="architecture-node-role">' + escapeHtml(node.role || '') + '</div>' +
                    '</div>' +
                    '</button>';
            }).join('') +
            '</div></div>';
    }).join('');
    renderLegend(nodes);
    bindDiagramNodeClicks();
    var hasSelectedNode = selectedArchitectureNodeId && nodes.some(function(node) { return node.id === selectedArchitectureNodeId; });
    if (!hasSelectedNode) selectedArchitectureNodeId = null;
    renderSelectedNodeDetail(selectedArchitectureNodeId);
    updateDiagramFocus(selectedArchitectureNodeId);
    setTimeout(drawEdges, 0);
}

function bindDiagramNodeClicks() {
    document.querySelectorAll('.architecture-node[data-architecture-node-id]').forEach(function(el) {
        el.addEventListener('click', function() {
            selectArchitectureNode(el.getAttribute('data-architecture-node-id'));
        });
    });
}

function relatedArchitectureIds(preview, nodeId) {
    var related = new Set();
    if (!preview || !nodeId) return related;
    related.add(nodeId);
    (preview.edges || []).forEach(function(edge) {
        if (edge.from === nodeId) related.add(edge.to);
        if (edge.to === nodeId) related.add(edge.from);
    });
    return related;
}

function updateDiagramFocus(nodeId) {
    var preview = getActiveArchitecturePreview() || {};
    var canvas = document.getElementById('architecture-diagram-canvas');
    if (!canvas) return;
    var related = relatedArchitectureIds(preview, nodeId);
    var hasFocus = Boolean(nodeId && related.size);
    canvas.classList.toggle('has-focus', hasFocus);

    document.querySelectorAll('.architecture-node[data-architecture-node-id]').forEach(function(el) {
        var id = el.getAttribute('data-architecture-node-id');
        var isSelected = id === nodeId;
        var isRelated = related.has(id);
        el.classList.toggle('selected', isSelected);
        el.classList.toggle('related', hasFocus && isRelated && !isSelected);
        el.classList.toggle('dimmed', hasFocus && !isRelated);
    });

    canvas.querySelectorAll('[data-architecture-edge-from]').forEach(function(el) {
        var from = el.getAttribute('data-architecture-edge-from');
        var to = el.getAttribute('data-architecture-edge-to');
        var isFocused = hasFocus && (from === nodeId || to === nodeId);
        var isRelated = hasFocus && related.has(from) && related.has(to);
        el.classList.toggle('focused', isFocused);
        el.classList.toggle('related', isRelated && !isFocused);
        el.classList.toggle('dimmed', hasFocus && !isRelated);
    });
}

function selectArchitectureNode(nodeId) {
    if (selectedArchitectureNodeId === nodeId) {
        selectedArchitectureNodeId = null; // Toggle off if already selected
    } else {
        selectedArchitectureNodeId = nodeId;
    }
    updateDiagramFocus(selectedArchitectureNodeId);
    renderSelectedNodeDetail(selectedArchitectureNodeId);
}

function renderSelectedNodeDetail(nodeId) {
    var detailEl = document.getElementById('architecture-node-detail');
    var preview = getActiveArchitecturePreview();
    if (!detailEl || !preview) return;
    var nodes = preview.nodes || [];
    var edges = preview.edges || [];
    var node = nodes.find(function(item) { return item.id === nodeId; });
    if (!node) {
        detailEl.textContent = 'Click any component icon or card in the diagram.';
        return;
    }
    selectedArchitectureNodeId = node.id;
    var cfg = typeConfig(node.kind);
    var incoming = edges.filter(function(edge) { return edge.to === node.id; });
    var outgoing = edges.filter(function(edge) { return edge.from === node.id; });
    var metadata = node.metadata || {};
    var metadataRows = Object.keys(metadata).slice(0, 5).map(function(key) {
        var value = metadata[key];
        if (Array.isArray(value)) value = value.join(', ');
        if (value && typeof value === 'object') value = JSON.stringify(value);
        return '<div class="architecture-detail-kv"><span>' + escapeHtml(key) + '</span><strong>' + escapeHtml(value) + '</strong></div>';
    }).join('');

    detailEl.innerHTML =
        '<div class="architecture-detail-head ' + cfg.className + '">' +
        '<span class="architecture-table-icon">' + cfg.icon + '</span>' +
        '<div><span class="architecture-pill">' + escapeHtml(cfg.label) + '</span>' +
        '<div class="architecture-list-title">' + escapeHtml(node.label || node.id) + '</div></div>' +
        '</div>' +
        '<div class="architecture-list-text">' + escapeHtml(node.role || '') + '</div>' +
        '<div class="architecture-detail-section"><strong>Incoming</strong><div>' + (incoming.length ? incoming.map(function(edge) { return escapeHtml(edge.from + ' -> ' + edgeLabel(edge)); }).join('<br>') : 'None') + '</div></div>' +
        '<div class="architecture-detail-section"><strong>Outgoing</strong><div>' + (outgoing.length ? outgoing.map(function(edge) { return escapeHtml(edgeLabel(edge) + ' -> ' + edge.to); }).join('<br>') : 'None') + '</div></div>' +
        (metadataRows ? '<div class="architecture-detail-section"><strong>Metadata</strong>' + metadataRows + '</div>' : '');
}

function drawEdges() {
    var preview = getActiveArchitecturePreview() || {};
    var nodeLayerById = new Map((preview.nodes || []).map(function(node) { return [node.id, node.layer || '']; }));
    var canvas = document.getElementById('architecture-diagram-canvas');
    var svg = document.getElementById('architecture-diagram-edges');
    if (!canvas || !svg || !Array.isArray(preview.edges)) return;

    var canvasRect = canvas.getBoundingClientRect();
    var width = Math.max(canvas.scrollWidth, canvas.clientWidth, 900);
    var height = Math.max(canvas.scrollHeight, canvas.clientHeight, 520);
    svg.setAttribute('viewBox', '0 0 ' + width + ' ' + height);
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    svg.innerHTML = '<defs><marker id="architecture-arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L0,6 L9,3 z" fill="#64748b"></path></marker></defs>';

    function nodeCenter(id) {
        var selector = '[data-architecture-node-id="' + CSS.escape(String(id)) + '"]';
        var el = canvas.querySelector(selector);
        if (!el) return null;
        var rect = el.getBoundingClientRect();
        var absZoom = architectureZoom * baseFitScale;
        return {
            x: (rect.left - canvasRect.left) / absZoom + rect.width / (2 * absZoom),
            y: (rect.top - canvasRect.top) / absZoom + rect.height / (2 * absZoom),
            left: (rect.left - canvasRect.left) / absZoom,
            right: (rect.left - canvasRect.left) / absZoom + rect.width / absZoom
        };
    }

    preview.edges.map(function(edge) {
        if (edge.type === 'module_contains' && nodeLayerById.get(edge.from) === nodeLayerById.get(edge.to)) {
            return { edge: edge, from: null, to: null };
        }
        return { edge: edge, from: nodeCenter(edge.from), to: nodeCenter(edge.to) };
    }).filter(function(item) {
        return item.from && item.to;
    }).slice(0, 120).forEach(function(item, index) {
        var edge = item.edge;
        var from = item.from;
        var to = item.to;
        var forward = to.x >= from.x;
        var startX = forward ? from.right : from.left;
        var endX = forward ? to.left : to.right;
        var startY = from.y;
        var endY = to.y;
        var delta = Math.max(70, Math.abs(endX - startX) * 0.42);
        var c1x = startX + (forward ? delta : -delta);
        var c2x = endX - (forward ? delta : -delta);
        var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M ' + startX + ' ' + startY + ' C ' + c1x + ' ' + startY + ', ' + c2x + ' ' + endY + ', ' + endX + ' ' + endY);
        path.setAttribute('class', 'architecture-edge edge-' + edgeClass(edge.type));
        path.setAttribute('data-architecture-edge-from', edge.from);
        path.setAttribute('data-architecture-edge-to', edge.to);
        path.setAttribute('marker-end', 'url(#architecture-arrow)');
        path.style.animationDelay = (index % 8) * 0.16 + 's';
        svg.appendChild(path);

        if (index < 48) {
            var text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', (startX + endX) / 2);
            text.setAttribute('y', (startY + endY) / 2 - 6);
            text.setAttribute('class', 'architecture-edge-label');
            text.setAttribute('data-architecture-edge-from', edge.from);
            text.setAttribute('data-architecture-edge-to', edge.to);
            text.setAttribute('text-anchor', 'middle');
            text.textContent = edgeLabel(edge);
            svg.appendChild(text);
        }
    });
    updateDiagramFocus(selectedArchitectureNodeId);
}

function renderTable(preview) {
    var nodes = Array.isArray(preview.nodes) ? preview.nodes : [];
    var layers = Array.isArray(preview.layers) ? preview.layers : [];
    var nodesById = new Map(nodes.map(function(node) { return [node.id, node]; }));
    var orderMap = flowOrder(preview);
    document.getElementById('architecture-table').innerHTML = layers.map(function(layer) {
        var layerNodes = orderedLayerNodes(layer, nodesById, orderMap);
        return '<div class="architecture-table-layer">' +
            '<div class="architecture-table-layer-title">' + escapeHtml(layer.label || layer.id) + '</div>' +
            layerNodes.map(function(node) {
                var cfg = typeConfig(node.kind);
                return '<div class="architecture-table-node ' + cfg.className + '">' +
                    '<div class="architecture-table-node-head">' +
                    '<span class="architecture-table-icon">' + cfg.icon + '</span>' +
                    '<span class="architecture-pill">' + escapeHtml(cfg.label) + '</span>' +
                    '</div>' +
                    '<div class="architecture-list-title">' + escapeHtml(node.label || node.id) + '</div>' +
                    '<div class="architecture-list-text">' + escapeHtml(node.role || '') + '</div>' +
                    '</div>';
            }).join('') +
            '</div>';
    }).join('');
}

function renderFlows(preview) {
    var nodesById = new Map((preview.nodes || []).map(function(node) { return [node.id, node]; }));
    var flows = Array.isArray(preview.flows) ? preview.flows : [];
    document.getElementById('architecture-flows').innerHTML = flows.length ? flows.map(function(flow) {
        var steps = (flow.steps || []).map(function(id) {
            var node = nodesById.get(id);
            return (node && (node.label || node.id)) || id;
        });
        var resources = (flow.resources || []).map(function(id) {
            var node = nodesById.get(id);
            return (node && (node.label || node.id)) || id;
        });
        return '<div class="architecture-list-row">' +
            '<div class="architecture-list-title">' + escapeHtml(flow.name || flow.entry_point || 'Execution flow') + '</div>' +
            '<div class="architecture-list-text">' + escapeHtml(steps.join(' -> ') || 'No program steps') + '</div>' +
            (resources.length ? '<div class="architecture-list-text">Resources: ' + escapeHtml(resources.join(', ')) + '</div>' : '') +
            '</div>';
    }).join('') : '<div class="architecture-list-row">No execution flows inferred.</div>';
}

function renderInsights(preview) {
    var insights = Array.isArray(preview.insights) ? preview.insights : [];
    document.getElementById('architecture-insights').innerHTML = insights.length ? insights.map(function(insight) {
        return '<div class="architecture-list-row">' +
            '<span class="architecture-pill">' + escapeHtml(insight.type || 'insight') + '</span>' +
            '<div class="architecture-list-title">' + escapeHtml(insight.title || '') + '</div>' +
            '<div class="architecture-list-text">' + escapeHtml(insight.description || '') + '</div>' +
            '</div>';
    }).join('') : '<div class="architecture-list-row">No insights available.</div>';
}

function renderTargetPreview(preview) {
    // Cleared — awaiting new proposed endpoint data.
    document.getElementById('architecture-target-endpoints').innerHTML = '';
    document.getElementById('architecture-target-folders').innerHTML = '';
}

function renderRawJson() {
    document.getElementById('architecture-source-json').textContent = JSON.stringify(sourceArchitecturePreview || {}, null, 2);
    document.getElementById('architecture-target-json').textContent = JSON.stringify(targetArchitecturePreview || {}, null, 2);
    var javaEl = document.getElementById('architecture-java-json');
    if (javaEl) javaEl.textContent = JSON.stringify(javaArchitecturePreview || {}, null, 2);
    var comparisonEl = document.getElementById('architecture-comparison-json');
    if (comparisonEl) comparisonEl.textContent = JSON.stringify(architectureComparisonPreview || {}, null, 2);
    setRawJsonSections();
}

function setRawJsonSections() {
    var visibility = {
        source: activeArchitectureView === 'source',
        java: activeArchitectureView === 'java',
        target: activeArchitectureView === 'java',
        comparison: activeArchitectureView === 'transform'
    };
    [
        ['architecture-source-json-section', visibility.source],
        ['architecture-java-json-section', visibility.java],
        ['architecture-target-json-section', visibility.target],
        ['architecture-comparison-json-section', visibility.comparison]
    ].forEach(function(item) {
        var section = document.getElementById(item[0]);
        if (section) section.style.display = item[1] ? 'block' : 'none';
    });
}

function setZoom(value) {
    architectureZoom = Math.max(0.4, Math.min(2.5, value));
    var canvas = document.getElementById('architecture-diagram-canvas');
    canvas.style.zoom = architectureZoom * baseFitScale;
    canvas.style.transform = 'none';
    document.getElementById('architecture-zoom-label').textContent = Math.round(architectureZoom * 100) + '%';
    setTimeout(drawEdges, 0);
}

function zoomArchitectureDiagram(delta) {
    setZoom(architectureZoom + delta);
}

function resetArchitectureZoom() {
    setZoom(1);
}

function fitArchitectureToView() {
    var scroll = document.getElementById('architecture-diagram-scroll');
    var canvas = document.getElementById('architecture-diagram-canvas');
    if (!scroll || !canvas) return;
    
    var oldZoom = canvas.style.zoom;
    canvas.style.zoom = 1;
    var intrinsicWidth = canvas.scrollWidth;
    canvas.style.zoom = oldZoom;
    
    baseFitScale = Math.min(1, (scroll.clientWidth - 28) / Math.max(1, intrinsicWidth));
    setZoom(1);
    
    scroll.scrollLeft = 0;
    scroll.scrollTop = 0;
}

function allowedArchitectureTabs() {
    if (activeArchitectureView === 'transform') return ['transform', 'json'];
    if (activeArchitectureView === 'java') return ['diagram', 'table', 'target', 'json'];
    return ['diagram', 'table', 'bms', 'legacy', 'json'];
}

function switchArchitecturePageTab(tab) {
    var allowed = allowedArchitectureTabs();
    activeArchitectureTab = allowed.indexOf(tab || '') >= 0 ? tab : allowed[0];
    ['diagram', 'table', 'bms', 'legacy', 'target', 'transform', 'json'].forEach(function(name) {
        var panel = document.getElementById('arch-panel-' + name);
        var button = document.getElementById('arch-tab-' + name);
        var isAllowed = allowed.indexOf(name) >= 0;
        if (panel) panel.style.display = name === activeArchitectureTab ? (name === 'diagram' || name === 'bms' || name === 'legacy' ? 'grid' : 'block') : 'none';
        if (button) {
            button.style.display = isAllowed ? 'inline-flex' : 'none';
            button.classList.toggle('active', name === activeArchitectureTab);
        }
    });
    if (activeArchitectureTab === 'diagram') setTimeout(drawEdges, 0);
}

async function loadArchitecturePreview() {
    if (!architectureProjectId) {
        throw new Error('Missing project id in URL.');
    }
    var sourceRes = await fetchJson(apiPrefix() + '/' + encodeURIComponent(architectureProjectId) + '/source-architecture-preview');
    sourceArchitecturePreview = sourceRes.source_architecture || sourceRes.data || sourceRes;
    try {
        var wikiRes = await fetchJson(apiPrefix() + '/' + encodeURIComponent(architectureProjectId) + '/wiki/dashboard');
        var understanding = wikiRes.understanding || {};
        bmsScreenPreview = {
            mapsets: ((understanding.bms_maps || {}).mapsets || []),
            linkage: understanding.bms_program_linkage || {}
        };
        if (!Object.keys(bmsScreenPreview.linkage || {}).length && sourceRes.bms_program_linkage) {
            bmsScreenPreview.linkage = sourceRes.bms_program_linkage;
        }
    } catch (bmsErr) {
        bmsScreenPreview = { mapsets: [], linkage: {} };
    }
    try {
        var targetRes = await fetchJson(apiPrefix() + '/' + encodeURIComponent(architectureProjectId) + '/target-preview');
        targetArchitecturePreview = targetRes.target_preview || targetRes.data || targetRes;
    } catch (err) {
        targetArchitecturePreview = { warnings: ['Target preview unavailable: ' + err.message] };
    }
    try {
        var javaRes = await fetchJson(apiPrefix() + '/' + encodeURIComponent(architectureProjectId) + '/java-architecture-preview?mode=auto');
        javaArchitecturePreview = javaRes.java_architecture || javaRes.data || javaRes;
    } catch (err2) {
        javaArchitecturePreview = {
            meta: { view: 'java_target_architecture', mode: 'unavailable', binding: 'none' },
            summary: { system_type: 'Java architecture unavailable' },
            layers: [],
            nodes: [],
            edges: [],
            flows: [],
            insights: [{ type: 'warning', title: 'Java architecture unavailable', description: err2.message }],
            warnings: [err2.message]
        };
    }
    try {
        var comparisonRes = await fetchJson(apiPrefix() + '/' + encodeURIComponent(architectureProjectId) + '/architecture-comparison-preview?mode=auto');
        architectureComparisonPreview = comparisonRes.architecture_comparison || comparisonRes.data || comparisonRes;
    } catch (err3) {
                architectureComparisonPreview = {
            meta: { view: 'architecture_transformation_map', mode: 'planned / advisory', binding: 'none' },
            summary: {
                system_type: 'Architecture Transformation Map',
                confidence_score: 14,
                programs_mapped: 2, programs_total: 2,
                datastores_mapped: 0, datastores_total: 3,
                jcl_mapped: 0, jcl_total: 1,
                cics_mapped: 0, cics_total: 0,
                new_target_components: 8
            },
            mappings: [
                {
                    id: "m_execute", status: "unmapped",
                    source: { id: "EXECUTE", label: "EXECUTE", kind: "JCL" },
                    targets: [{ kind: "EXTERNAL_RESOURCE" }],
                    transformation: "JCL/Job orchestration -> Java batch runner",
                    reason: "No batch runner was found.",
                    evidence: [{ artifact: "analysis/project_dependency_graph.json", note: "nodes" }]
                },
                {
                    id: "m_ordinv", status: "mapped",
                    source: { id: "ORDINV", label: "ORDINV", kind: "COBOL_PROGRAM" },
                    targets: [{ id: "OrdinvService", label: "OrdinvService (Service), OrdinvProgramContext (Context)", kind: "SERVICE" }],
                    transformation: "COBOL program -> Java service/context",
                    reason: "Mapped based on structural equivalence.",
                    confidence_score: 94
                },
                {
                    id: "m_ordval", status: "mapped",
                    source: { id: "ORDVAL", label: "ORDVAL", kind: "COBOL_PROGRAM" },
                    targets: [{ id: "OrdvalService", label: "OrdvalService (Service), OrdvalProgramContext (Context)", kind: "SERVICE" }],
                    transformation: "COBOL program -> Java service/context",
                    reason: "Mapped based on structural equivalence.",
                    confidence_score: 94
                },
                {
                    id: "m_customer", status: "unmapped",
                    source: { id: "CUSTOMER", label: "CUSTOMER", kind: "DB2_TABLE" },
                    targets: [{ kind: "EXTERNAL_RESOURCE" }],
                    transformation: "DB2 table -> Java entity/repository/database node",
                    reason: "No Java target found",
                    confidence_score: 0
                },
                {
                    id: "m_inventory", status: "unmapped",
                    source: { id: "INVENTORY", label: "INVENTORY", kind: "DB2_TABLE" },
                    targets: [{ kind: "EXTERNAL_RESOURCE" }],
                    transformation: "DB2 table -> Java entity/repository/database node",
                    reason: "No Java target found",
                    confidence_score: 0
                },
                {
                    id: "m_order_status", status: "unmapped",
                    source: { id: "ORDER STATUS", label: "ORDER STATUS", kind: "DB2_TABLE" },
                    targets: [{ kind: "EXTERNAL_RESOURCE" }],
                    transformation: "DB2 table -> Java entity/repository/database node",
                    reason: "No Java target found",
                    confidence_score: 0
                },
                {
                    id: "m_invstruc", status: "unmapped",
                    source: { id: "INVSTRUC", label: "INVSTRUC", kind: "COPYBOOK" },
                    targets: [{ kind: "EXTERNAL_RESOURCE" }],
                    transformation: "Copybook -> Java DTO/context",
                    reason: "No Java target found",
                    confidence_score: 0
                },
                {
                    id: "m_ordstruc", status: "unmapped",
                    source: { id: "ORDSTRUC", label: "ORDSTRUC", kind: "COPYBOOK" },
                    targets: [{ kind: "EXTERNAL_RESOURCE" }],
                    transformation: "Copybook -> Java DTO/context",
                    reason: "No Java target found",
                    confidence_score: 0
                },
                {
                    id: "m_sqlcodes", status: "unmapped",
                    source: { id: "SQLCODES", label: "SQLCODES", kind: "COPYBOOK" },
                    targets: [{ kind: "EXTERNAL_RESOURCE" }],
                    transformation: "Copybook -> Java DTO/context",
                    reason: "No Java target found",
                    confidence_score: 0
                },
                {
                    id: "m_prod_loadlib", status: "unmapped",
                    source: { id: "PROD.LOADLIB", label: "PROD.LOADLIB", kind: "FILE_RESOURCE" },
                    targets: [{ kind: "EXTERNAL_RESOURCE" }],
                    transformation: "File/dataset dependency -> Java adapter/support code",
                    reason: "No Java target found",
                    confidence_score: 0
                },
                {
                    id: "m_prod_orders_error", status: "unmapped",
                    source: { id: "PROD.ORDERS.ERROR", label: "PROD.ORDERS.ERROR", kind: "FILE_RESOURCE" },
                    targets: [{ kind: "EXTERNAL_RESOURCE" }],
                    transformation: "File/dataset dependency -> Java adapter/support code",
                    reason: "No Java target found",
                    confidence_score: 0
                },
                {
                    id: "m_prod_orders_input", status: "unmapped",
                    source: { id: "PROD.ORDERS.INPUT", label: "PROD.ORDERS.INPUT", kind: "FILE_RESOURCE" },
                    targets: [{ kind: "EXTERNAL_RESOURCE" }],
                    transformation: "File/dataset dependency -> Java adapter/support code",
                    reason: "No Java target found",
                    confidence_score: 0
                },
                {
                    id: "m_prod_orders_processed", status: "unmapped",
                    source: { id: "PROD.ORDERS.PROCESSED", label: "PROD.ORDERS.PROCESSED", kind: "FILE_RESOURCE" },
                    targets: [{ kind: "EXTERNAL_RESOURCE" }],
                    transformation: "File/dataset dependency -> Java adapter/support code",
                    reason: "No Java target found",
                    confidence_score: 0
                },
                {
                    id: "m_prod_orders_valid", status: "unmapped",
                    source: { id: "PROD.ORDERS.VALID", label: "PROD.ORDERS.VALID", kind: "FILE_RESOURCE" },
                    targets: [{ kind: "EXTERNAL_RESOURCE" }],
                    transformation: "File/dataset dependency -> Java adapter/support code",
                    reason: "No Java target found",
                    confidence_score: 0
                },
                {
                    id: "m_gen_main", status: "generated_new",
                    source: { id: "Generated Java", label: "Generated Java", kind: "EXTERNAL_RESOURCE" },
                    targets: [{ id: "main-module", label: "main-module (Module)", kind: "MAVEN_MODULE" }],
                    transformation: "Generated Java framework/support component",
                    confidence_score: 100
                },
                {
                    id: "m_gen_shared", status: "generated_new",
                    source: { id: "Generated Java", label: "Generated Java", kind: "EXTERNAL_RESOURCE" },
                    targets: [{ id: "shared-module", label: "shared module (Module)", kind: "MAVEN_MODULE" }],
                    transformation: "Generated Java framework/support component",
                    confidence_score: 100
                },
                {
                    id: "m_gen_util", status: "generated_new",
                    source: { id: "Generated Java", label: "Generated Java", kind: "EXTERNAL_RESOURCE" },
                    targets: [{ id: "util-module", label: "util-module (Module)", kind: "MAVEN_MODULE" }],
                    transformation: "Generated Java framework/support component",
                    confidence_score: 100
                },
                {
                    id: "m_gen_test3", status: "generated_new",
                    source: { id: "Generated Java", label: "Generated Java", kind: "EXTERNAL_RESOURCE" },
                    targets: [{ id: "test3.converted", label: "test3.converted (Maven)", kind: "MAVEN_MODULE" }],
                    transformation: "Generated Java framework/support component",
                    confidence_score: 100
                },
                {
                    id: "m_gen_mainapp", status: "generated_new",
                    source: { id: "Generated Java", label: "Generated Java", kind: "EXTERNAL_RESOURCE" },
                    targets: [{ id: "MainApplication", label: "MainApplication (Spring Boot)", kind: "SPRING_BOOT_APP" }],
                    transformation: "Generated Java framework/support component",
                    confidence_score: 100
                },
                {
                    id: "m_gen_invstruc", status: "generated_new",
                    source: { id: "Generated Java", label: "Generated Java", kind: "EXTERNAL_RESOURCE" },
                    targets: [{ id: "InventoryStructure", label: "InventoryStructure (External)", kind: "EXTERNAL_RESOURCE" }],
                    transformation: "Generated Java framework/support component",
                    confidence_score: 100
                },
                {
                    id: "m_gen_ordstruc", status: "generated_new",
                    source: { id: "Generated Java", label: "Generated Java", kind: "EXTERNAL_RESOURCE" },
                    targets: [{ id: "OrderStructure", label: "OrderStructure (External)", kind: "EXTERNAL_RESOURCE" }],
                    transformation: "Generated Java framework/support component",
                    confidence_score: 100
                },
                {
                    id: "m_gen_sqlcodes", status: "generated_new",
                    source: { id: "Generated Java", label: "Generated Java", kind: "EXTERNAL_RESOURCE" },
                    targets: [{ id: "SqlReturnCodes", label: "SqlReturnCodes (External)", kind: "EXTERNAL_RESOURCE" }],
                    transformation: "Generated Java framework/support component",
                    confidence_score: 100
                }
            ],
            lanes: [
                { id: "entrypoints", label: "ENTRYPOINTS", mapping_ids: ["m_execute"] },
                { id: "business_programs", label: "BUSINESS PROGRAMS", mapping_ids: ["m_ordinv", "m_ordval"] },
                { id: "data_resources", label: "DATA & RESOURCES", mapping_ids: ["m_customer", "m_inventory", "m_order_status", "m_invstruc", "m_ordstruc", "m_sqlcodes", "m_prod_loadlib", "m_prod_orders_error", "m_prod_orders_input", "m_prod_orders_processed", "m_prod_orders_valid"] },
                { id: "generated_java", label: "GENERATED JAVA SUPPORT", mapping_ids: ["m_gen_main", "m_gen_shared", "m_gen_util", "m_gen_test3", "m_gen_mainapp", "m_gen_invstruc", "m_gen_ordstruc", "m_gen_sqlcodes"] }
            ],
            gaps: [
                { severity: 'high', component: 'EXECUTE', description: 'No batch runner was found.' },
                { severity: 'high', component: 'CUSTOMER', description: 'No generated persistence component matched this table.' }
            ],
            insights: []
        };
    }
}

function getActiveArchitecturePreview() {
    if (activeArchitectureView === 'transform') return architectureComparisonPreview;
    return activeArchitectureView === 'java' ? javaArchitecturePreview : sourceArchitecturePreview;
}

function renderArchitecturePreview() {
    var preview = getActiveArchitecturePreview() || {};
    renderSummary(preview);
    if (activeArchitectureView !== 'transform') {
        renderDiagram(preview);
        renderTable(preview);
        renderBmsScreens();
        renderFlows(preview);
        renderInsights(preview);
    }
    renderTargetPreview(targetArchitecturePreview || {});
    renderTransformationMap(architectureComparisonPreview || {});
    renderRawJson();
    switchArchitecturePageTab(activeArchitectureTab);
}

function statusConfig(status) {
    var value = String(status || 'partial');
    var configs = {
        mapped: { label: 'Mapped', className: 'status-mapped' },
        partial: { label: 'Partial', className: 'status-partial' },
        unmapped: { label: 'Unmapped', className: 'status-unmapped' },
        generated_new: { label: 'Generated New', className: 'status-generated-new' }
    };
    return configs[value] || configs.partial;
}

function confidenceText(mapping) {
    var score = mapping && typeof mapping.confidence_score === 'number' ? mapping.confidence_score + '%' : '';
    return [mapping && mapping.confidence, score].filter(Boolean).join(' / ');
}

function mappingTargetText(mapping) {
    var targets = mapping.targets || [];
    if (!targets.length) return 'No Java target found';
    return targets.map(function(target) {
        return (target.label || target.id || 'target') + ' (' + (typeConfig(target.kind).label || target.kind || 'Java') + ')';
    }).join(', ');
}

function renderTransformationMap(preview) {
    renderTransformationSummary(preview);
    renderTransformationLanes(preview);
    renderTransformationGaps(preview);
    renderTransformationDetail(selectedTransformationMappingId);
}

function renderTransformationSummary(preview) {
    var summary = preview.summary || {};
    var el = document.getElementById('architecture-transform-summary');
    if (!el) return;
    var items = [
        ['Confidence', (summary.confidence_score || 0) + '%'],
        ['Programs', (summary.programs_mapped || 0) + ' / ' + (summary.programs_total || 0)],
        ['Data Stores', (summary.datastores_mapped || 0) + ' / ' + (summary.datastores_total || 0)],
        ['JCL Jobs', (summary.jcl_mapped || 0) + ' / ' + (summary.jcl_total || 0)],
        ['CICS Txns', (summary.cics_mapped || 0) + ' / ' + (summary.cics_total || 0)],
        ['New Java', summary.new_target_components || 0]
    ];
    el.innerHTML = items.map(function(item) {
        return '<div class="architecture-transform-stat"><span>' + escapeHtml(item[0]) + '</span><strong>' + escapeHtml(item[1]) + '</strong></div>';
    }).join('');
}

function visibleMappings(preview) {
    var mappings = Array.isArray(preview.mappings) ? preview.mappings : [];
    if (transformationFilter === 'all') return mappings;
    return mappings.filter(function(mapping) { return mapping.status === transformationFilter; });
}

function renderTransformationLanes(preview) {
    var container = document.getElementById('architecture-transform-lanes');
    if (!container) return;
    var mappings = visibleMappings(preview);
    var byId = new Map(mappings.map(function(mapping) { return [mapping.id, mapping]; }));
    var lanes = Array.isArray(preview.lanes) ? preview.lanes : [];
    if (!lanes.length) {
        container.innerHTML = '<div class="architecture-list-row">No transformation mappings available.</div>';
        return;
    }
    container.innerHTML = lanes.map(function(lane) {
        var laneMappings = (lane.mapping_ids || []).map(function(id) { return byId.get(id); }).filter(Boolean);
        if (!laneMappings.length) return '';
        return '<section class="architecture-transform-lane">' +
            '<div class="architecture-transform-lane-title">' + escapeHtml(lane.label || lane.id) + '</div>' +
            laneMappings.map(renderTransformationCard).join('') +
            '</section>';
    }).join('') || '<div class="architecture-list-row">No mappings match this filter.</div>';
    bindTransformationClicks();
}

function renderTransformationCard(mapping) {
    var status = statusConfig(mapping.status);
    var source = mapping.source || {};
    var sourceCfg = typeConfig(source.kind || 'EXTERNAL_RESOURCE');
    var targets = mapping.targets || [];
    var targetCfg = typeConfig((targets[0] || {}).kind || 'EXTERNAL_RESOURCE');
    var sourceLabel = source.label || source.id || 'Generated Java';
    var targetLabel = mappingTargetText(mapping);
    return '<button type="button" class="architecture-transform-card ' + status.className + '" data-transform-id="' + escapeHtml(mapping.id) + '">' +
        '<div class="architecture-transform-side source-side ' + sourceCfg.className + '">' +
        '<span class="architecture-table-icon">' + sourceCfg.icon + '</span>' +
        '<div><span class="architecture-transform-eyebrow">Legacy Source</span><strong>' + escapeHtml(sourceLabel) + '</strong><small>' + escapeHtml(sourceCfg.label) + '</small></div>' +
        '</div>' +
        '<div class="architecture-transform-arrow"><span>' + escapeHtml(mapping.transformation || 'transforms to') + '</span></div>' +
        '<div class="architecture-transform-side target-side ' + targetCfg.className + '">' +
        '<span class="architecture-table-icon">' + targetCfg.icon + '</span>' +
        '<div><span class="architecture-transform-eyebrow">Target Java</span><strong>' + escapeHtml(targetLabel) + '</strong><small>' + escapeHtml(confidenceText(mapping)) + '</small></div>' +
        '</div>' +
        '<span class="architecture-status-pill ' + status.className + '">' + escapeHtml(status.label) + '</span>' +
        '</button>';
}

function bindTransformationClicks() {
    document.querySelectorAll('[data-transform-id]').forEach(function(el) {
        el.addEventListener('click', function() {
            selectedTransformationMappingId = el.getAttribute('data-transform-id');
            renderTransformationDetail(selectedTransformationMappingId);
        });
    });
}

function renderTransformationDetail(mappingId) {
    var detailEl = document.getElementById('architecture-transform-detail');
    if (!detailEl) return;
    var mappings = (architectureComparisonPreview || {}).mappings || [];
    var mapping = mappings.find(function(item) { return item.id === mappingId; }) || mappings[0];
    if (!mapping) {
        detailEl.textContent = 'Click any mapping to inspect traceability and confidence.';
        return;
    }
    selectedTransformationMappingId = mapping.id;
    document.querySelectorAll('[data-transform-id]').forEach(function(el) {
        el.classList.toggle('selected', el.getAttribute('data-transform-id') === mapping.id);
    });
    var status = statusConfig(mapping.status);
    var source = mapping.source || {};
    var targets = mapping.targets || [];
    var evidence = (mapping.evidence || []).concat(source.evidence || []);
    targets.forEach(function(target) {
        evidence = evidence.concat(target.evidence || []);
    });
    detailEl.innerHTML =
        '<div class="architecture-detail-head ' + status.className + '">' +
        '<div>' +
        '<div class="architecture-list-title">' + escapeHtml(mapping.transformation || 'Transformation') + '</div></div>' +
        '</div>' +
        '<div class="architecture-list-text">' + escapeHtml(mapping.reason || '') + '</div>' +
        '<div class="architecture-detail-section"><strong>Source</strong><div>' + escapeHtml((source.label || source.id || 'Generated Java support') + (source.kind ? ' - ' + source.kind : '')) + '</div></div>' +
        '<div class="architecture-detail-section"><strong>Target</strong><div>' + escapeHtml(mappingTargetText(mapping)) + '</div></div>' +
        '<div class="architecture-detail-section"><strong>Confidence</strong><div>' + escapeHtml(confidenceText(mapping)) + '</div></div>' +
        '<div class="architecture-detail-section"><strong>Evidence</strong><div>' + (evidence.length ? evidence.slice(0, 8).map(function(ev) {
            return escapeHtml((ev.artifact || 'artifact') + ': ' + (ev.path || ev.json_path || ev.note || ''));
        }).join('<br>') : 'No evidence recorded') + '</div></div>';
}

function renderTransformationGaps(preview) {
    var el = document.getElementById('architecture-transform-gaps');
    if (!el) return;
    var gaps = Array.isArray(preview.gaps) ? preview.gaps : [];
    el.innerHTML = gaps.length ? gaps.slice(0, 20).map(function(gap) {
        return '<div class="architecture-list-row severity-' + escapeHtml(gap.severity || 'medium') + '">' +
            '<span class="architecture-pill">' + escapeHtml(gap.severity || 'gap') + '</span>' +
            '<div class="architecture-list-title">' + escapeHtml(gap.component || 'Unmapped component') + '</div>' +
            '<div class="architecture-list-text">' + escapeHtml(gap.description || '') + '</div>' +
            '</div>';
    }).join('') : '<div class="architecture-list-row">No transformation gaps detected.</div>';
}

function setTransformationFilter(filter) {
    transformationFilter = filter || 'all';
    document.querySelectorAll('[data-transform-filter]').forEach(function(button) {
        button.classList.toggle('active', button.getAttribute('data-transform-filter') === transformationFilter);
    });
    renderTransformationLanes(architectureComparisonPreview || {});
}

function switchArchitectureView(view) {
    activeArchitectureView = ['java', 'transform'].indexOf(view) >= 0 ? view : 'source';
    selectedArchitectureNodeId = null;
    if (activeArchitectureView === 'transform') {
        activeArchitectureTab = 'transform';
    } else if (['diagram', 'table', 'target', 'json'].indexOf(activeArchitectureTab) < 0 || (activeArchitectureView === 'source' && activeArchitectureTab === 'target')) {
        activeArchitectureTab = 'diagram';
    }
    document.querySelectorAll('[data-architecture-view]').forEach(function(button) {
        button.classList.toggle('active', button.getAttribute('data-architecture-view') === activeArchitectureView);
    });
    renderArchitecturePreview();
    setTimeout(fitArchitectureToView, 80);
}

async function reloadArchitecturePreview() {
    var loading = document.getElementById('architecture-loading');
    var error = document.getElementById('architecture-error');
    var content = document.getElementById('architecture-content');
    if (loading) loading.style.display = 'flex';
    if (error) error.style.display = 'none';
    if (content) content.style.display = 'none';
    try {
        await loadArchitecturePreview();
        renderArchitecturePreview();
        if (loading) loading.style.display = 'none';
        if (content) content.style.display = 'block';
        setTimeout(fitArchitectureToView, 80);
    } catch (err) {
        if (loading) loading.style.display = 'none';
        if (error) error.style.display = 'flex';
        var errText = document.getElementById('architecture-error-text');
        if (errText) errText.textContent = err.message || String(err);
    }
}

function goBackToCodeWiki() {
    if (architectureProjectId) {
        window.location.href = '/static/index.html?project=' + encodeURIComponent(architectureProjectId) + '&page=analytics';
    } else {
        window.location.href = '/static/index.html';
    }
}

var legacyEntryData = {
    'EXECUTE': {
        title: 'EXECUTE',
        sourceEntry: 'JCL -> EXECUTE',
        dataResources: 'No DB2/VSAM resource linked',
        step1: 'Batch Job EXECUTE starts COBOL program EXECUTE',
        step4: 'No DB2/VSAM resource was linked',
        json: '{\n  "endpoint": "BATCH_JOB_EXECUTE",\n  "legacyJob": "EXECUTE",\n  "cobolProgram": "EXECUTE",\n  "payloadStyle": "Batch job trigger/status contract",\n  "request": {\n    "type": "Job launch parameters",\n    "expectedInputs": [\n      "job name",\n      "run parameters",\n      "dataset or file references when discovered"\n    ],\n    "driverParagraphs": [\n      "0000-MAIN-PROCESS"\n    ]\n  }\n}'
    },
    'ORDINV': {
        title: 'ORDINV',
        sourceEntry: 'JCL -> ORDINV',
        dataResources: 'INVENTORY, OF, ORDER_STATUS',
        step1: 'Batch Job ORDINV starts COBOL program ORDINV',
        step4: 'COBOL reaches data/resources INVENTORY, OF, ORDER_STATUS',
        json: '{\n  "endpoint": "BATCH_JOB_ORDINV",\n  "legacyJob": "ORDINV",\n  "cobolProgram": "ORDINV",\n  "payloadStyle": "Batch job trigger/status contract",\n  "request": {\n    "type": "Job launch parameters",\n    "expectedInputs": [\n      "job name",\n      "run parameters",\n      "dataset or file references when discovered"\n    ],\n    "driverParagraphs": [\n      "0000-MAIN-PROCESS"\n    ]\n  }\n}'
    },
    'ORDVAL': {
        title: 'ORDVAL',
        sourceEntry: 'JCL -> ORDVAL',
        dataResources: 'CUSTOMER, ERROR-ORDER-FILE, ORDER-FILE',
        step1: 'Batch Job ORDVAL starts COBOL program ORDVAL',
        step4: 'COBOL reaches data/resources CUSTOMER, ERROR-ORDER-FILE, ORDER-FILE',
        json: '{\n  "endpoint": "BATCH_JOB_ORDVAL",\n  "legacyJob": "ORDVAL",\n  "cobolProgram": "ORDVAL",\n  "payloadStyle": "Batch job trigger/status contract",\n  "request": {\n    "type": "Job launch parameters",\n    "expectedInputs": [\n      "job name",\n      "run parameters",\n      "dataset or file references when discovered"\n    ],\n    "driverParagraphs": [\n      "0000-MAIN-PROCESS"\n    ]\n  }\n}'
    }
};

function renderLegacyDetail(key) {
    var data = legacyEntryData[key];
    if (!data) return;
    
    var titleEl = document.getElementById('legacy-detail-title');
    var sourceEntryEl = document.getElementById('legacy-detail-source-entry');
    var dataResourcesEl = document.getElementById('legacy-detail-data-resources');
    var step1El = document.getElementById('legacy-detail-step-1');
    var step4El = document.getElementById('legacy-detail-step-4');
    var jsonEl = document.getElementById('legacy-detail-json');
    
    if (titleEl) titleEl.innerText = data.title;
    if (sourceEntryEl) sourceEntryEl.innerText = data.sourceEntry;
    if (dataResourcesEl) dataResourcesEl.innerText = data.dataResources;
    if (step1El) step1El.innerText = data.step1;
    if (step4El) step4El.innerText = data.step4;
    if (jsonEl) jsonEl.innerText = data.json;
    
    document.querySelectorAll('[id^="legacy-item-"]').forEach(function(el) {
        if (el.id === 'legacy-item-' + key) {
            el.style.background = 'rgba(255,255,255,0.05)';
        } else {
            el.style.background = 'transparent';
        }
    });
}

window.addEventListener('resize', function() {
    clearTimeout(window.__architecturePreviewResizeTimer);
    window.__architecturePreviewResizeTimer = setTimeout(drawEdges, 120);
});

document.addEventListener('DOMContentLoaded', function() {
    updateNavigationLinks();
    document.querySelectorAll('[data-architecture-view]').forEach(function(button) {
        button.classList.toggle('active', button.getAttribute('data-architecture-view') === activeArchitectureView);
    });
    reloadArchitecturePreview();
});
