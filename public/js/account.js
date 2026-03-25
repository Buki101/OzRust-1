const accountStatusEl = document.getElementById('accountStatus');
const accountSubhead = document.getElementById('accountSubhead');
const purchasesWrap = document.getElementById('purchasesWrap');
const purchasesBody = document.getElementById('purchasesBody');
const clearPurchasesBtn = document.getElementById('clearPurchasesBtn');

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString();
}

function renderRows(entries) {
  purchasesBody.innerHTML = '';

  entries.forEach((entry) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${formatDate(entry.purchasedAt)}</td>
      <td>${entry.server || '—'}</td>
      <td>${entry.kitTitle || '—'}</td>
      <td>${entry.price || '—'}</td>
      <td>${entry.status || 'Pending'}</td>
    `;
    purchasesBody.appendChild(tr);
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

    const allEntries = window.ozPurchases?.readPurchases?.() || [];
    const entries = allEntries.filter((entry) => entry.username === username);

    if (!entries.length) {
      purchasesWrap.hidden = true;
      accountStatusEl.textContent = 'No purchases yet. Your completed and pending kit purchases will appear here.';
    } else {
      renderRows(entries);
      purchasesWrap.hidden = false;
      accountStatusEl.textContent = '';
    }

    clearPurchasesBtn.addEventListener('click', () => {
      window.ozPurchases?.clearPurchasesForUser?.(username);
      loadAccount();
    });
  } catch (_error) {
    accountStatusEl.textContent = 'Unable to load account data right now.';
  }
}

loadAccount();
