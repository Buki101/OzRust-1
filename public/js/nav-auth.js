const authNavLink = document.getElementById('authNavLink');

async function hydrateAuthNav() {
  if (!authNavLink) return;

  try {
    const response = await fetch('/api/auth/session', {
      credentials: 'same-origin'
    });

    if (!response.ok) {
      return;
    }

    const payload = await response.json();
    if (!payload?.signedIn || !payload?.username) {
      return;
    }

    authNavLink.textContent = `G'day ${payload.username}`;
    authNavLink.href = '/';
  } catch (_error) {
    // Keep default Sign In CTA if session lookup fails.
  }
}

hydrateAuthNav();
