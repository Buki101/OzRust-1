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
  'ozrust-starter': {
    server: 'OzRust',
    title: 'OzRust Starter Kit Subscription',
    description: 'A balanced monthly kit for reliable early wipe progression and smooth base setup.',
    price: '$19/mo',
    image: 'https://images.unsplash.com/photo-1533130061792-64b345e4a833?auto=format&fit=crop&w=1200&q=80',
    includes: ['Metal tools starter loadout', 'Building resource bundle', 'Protection consumables', 'Queue priority during peak hours']
  },
  'ozrust-raider': {
    server: 'OzRust',
    title: 'OzRust Raider Kit Subscription',
    description: 'Built for aggressive teams that need fast access to raid-ready progression every month.',
    price: '$29/mo',
    image: 'https://images.unsplash.com/photo-1517976487492-576ea6b2936d?auto=format&fit=crop&w=1200&q=80',
    includes: ['Explosives progression package', 'Advanced armor set', 'Weapon utility cache', 'Raid support crate each cycle']
  },
  'rustygoose-survivor': {
    server: 'RustyGoose',
    title: 'RustyGoose Survivor Kit Subscription',
    description: 'A dependable monthly plan for solo and duo players focused on survival consistency.',
    price: '$24/mo',
    image: 'https://images.unsplash.com/photo-1508179522353-11ba468c4a1c?auto=format&fit=crop&w=1200&q=80',
    includes: ['Solo/duo weapon bundle', 'Med and food supply pack', 'Base defense starter stack', 'Monthly utility refill']
  },
  'rustygoose-elite': {
    server: 'RustyGoose',
    title: 'RustyGoose Elite Kit Subscription',
    description: 'Top-tier monthly kit built for high-tempo clans and competitive wipe pushes.',
    price: '$49/mo',
    image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=1200&q=80',
    includes: ['Elite armor and utility gear', 'Premium explosives allocation', 'Endgame ammo and meds', 'Priority support fulfilment']
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

addToCartBtn.addEventListener('click', () => {
  addToCartBtn.textContent = 'Added to cart';
  addToCartBtn.disabled = true;
});

const kit = kits[getKitId()];
if (!kit) {
  statusEl.textContent = 'Subscription not found.';
} else {
  renderKit(kit);
}
