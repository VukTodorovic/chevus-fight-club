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
    case 'controller_connected':
      controllersConnected[msg.player] = true;
      updateControllerStatus(msg.player, true);
      break;

    case 'controller_disconnected':
      controllersConnected[msg.player] = false;
      updateControllerStatus(msg.player, false);
      break;

    case 'input':
      if (engine) {
        engine.handleInput(msg.player, msg.input, msg.pressed);
      }
      break;

    case 'select_fighter':
      selectFighter(msg.player, msg.fighterId);
      break;

    case 'select_map':
      selectMap(msg.mapId);
      break;

    case 'start_fight':
      startFight();
      break;

    case 'rematch':
      showSelectScreen();
      break;
  }
};

ws.onclose = () => {
  console.log('Disconnected from server');
};

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

    // Click to select (also works for local testing)
    card.addEventListener('click', () => {
      selectFighter(playerNum, fighter.id);
      // Notify controllers
      ws.send(JSON.stringify({ type: 'fighter_selected', player: playerNum, fighterId: fighter.id }));
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
      selectMap(map.id);
      ws.send(JSON.stringify({ type: 'map_selected', mapId: map.id }));
    });

    container.appendChild(card);
  });

  // Auto-select first map
  selectMap(MAPS[0].id);
}

function selectFighter(playerNum, fighterId) {
  const fighter = FIGHTERS.find(f => f.id === fighterId);
  if (!fighter) return;

  selectedFighters[playerNum] = fighter;

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
}

function selectMap(mapId) {
  const map = MAPS.find(m => m.id === mapId);
  if (!map) return;

  selectedMap = map;

  document.querySelectorAll('.map-card').forEach(card => {
    card.classList.toggle('selected', card.dataset.mapId === mapId);
  });

  checkReadyToFight();
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

function startFight() {
  if (!selectedFighters[1] || !selectedFighters[2] || !selectedMap) return;

  // Hide select screen, show game
  document.getElementById('select-screen').classList.add('hidden');
  document.getElementById('game-screen').classList.remove('hidden');

  // Initialize engine
  const canvas = document.getElementById('gameCanvas');
  engine = new GameEngine(canvas);
  engine.init(selectedFighters[1], selectedFighters[2], selectedMap);

  // Notify controllers that fight started
  ws.send(JSON.stringify({
    type: 'fight_started',
    fighter1: selectedFighters[1].name,
    fighter2: selectedFighters[2].name,
  }));
}

function showSelectScreen() {
  if (engine) {
    engine.destroy();
    engine = null;
  }

  document.getElementById('game-screen').classList.add('hidden');
  document.getElementById('select-screen').classList.remove('hidden');

  selectedFighters = { 1: null, 2: null };

  // Reset selection visuals
  document.querySelectorAll('.fighter-card').forEach(c => {
    c.classList.remove('selected-p1', 'selected-p2');
  });
  document.getElementById('p1-preview-name').textContent = '???';
  document.getElementById('p2-preview-name').textContent = '???';

  checkReadyToFight();
}

// Fight button
document.getElementById('fight-btn').addEventListener('click', () => {
  startFight();
  ws.send(JSON.stringify({ type: 'fight_started', fighter1: selectedFighters[1].name, fighter2: selectedFighters[2].name }));
});

// Keyboard support for local testing
const keyMap1 = { 'a': 'left', 'd': 'right', 'w': 'up', 's': 'down', 'f': 'punch', 'g': 'kick', 'h': 'block' };
const keyMap2 = { 'ArrowLeft': 'left', 'ArrowRight': 'right', 'ArrowUp': 'up', 'ArrowDown': 'down', 'Numpad1': 'punch', 'Numpad2': 'kick', 'Numpad3': 'block', '1': 'punch', '2': 'kick', '3': 'block' };

document.addEventListener('keydown', (e) => {
  if (keyMap1[e.key] && engine) engine.handleInput(1, keyMap1[e.key], true);
  if (keyMap2[e.key] && engine) engine.handleInput(2, keyMap2[e.key], true);
});

document.addEventListener('keyup', (e) => {
  if (keyMap1[e.key] && engine) engine.handleInput(1, keyMap1[e.key], false);
  if (keyMap2[e.key] && engine) engine.handleInput(2, keyMap2[e.key], false);
});

// Init
initSelectScreen();
