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
    description: 'Utility-focused kit that grants passive resource production value for your wipe progression.',
    price: '8.00 USD',
    image: 'https://images.unsplash.com/photo-1517976487492-576ea6b2936d?auto=format&fit=crop&w=1200&q=80',
    includes: ['A Mining Quarry and Pumpjack on OzRust']
  },
  'ozrust-crocodile': {
    server: 'OzRust',
    title: 'Crocodile Kit',
    description: 'Premium mid-tier combat kit tuned for fast progression and strong roam/defense utility.',
    price: '20.00 USD',
    image: 'https://images.unsplash.com/photo-1533130061792-64b345e4a833?auto=format&fit=crop&w=1200&q=80',
    includes: [
      'Full Metal Armor',
      'AK / SAP / Pump Action loadout',
      '400 5.56 Rifle Ammo',
      '100 Pistol Ammo',
      '50 Buckshot',
      '5 Croc Meat',
      '50 Blueberries',
      '5 Medical Syringes',
      '5 Bandages',
      'Large Billboards Max 3x3',
      '10 Homes',
      '10 Second teleport',
      '7 Backpack Rows',
      'Workbench Covers Your Entire Base',
      'Instant Mixing Table',
      'Quick Sort For Boxes',
      'Spawn a MiniCopter',
      'Call a Helicopter',
      'Sign Artist',
      'Craft a Lock-On Rocket'
    ]
  },
  'ozrust-shark': {
    server: 'OzRust',
    title: 'Shark Kit',
    description: 'Combat-forward kit built around reliable mid-tier gunplay and strong utility perks.',
    price: '15.00 USD',
    image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=1200&q=80',
    includes: [
      'Road Sign Armor',
      'Semi-Automatic Rifle',
      '300 5.56 Rifle Ammo',
      '5 Croc Meat',
      '50 Blueberries',
      '5 Medical Syringes',
      '5 Bandages',
      'Large Billboards Max 3x3',
      '10 Homes',
      '10 Second teleport',
      '6 Backpack Rows',
      'Workbench Covers Your Entire Base',
      'Instant Mixing Table',
      'Quick Sort For Boxes',
      'Spawn a MiniCopter',
      'Call a Helicopter',
      'Sign Artist',
      'Craft a Lock-On Rocket'
    ]
  },
  'ozrust-wallaby': {
    server: 'OzRust',
    title: 'Wallaby Kit',
    description: 'Affordable balanced kit with strong utility perks and dependable close-range combat gear.',
    price: '10.00 USD',
    image: 'https://images.unsplash.com/photo-1508179522353-11ba468c4a1c?auto=format&fit=crop&w=1200&q=80',
    includes: [
      'Hide Armor',
      'Thompson SMG',
      '400 Pistol Ammo',
      '5 Croc Meat',
      '50 Blueberries',
      '5 Medical Syringes',
      '5 Bandages',
      'Large Billboards Max 3x3',
      '8 Homes',
      '10 Second teleport',
      '6 Backpack Rows',
      'Workbench Covers Your Entire Base',
      'Instant Mixing Table',
      'Quick Sort For Boxes',
      'Spawn a MiniCopter',
      'Call a Helicopter',
      'Sign Artist',
      'Craft a Lock-On Rocket'
    ]
  },

  'rustygoose-chad': {
    server: 'RustyGoose',
    title: 'Chad Kit',
    description: 'High-tier RustyGoose loadout for dominant roaming and strong monument pressure.',
    price: '30.00 USD',
    image: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=1200&q=80',
    includes: ['Premium weapon package', 'Advanced armor set', 'Explosives + utility stack', 'Large med and ammo reserve']
  },
  'rustygoose-roam': {
    server: 'RustyGoose',
    title: 'Roam Kit',
    description: 'Balanced roaming kit built for consistent PVP/PVE fights across the map.',
    price: '15.00 USD',
    image: 'https://images.unsplash.com/photo-1601758260892-ae5f83368a3f?auto=format&fit=crop&w=1200&q=80',
    includes: ['Roam-ready weapon setup', 'Reliable armor and meds', 'Travel utility gear', 'Resource top-up bundle']
  },
  'rustygoose-grub': {
    server: 'RustyGoose',
    title: 'The Grub',
    description: 'Low-cost starter option perfect for resets, snowballs, and budget runs.',
    price: '5.00 USD',
    image: 'https://images.unsplash.com/photo-1563298723-dcfebaa392e3?auto=format&fit=crop&w=1200&q=80',
    includes: ['Budget weapon + tools', 'Starter meds and food', 'Light utility gear', 'Quick recovery materials']
  },
  'ozrust-bilby': {
    server: 'OzRust',
    title: 'Bilby Kit',
    description: 'Entry-level budget kit focused on quick recovery, close-range fights, and core utility perks.',
    price: '5.00 USD',
    image: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1200&q=80',
    includes: [
      'Hazzy',
      'Hand Made SMG',
      '200 Pistol Ammo',
      '5 Croc Meat',
      '50 Blueberries',
      '5 Medical Syringes',
      '5 Bandages',
      'Large Billboards Max 3x3',
      '8 Homes',
      '10 Second teleport',
      '6 Backpack Rows',
      'Workbench Covers Your Entire Base',
      'Instant Mixing Table',
      'Quick Sort For Boxes',
      'Spawn a MiniCopter',
      'Call a Helicopter',
      'Sign Artist',
      'Craft a Lock-On Rocket'
    ]
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
