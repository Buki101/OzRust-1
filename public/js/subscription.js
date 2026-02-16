const statusEl = document.getElementById('subscriptionStatus');
const shell = document.getElementById('subscriptionShell');
const kitImage = document.getElementById('kitImage');
const kitServer = document.getElementById('kitServer');
const kitTitle = document.getElementById('kitTitle');
const kitDescription = document.getElementById('kitDescription');
const kitPrice = document.getElementById('kitPrice');
const kitIncludes = document.getElementById('kitIncludes');
const addToCartBtn = document.getElementById('addToCartBtn');

const kits = {
  'ozrust-quarry': {
    server: 'OzRust',
    title: 'Quarry Kit',
    description: 'Reliable entry tier with the essentials for quick progression and cleaner early-game momentum.',
    price: '8.00 USD',
    image: 'https://images.unsplash.com/photo-1517976487492-576ea6b2936d?auto=format&fit=crop&w=1200&q=80',
    includes: ['Starter weapon bundle', 'Basic armor and meds', 'Early wipe farming stack', 'Quick deploy resources']
  },
  'ozrust-crocodile': {
    server: 'OzRust',
    title: 'Crocodile Kit',
    description: 'A stronger all-rounder kit for players who want a confident advantage going into contested zones.',
    price: '20.00 USD',
    image: 'https://images.unsplash.com/photo-1533130061792-64b345e4a833?auto=format&fit=crop&w=1200&q=80',
    includes: ['Mid-tier combat loadout', 'Improved armor setup', 'Raid utility starter pack', 'Expanded ammo allocation']
  },
  'ozrust-shark': {
    server: 'OzRust',
    title: 'Shark Kit',
    description: 'Aggressive combat-focused kit for players pushing monuments and high-pressure fights.',
    price: '15.00 USD',
    image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=1200&q=80',
    includes: ['PvP-oriented weapon set', 'Advanced healing supplies', 'Explosive support items', 'Mobility-focused utility']
  },
  'ozrust-wallaby': {
    server: 'OzRust',
    title: 'Wallaby Kit',
    description: 'Balanced utility kit designed for dependable roaming, farming, and base sustain.',
    price: '10.00 USD',
    image: 'https://images.unsplash.com/photo-1508179522353-11ba468c4a1c?auto=format&fit=crop&w=1200&q=80',
    includes: ['Roaming weapon tools', 'Resource and component bundle', 'Base defense essentials', 'Stacked med supplies']
  },
  'ozrust-bilby': {
    server: 'OzRust',
    title: 'Bilby Kit',
    description: 'Budget-friendly starter option for fast reset recovery and low-risk gameplay loops.',
    price: '5.00 USD',
    image: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1200&q=80',
    includes: ['Starter tools and meds', 'Basic base materials', 'Food and utility items', 'Low-cost combat backup']
  }
};

function getKitId() {
  const parts = window.location.pathname.split('/').filter(Boolean);
  return parts[parts.length - 1];
}

function renderKit(kit) {
  kitImage.src = kit.image;
  kitImage.alt = kit.title;
  kitServer.textContent = kit.server;
  kitTitle.textContent = kit.title;
  kitDescription.textContent = kit.description;
  kitPrice.textContent = kit.price;

  kitIncludes.innerHTML = '';
  kit.includes.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = item;
    kitIncludes.appendChild(li);
  });

  statusEl.textContent = '';
  shell.hidden = false;
}

addToCartBtn.addEventListener('click', async () => {
  addToCartBtn.disabled = true;
  addToCartBtn.textContent = 'Checking sign in...';

  try {
    const response = await fetch('/api/auth/session', { credentials: 'same-origin' });
    const payload = await response.json().catch(() => ({}));

    if (!response.ok || !payload.signedIn) {
      const next = encodeURIComponent(window.location.pathname + window.location.search);
      window.location.href = `/signin?next=${next}`;
      return;
    }

    addToCartBtn.textContent = 'Added to cart';
  } catch (_error) {
    addToCartBtn.textContent = 'Sign in required';
    addToCartBtn.disabled = false;
  }
});

const kit = kits[getKitId()];
if (!kit) {
  statusEl.textContent = 'Kit not found.';
} else {
  renderKit(kit);
}
