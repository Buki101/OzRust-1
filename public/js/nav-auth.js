const authNavLink = document.getElementById('authNavLink');
const AUTH_USERNAME_KEY = 'ozrust_auth_username';

function renderSignedOutNav() {
  authNavLink.textContent = 'Sign In';
  authNavLink.href = '/signin';
}

function renderSignedInNav(username) {
  authNavLink.textContent = `G'day ${username}`;
  authNavLink.href = '/';
}

async function hydrateAuthNav() {
  if (!authNavLink) return;

  try {
    const cachedUsername = localStorage.getItem(AUTH_USERNAME_KEY);
    if (cachedUsername) {
      renderSignedInNav(cachedUsername);
    }
  } catch (_error) {
    // Ignore local storage failures and continue session hydration.
  }

  try {
    const response = await fetch('/api/auth/session', {
      credentials: 'same-origin'
    });

    if (!response.ok) {
      renderSignedOutNav();
      return;
    }

    const payload = await response.json();
    if (!payload?.signedIn || !payload?.username) {
      try {
        localStorage.removeItem(AUTH_USERNAME_KEY);
      } catch (_error) {
        // Ignore local storage failures and continue with signed-out nav.
      }
      renderSignedOutNav();
      return;
    }

    renderSignedInNav(payload.username);
    try {
      localStorage.setItem(AUTH_USERNAME_KEY, payload.username);
    } catch (_error) {
      // Ignore local storage failures and keep hydrated nav state.
    }
  } catch (_error) {
    // Keep cached state if available. Otherwise use signed-out CTA.
    if (authNavLink.textContent.trim().toLowerCase() === 'sign in') {
      renderSignedOutNav();
    }
  }
}

hydrateAuthNav();
