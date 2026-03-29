// Fighter definitions
// To customize a fighter's head, place an image in /assets/heads/<fighterId>.png
// e.g., /assets/heads/chevu.png — the image will be drawn as the fighter's head

const FIGHTERS = [
  {
    id: 'chevu',
    name: 'CHEVU',
    // Body color scheme
    skinColor: '#e8b88a',
    shirtColor: '#cc2222',
    pantsColor: '#333366',
    hairColor: '#332211',
    // Stats (out of 10)
    speed: 5,
    power: 8,
    defense: 7,
    // Attack properties
    punchDamage: 12,
    kickDamage: 15,
    punchRange: 60,
    kickRange: 75,
    // Size
    bodyWidth: 40,
    bodyHeight: 90,
  },
  {
    id: 'jani',
    name: 'JANI',
    skinColor: '#c68642',
    shirtColor: '#2266cc',
    pantsColor: '#222244',
    hairColor: '#111111',
    speed: 9,
    power: 5,
    defense: 4,
    punchDamage: 8,
    kickDamage: 10,
    punchRange: 55,
    kickRange: 70,
    bodyWidth: 35,
    bodyHeight: 85,
  },
  {
    id: 'majami',
    name: 'MAJAMI',
    skinColor: '#f5d0a9',
    shirtColor: '#446622',
    pantsColor: '#443322',
    hairColor: '#cc8833',
    speed: 3,
    power: 10,
    defense: 9,
    punchDamage: 16,
    kickDamage: 20,
    punchRange: 65,
    kickRange: 80,
    bodyWidth: 50,
    bodyHeight: 95,
  },
  {
    id: 'box',
    name: 'BOX',
    skinColor: '#8d5524',
    shirtColor: '#222222',
    pantsColor: '#111111',
    hairColor: '#000000',
    speed: 8,
    power: 7,
    defense: 5,
    punchDamage: 10,
    kickDamage: 14,
    punchRange: 58,
    kickRange: 72,
    bodyWidth: 38,
    bodyHeight: 88,
  },
  {
    id: 'shandu',
    name: 'SHANDU',
    skinColor: '#ffe0bd',
    shirtColor: '#ff6600',
    pantsColor: '#442200',
    hairColor: '#ff3300',
    speed: 7,
    power: 6,
    defense: 6,
    punchDamage: 11,
    kickDamage: 13,
    punchRange: 58,
    kickRange: 73,
    bodyWidth: 38,
    bodyHeight: 87,
  },
  {
    id: 'balkanac',
    name: 'BALKANAC',
    skinColor: '#ffe0e0',
    shirtColor: '#4488cc',
    pantsColor: '#223355',
    hairColor: '#aaccff',
    speed: 6,
    power: 7,
    defense: 6,
    punchDamage: 11,
    kickDamage: 14,
    punchRange: 60,
    kickRange: 74,
    bodyWidth: 39,
    bodyHeight: 89,
  },
];

// Head image cache
const headImages = {};

function loadHeadImage(fighterId) {
  return new Promise((resolve) => {
    if (headImages[fighterId] !== undefined) {
      resolve(headImages[fighterId]);
      return;
    }
    const img = new Image();
    img.onload = () => {
      headImages[fighterId] = img;
      resolve(img);
    };
    img.onerror = () => {
      headImages[fighterId] = null;
      resolve(null);
    };
    img.src = `/assets/heads/${fighterId}.png`;
  });
}

// Preload all head images
function preloadHeadImages() {
  return Promise.all(FIGHTERS.map(f => loadHeadImage(f.id)));
}

// Draw a fighter portrait for select screen
function drawFighterPortrait(canvas, fighter) {
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  // Background
  ctx.fillStyle = '#0d0d1a';
  ctx.fillRect(0, 0, w, h);

  const cx = w / 2;
  const cy = h * 0.55;

  // Body
  ctx.fillStyle = fighter.shirtColor;
  ctx.fillRect(cx - 18, cy - 5, 36, 35);

  // Head
  const headImg = headImages[fighter.id];
  const headSize = 46;
  if (headImg) {
    ctx.drawImage(headImg, cx - headSize / 2, cy - 22 - headSize / 2, headSize, headSize);
  } else {
    // Default head
    ctx.fillStyle = fighter.skinColor;
    ctx.beginPath();
    ctx.arc(cx, cy - 22, 18, 0, Math.PI * 2);
    ctx.fill();
    // Hair
    ctx.fillStyle = fighter.hairColor;
    ctx.beginPath();
    ctx.arc(cx, cy - 30, 16, Math.PI, 0);
    ctx.fill();
  }

  // Pants
  ctx.fillStyle = fighter.pantsColor;
  ctx.fillRect(cx - 16, cy + 30, 14, 20);
  ctx.fillRect(cx + 2, cy + 30, 14, 20);
}
