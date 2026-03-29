// Controller page - handles mobile input and sends to game via WebSocket

// Get player ID from URL
const pathParts = window.location.pathname.split('/');
const playerId = parseInt(pathParts[pathParts.length - 1]);

if (playerId !== 1 && playerId !== 2) {
  document.body.innerHTML = '<h1 style="color:red;text-align:center;margin-top:40vh">Invalid player ID. Use /game/controller/1 or /game/controller/2</h1>';
}

// Set player label
const playerLabel = document.getElementById('player-label');
playerLabel.textContent = `PLAYER ${playerId}`;
playerLabel.classList.add(playerId === 1 ? 'p1-color' : 'p2-color');

const fightLabel = document.getElementById('fight-p-label');
fightLabel.textContent = `P${playerId}`;
fightLabel.classList.add(playerId === 1 ? 'p1-color' : 'p2-color');

// WebSocket
const wsProtocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
const ws = new WebSocket(`${wsProtocol}//${location.host}?role=controller&player=${playerId}`);

const statusEl = document.getElementById('conn-status');

ws.onopen = () => {
  statusEl.textContent = 'CONNECTED';
  statusEl.classList.add('connected');
};

ws.onclose = () => {
  statusEl.textContent = 'DISCONNECTED';
  statusEl.classList.remove('connected');
  setTimeout(() => location.reload(), 3000);
};

ws.onerror = () => {
  statusEl.textContent = 'ERROR';
  statusEl.classList.remove('connected');
};

ws.onmessage = (event) => {
  const msg = JSON.parse(event.data);

  switch (msg.type) {
    case 'state_sync':
      handleStateSync(msg);
      break;

    case 'fight_started':
      showScreen('fight-screen');
      document.getElementById('ctrl-pause-overlay').classList.add('hidden');
      break;

    case 'match_end': {
      const endMsg = document.getElementById('end-message');
      endMsg.textContent = msg.winner === playerId ? 'YOU WIN!' : 'YOU LOSE!';
      endMsg.style.color = msg.winner === playerId ? '#00cc44' : '#ff3333';
      showScreen('end-screen');
      document.getElementById('ctrl-pause-overlay').classList.add('hidden');
      break;
    }

    case 'select_fighter':
      highlightFighter(msg.fighterId, msg.player);
      break;

    case 'select_map':
      highlightMap(msg.mapId);
      break;

    case 'paused':
      document.getElementById('ctrl-pause-overlay').classList.remove('hidden');
      break;

    case 'resumed':
      document.getElementById('ctrl-pause-overlay').classList.add('hidden');
      break;

    case 'rematch':
      showScreen('waiting-screen');
      document.getElementById('ctrl-pause-overlay').classList.add('hidden');
      clearSelections();
      break;
  }
};

function send(data) {
  if (ws.readyState === 1) {
    ws.send(JSON.stringify(data));
  }
}

// === STATE SYNC ===
function handleStateSync(state) {
  // Restore selections
  if (state.fighters[1]) highlightFighter(state.fighters[1], 1);
  if (state.fighters[2]) highlightFighter(state.fighters[2], 2);
  if (state.map) highlightMap(state.map);

  // Restore phase
  if (state.phase === 'fighting') {
    showScreen('fight-screen');
  } else if (state.phase === 'paused') {
    showScreen('fight-screen');
    document.getElementById('ctrl-pause-overlay').classList.remove('hidden');
  } else if (state.phase === 'matchEnd') {
    const endMsg = document.getElementById('end-message');
    endMsg.textContent = state.winner === playerId ? 'YOU WIN!' : 'YOU LOSE!';
    endMsg.style.color = state.winner === playerId ? '#00cc44' : '#ff3333';
    showScreen('end-screen');
  } else {
    showScreen('waiting-screen');
  }
}

// === SCREEN MANAGEMENT ===
function showScreen(screenId) {
  document.querySelectorAll('.ctrl-screen').forEach(s => s.classList.add('hidden'));
  document.getElementById(screenId).classList.remove('hidden');
}

function clearSelections() {
  document.querySelectorAll('.mobile-fighter-card').forEach(c => c.classList.remove('selected'));
  document.querySelectorAll('.mobile-map-card').forEach(c => c.classList.remove('selected'));
}

