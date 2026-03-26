const activeStatusEl = document.getElementById('activeStatus');
const historyStatusEl = document.getElementById('historyStatus');
const accountSubhead = document.getElementById('accountSubhead');
const activeWrap = document.getElementById('activeWrap');
const activeBody = document.getElementById('activeBody');
const purchasesWrap = document.getElementById('purchasesWrap');
const purchasesBody = document.getElementById('purchasesBody');
const clearPurchasesBtn = document.getElementById('clearPurchasesBtn');
const authNavLink = document.getElementById('authNavLink');
const AUTH_USERNAME_KEY = 'ozrust_auth_username';

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString();
}

function renderRows(targetBody, entries) {
  targetBody.innerHTML = '';
  entries.forEach((entry) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${formatDate(entry.purchasedAt)}</td>
      <td>${entry.server || '—'}</td>
      <td>${entry.kitTitle || '—'}</td>
      <td>${entry.price || '—'}</td>
      <td>${entry.status || 'Pending'}</td>
    `;
    targetBody.appendChild(tr);
  });
}

async function loadAccount() {
  try {
    const response = await fetch('/api/auth/session', { credentials: 'same-origin' });
    const payload = await response.json().catch(() => ({}));

    if (!response.ok || !payload?.signedIn || !payload?.username) {
      window.location.href = `/signin?next=${encodeURIComponent('/account')}`;
      return;
    }

    const username = payload.username;
    accountSubhead.textContent = `G'day ${username}`;
    if (authNavLink) {
      authNavLink.textContent = `G'day ${username}`;
      authNavLink.href = '/account';
    }
    try {
      localStorage.setItem(AUTH_USERNAME_KEY, username);
    } catch (_error) {
      // Ignore local storage failures and continue rendering account data.
    }

    const allEntries = window.ozPurchases?.readPurchases?.() || [];
    const entries = allEntries.filter((entry) => entry.username === username);
    const activeEntries = entries.filter((entry) =>
      ['Checkout started', 'Active'].includes(String(entry.status || '').trim())
    );

    if (!activeEntries.length) {
      activeWrap.hidden = true;
      activeStatusEl.textContent = 'No active kits yet.';
    } else {
      renderRows(activeBody, activeEntries);
      activeWrap.hidden = false;
      activeStatusEl.textContent = '';
    }

    if (!entries.length) {
      purchasesWrap.hidden = true;
      historyStatusEl.textContent = 'No purchases yet. Completed and pending kit purchases will appear here.';
    } else {
      renderRows(purchasesBody, entries);
      purchasesWrap.hidden = false;
      historyStatusEl.textContent = '';
    }

    clearPurchasesBtn.onclick = () => {
      window.ozPurchases?.clearPurchasesForUser?.(username);
      loadAccount();
    };
  } catch (_error) {
    activeStatusEl.textContent = 'Unable to load account data right now.';
    historyStatusEl.textContent = 'Unable to load account data right now.';
  }
}

loadAccount();
