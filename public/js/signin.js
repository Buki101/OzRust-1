const form = document.getElementById('signinForm');
const statusEl = document.getElementById('signinStatus');

const params = new URLSearchParams(window.location.search);
const nextPath = params.get('next') || '/';

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  statusEl.classList.remove('success');
  statusEl.textContent = 'Signing in...';

  const formData = new FormData(form);
  const body = {
    username: String(formData.get('username') || '').trim(),
    password: String(formData.get('password') || '')
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
    window.location.href = nextPath;
  } catch (error) {
    statusEl.textContent = error.message || 'Sign in failed.';
  }
});