// === FIGHTER/MAP SELECTION ===
function initMobileSelect() {
  preloadHeadImages().then(() => {
    const grid = document.getElementById('mobile-fighter-grid');
    grid.innerHTML = '';

    FIGHTERS.forEach(fighter => {
      const card = document.createElement('div');
      card.className = 'mobile-fighter-card';
      card.dataset.fighterId = fighter.id;

      const canvas = document.createElement('canvas');
      canvas.width = 100;
      canvas.height = 100;
      drawFighterPortrait(canvas, fighter);
      card.appendChild(canvas);

      const name = document.createElement('div');
      name.className = 'card-name';
      name.textContent = fighter.name;
      card.appendChild(name);

      card.addEventListener('click', () => {
        highlightFighter(fighter.id, playerId);
        send({ type: 'select_fighter', player: playerId, fighterId: fighter.id });
      });

      grid.appendChild(card);
    });

    // Maps
    const mapGrid = document.getElementById('mobile-map-grid');
    mapGrid.innerHTML = '';

    MAPS.forEach(map => {
      const card = document.createElement('div');
      card.className = 'mobile-map-card';
      card.dataset.mapId = map.id;

      const canvas = document.createElement('canvas');
      canvas.width = 200;
      canvas.height = 100;
      drawMapPreview(canvas, map);
      card.appendChild(canvas);

      const label = document.createElement('div');
      label.className = 'map-label';
      label.textContent = map.name;
      card.appendChild(label);

      card.addEventListener('click', () => {
        highlightMap(map.id);
        send({ type: 'select_map', mapId: map.id });
      });

      mapGrid.appendChild(card);
    });
  });
}

function highlightFighter(fighterId, forPlayer) {
  // Only highlight this player's own selection with the selected class
  // But we could show both - for now just highlight own selection
  if (forPlayer === playerId) {
    document.querySelectorAll('.mobile-fighter-card').forEach(c => {
      c.classList.toggle('selected', c.dataset.fighterId === fighterId);
    });
  }
}

function highlightMap(mapId) {
  document.querySelectorAll('.mobile-map-card').forEach(c => {
    c.classList.toggle('selected', c.dataset.mapId === mapId);
  });
}

// Fight button
document.getElementById('mobile-fight-btn').addEventListener('click', () => {
  send({ type: 'start_fight' });
});

// Rematch button
document.getElementById('rematch-btn').addEventListener('click', () => {
  send({ type: 'rematch' });
});

// === PAUSE ===

function addTouchClick(el, handler) {
  el.addEventListener('click', handler);
  el.addEventListener('touchend', (e) => {
    e.preventDefault();
    e.stopPropagation();
    handler();
  }, { passive: false });
}

addTouchClick(document.getElementById('ctrl-pause-btn'), () => {
  send({ type: 'pause' });
});

addTouchClick(document.getElementById('ctrl-resume-btn'), () => {
  send({ type: 'resume' });
});

addTouchClick(document.getElementById('ctrl-select-btn'), () => {
  send({ type: 'rematch' });
});

// === TAUNT ===
addTouchClick(document.getElementById('taunt-btn'), () => {
  send({ type: 'taunt', player: playerId });
});

// === FIGHT CONTROLS ===

// Track which inputs each touch ID is currently pressing
const touchToInputs = new Map();  // touchId -> [input names]
const activeInputs = new Set();   // currently pressed input names
// Track mouse hold
let mouseHeldInputs = null;

// Expand combo inputs like "up+left" into ["up", "left"]
function expandInput(dataInput) {
  return dataInput.split('+');
}

function pressInputs(inputs) {
  for (const input of inputs) {
    if (!activeInputs.has(input)) {
      activeInputs.add(input);
      send({ type: 'input', input, pressed: true });
    }
  }
}

function releaseInputs(inputs) {
  for (const input of inputs) {
    // Only release if no other touch is still holding this input
    let stillHeld = false;
    for (const [, held] of touchToInputs) {
      if (held.includes(input)) { stillHeld = true; break; }
    }
    if (mouseHeldInputs && mouseHeldInputs.includes(input)) stillHeld = true;
    if (!stillHeld && activeInputs.has(input)) {
      activeInputs.delete(input);
      send({ type: 'input', input, pressed: false });
    }
  }
}

function getButtonFromPoint(x, y) {
  const el = document.elementFromPoint(x, y);
  if (!el) return null;
  const btn = el.closest('[data-input]');
  return btn;
}

// Collect all raw data-input values currently held by any touch/mouse
function getActiveRawInputs() {
  const raw = new Set();
  for (const [, inputs] of touchToInputs) {
    raw.add(inputs.join('+'));
  }
  if (mouseHeldInputs) raw.add(mouseHeldInputs.join('+'));
  return raw;
}

