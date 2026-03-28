// Map/Arena definitions
const MAPS = [
  {
    id: 'dojo',
    name: 'THE DOJO',
    // Colors for procedural background
    skyColor: '#1a0a2e',
    groundColor: '#4a3728',
    accentColor: '#ff6633',
    draw(ctx, w, h) {
      const groundY = h * 0.75;

      // Sky gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, groundY);
      skyGrad.addColorStop(0, '#0d0520');
      skyGrad.addColorStop(1, '#1a0a2e');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, groundY);

      // Moon
      ctx.fillStyle = '#ffeecc';
      ctx.beginPath();
      ctx.arc(w * 0.8, h * 0.15, 40, 0, Math.PI * 2);
      ctx.fill();

      // Background pillars
      ctx.fillStyle = '#2a1a3e';
      for (let i = 0; i < 5; i++) {
        const x = w * 0.1 + i * (w * 0.2);
        ctx.fillRect(x - 15, groundY - 200, 30, 200);
        // Pillar top
        ctx.fillRect(x - 22, groundY - 200, 44, 10);
      }

      // Lanterns
      ctx.fillStyle = '#ff6633';
      ctx.shadowColor = '#ff6633';
      ctx.shadowBlur = 20;
      for (let i = 0; i < 4; i++) {
        const x = w * 0.15 + i * (w * 0.22);
        ctx.fillRect(x - 6, groundY - 160, 12, 16);
      }
      ctx.shadowBlur = 0;

      // Ground
      const groundGrad = ctx.createLinearGradient(0, groundY, 0, h);
      groundGrad.addColorStop(0, '#5a4738');
      groundGrad.addColorStop(1, '#3a2718');
      ctx.fillStyle = groundGrad;
      ctx.fillRect(0, groundY, w, h - groundY);

      // Floor lines
      ctx.strokeStyle = '#6a5748';
      ctx.lineWidth = 1;
      for (let i = 0; i < 8; i++) {
        const y = groundY + 10 + i * 15;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
    }
  },
  {
    id: 'rooftop',
    name: 'ROOFTOP',
    skyColor: '#0a1628',
    groundColor: '#555555',
    accentColor: '#4488ff',
    draw(ctx, w, h) {
      const groundY = h * 0.75;

      // Night sky
      const skyGrad = ctx.createLinearGradient(0, 0, 0, groundY);
      skyGrad.addColorStop(0, '#050a14');
      skyGrad.addColorStop(1, '#0a1628');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, groundY);

      // Stars
      ctx.fillStyle = '#ffffff';
      const starSeed = [0.1,0.25,0.4,0.55,0.7,0.85,0.15,0.35,0.6,0.8,0.05,0.45,0.75,0.92,0.3];
      const starSeedY = [0.05,0.12,0.08,0.2,0.15,0.03,0.22,0.18,0.1,0.07,0.25,0.13,0.02,0.19,0.11];
      for (let i = 0; i < starSeed.length; i++) {
        const size = (i % 3 === 0) ? 2 : 1;
        ctx.fillRect(w * starSeed[i], h * starSeedY[i], size, size);
      }

      // City skyline
      ctx.fillStyle = '#111828';
      const buildings = [
        [0.05, 0.4], [0.12, 0.35], [0.2, 0.5], [0.28, 0.3],
        [0.35, 0.45], [0.42, 0.25], [0.5, 0.38], [0.58, 0.42],
        [0.65, 0.32], [0.72, 0.48], [0.8, 0.28], [0.88, 0.44]
      ];
      buildings.forEach(([x, heightRatio]) => {
        const bh = groundY * heightRatio;
        ctx.fillRect(w * x, groundY - bh, w * 0.06, bh);
        // Windows
        ctx.fillStyle = '#223344';
        for (let wy = groundY - bh + 8; wy < groundY - 10; wy += 14) {
          for (let wx = w * x + 4; wx < w * x + w * 0.06 - 4; wx += 10) {
            if (Math.random() > 0.3) {
              ctx.fillStyle = Math.random() > 0.5 ? '#334466' : '#223344';
              ctx.fillRect(wx, wy, 5, 7);
            }
          }
        }
        ctx.fillStyle = '#111828';
      });

      // Rooftop ground
      ctx.fillStyle = '#444444';
      ctx.fillRect(0, groundY, w, h - groundY);

      // Railing
      ctx.strokeStyle = '#666666';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, groundY + 5);
      ctx.lineTo(w, groundY + 5);
      ctx.stroke();

      // Railing posts
      for (let i = 0; i < 12; i++) {
        const x = i * (w / 11);
        ctx.fillStyle = '#555555';
        ctx.fillRect(x - 2, groundY - 20, 4, 25);
      }

      // Neon sign glow
      ctx.fillStyle = '#4488ff';
      ctx.shadowColor = '#4488ff';
      ctx.shadowBlur = 30;
      ctx.font = 'bold 16px monospace';
      ctx.fillText('FIGHT', w * 0.05, groundY - 30);
      ctx.shadowBlur = 0;
    }
  },
  {
    id: 'arena',
    name: 'THE ARENA',
    skyColor: '#1a0000',
    groundColor: '#444444',
    accentColor: '#ff0000',
    draw(ctx, w, h) {
      const groundY = h * 0.75;

      // Dark red background
      const bg = ctx.createRadialGradient(w/2, h*0.3, 50, w/2, h*0.3, w*0.6);
      bg.addColorStop(0, '#2a0808');
      bg.addColorStop(1, '#0a0000');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, groundY);

      // Crowd silhouettes (rows of heads)
      ctx.fillStyle = '#1a0505';
      for (let row = 0; row < 3; row++) {
        const y = groundY - 60 - row * 35;
        for (let i = 0; i < 30; i++) {
          const x = (w / 30) * i + 10;
          ctx.beginPath();
          ctx.arc(x, y, 8 + row * 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Spotlights
      ctx.save();
      ctx.globalAlpha = 0.1;
      const spot1 = ctx.createRadialGradient(w*0.3, 0, 0, w*0.3, groundY, w*0.2);
      spot1.addColorStop(0, '#ffffff');
      spot1.addColorStop(1, 'transparent');
      ctx.fillStyle = spot1;
      ctx.fillRect(0, 0, w, groundY);

      const spot2 = ctx.createRadialGradient(w*0.7, 0, 0, w*0.7, groundY, w*0.2);
      spot2.addColorStop(0, '#ffffff');
      spot2.addColorStop(1, 'transparent');
      ctx.fillStyle = spot2;
      ctx.fillRect(0, 0, w, groundY);
      ctx.restore();

      // Ring ropes
      ctx.strokeStyle = '#cc3333';
      ctx.lineWidth = 3;
      for (let i = 0; i < 3; i++) {
        const y = groundY - 20 - i * 30;
        ctx.beginPath();
        ctx.moveTo(w * 0.05, y);
        ctx.lineTo(w * 0.95, y);
        ctx.stroke();
      }

      // Corner posts
      ctx.fillStyle = '#881111';
      ctx.fillRect(w * 0.05 - 5, groundY - 85, 10, 90);
      ctx.fillRect(w * 0.95 - 5, groundY - 85, 10, 90);

      // Ground / ring floor
      ctx.fillStyle = '#3a3a3a';
      ctx.fillRect(0, groundY, w, h - groundY);

      // Ring mat
      ctx.fillStyle = '#444444';
      ctx.fillRect(w * 0.03, groundY, w * 0.94, h - groundY);
    }
  },
  {
    id: 'colizeum',
    name: 'COLIZEUM',
    skyColor: '#0a0a00',
    groundColor: '#1a1a00',
    accentColor: '#ffcc00',
    draw(ctx, w, h) {
      const groundY = h * 0.75;

      // Dark interior wall
      const wallGrad = ctx.createLinearGradient(0, 0, 0, groundY);
      wallGrad.addColorStop(0, '#0d0d05');
      wallGrad.addColorStop(1, '#1a1a0a');
      ctx.fillStyle = wallGrad;
      ctx.fillRect(0, 0, w, groundY);

      // Ceiling with LED strip (yellow glow)
      ctx.fillStyle = '#ffcc00';
      ctx.shadowColor = '#ffcc00';
      ctx.shadowBlur = 25;
      ctx.fillRect(0, 0, w, 3);
      ctx.shadowBlur = 0;

      // Back wall accent stripe (yellow diagonal pattern)
      ctx.save();
      ctx.globalAlpha = 0.06;
      ctx.fillStyle = '#ffcc00';
      for (let i = -5; i < 20; i++) {
        ctx.beginPath();
        ctx.moveTo(w * i * 0.08, 0);
        ctx.lineTo(w * i * 0.08 + 60, 0);
        ctx.lineTo(w * i * 0.08 + 60 + groundY * 0.4, groundY);
        ctx.lineTo(w * i * 0.08 + groundY * 0.4, groundY);
        ctx.fill();
      }
      ctx.restore();

      // Yellow horizontal wall stripe
      ctx.fillStyle = '#ffcc00';
      ctx.fillRect(0, groundY * 0.12, w, 4);
      ctx.globalAlpha = 0.3;
      ctx.fillRect(0, groundY * 0.12 - 2, w, 8);
      ctx.globalAlpha = 1;

      // "COLIZEUM" sign on back wall
      ctx.save();
      ctx.font = `bold ${Math.floor(h * 0.06)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillStyle = '#ffcc00';
      ctx.shadowColor = '#ffcc00';
      ctx.shadowBlur = 40;
      ctx.fillText('COLIZEUM', w * 0.5, groundY * 0.55);
      ctx.shadowBlur = 20;
      ctx.fillText('COLIZEUM', w * 0.5, groundY * 0.55);
      ctx.shadowBlur = 0;
      ctx.restore();

      // --- Reception desk (far left) ---
      const rxX = w * 0.02;
      const rxW = w * 0.12;
      const deskH = 55;
      const deskY = groundY - deskH;

      // Desk body (black with yellow trim)
      ctx.fillStyle = '#111111';
      ctx.fillRect(rxX, deskY, rxW, deskH);
      // Yellow top edge
      ctx.fillStyle = '#ccaa00';
      ctx.fillRect(rxX, deskY, rxW, 4);
      // Yellow front strip
      ctx.fillStyle = '#ffcc00';
      ctx.fillRect(rxX, deskY + 20, rxW, 3);
      // Monitor on desk
      ctx.fillStyle = '#222';
      ctx.fillRect(rxX + rxW * 0.3, deskY - 28, 22, 20);
      ctx.fillStyle = '#1a3300';
      ctx.fillRect(rxX + rxW * 0.3 + 2, deskY - 26, 18, 16);
      // Monitor stand
      ctx.fillStyle = '#333';
      ctx.fillRect(rxX + rxW * 0.3 + 8, deskY - 8, 6, 8);
      // "RECEPTION" text
      ctx.save();
      ctx.font = 'bold 7px sans-serif';
      ctx.fillStyle = '#ffcc00';
      ctx.shadowColor = '#ffcc00';
      ctx.shadowBlur = 6;
      ctx.fillText('RECEPTION', rxX + 4, deskY + 14);
      ctx.shadowBlur = 0;
      ctx.restore();

      // --- PC Gaming stations (back wall, left-center) ---
      const pcStartX = w * 0.18;
      const pcCount = 5;
      const pcSpacing = w * 0.09;

      for (let i = 0; i < pcCount; i++) {
        const px = pcStartX + i * pcSpacing;
        const deskTopY = groundY - 50;

        // Desk
        ctx.fillStyle = '#111111';
        ctx.fillRect(px, deskTopY, 50, 50);
        ctx.fillStyle = '#ccaa00';
        ctx.fillRect(px - 2, deskTopY, 54, 3);

        // Monitor
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(px + 8, deskTopY - 32, 34, 26);
        // Screen glow (alternating colors for variety)
        const screenColors = ['#0a1a33', '#0a330a', '#1a0a33', '#33200a', '#0a2a2a'];
        ctx.fillStyle = screenColors[i % screenColors.length];
        ctx.fillRect(px + 10, deskTopY - 30, 30, 22);
        // Screen content lines
        ctx.fillStyle = '#ffcc00';
        ctx.globalAlpha = 0.4;
        for (let line = 0; line < 3; line++) {
          ctx.fillRect(px + 13, deskTopY - 27 + line * 6, 14 + (i * 3) % 10, 2);
        }
        ctx.globalAlpha = 1;
        // Monitor stand
        ctx.fillStyle = '#222';
        ctx.fillRect(px + 22, deskTopY - 6, 6, 6);

        // Keyboard
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(px + 12, deskTopY + 6, 26, 8);
        // Key dots
        ctx.fillStyle = '#333';
        for (let k = 0; k < 5; k++) {
          ctx.fillRect(px + 14 + k * 5, deskTopY + 8, 3, 4);
        }

        // Gaming chair
        ctx.fillStyle = '#111';
        ctx.fillRect(px + 14, groundY - 38, 22, 36);
        // Chair yellow accent
        ctx.fillStyle = '#ccaa00';
        ctx.fillRect(px + 15, groundY - 36, 3, 30);
        ctx.fillRect(px + 32, groundY - 36, 3, 30);
        // Chair backrest
        ctx.fillRect(px + 12, groundY - 52, 26, 16);
        ctx.fillStyle = '#111';
        ctx.fillRect(px + 14, groundY - 50, 22, 12);

        // RGB underglow on desk
        ctx.fillStyle = '#ffcc00';
        ctx.shadowColor = '#ffcc00';
        ctx.shadowBlur = 8;
        ctx.fillRect(px, groundY - 2, 50, 2);
        ctx.shadowBlur = 0;
      }

      // --- PS5 Couch area (right side) ---
      const couchX = w * 0.72;
      const couchW = w * 0.18;
      const couchH = 40;
      const couchY = groundY - couchH;

      // Couch body (dark with yellow piping)
      ctx.fillStyle = '#0d0d0d';
      ctx.fillRect(couchX, couchY, couchW, couchH);
      // Couch back
      ctx.fillRect(couchX, couchY - 25, couchW, 28);
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(couchX + 3, couchY - 22, couchW - 6, 22);
      // Yellow piping
      ctx.strokeStyle = '#ccaa00';
      ctx.lineWidth = 2;
      ctx.strokeRect(couchX, couchY - 25, couchW, couchH + 25);
      // Cushion lines
      ctx.strokeStyle = '#ccaa00';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(couchX + couchW * 0.33, couchY);
      ctx.lineTo(couchX + couchW * 0.33, couchY + couchH);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(couchX + couchW * 0.66, couchY);
      ctx.lineTo(couchX + couchW * 0.66, couchY + couchH);
      ctx.stroke();
      // Armrests
      ctx.fillStyle = '#111';
      ctx.fillRect(couchX - 8, couchY - 10, 10, couchH + 10);
      ctx.fillRect(couchX + couchW - 2, couchY - 10, 10, couchH + 10);

      // TV above couch area (mounted on wall)
      const tvX = couchX + couchW * 0.15;
      const tvW = couchW * 0.7;
      const tvH = 45;
      const tvY = groundY - 130;
      ctx.fillStyle = '#111';
      ctx.fillRect(tvX - 3, tvY - 3, tvW + 6, tvH + 6);
      ctx.fillStyle = '#0a1a2a';
      ctx.fillRect(tvX, tvY, tvW, tvH);
      // Game on screen
      ctx.fillStyle = '#1a2a1a';
      ctx.fillRect(tvX + 5, tvY + 5, tvW - 10, tvH - 15);
      // PS game UI elements
      ctx.fillStyle = '#ffcc00';
      ctx.globalAlpha = 0.6;
      ctx.fillRect(tvX + 8, tvY + 8, tvW * 0.3, 3);
      ctx.fillStyle = '#cc3333';
      ctx.fillRect(tvX + tvW - tvW * 0.3 - 8, tvY + 8, tvW * 0.3, 3);
      ctx.globalAlpha = 1;
      // TV mount
      ctx.fillStyle = '#222';
      ctx.fillRect(tvX + tvW * 0.45, tvY + tvH, 10, 15);

      // PS5 console (next to TV on a small shelf)
      const psX = couchX + couchW + 15;
      const psY = groundY - 85;
      // Shelf
      ctx.fillStyle = '#111';
      ctx.fillRect(psX - 5, psY + 30, 30, 4);
      // PS5 body (standing)
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(psX, psY, 8, 30);
      // PS5 black center
      ctx.fillStyle = '#111';
      ctx.fillRect(psX + 2, psY + 3, 4, 24);
      // PS5 blue light
      ctx.fillStyle = '#4488ff';
      ctx.shadowColor = '#4488ff';
      ctx.shadowBlur = 8;
      ctx.fillRect(psX + 3, psY + 2, 2, 26);
      ctx.shadowBlur = 0;
      // Controller on couch
      ctx.fillStyle = '#222';
      ctx.beginPath();
      ctx.ellipse(couchX + couchW * 0.5, couchY + 12, 14, 8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#333';
      ctx.beginPath();
      ctx.ellipse(couchX + couchW * 0.5, couchY + 11, 10, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      // --- Floor ---
      const floorGrad = ctx.createLinearGradient(0, groundY, 0, h);
      floorGrad.addColorStop(0, '#1a1a10');
      floorGrad.addColorStop(1, '#0d0d08');
      ctx.fillStyle = floorGrad;
      ctx.fillRect(0, groundY, w, h - groundY);

      // Floor tiles (dark with subtle yellow grout)
      ctx.strokeStyle = '#2a2a15';
      ctx.lineWidth = 1;
      const tileSize = 60;
      for (let tx = 0; tx < w; tx += tileSize) {
        ctx.beginPath();
        ctx.moveTo(tx, groundY);
        ctx.lineTo(tx, h);
        ctx.stroke();
      }
      for (let ty = groundY; ty < h; ty += tileSize * 0.5) {
        ctx.beginPath();
        ctx.moveTo(0, ty);
        ctx.lineTo(w, ty);
        ctx.stroke();
      }

      // Yellow floor accent strip
      ctx.fillStyle = '#ffcc00';
      ctx.shadowColor = '#ffcc00';
      ctx.shadowBlur = 10;
      ctx.fillRect(0, groundY, w, 2);
      ctx.shadowBlur = 0;

      // Ambient ceiling lights (yellow downlights)
      ctx.save();
      const lightPositions = [0.15, 0.35, 0.55, 0.75, 0.9];
      for (const lx of lightPositions) {
        // Light fixture
        ctx.fillStyle = '#222';
        ctx.fillRect(w * lx - 8, 3, 16, 6);
        // Light glow cone
        ctx.globalAlpha = 0.04;
        ctx.fillStyle = '#ffcc00';
        ctx.beginPath();
        ctx.moveTo(w * lx - 10, 9);
        ctx.lineTo(w * lx - 80, groundY);
        ctx.lineTo(w * lx + 80, groundY);
        ctx.lineTo(w * lx + 10, 9);
        ctx.fill();
      }
      ctx.restore();
    }
  },
];

function drawMapPreview(canvas, map) {
  const ctx = canvas.getContext('2d');
  map.draw(ctx, canvas.width, canvas.height);
}
