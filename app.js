const titleNode = document.getElementById('section-title');
const periodNode = document.getElementById('period-label');
const kpiGrid = document.getElementById('kpi-grid');
const tableTitle = document.getElementById('table-title');
const tableHead = document.getElementById('table-head');
const tableBody = document.getElementById('table-body');
const searchInput = document.getElementById('search');

let erpData;
let currentSection = 'overview';

const renderRows = (rows) => {
  tableBody.innerHTML = rows
    .map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join('')}</tr>`)
    .join('');
};

const render = (sectionKey) => {
  const section = erpData.sections[sectionKey];
  if (!section) return;

  currentSection = sectionKey;
  periodNode.textContent = erpData.period;
  titleNode.textContent = section.title;
  tableTitle.textContent = section.tableTitle;

  kpiGrid.innerHTML = section.kpis
    .map(
      ([label, value]) => `
        <article class="kpi">
          <div class="label">${label}</div>
          <div class="value">${value}</div>
        </article>
      `
    )
    .join('');

  tableHead.innerHTML = `<tr>${section.columns.map((col) => `<th>${col}</th>`).join('')}</tr>`;
  renderRows(section.rows);
};

const bindEvents = () => {
  document.querySelectorAll('.nav-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.nav-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      searchInput.value = '';
      render(btn.dataset.section);
    });
  });

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim().toLowerCase();
    const rows = erpData.sections[currentSection].rows;
    const result = !query
      ? rows
      : rows.filter((row) => row.some((cell) => String(cell).toLowerCase().includes(query)));
    renderRows(result);
  });
};

const init = async () => {
  const response = await fetch('./erp-data.json');
  erpData = await response.json();
  bindEvents();
  render(currentSection);
};

init();
