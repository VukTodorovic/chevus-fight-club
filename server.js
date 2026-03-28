const express = require('express');
const http = require('http');
const { WebSocketServer } = require('ws');
const path = require('path');

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

// Track connections
const connections = {
  game: null,
  controllers: { 1: null, 2: null }
};

wss.on('connection', (ws, req) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const role = url.searchParams.get('role');
  const playerId = url.searchParams.get('player');

  if (role === 'game') {
    connections.game = ws;
    console.log('Game screen connected');

    // Notify game of already-connected controllers
    for (const id of [1, 2]) {
      if (connections.controllers[id]) {
        ws.send(JSON.stringify({ type: 'controller_connected', player: id }));
      }
    }
  } else if (role === 'controller' && (playerId === '1' || playerId === '2')) {
    const pid = parseInt(playerId);
    connections.controllers[pid] = ws;
    console.log(`Controller P${pid} connected`);

    // Notify game screen
    if (connections.game && connections.game.readyState === 1) {
      connections.game.send(JSON.stringify({ type: 'controller_connected', player: pid }));
    }
  }

  ws.on('message', (data) => {
    try {
      const msg = JSON.parse(data);

      if (role === 'controller' && connections.game && connections.game.readyState === 1) {
        // Forward controller input to game
        msg.player = parseInt(playerId);
        connections.game.send(JSON.stringify(msg));
      } else if (role === 'game') {
        // Forward game state to controllers
        for (const id of [1, 2]) {
          const ctrl = connections.controllers[id];
          if (ctrl && ctrl.readyState === 1) {
            ctrl.send(JSON.stringify(msg));
          }
        }
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
      if (connections.game && connections.game.readyState === 1) {
        connections.game.send(JSON.stringify({ type: 'controller_disconnected', player: pid }));
      }
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
