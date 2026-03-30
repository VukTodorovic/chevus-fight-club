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
    id: 'katolik',
    name: 'KATOLIK',
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
  {
    id: 'lale',
    name: 'LALE',
    skinColor: '#d4a574',
    shirtColor: '#9922cc',
    pantsColor: '#331144',
    hairColor: '#220044',
    speed: 7,
    power: 6,
    defense: 5,
    punchDamage: 10,
    kickDamage: 13,
    punchRange: 57,
    kickRange: 72,
    bodyWidth: 37,
    bodyHeight: 87,
  },
  {
    id: 'haki',
    name: 'HAKI',
    skinColor: '#c49a6c',
    shirtColor: '#556b2f',
    pantsColor: '#2e3b1f',
    hairColor: '#1a1a1a',
    speed: 6,
    power: 8,
    defense: 7,
    punchDamage: 13,
    kickDamage: 16,
    punchRange: 62,
    kickRange: 76,
    bodyWidth: 42,
    bodyHeight: 91,
  },
  {
    id: 'tomislav',
    name: 'TOMISLAV',
    skinColor: '#f0c8a0',
    shirtColor: '#cc0000',
    pantsColor: '#1a1a2e',
    hairColor: '#554433',
    speed: 4,
    power: 9,
    defense: 8,
    punchDamage: 14,
    kickDamage: 18,
    punchRange: 63,
    kickRange: 78,
    bodyWidth: 46,
    bodyHeight: 93,
  },
  {
    id: 'klaja',
    name: 'KLAJA',
    skinColor: '#e8c4a0',
    shirtColor: '#ff8800',
    pantsColor: '#443300',
    hairColor: '#ffcc00',
    speed: 9,
    power: 4,
    defense: 5,
    punchDamage: 8,
    kickDamage: 11,
    punchRange: 55,
    kickRange: 70,
    bodyWidth: 34,
    bodyHeight: 84,
  },
  {
    id: 'milanchik',
    name: 'MILANCHIK',
    skinColor: '#f5deb3',
    shirtColor: '#1a1a1a',
    pantsColor: '#0a0a0a',
    hairColor: '#333333',
    speed: 5,
    power: 7,
    defense: 8,
    punchDamage: 12,
    kickDamage: 15,
    punchRange: 60,
    kickRange: 74,
    bodyWidth: 41,
    bodyHeight: 90,
  },
  {
    id: 'nile',
    name: 'NILE',
    skinColor: '#b5651d',
    shirtColor: '#0066aa',
    pantsColor: '#002244',
    hairColor: '#0a0a0a',
    speed: 8,
    power: 6,
    defense: 4,
    punchDamage: 9,
    kickDamage: 12,
    punchRange: 56,
    kickRange: 71,
    bodyWidth: 36,
    bodyHeight: 86,
  },
  {
    id: 'pepsi',
    name: 'PEPSI',
    skinColor: '#ffe4c4',
    shirtColor: '#0044cc',
    pantsColor: '#cc0000',
    hairColor: '#8b4513',
    speed: 7,
    power: 5,
    defense: 6,
    punchDamage: 9,
    kickDamage: 12,
    punchRange: 57,
    kickRange: 71,
    bodyWidth: 37,
    bodyHeight: 86,
  },
  {
    id: 'boki',
    name: 'BOKI',
    skinColor: '#deb887',
    shirtColor: '#228b22',
    pantsColor: '#1a3a1a',
    hairColor: '#2f1a0a',
    speed: 6,
    power: 7,
    defense: 7,
    punchDamage: 11,
    kickDamage: 14,
    punchRange: 59,
    kickRange: 73,
    bodyWidth: 40,
    bodyHeight: 89,
  },
  {
    id: 'ogac',
    name: 'OGAC',
    skinColor: '#d2a679',
    shirtColor: '#8b0000',
    pantsColor: '#2a0a0a',
    hairColor: '#660000',
    speed: 4,
    power: 10,
    defense: 6,
    punchDamage: 15,
    kickDamage: 19,
    punchRange: 64,
    kickRange: 79,
    bodyWidth: 48,
    bodyHeight: 94,
  },
  {
    id: 'zhex',
    name: 'ZHEX',
    skinColor: '#c9a882',
    shirtColor: '#4400aa',
    pantsColor: '#220055',
    hairColor: '#cc00ff',
    speed: 10,
    power: 4,
    defense: 3,
    punchDamage: 7,
    kickDamage: 10,
    punchRange: 54,
    kickRange: 69,
    bodyWidth: 33,
    bodyHeight: 83,
  },
  {
    id: 'shareni',
    name: 'SHARENI',
    skinColor: '#e0b090',
    shirtColor: '#ff4488',
    pantsColor: '#44ff88',
    hairColor: '#ff8844',
    speed: 7,
    power: 6,
    defense: 5,
    punchDamage: 10,
    kickDamage: 13,
    punchRange: 58,
    kickRange: 72,
    bodyWidth: 38,
    bodyHeight: 87,
  },
  {
    id: 'kula',
    name: 'KULA',
    skinColor: '#f0d0b0',
    shirtColor: '#00aacc',
    pantsColor: '#004455',
    hairColor: '#003344',
    speed: 5,
    power: 8,
    defense: 7,
    punchDamage: 13,
    kickDamage: 16,
    punchRange: 61,
    kickRange: 76,
    bodyWidth: 43,
    bodyHeight: 92,
  },
  {
    id: 'mrcon',
    name: 'MRCON',
    skinColor: '#a07050',
    shirtColor: '#555555',
    pantsColor: '#333333',
    hairColor: '#222222',
    speed: 3,
    power: 10,
    defense: 9,
    punchDamage: 16,
    kickDamage: 20,
    punchRange: 65,
    kickRange: 80,
    bodyWidth: 50,
    bodyHeight: 96,
  },
  {
    id: 'ankara',
    name: 'ANKARA',
    skinColor: '#d4a06a',
    shirtColor: '#cc4400',
    pantsColor: '#442200',
    hairColor: '#1a0a00',
    speed: 6,
    power: 7,
    defense: 6,
    punchDamage: 11,
    kickDamage: 14,
    punchRange: 59,
    kickRange: 74,
    bodyWidth: 39,
    bodyHeight: 88,
  },
  {
    id: 'gishka',
    name: 'GISHKA',
    skinColor: '#f5e0c8',
    shirtColor: '#aa8800',
    pantsColor: '#554400',
    hairColor: '#ffdd00',
    speed: 8,
    power: 5,
    defense: 5,
    punchDamage: 9,
    kickDamage: 12,
    punchRange: 56,
    kickRange: 71,
    bodyWidth: 36,
    bodyHeight: 85,
  },
  {
    id: 'kokica',
    name: 'KOKICA',
    skinColor: '#f0d8c0',
    shirtColor: '#dd2266',
    pantsColor: '#441133',
    hairColor: '#ffaacc',
    speed: 7,
    power: 6,
    defense: 6,
    punchDamage: 10,
    kickDamage: 13,
    punchRange: 57,
    kickRange: 72,
    bodyWidth: 37,
    bodyHeight: 86,
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
