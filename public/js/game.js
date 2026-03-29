// Game page - handles selection screen, WebSocket, and game initialization

let engine = null;
let selectedFighters = { 1: null, 2: null };
let selectedMap = null;
let controllersConnected = { 1: false, 2: false };

// WebSocket connection
const wsProtocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
const ws = new WebSocket(`${wsProtocol}//${location.host}?role=game`);
window.gameWs = ws;

ws.onopen = () => {
  console.log('Game connected to server');
};

ws.onmessage = (event) => {
  const msg = JSON.parse(event.data);

  switch (msg.type) {
    case 'state_sync':
      handleStateSync(msg);
      break;

    case 'controller_connected':
      controllersConnected[msg.player] = true;
      updateControllerStatus(msg.player, true);
      break;

    case 'controller_disconnected':
      controllersConnected[msg.player] = false;
      updateControllerStatus(msg.player, false);
      break;

    case 'input':
      if (engine && engine.gameState !== 'paused') {
        engine.handleInput(msg.player, msg.input, msg.pressed);
      }
      break;

    case 'select_fighter':
      selectFighter(msg.player, msg.fighterId, true);
      break;

    case 'select_map':
      selectMap(msg.mapId, true);
      break;

    case 'start_fight':
    case 'fight_started':
      startFight(true);
      break;

    case 'rematch':
      showSelectScreen(true);
      break;

    case 'paused':
      pauseGame(true);
      break;

    case 'resumed':
      resumeGame(true);
      break;
  }
};

ws.onclose = () => {
  console.log('Disconnected from server');
};

// === STATE SYNC ===
function handleStateSync(state) {
  // Restore controller status
  controllersConnected[1] = state.controllers[1];
  controllersConnected[2] = state.controllers[2];
  updateControllerStatus(1, state.controllers[1]);
  updateControllerStatus(2, state.controllers[2]);

  // Restore selections
  if (state.fighters[1]) selectFighter(1, state.fighters[1], true);
  if (state.fighters[2]) selectFighter(2, state.fighters[2], true);
  if (state.map) selectMap(state.map, true);

  // Restore phase
  if (state.phase === 'fighting' || state.phase === 'paused') {
    startFight(true);
    if (state.phase === 'paused') {
      pauseGame(true);
    }
  } else if (state.phase === 'matchEnd') {
    startFight(true);
    showMatchEnd(state.winner);
  }
}

// === SELECT SCREEN ===

function initSelectScreen() {
  preloadHeadImages().then(() => {
    buildFighterGrid('p1-fighters', 1);
    buildFighterGrid('p2-fighters', 2);
    buildMapGrid();
  });
}

function buildFighterGrid(containerId, playerNum) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';

  FIGHTERS.forEach(fighter => {
    const card = document.createElement('div');
    card.className = 'fighter-card';
    card.dataset.fighterId = fighter.id;
    card.dataset.player = playerNum;

    const portrait = document.createElement('div');
    portrait.className = 'fighter-card-portrait';
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    drawFighterPortrait(canvas, fighter);
    portrait.appendChild(canvas);

    const name = document.createElement('div');
    name.className = 'fighter-card-name';
    name.textContent = fighter.name;

    card.appendChild(portrait);
    card.appendChild(name);

    card.addEventListener('click', () => {
      selectFighter(playerNum, fighter.id, false);
    });

    container.appendChild(card);
  });
}

function buildMapGrid() {
  const container = document.getElementById('map-grid');
  container.innerHTML = '';

  MAPS.forEach(map => {
    const card = document.createElement('div');
    card.className = 'map-card';
    card.dataset.mapId = map.id;

    const canvas = document.createElement('canvas');
    canvas.width = 360;
    canvas.height = 180;
    drawMapPreview(canvas, map);
    card.appendChild(canvas);

    const name = document.createElement('div');
    name.className = 'map-card-name';
    name.textContent = map.name;
    card.appendChild(name);

    card.addEventListener('click', () => {
      selectMap(map.id, false);
    });

    container.appendChild(card);
  });

  // Auto-select first map
  selectMap(MAPS[0].id, false);
}

