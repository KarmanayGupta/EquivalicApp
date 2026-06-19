window.EQUIVALIC_NAV_ITEMS = [
  { key: 'overview', label: 'Overview', pages: [['Project Summary', '../Overview/project%20summary.html'], ['Project DNA', '../Overview/project%20dna.html'], ['Parser Improvement', '../Overview/parser%20improvement.html']]},
  { key: 'analyze', label: 'Analyze', pages: [['Code Wiki', '../Analyze/code%20wiki.html'], ['IR Quality', '../Analyze/ir%20quality.html'], ['Analysis Health', '../Analyze/analysis%20health.html']]},
  { key: 'design', label: 'Design', pages: [['Architecture Studio', '../Design/architectureStudio.html'], ['Data Mapping Review', '../Design/data%20mapping%20review.html'], ['Best Design Practices', '../Design/best%20design%20practices.html']]},
  { key: 'risk', label: 'Risk &amp; Readiness', pages: [['Migration Risk Assessment', '../risk%20and%20readiness/migration%20risk.html'], ['Vulnerability Assessment', '../risk%20and%20readiness/vulnerability%20assessment.html']]},
  { key: 'convert', label: 'Convert', pages: [['Conversion Workspace', '../convert/conversion%20workspace.html'], ['Conversion Status', '../convert/conversion%20status.html']]}
];

window.renderNavbar = function renderNavbar(activePage) {
  const groups = window.EQUIVALIC_NAV_ITEMS.map(group => {
    const isOpen = group.pages.some(([page]) => page === activePage);
    const children = group.pages.map(([page, href]) => {
      const active = page === activePage ? ' active' : '';
      return `          <a class="nav-child${active}" href="${href}" data-page="${page}">${page}</a>`;
    }).join('\n');
    return `        <div class="nav-row${isOpen ? ' active' : ''}" data-nav="${group.key}">${group.label}</div>
        <div class="nav-children${isOpen ? ' open' : ''}" id="children-${group.key}">
${children}
        </div>`;
  }).join('\n\n');

  return `    <aside class="sidebar">
      <div>
        <div class="logo">EquiValic</div>

${groups}
      </div>

      <div class="sidebar-settings">Settings</div>
    </aside>`;
};