function updateButtonVisuals() {
  const activeRaw = getActiveRawInputs();
  // Build set of buttons that should highlight:
  // - the directly pressed button
  // - for diagonals, also highlight the individual direction buttons
  const highlightSet = new Set();
  for (const raw of activeRaw) {
    highlightSet.add(raw);
    if (raw.includes('+')) {
      for (const part of raw.split('+')) {
        highlightSet.add(part);
      }
    }
  }

  document.querySelectorAll('[data-input]').forEach(btn => {
    btn.classList.toggle('pressed', highlightSet.has(btn.dataset.input));
  });
}

// Use a single global touchstart/touchmove/touchend on the fight screen
function setupButtons() {
  const fightScreen = document.getElementById('fight-screen');

  fightScreen.addEventListener('touchstart', (e) => {
    // Let pause, taunt, and overlay buttons handle their own touch/click events
    const target = e.target.closest('.pause-ctrl-btn, .taunt-btn, .ctrl-overlay button');
    if (target) return;
    e.preventDefault();
    for (const touch of e.changedTouches) {
      const btn = getButtonFromPoint(touch.clientX, touch.clientY);
      if (btn) {
        const inputs = expandInput(btn.dataset.input);
        touchToInputs.set(touch.identifier, inputs);
        pressInputs(inputs);
      }
    }
    updateButtonVisuals();
  }, { passive: false });

  fightScreen.addEventListener('touchmove', (e) => {
    const target = e.target.closest('.pause-ctrl-btn, .taunt-btn, .ctrl-overlay button');
    if (target) return;
    e.preventDefault();
    for (const touch of e.changedTouches) {
      const btn = getButtonFromPoint(touch.clientX, touch.clientY);
      const newRaw = btn ? btn.dataset.input : null;
      const oldInputs = touchToInputs.get(touch.identifier) || null;
      const oldRaw = oldInputs ? oldInputs.join('+') : null;

      if (oldRaw !== newRaw) {
        if (oldInputs) {
          touchToInputs.delete(touch.identifier);
          releaseInputs(oldInputs);
        }
        if (newRaw) {
          const newInputs = expandInput(newRaw);
          touchToInputs.set(touch.identifier, newInputs);
          pressInputs(newInputs);
        }
      }
    }
    updateButtonVisuals();
  }, { passive: false });

  const handleTouchEnd = (e) => {
    const target = e.target.closest('.pause-ctrl-btn, .taunt-btn, .ctrl-overlay button');
    if (target) return;
    e.preventDefault();
    for (const touch of e.changedTouches) {
      const inputs = touchToInputs.get(touch.identifier);
      if (inputs) {
        touchToInputs.delete(touch.identifier);
        releaseInputs(inputs);
      }
    }
    updateButtonVisuals();
  };

  fightScreen.addEventListener('touchend', handleTouchEnd, { passive: false });
  fightScreen.addEventListener('touchcancel', handleTouchEnd, { passive: false });

  // Mouse fallback for desktop testing
  fightScreen.addEventListener('mousedown', (e) => {
    e.preventDefault();
    const btn = getButtonFromPoint(e.clientX, e.clientY);
    if (btn) {
      mouseHeldInputs = expandInput(btn.dataset.input);
      pressInputs(mouseHeldInputs);
      updateButtonVisuals();
    }
  });

  document.addEventListener('mousemove', (e) => {
    if (mouseHeldInputs === null) return;
    const btn = getButtonFromPoint(e.clientX, e.clientY);
    const newRaw = btn ? btn.dataset.input : null;
    const oldRaw = mouseHeldInputs.join('+');
    if (newRaw !== oldRaw) {
      const old = mouseHeldInputs;
      mouseHeldInputs = newRaw ? expandInput(newRaw) : null;
      releaseInputs(old);
      if (mouseHeldInputs) pressInputs(mouseHeldInputs);
      updateButtonVisuals();
    }
  });

  document.addEventListener('mouseup', () => {
    if (mouseHeldInputs !== null) {
      const old = mouseHeldInputs;
      mouseHeldInputs = null;
      releaseInputs(old);
      updateButtonVisuals();
    }
  });
}

// Release all inputs when page loses focus
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    activeInputs.forEach(input => {
      send({ type: 'input', input, pressed: false });
    });
    activeInputs.clear();
    touchToInputs.clear();
    mouseHeldInputs = null;
    updateButtonVisuals();
  }
});

// Prevent context menu on long press
document.addEventListener('contextmenu', e => e.preventDefault());

// Prevent pull-to-refresh and scroll on fight screen only
// (allow scrolling on waiting/select screens for map carousel)
document.getElementById('fight-screen').addEventListener('touchmove', e => {
  if (!e.target.closest('.pause-ctrl-btn, .taunt-btn, .ctrl-overlay button')) e.preventDefault();
}, { passive: false });

// Init
initMobileSelect();
setupButtons();
