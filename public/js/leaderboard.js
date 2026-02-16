const statOptions = [
  { value: 'PVPKills', label: 'PVP Kills' },
  { value: 'KDR', label: 'KDR' },
  { value: 'Deaths', label: 'Deaths' },
  { value: 'HeadShots', label: 'Headshots' },
  { value: 'PVEKills', label: 'PVE Kills' },
  { value: 'NPCKills', label: 'NPC Kills' },
  { value: 'Economics', label: 'Economics' },
  { value: 'ServerRewards', label: 'Server Rewards' }
];

const select = document.getElementById('statSelect');
const statusEl = document.getElementById('leaderboardStatus');
const tableWrap = document.getElementById('tableWrap');
const rowsEl = document.getElementById('leaderboardRows');
const valueHeader = document.getElementById('valueHeader');

function formatDate(value) {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleString();
}

function formatValue(stat, value) {
  if (value == null) return '-';
  if (stat === 'KDR') return Number(value).toFixed(2);
  if (stat === 'Economics' || stat === 'ServerRewards') {
    return Number(value).toLocaleString();
  }
  return String(value);
}

function renderRows(stat, rows) {
  rowsEl.innerHTML = '';

  rows.forEach((row, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${row.name ?? '-'}</td>
      <td>${row.clan ?? '-'}</td>
      <td>${row.status ?? '-'}</td>
      <td>${formatDate(row.activeDate)}</td>
      <td class="value-col">${formatValue(stat, row.value)}</td>
    `;

    tr.addEventListener('click', () => {
      window.location.href = `/player/${row.userId}`;
    });

    rowsEl.appendChild(tr);
  });
}

async function loadLeaderboard(stat) {
  statusEl.textContent = 'Loading leaderboard...';
  tableWrap.hidden = true;

  try {
    const response = await fetch(`/api/leaderboard?stat=${encodeURIComponent(stat)}&limit=50`);
    if (!response.ok) throw new Error('Request failed');

    const data = await response.json();
    valueHeader.textContent = statOptions.find((option) => option.value === stat)?.label || 'Value';

    if (!data.rows.length) {
      statusEl.textContent = 'No rows found for this stat.';
      return;
    }

    statusEl.textContent = '';
    tableWrap.hidden = false;
    renderRows(stat, data.rows);
  } catch (error) {
    statusEl.textContent = 'Failed to load leaderboard. Please try again.';
    console.error(error);
  }
}

function init() {
  statOptions.forEach((option) => {
    const element = document.createElement('option');
    element.value = option.value;
    element.textContent = option.label;
    select.appendChild(element);
  });

  select.value = 'PVPKills';
  loadLeaderboard(select.value);

  select.addEventListener('change', () => {
    loadLeaderboard(select.value);
  });
}

init();
