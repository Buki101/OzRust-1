const PURCHASES_STORAGE_KEY = 'ozrust_purchases_v1';

function readPurchases() {
  try {
    const raw = localStorage.getItem(PURCHASES_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (_error) {
    return [];
  }
}

function writePurchases(purchases) {
  try {
    localStorage.setItem(PURCHASES_STORAGE_KEY, JSON.stringify(purchases));
  } catch (_error) {
    // Ignore storage failures in demo mode.
  }
}

function addPurchase(purchase) {
  const purchases = readPurchases();
  purchases.unshift(purchase);
  writePurchases(purchases.slice(0, 100));
}

function clearPurchasesForUser(username) {
  const purchases = readPurchases().filter((entry) => entry.username !== username);
  writePurchases(purchases);
}

window.ozPurchases = {
  readPurchases,
  addPurchase,
  clearPurchasesForUser
};
