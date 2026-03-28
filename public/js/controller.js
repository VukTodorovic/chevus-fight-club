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
  // Try to reconnect
  setTimeout(() => location.reload(), 3000);
};

ws.onerror = () => {
  statusEl.textContent = 'ERROR';
  statusEl.classList.remove('connected');
};

ws.onmessage = (event) => {
  const msg = JSON.parse(event.data);

  switch (msg.type) {
    case 'fight_started':
      showScreen('fight-screen');
      break;
    case 'match_end':
      const endMsg = document.getElementById('end-message');
      endMsg.textContent = msg.winner === playerId ? 'YOU WIN!' : 'YOU LOSE!';
      endMsg.style.color = msg.winner === playerId ? '#00cc44' : '#ff3333';
      showScreen('end-screen');
      break;
    case 'fighter_selected':
      // Update selection from game screen
      if (msg.player === playerId) {
        highlightFighter(msg.fighterId);
      }
      break;
    case 'map_selected':
      highlightMap(msg.mapId);
      break;
  }
};

function send(data) {
  if (ws.readyState === 1) {
    ws.send(JSON.stringify(data));
  }
}

// === SCREEN MANAGEMENT ===
function showScreen(screenId) {
  document.querySelectorAll('.ctrl-screen').forEach(s => s.classList.add('hidden'));
  document.getElementById(screenId).classList.remove('hidden');
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
        highlightFighter(fighter.id);
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

function highlightFighter(fighterId) {
  document.querySelectorAll('.mobile-fighter-card').forEach(c => {
    c.classList.toggle('selected', c.dataset.fighterId === fighterId);
  });
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
  showScreen('waiting-screen');
});

// === FIGHT CONTROLS ===

// Track active touches per button
const activeInputs = new Set();

function handleButtonPress(input) {
  if (!activeInputs.has(input)) {
    activeInputs.add(input);
    send({ type: 'input', input, pressed: true });
  }
}

function handleButtonRelease(input) {
  if (activeInputs.has(input)) {
    activeInputs.delete(input);
    send({ type: 'input', input, pressed: false });
  }
}

// Setup touch handlers for all buttons
function setupButtons() {
  const buttons = document.querySelectorAll('[data-input]');

  buttons.forEach(btn => {
    const input = btn.dataset.input;

    // Touch events
    btn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      btn.classList.add('pressed');
      handleButtonPress(input);
    }, { passive: false });

    btn.addEventListener('touchend', (e) => {
      e.preventDefault();
      btn.classList.remove('pressed');
      handleButtonRelease(input);
    }, { passive: false });

    btn.addEventListener('touchcancel', (e) => {
      btn.classList.remove('pressed');
      handleButtonRelease(input);
    });

    // Mouse fallback for desktop testing
    btn.addEventListener('mousedown', (e) => {
      e.preventDefault();
      btn.classList.add('pressed');
      handleButtonPress(input);
    });

    btn.addEventListener('mouseup', (e) => {
      btn.classList.remove('pressed');
      handleButtonRelease(input);
    });

    btn.addEventListener('mouseleave', () => {
      btn.classList.remove('pressed');
      handleButtonRelease(input);
    });
  });
}

// Release all inputs when page loses focus
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    activeInputs.forEach(input => {
      send({ type: 'input', input, pressed: false });
    });
    activeInputs.clear();
    document.querySelectorAll('.pressed').forEach(el => el.classList.remove('pressed'));
  }
});

// Prevent context menu on long press
document.addEventListener('contextmenu', e => e.preventDefault());

// Prevent pull-to-refresh and scroll
document.addEventListener('touchmove', e => e.preventDefault(), { passive: false });

// Init
initMobileSelect();
setupButtons();