// fromRemote: true if triggered by a WS message (don't re-broadcast)
function selectFighter(playerNum, fighterId, fromRemote) {
  const fighter = FIGHTERS.find(f => f.id === fighterId);
  if (!fighter) return;

  selectedFighters[playerNum] = fighter;
  if (typeof SFX !== 'undefined') SFX.select();

  // Update grid selection visuals
  const gridId = `p${playerNum}-fighters`;
  const cards = document.querySelectorAll(`#${gridId} .fighter-card`);
  cards.forEach(card => {
    card.classList.remove(`selected-p${playerNum}`);
    if (card.dataset.fighterId === fighterId) {
      card.classList.add(`selected-p${playerNum}`);
    }
  });

  // Update preview
  const previewName = document.getElementById(`p${playerNum}-preview-name`);
  if (previewName) {
    previewName.textContent = fighter.name;
    previewName.style.color = playerNum === 1 ? '#4488ff' : '#ff4444';
  }

  checkReadyToFight();

  if (!fromRemote) {
    ws.send(JSON.stringify({ type: 'select_fighter', player: playerNum, fighterId }));
  }
}

function selectMap(mapId, fromRemote) {
  const map = MAPS.find(m => m.id === mapId);
  if (!map) return;

  selectedMap = map;
  if (typeof SFX !== 'undefined') SFX.select();

  document.querySelectorAll('.map-card').forEach(card => {
    card.classList.toggle('selected', card.dataset.mapId === mapId);
  });

  checkReadyToFight();

  if (!fromRemote) {
    ws.send(JSON.stringify({ type: 'select_map', mapId }));
  }
}

function updateControllerStatus(player, connected) {
  const el = document.getElementById(`p${player}-status`);
  if (el) {
    el.textContent = connected ? 'CONTROLLER CONNECTED' : 'WAITING FOR CONTROLLER...';
    el.className = 'status-indicator' + (connected ? ' connected' : '');
  }
}

function checkReadyToFight() {
  const btn = document.getElementById('fight-btn');
  const ready = selectedFighters[1] && selectedFighters[2] && selectedMap;
  btn.disabled = !ready;
}

// === FIGHT ===

function startFight(fromRemote) {
  if (!selectedFighters[1] || !selectedFighters[2] || !selectedMap) return;

  // Hide select screen, show game
  document.getElementById('select-screen').classList.add('hidden');
  document.getElementById('game-screen').classList.remove('hidden');
  document.getElementById('match-end-overlay').classList.add('hidden');
  document.getElementById('pause-overlay').classList.add('hidden');

  // Initialize engine if not running
  if (!engine) {
    const canvas = document.getElementById('gameCanvas');
    engine = new GameEngine(canvas);
    engine.init(selectedFighters[1], selectedFighters[2], selectedMap);
  }

  if (!fromRemote) {
    ws.send(JSON.stringify({ type: 'start_fight' }));
  }
}

function showSelectScreen(fromRemote) {
  if (engine) {
    engine.destroy();
    engine = null;
  }

  document.getElementById('game-screen').classList.add('hidden');
  document.getElementById('select-screen').classList.remove('hidden');
  document.getElementById('match-end-overlay').classList.add('hidden');
  document.getElementById('pause-overlay').classList.add('hidden');

  selectedFighters = { 1: null, 2: null };
  selectedMap = null;

  // Reset selection visuals
  document.querySelectorAll('.fighter-card').forEach(c => {
    c.classList.remove('selected-p1', 'selected-p2');
  });
  document.getElementById('p1-preview-name').textContent = '???';
  document.getElementById('p2-preview-name').textContent = '???';
  document.querySelectorAll('.map-card').forEach(c => c.classList.remove('selected'));

  checkReadyToFight();

  if (!fromRemote) {
    ws.send(JSON.stringify({ type: 'rematch' }));
  }
}

// === PAUSE ===

