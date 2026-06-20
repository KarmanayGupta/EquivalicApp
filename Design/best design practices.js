var API_BASE = (typeof window !== 'undefined' && window.location && window.location.origin)
    ? window.location.origin + '/api/v1/cobol'
    : '/api/v1/cobol';

var bestPracticesProjectId = new URLSearchParams(window.location.search).get('project');

document.addEventListener('DOMContentLoaded', function() {
    loadBestPractices();
});

function handleBestPracticesLogout(e) {
    e.preventDefault();
    if (confirm('The process will be stopped. Do you want to close the analysis and logout?')) {
        try { localStorage.removeItem('shiftscripts_session_id'); } catch (err) {}
        window.location.href = '/?logout=1';
    }
}

function getSessionHeaders() {
    var headers = {};
    try {
        var sid = localStorage.getItem('shiftscripts_session_id');
        if (sid) headers['X-Session-ID'] = sid;
    } catch (e) {}
    return headers;
}

function escapeHtml(value) {
    return String(value == null ? '' : value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
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

const appState = { product: "Product Suite", section: "Design", page: "Best Design Practices" };
function renderHeader() {
  const el = document.getElementById("appBreadcrumb");
  if (el) el.innerHTML = `${appState.section} > ${appState.page}`;
}

document.addEventListener('DOMContentLoaded', () => {
  renderHeader();
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
  syncSidebarActive("Best Design Practices");
});

function showError(message) {
    var loading = document.getElementById('loading-indicator');
    var error = document.getElementById('error-container');
    var content = document.getElementById('bp-content');
    var text = document.getElementById('error-text');
    if (loading) loading.style.display = 'none';
    if (content) content.style.display = 'none';
    if (text) text.textContent = message || 'Unknown error';
    if (error) error.style.display = 'flex';
}

async function loadBestPractices() {
    

    var headers = getSessionHeaders();

    var loading = document.getElementById('loading-indicator');
    var error = document.getElementById('error-container');
    var content = document.getElementById('bp-content');
    if (loading) loading.style.display = 'flex';
    if (error) error.style.display = 'none';
    if (content) content.style.display = 'none';

    try {
        var data = {
            success: true,
            project_name: 'Project',
            overall: {
                score: 74,
                urgency: 'Medium',
                missing_practices: 3,
                partial_practices: 6,
                business_message: 'The current application architecture presents moderate risk to immediate cloud migration.'
            },
            categories: [
                {
                    name: 'Modularity & Interfaces',
                    score: 100,
                    business_value: 'Architecture patterns reflect standard component structures.',
                    met_practices: 2, partial_practices: 0, missing_practices: 0,
                    practices: [
                        { title: 'Abstract boundaries between components', recommendation: 'Ensure loosely-coupled dependencies are utilized', status: 'met', business_impact: 'All core process blocks use distinct copybooks for communication', evidence: ['Evidence of Call interfaces in the main batch pipeline...'], evidence_details: [{program: 'SAMPLE01', source_path: 'SAMPLE01.cbl', snippet: '* Source code reference found'}] },
                        { title: 'Ensure loosely-coupled dependencies are utilized', recommendation: 'Cross-module dependencies are passed through LINKAGE SECTION parameters', status: 'met', business_impact: 'Cross-module dependencies are passed through LINKAGE SECTION parameters', evidence: ['Evidence details'], evidence_details: [{program: 'SAMPLE01', source_path: 'SAMPLE01.cbl', snippet: '* Source code reference found'}] },
                        { title: 'Avoid cyclical linking over component boundaries', recommendation: 'The batch module tree is predominantly unidirectional and structured.', status: 'met', business_impact: 'The batch module tree is predominantly unidirectional and structured.', evidence: ['Evidence details'], evidence_details: [{program: 'SAMPLE01', source_path: 'SAMPLE01.cbl', snippet: '* Source code reference found'}] }
                    ]
                },
                {
                    name: 'Data coupling',
                    score: 40,
                    business_value: 'High embedded SQL/DML mixes data logic with business flow.',
                    met_practices: 0, partial_practices: 1, missing_practices: 1,
                    practices: [
                        { title: 'Use abstract DB mapping to logical components', recommendation: 'Abstract database calls into dedicated access modules.', status: 'missing', business_impact: 'SQL queries exist alongside core computational logic.', evidence: ['EXEC SQL SELECT ...'], evidence_details: [{program: 'SAMPLE01', source_path: 'SAMPLE01.cbl', snippet: '* Source code reference found'}] },
                        { title: 'Restrict raw record-level data definitions in logic', recommendation: 'Adopt data access objects.', status: 'partial', business_impact: 'A portion of data structure parsing still leaks into core modules.', evidence: ['FD layout definition'], evidence_details: [{program: 'SAMPLE01', source_path: 'SAMPLE01.cbl', snippet: '* Source code reference found'}] }
                    ]
                },
                {
                    name: 'Architecture coupling',
                    score: 80,
                    business_value: 'The current interface layers limit direct coupling from UI to core.',
                    met_practices: 1, partial_practices: 1, missing_practices: 0,
                    practices: [
                        { title: 'Network signatures remain independent of infrastructure', recommendation: 'Abstract network calls.', status: 'missing', business_impact: 'Hard-coded IP address bindings to CICS terminals', evidence: ['Program using hardcoded network IP addresses'], evidence_details: [{program: 'SAMPLE01', source_path: 'SAMPLE01.cbl', snippet: '* Source code reference found'}] },
                        { title: 'Use domain models instead of copybooks where feasible', recommendation: 'Create unified data models.', status: 'partial', business_impact: 'Some structures are modeled as data dictionaries but fall short of true domain modeling', evidence: ['Copybook structure'], evidence_details: [{program: 'SAMPLE01', source_path: 'SAMPLE01.cbl', snippet: '* Source code reference found'}] }
                    ]
                },
                {
                    name: 'Code freshness',
                    score: 70,
                    business_value: 'Code structure and styling follow largely standard legacy structure.',
                    met_practices: 1, partial_practices: 1, missing_practices: 1,
                    practices: [
                        { title: 'Adhere to code formatting conventions', recommendation: 'Ensure consistent styling.', status: 'met', business_impact: 'The codebase adheres to IBM standard COBOL style formatting conventions.', evidence: ['Consistently indented source files'], evidence_details: [{program: 'SAMPLE01', source_path: 'SAMPLE01.cbl', snippet: '* Source code reference found'}] },
                        { title: 'Keep cyclomatic complexity metrics manageable', recommendation: 'Simplify logic flows.', status: 'missing', business_impact: 'Complex nested IFs and GO TO constructs make maintenance difficult', evidence: ['A highly complex procedure in batch transaction logic'], evidence_details: [{program: 'SAMPLE01', source_path: 'SAMPLE01.cbl', snippet: '* Source code reference found'}] },
                        { title: 'Remove dead and legacy obsolete code blocks', recommendation: 'Delete unused paragraphs.', status: 'partial', business_impact: 'Several dead paragraphs are still present across the core files.', evidence: ['Dead procedure logic detected'], evidence_details: [{program: 'SAMPLE01', source_path: 'SAMPLE01.cbl', snippet: '* Source code reference found'}] }
                    ]
                },
                {
                    name: 'Reliability & Operations',
                    score: 50,
                    business_value: 'System metrics logs require operational log parsing mechanisms.',
                    met_practices: 0, partial_practices: 2, missing_practices: 1,
                    practices: [
                        { title: 'Ensure resilient error handling capabilities are utilized', recommendation: 'Implement standardized exception handling.', status: 'met', business_impact: 'Global exception traps exist in standard application flows.', evidence: ['Global exception handlers exist'], evidence_details: [{program: 'SAMPLE01', source_path: 'SAMPLE01.cbl', snippet: '* Source code reference found'}] },
                        { title: 'Write comprehensive unit testing artifacts', recommendation: 'Introduce automated testing.', status: 'missing', business_impact: 'No formal automated unit test scripts are observed.', evidence: ['Missing artifacts'], evidence_details: [{program: 'SAMPLE01', source_path: 'SAMPLE01.cbl', snippet: '* Source code reference found'}] },
                        { title: 'Emit logging outputs natively to structured targets', recommendation: 'Adopt structured logging frameworks.', status: 'partial', business_impact: 'Static string outputs are prevalent, reducing observability.', evidence: ['DISPLAY outputs'], evidence_details: [{program: 'SAMPLE01', source_path: 'SAMPLE01.cbl', snippet: '* Source code reference found'}] }
                    ]
                },
                {
                    name: 'Core modernization',
                    score: 30,
                    business_value: 'Extensive hardcoded logic flags immediate blockers to migration.',
                    met_practices: 0, partial_practices: 1, missing_practices: 2,
                    practices: [
                        { title: 'Remove platform specific dependency models', recommendation: 'Decouple platform APIs.', status: 'missing', business_impact: 'CICS macros create a hard lock-in to the IBM runtime.', evidence: ['EXEC CICS commands'], evidence_details: [{program: 'SAMPLE01', source_path: 'SAMPLE01.cbl', snippet: '* Source code reference found'}] },
                        { title: 'Isolate hardware boundaries to configuration layers', recommendation: 'Externalize environment dependencies.', status: 'partial', business_impact: 'Device layouts are bound to explicit display commands.', evidence: ['Device map layouts'], evidence_details: [{program: 'SAMPLE01', source_path: 'SAMPLE01.cbl', snippet: '* Source code reference found'}] },
                        { title: 'Adopt industry standard data modeling models', recommendation: 'Replace procedural data parsing.', status: 'missing', business_impact: 'Internal byte-shifting and REDEFINES are still in active use.', evidence: ['REDEFINES statements'], evidence_details: [{program: 'SAMPLE01', source_path: 'SAMPLE01.cbl', snippet: '* Source code reference found'}] }
                    ]
                }
            ],
            top_gaps: [
                { status: 'missing', severity: 'critical', title: 'Framework dependencies block migration', business_impact: 'Legacy libraries (e.g. CEEDATE) must be upgraded for cloud environment compatibility.', recommendation: 'Upgrade framework dependencies to modern equivalent libraries', evidence: ['Found in multiple batch programs'], evidence_details: [{program: 'SAMPLE01', source_path: 'SAMPLE01.cbl', snippet: '* Source code reference found'}] },
                { status: 'missing', severity: 'critical', title: 'Inconsistent DB handling impacts data tier', business_impact: 'Managed DB procedures remain mixed within flat text data flows. Extract DB queries into DTOs.', recommendation: 'Refactor data logic into dedicated access services', evidence: ['Occurs broadly across application footprint'], evidence_details: [{program: 'SAMPLE01', source_path: 'SAMPLE01.cbl', snippet: '* Source code reference found'}] },
                { status: 'missing', severity: 'critical', title: 'Architecture coupling restricts scaleout', business_impact: 'Network calls are tightly bound to the legacy infrastructure layer.', recommendation: 'Abstract external interactions into generic API wrapper definitions', evidence: ['Found across CICS transaction layers'], evidence_details: [{program: 'SAMPLE01', source_path: 'SAMPLE01.cbl', snippet: '* Source code reference found'}] },
                { status: 'partial', severity: 'high', title: 'Hardcoded assumptions dictate platform behavior', business_impact: 'Values \'X\' and \'Y\' dictate runtime execution paths based on legacy byte formats.', recommendation: 'Move configurations to external application properties', evidence: ['Requires refactoring in key macros'], evidence_details: [{program: 'SAMPLE01', source_path: 'SAMPLE01.cbl', snippet: '* Source code reference found'}] },
                { status: 'partial', severity: 'high', title: 'Batch scheduling dependencies are brittle', business_impact: 'Tightly coupled job flows rely on strict sequence rather than state.', recommendation: 'Adopt modern event-driven architectures for batch workloads.', evidence: ['Identify event-triggers'], evidence_details: [{program: 'SAMPLE01', source_path: 'SAMPLE01.cbl', snippet: '* Source code reference found'}] },
                { status: 'partial', severity: 'high', title: 'Security payload handling must be modernized', business_impact: 'Auth mechanisms bypass modern token standards and remain in proprietary formats.', recommendation: 'Adopt modern OAuth/OIDC security standards', evidence: ['Encrypt payload streams'], evidence_details: [{program: 'SAMPLE01', source_path: 'SAMPLE01.cbl', snippet: '* Source code reference found'}] },
                { status: 'missing', severity: 'medium', title: 'Business logic remains bound to data models', business_impact: 'Raw record layouts manipulate domain boundaries. Refactor into domain models.', recommendation: 'Build data transformation DTOs', evidence: ['Build data transformation DTOs'], evidence_details: [{program: 'SAMPLE01', source_path: 'SAMPLE01.cbl', snippet: '* Source code reference found'}] },
                { status: 'partial', severity: 'medium', title: 'Logging frameworks demand modernization', business_impact: 'Application logging uses generic file I/O rather than structured logging platforms.', recommendation: 'Adopt centralized logging platforms (e.g. ELK, Datadog, Splunk)', evidence: ['Transform standard program output'], evidence_details: [{program: 'SAMPLE01', source_path: 'SAMPLE01.cbl', snippet: '* Source code reference found'}] }
            ],
            roadmap: [
                {
                    title: 'Top 30 Days',
                    items: [
                        { title: 'Upgrade unsupported framework versions', recommendation: 'Ensure core framework builds function under cloud platforms.', severity: 'critical', effort: 'High' },
                        { title: 'Extract internal DB references to data tiers', recommendation: 'Abstract database logic out of core business functions.', severity: 'high', effort: 'High' },
                        { title: 'Isolate network configurations from core macros', recommendation: 'Move specific hardware boundaries off to config files for containerization support.', severity: 'high', effort: 'High' }
                    ]
                },
                {
                    title: 'Next 90 days',
                    items: [
                        { title: 'Refactor payload parser wrappers into standard DTOs', recommendation: 'Migrate flat file payloads into structured data models.', severity: 'medium', effort: 'Medium' },
                        { title: 'Abstract external API signatures for modern SOA', recommendation: 'Eliminate static integration parameters across cross-module calls.', severity: 'medium', effort: 'Medium' },
                        { title: 'Modernize job scheduling flows to event-based', recommendation: 'Re-route rigid JCL dependencies into event-based orchestration models.', severity: 'medium', effort: 'Medium' }
                    ]
                },
                {
                    title: 'Future considerations',
                    items: [
                        { title: 'Evaluate microservices extraction for key modules', recommendation: 'Begin assessing core batch workloads for standalone runtime execution.', severity: 'low', effort: 'High' },
                        { title: 'Migrate data schemas into relational models', recommendation: 'Transition legacy IMS/VSAM layouts into RDBMS structures.', severity: 'low', effort: 'High' },
                        { title: 'Adopt full distributed enterprise security models', recommendation: 'Consolidate external auth routines to standard protocols (OIDC/SAML).', severity: 'low', effort: 'Medium' }
                    ]
                }
            ],
            evidence_summary: {
                programs_analyzed: 35,
                dead_code_pct: 74,
                missing_dependencies: 0,
                security_scan_available: true,
                architecture_map_available: true,
                source_file_types: { 'cobol': 15, 'jcl': 10, 'copybook': 10 }
            }
        };

        

        renderBestPractices(data);
        if (loading) loading.style.display = 'none';
        if (content) content.style.display = 'block';
    } catch (err) {
        showError(err.message || String(err));
    }
}

function goToRiskAssessment() {
    window.location.href = '../risk and readiness/migration risk.html' + (bestPracticesProjectId ? '?project=' + encodeURIComponent(bestPracticesProjectId) : '');
}

function renderBestPractices(data) {
    var overall = data.overall || {};
    setText('bp-subtitle', (data.project_name || 'Project') + ' best-practice gap assessment generated from current analysis artifacts.');
    setText('bp-score-value', overall.score != null ? overall.score : '--');
    setText('bp-urgency', overall.urgency || '--');
    setText('bp-missing', overall.missing_practices != null ? overall.missing_practices : '--');
    setText('bp-partial', overall.partial_practices != null ? overall.partial_practices : '--');
    setText('bp-business-message', overall.business_message || '');

    var ring = document.getElementById('bp-score-ring');
    if (ring) {
        var score = Number(overall.score || 0);
        ring.style.setProperty('--score-angle', Math.max(0, Math.min(100, score)) * 3.6 + 'deg');
        ring.className = 'bp-score-ring ' + urgencyClass(overall.urgency);
    }

    renderCategories(data.categories || []);
    renderTopGaps(data.top_gaps || []);
    renderRoadmap(data.roadmap || []);
    renderPracticeMatrix(data.categories || []);
    renderEvidence(data.evidence_summary || {});
}

function setText(id, text) {
    var el = document.getElementById(id);
    if (el) el.textContent = text;
}

function statusClass(status) {
    return 'is-' + String(status || 'unknown').replace(/_/g, '-').toLowerCase();
}

function severityClass(severity) {
    return 'sev-' + String(severity || 'low').toLowerCase();
}

function urgencyClass(urgency) {
    return 'urgency-' + String(urgency || 'low').toLowerCase();
}

function renderCategories(categories) {
    var el = document.getElementById('bp-category-grid');
    if (!el) return;
    if (!categories.length) {
        el.innerHTML = '<p class="bp-empty">No category data available.</p>';
        return;
    }
    el.innerHTML = categories.map(function(cat) {
        var score = Number(cat.score || 0);
        return '' +
            '<article class="bp-category-card">' +
                '<div class="bp-category-top">' +
                    '<h3>' + escapeHtml(cat.name) + '</h3>' +
                    '<strong>' + score + '</strong>' +
                '</div>' +
                '<div class="bp-bar" aria-hidden="true"><span style="width:' + Math.max(0, Math.min(100, score)) + '%"></span></div>' +
                '<p>' + escapeHtml(cat.business_value || '') + '</p>' +
                '<div class="bp-category-counts">' +
                    '<span>' + escapeHtml(cat.met_practices || 0) + ' met</span>' +
                    '<span>' + escapeHtml(cat.partial_practices || 0) + ' partial</span>' +
                    '<span>' + escapeHtml(cat.missing_practices || 0) + ' missing</span>' +
                '</div>' +
            '</article>';
    }).join('');
}

function renderTopGaps(gaps) {
    var el = document.getElementById('bp-top-gaps');
    if (!el) return;
    if (!gaps.length) {
        el.innerHTML = '<p class="bp-empty">No high-priority gaps found.</p>';
        return;
    }
    el.innerHTML = gaps.map(function(gap) {
        return '' +
            '<article class="bp-gap-card">' +
                '<div class="bp-gap-header">' +
                    '<span class="bp-pill ' + statusClass(gap.status) + '">' + escapeHtml(gap.status) + '</span>' +
                    '<span class="bp-pill ' + severityClass(gap.severity) + '">' + escapeHtml(gap.severity) + '</span>' +
                '</div>' +
                '<h3>' + escapeHtml(gap.title) + '</h3>' +
                '<p class="bp-impact">' + escapeHtml(gap.business_impact) + '</p>' +
                '<p class="bp-recommendation">' + escapeHtml(gap.recommendation) + '</p>' +
                renderEvidenceList(gap.evidence) +
                renderEvidenceDetails(gap.evidence_details) +
            '</article>';
    }).join('');
}

function renderRoadmap(roadmap) {
    var el = document.getElementById('bp-roadmap');
    if (!el) return;
    if (!roadmap.length) {
        el.innerHTML = '<p class="bp-empty">No roadmap data available.</p>';
        return;
    }
    el.innerHTML = roadmap.map(function(phase) {
        var items = phase.items || [];
        return '' +
            '<article class="bp-roadmap-phase">' +
                '<h3>' + escapeHtml(phase.title) + '</h3>' +
                (items.length ? items.map(function(item) {
                    return '' +
                        '<div class="bp-roadmap-item">' +
                            '<div>' +
                                '<strong>' + escapeHtml(item.title) + '</strong>' +
                                '<p>' + escapeHtml(item.recommendation) + '</p>' +
                            '</div>' +
                            '<span class="bp-pill ' + severityClass(item.severity) + '">' + escapeHtml(item.effort) + '</span>' +
                        '</div>';
                }).join('') : '<p class="bp-empty">No urgent items in this phase.</p>') +
            '</article>';
    }).join('');
}

function renderPracticeMatrix(categories) {
    var el = document.getElementById('bp-practice-matrix');
    if (!el) return;
    var rows = [];
    categories.forEach(function(cat) {
        (cat.practices || []).forEach(function(practice) {
            rows.push({ category: cat.name, practice: practice });
        });
    });
    if (!rows.length) {
        el.innerHTML = '<p class="bp-empty">No practice matrix available.</p>';
        return;
    }
    el.innerHTML = '' +
        '<table>' +
            '<thead><tr><th>Category</th><th>Practice</th><th>Status</th><th>Impact</th><th>Evidence</th></tr></thead>' +
            '<tbody>' + rows.map(function(row) {
                var p = row.practice;
                return '' +
                    '<tr>' +
                        '<td>' + escapeHtml(row.category) + '</td>' +
                        '<td><strong>' + escapeHtml(p.title) + '</strong><span>' + escapeHtml(p.recommendation) + '</span></td>' +
                        '<td><span class="bp-pill ' + statusClass(p.status) + '">' + escapeHtml(p.status) + '</span></td>' +
                        '<td>' + escapeHtml(p.business_impact) + '</td>' +
                        '<td>' + renderEvidenceList(p.evidence) + renderEvidenceDetails(p.evidence_details) + '</td>' +
                    '</tr>';
            }).join('') + '</tbody>' +
        '</table>';
}

function renderEvidence(evidence) {
    var el = document.getElementById('bp-evidence-grid');
    if (!el) return;
    var items = [
        ['Programs analyzed', evidence.programs_analyzed],
        ['Dead code estimate', (evidence.dead_code_pct || 0) + '%'],
        ['Missing dependencies', evidence.missing_dependencies || 0],
        ['Security scan', evidence.security_scan_available ? 'Available' : 'Unavailable'],
        ['Architecture map', evidence.architecture_map_available ? 'Available' : 'Unavailable']
    ];
    var fileTypes = evidence.source_file_types || {};
    Object.keys(fileTypes).sort().slice(0, 6).forEach(function(key) {
        items.push([key.toUpperCase() + ' files', fileTypes[key]]);
    });
    el.innerHTML = items.map(function(item) {
        return '<div><span>' + escapeHtml(item[0]) + '</span><strong>' + escapeHtml(item[1]) + '</strong></div>';
    }).join('');
}

function renderEvidenceList(items) {
    items = (items || []).filter(Boolean);
    if (!items.length) return '<ul class="bp-evidence-list"><li>No evidence available</li></ul>';
    return '<ul class="bp-evidence-list">' + items.map(function(item) {
        return '<li>' + escapeHtml(item) + '</li>';
    }).join('') + '</ul>';
}

function renderEvidenceDetails(items) {
    items = (items || []).filter(Boolean);
    if (!items.length) return '';
    return '' +
        '<details class="bp-source-details">' +
            '<summary>Source drilldown</summary>' +
            '<div class="bp-source-list">' + items.map(function(item) {
                var program = item.program ? '<span class="bp-source-chip">' + escapeHtml(item.program) + '</span>' : '';
                var source = item.source_path
                    ? '<code>' + escapeHtml(item.source_path) + (item.line ? ':' + escapeHtml(item.line) : '') + '</code>'
                    : '';
                var artifact = item.artifact_path
                    ? '<code>' + escapeHtml(item.artifact_path) + '</code>'
                    : '';
                var note = item.note ? '<span>' + escapeHtml(item.note) + '</span>' : '';
                var snippet = item.snippet ? '<pre>' + escapeHtml(item.snippet) + '</pre>' : '';
                return '' +
                    '<div class="bp-source-item">' +
                        '<div class="bp-source-meta">' +
                            program +
                            (source || artifact || '<code>Evidence pointer</code>') +
                        '</div>' +
                        (source && artifact ? '<div class="bp-source-artifact">Artifact: ' + artifact + '</div>' : '') +
                        note +
                        snippet +
                    '</div>';
            }).join('') + '</div>' +
        '</details>';
}

// --- Tab Switching Logic ---
function switchBPTab(tabId) {
    // Hide all panels
    document.querySelectorAll('.bp-tab-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    // Remove active class from all tabs
    document.querySelectorAll('#bp-tabs .tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected panel
    const selectedPanel = document.getElementById(tabId);
    if (selectedPanel) {
        selectedPanel.classList.add('active');
    }
    
    // Add active class to clicked tab
    const event = window.event;
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }
}
