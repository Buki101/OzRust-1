const signOutBtn = document.getElementById('signOutBtn');
const AUTH_USERNAME_KEY = 'ozrust_auth_username';

if (signOutBtn) {
  signOutBtn.addEventListener('click', async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (_error) {
      // Best-effort logout.
    }

    try {
      localStorage.removeItem(AUTH_USERNAME_KEY);
    } catch (_error) {
      // Ignore storage failures and proceed with sign-out redirect.
    }

    window.location.href = '/signin';
  });
}
