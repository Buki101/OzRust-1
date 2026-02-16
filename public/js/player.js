const statusEl = document.getElementById('playerStatus');
const playerCard = document.getElementById('playerCard');
const playerName = document.getElementById('playerName');
const playerMeta = document.getElementById('playerMeta');
const statsGrid = document.getElementById('statsGrid');

const statFields = [
  ['PVPKills', 'PVP Kills'],
  ['PVEKills', 'PVE Kills'],
  ['NPCKills', 'NPC Kills'],
  ['Deaths', 'Deaths'],
  ['HeadShots', 'Headshots'],
  ['KDR', 'KDR'],
  ['Economics', 'Economics'],
  ['ServerRewards', 'Server Rewards']
];

function formatDate(value) {
  if (!value) return '-';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '-' : date.toLocaleString();
}

function statValue(field, value) {
  if (value == null) return '-';
  if (field === 'KDR') return Number(value).toFixed(2);
  if (field === 'Economics' || field === 'ServerRewards') return Number(value).toLocaleString();
  return String(value);
}

function renderPlayer(player) {
  playerName.textContent = player.Name || 'Unknown Player';
  const lastSeen = formatDate(player.ActiveDate);
  const timePlayed = player.TimePlayed != null ? `${player.TimePlayed} mins` : 'N/A';
  playerMeta.textContent = `SteamID: ${player.UserID} • Clan: ${player.Clan || '-'} • Status: ${player.Status || '-'} • Last Seen: ${lastSeen} • Time Played: ${timePlayed}`;

  statsGrid.innerHTML = '';
  statFields.forEach(([field, label]) => {
    const card = document.createElement('div');
    card.className = 'stat-card';
    card.innerHTML = `<span class="label">${label}</span><span class="value">${statValue(field, player[field])}</span>`;
    statsGrid.appendChild(card);
  });
}

async function loadPlayer() {
  const steamId = window.location.pathname.split('/').pop();

  statusEl.textContent = 'Loading player...';
  playerCard.hidden = true;

  try {
    const response = await fetch(`/api/player/${encodeURIComponent(steamId)}`);
    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw new Error(errorBody.error || 'Request failed');
    }

    const data = await response.json();
    renderPlayer(data.player);
    statusEl.textContent = '';
    playerCard.hidden = false;
  } catch (error) {
    statusEl.textContent = error.message || 'Failed to load player.';
    console.error(error);
  }
}

loadPlayer();
