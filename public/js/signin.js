const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const useDemoBtn = document.getElementById('useDemoBtn');
const form = document.getElementById('signinForm');
const statusEl = document.getElementById('signinStatus');

const params = new URLSearchParams(window.location.search);
const nextPath = params.get('next') || '/';
const AUTH_USERNAME_KEY = 'ozrust_auth_username';

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  statusEl.classList.remove('success');
  statusEl.textContent = 'Signing in...';

  const formData = new FormData(form);
  const body = {
    username: String(usernameInput.value || formData.get('username') || '').trim(),
    password: String(passwordInput.value || formData.get('password') || '')
  };

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(payload.error || 'Sign in failed.');
    }

    statusEl.classList.add('success');
    statusEl.textContent = 'Signed in. Redirecting...';

    try {
      localStorage.setItem(AUTH_USERNAME_KEY, payload.username || body.username);
    } catch (_error) {
      // Ignore storage failures and continue sign-in redirect flow.
    }

    window.location.href = nextPath;
  } catch (error) {
    statusEl.textContent = error.message || 'Sign in failed.';
  }
});

if (useDemoBtn) {
  useDemoBtn.addEventListener('click', () => {
    usernameInput.value = 'admin';
    passwordInput.value = 'changeme';
    statusEl.classList.remove('success');
    statusEl.textContent = 'Demo credentials populated. Click Sign in.';
  });
}