function pauseGame(fromRemote) {
  if (!engine) return;
  engine.gameState = 'paused';
  engine.stopTimer();
  document.getElementById('pause-overlay').classList.remove('hidden');
  if (typeof SFX !== 'undefined') SFX.pause();

  if (!fromRemote) {
    ws.send(JSON.stringify({ type: 'pause' }));
  }
}

function resumeGame(fromRemote) {
  if (!engine) return;
  engine.gameState = 'fighting';
  engine.startTimer();
  document.getElementById('pause-overlay').classList.add('hidden');
  if (typeof SFX !== 'undefined') SFX.resume();

  if (!fromRemote) {
    ws.send(JSON.stringify({ type: 'resume' }));
  }
}

// === MATCH END ===

function showMatchEnd(winner) {
  const text = document.getElementById('match-end-text');
  if (engine) {
    const winnerFighter = winner === 1 ? engine.fighter1 : engine.fighter2;
    text.textContent = `${winnerFighter.config.name} WINS!`;
  } else {
    text.textContent = `PLAYER ${winner} WINS!`;
  }
  document.getElementById('match-end-overlay').classList.remove('hidden');
}

// Override engine's match end to show overlay and broadcast
const origCheckRoundEnd = GameEngine.prototype.checkRoundEnd;
GameEngine.prototype.checkRoundEnd = function() {
  const prevState = this.gameState;
  origCheckRoundEnd.call(this);

  if (this.gameState === 'matchEnd' && prevState !== 'matchEnd') {
    const winner = this.wins[1] >= this.winsNeeded ? 1 : 2;
    // Show overlay after announcement clears
    setTimeout(() => {
      showMatchEnd(winner);
      ws.send(JSON.stringify({ type: 'match_end', winner }));
    }, 3000);
  }
};

// === UI BUTTONS ===

// Fight button
document.getElementById('fight-btn').addEventListener('click', () => {
  if (typeof SFX !== 'undefined') SFX.confirm();
  startFight(false);
});

// Pause button
document.getElementById('pause-btn').addEventListener('click', () => {
  if (engine) {
    if (engine.gameState === 'fighting') {
      pauseGame(false);
    } else if (engine.gameState === 'paused') {
      resumeGame(false);
    }
  }
});

// Resume button in overlay
document.getElementById('resume-btn').addEventListener('click', () => {
  resumeGame(false);
});

// Rematch button on game screen
document.getElementById('rematch-btn').addEventListener('click', () => {
  showSelectScreen(false);
});

// Fighter select from pause menu
document.getElementById('pause-select-btn').addEventListener('click', () => {
  showSelectScreen(false);
});

// Keyboard support for local testing
const keyMap1 = { 'a': 'left', 'd': 'right', 'w': 'up', 's': 'down', 'f': 'punch', 'g': 'kick', 'h': 'block' };
const keyMap2 = { 'ArrowLeft': 'left', 'ArrowRight': 'right', 'ArrowUp': 'up', 'ArrowDown': 'down', 'Numpad1': 'punch', 'Numpad2': 'kick', 'Numpad3': 'block', '1': 'punch', '2': 'kick', '3': 'block' };

document.addEventListener('keydown', (e) => {
  // Escape to pause/resume
  if (e.key === 'Escape' && engine) {
    if (engine.gameState === 'fighting') pauseGame(false);
    else if (engine.gameState === 'paused') resumeGame(false);
    return;
  }
  if (engine && engine.gameState !== 'paused') {
    if (keyMap1[e.key]) engine.handleInput(1, keyMap1[e.key], true);
    if (keyMap2[e.key]) engine.handleInput(2, keyMap2[e.key], true);
  }
});

document.addEventListener('keyup', (e) => {
  if (engine && engine.gameState !== 'paused') {
    if (keyMap1[e.key]) engine.handleInput(1, keyMap1[e.key], false);
    if (keyMap2[e.key]) engine.handleInput(2, keyMap2[e.key], false);
  }
});

// Init
initSelectScreen();
