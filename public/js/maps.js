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
];

function drawMapPreview(canvas, map) {
  const ctx = canvas.getContext('2d');
  map.draw(ctx, canvas.width, canvas.height);
}
