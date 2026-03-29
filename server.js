const express = require('express');
const http = require('http');
const { WebSocketServer } = require('ws');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/game', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'game.html'));
});

app.get('/game/controller/:playerId', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'controller.html'));
});

// API: list available sound files for a fighter
app.get('/api/sounds/:fighterId/:type', (req, res) => {
  const { fighterId, type } = req.params;
  if (!['hit', 'taunt'].includes(type)) return res.json([]);
  // Sanitize to prevent path traversal
  const safeId = fighterId.replace(/[^a-z0-9_-]/gi, '');
  const safeType = type.replace(/[^a-z]/gi, '');
  const dir = path.join(__dirname, 'public', 'assets', 'sounds', safeId, safeType);
  try {
    const files = fs.readdirSync(dir).filter(f => /\.(mp3|wav|ogg|webm|m4a)$/i.test(f));
    res.json(files.map(f => `/assets/sounds/${safeId}/${safeType}/${f}`));
  } catch {
    res.json([]);
  }
});

// Central game state
const gameState = {
  phase: 'select', // select, fighting, paused, matchEnd
  fighters: { 1: null, 2: null },
  map: null,
  winner: null,
};

// Track connections
const connections = {
  game: null,
  controllers: { 1: null, 2: null }
};

function broadcast(msg, exclude) {
  const data = JSON.stringify(msg);
  const targets = [connections.game, connections.controllers[1], connections.controllers[2]];
  for (const ws of targets) {
    if (ws && ws !== exclude && ws.readyState === 1) {
      ws.send(data);
    }
  }
}

function sendTo(ws, msg) {
  if (ws && ws.readyState === 1) {
    ws.send(JSON.stringify(msg));
  }
}

// Send full state snapshot to a client
function sendStateSync(ws) {
  sendTo(ws, {
    type: 'state_sync',
    phase: gameState.phase,
    fighters: gameState.fighters,
    map: gameState.map,
    winner: gameState.winner,
    controllers: {
      1: !!connections.controllers[1],
      2: !!connections.controllers[2],
    }
  });
}

wss.on('connection', (ws, req) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const role = url.searchParams.get('role');
  const playerId = url.searchParams.get('player');

  if (role === 'game') {
    connections.game = ws;
    console.log('Game screen connected');
    // Send current state
    sendStateSync(ws);
  } else if (role === 'controller' && (playerId === '1' || playerId === '2')) {
    const pid = parseInt(playerId);
    connections.controllers[pid] = ws;
    console.log(`Controller P${pid} connected`);

    // Notify others
    broadcast({ type: 'controller_connected', player: pid }, ws);

    // Send current state to this controller
    sendStateSync(ws);
  }

  ws.on('message', (data) => {
    try {
      const msg = JSON.parse(data);

      // Tag controller messages with player id
      if (role === 'controller') {
        msg.player = parseInt(playerId);
      }

      switch (msg.type) {
        case 'select_fighter':
          gameState.fighters[msg.player] = msg.fighterId;
          broadcast(msg); // send to ALL clients
          break;

        case 'select_map':
          gameState.map = msg.mapId;
          broadcast(msg);
          break;

        case 'start_fight':
          if (gameState.fighters[1] && gameState.fighters[2] && gameState.map) {
            gameState.phase = 'fighting';
            broadcast({ type: 'fight_started' });
          }
          break;

        case 'pause':
          if (gameState.phase === 'fighting') {
            gameState.phase = 'paused';
            broadcast({ type: 'paused' });
          }
          break;

        case 'resume':
          if (gameState.phase === 'paused') {
            gameState.phase = 'fighting';
            broadcast({ type: 'resumed' });
          }
          break;

        case 'match_end':
          gameState.phase = 'matchEnd';
          gameState.winner = msg.winner;
          broadcast(msg);
          break;

        case 'rematch':
          gameState.phase = 'select';
          gameState.fighters = { 1: null, 2: null };
          gameState.map = null;
          gameState.winner = null;
          broadcast({ type: 'rematch' });
          break;

        case 'input':
          // Only forward inputs to game screen (high frequency)
          sendTo(connections.game, msg);
          break;

        default:
          // Forward unknown messages based on role
          if (role === 'controller') {
            sendTo(connections.game, msg);
          } else if (role === 'game') {
            broadcast(msg, ws);
          }
          break;
      }
    } catch (e) {
      console.error('Invalid message:', e);
    }
  });

  ws.on('close', () => {
    if (role === 'game') {
      connections.game = null;
      console.log('Game screen disconnected');
    } else if (role === 'controller') {
      const pid = parseInt(playerId);
      connections.controllers[pid] = null;
      console.log(`Controller P${pid} disconnected`);
      broadcast({ type: 'controller_disconnected', player: pid });
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Chevu's Fight Club running on http://localhost:${PORT}`);
  console.log(`Game screen: http://localhost:${PORT}/game`);
  console.log(`Controller P1: http://localhost:${PORT}/game/controller/1`);
  console.log(`Controller P2: http://localhost:${PORT}/game/controller/2`);
});
