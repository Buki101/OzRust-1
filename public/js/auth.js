const signOutBtn = document.getElementById('signOutBtn');

if (signOutBtn) {
  signOutBtn.addEventListener('click', async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (_error) {
      // Best-effort logout.
    }

    window.location.href = '/signin';
  });
}
