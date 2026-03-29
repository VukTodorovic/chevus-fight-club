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
      skyGrad.addColorStop(0, '#050210');
      skyGrad.addColorStop(0.5, '#0d0520');
      skyGrad.addColorStop(1, '#1a0a2e');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, groundY);

      // Stars
      const stars = [
        [0.05,0.08],[0.12,0.18],[0.18,0.05],[0.25,0.22],[0.32,0.1],
        [0.38,0.25],[0.42,0.06],[0.48,0.16],[0.55,0.03],[0.6,0.2],
        [0.65,0.12],[0.72,0.08],[0.78,0.24],[0.85,0.05],[0.9,0.18],
        [0.95,0.1],[0.08,0.28],[0.22,0.14],[0.35,0.03],[0.5,0.26],
        [0.58,0.09],[0.75,0.17],[0.88,0.27],[0.15,0.32],[0.68,0.3],
      ];
      for (const [sx, sy] of stars) {
        const brightness = 0.3 + (sx * 7 % 1) * 0.7;
        ctx.fillStyle = `rgba(255,255,220,${brightness})`;
        const size = (sy * 13 % 1) > 0.6 ? 2 : 1;
        ctx.fillRect(w * sx, groundY * sy, size, size);
      }

      // Moon (lower, with glow and crescent shadow)
      const moonX = w * 0.82;
      const moonY = groundY * 0.45;
      // Moon glow
      ctx.save();
      const moonGlow = ctx.createRadialGradient(moonX, moonY, 20, moonX, moonY, 100);
      moonGlow.addColorStop(0, 'rgba(255,238,180,0.15)');
      moonGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = moonGlow;
      ctx.fillRect(moonX - 100, moonY - 100, 200, 200);
      ctx.restore();
      // Moon disc
      ctx.fillStyle = '#ffeecc';
      ctx.beginPath();
      ctx.arc(moonX, moonY, 35, 0, Math.PI * 2);
      ctx.fill();
      // Crescent shadow
      ctx.fillStyle = '#0d0520';
      ctx.beginPath();
      ctx.arc(moonX + 12, moonY - 5, 30, 0, Math.PI * 2);
      ctx.fill();

      // Distant mountains silhouette
      ctx.fillStyle = '#12082a';
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(w * 0.05, groundY - 50);
      ctx.lineTo(w * 0.15, groundY - 100);
      ctx.lineTo(w * 0.25, groundY - 60);
      ctx.lineTo(w * 0.35, groundY - 120);
      ctx.lineTo(w * 0.45, groundY - 70);
      ctx.lineTo(w * 0.55, groundY - 90);
      ctx.lineTo(w * 0.65, groundY - 55);
      ctx.lineTo(w * 0.75, groundY - 110);
      ctx.lineTo(w * 0.85, groundY - 65);
      ctx.lineTo(w * 0.95, groundY - 85);
      ctx.lineTo(w, groundY - 40);
      ctx.lineTo(w, groundY);
      ctx.fill();

      // Torii gate (left side)
      const toriiX = w * 0.35;
      ctx.fillStyle = '#aa2222';
      // Vertical posts
      ctx.fillRect(toriiX - 30, groundY - 170, 8, 170);
      ctx.fillRect(toriiX + 22, groundY - 170, 8, 170);
      // Top beam (kasagi) - curved
      ctx.fillRect(toriiX - 40, groundY - 175, 80, 8);
      // Flared ends
      ctx.beginPath();
      ctx.moveTo(toriiX - 44, groundY - 175);
      ctx.lineTo(toriiX - 38, groundY - 185);
      ctx.lineTo(toriiX - 32, groundY - 175);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(toriiX + 32, groundY - 175);
      ctx.lineTo(toriiX + 38, groundY - 185);
      ctx.lineTo(toriiX + 44, groundY - 175);
      ctx.fill();
      // Second beam (nuki)
      ctx.fillRect(toriiX - 34, groundY - 155, 68, 6);

      // Torii gate (right side, smaller / further away)
      const torii2X = w * 0.65;
      ctx.fillStyle = '#882222';
      ctx.fillRect(torii2X - 22, groundY - 130, 6, 130);
      ctx.fillRect(torii2X + 16, groundY - 130, 6, 130);
      ctx.fillRect(torii2X - 30, groundY - 134, 60, 6);
      ctx.beginPath();
      ctx.moveTo(torii2X - 33, groundY - 134);
      ctx.lineTo(torii2X - 28, groundY - 142);
      ctx.lineTo(torii2X - 23, groundY - 134);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(torii2X + 23, groundY - 134);
      ctx.lineTo(torii2X + 28, groundY - 142);
      ctx.lineTo(torii2X + 33, groundY - 134);
      ctx.fill();
      ctx.fillRect(torii2X - 25, groundY - 118, 50, 5);

      // Background pillars (wooden dojo posts)
      ctx.fillStyle = '#2a1a3e';
      for (let i = 0; i < 5; i++) {
        const x = w * 0.1 + i * (w * 0.2);
        ctx.fillRect(x - 15, groundY - 200, 30, 200);
        // Pillar top - pagoda style bracket
        ctx.fillRect(x - 22, groundY - 200, 44, 10);
        ctx.fillRect(x - 18, groundY - 210, 36, 12);
      }

      // Hanging lanterns (paper style)
      ctx.shadowColor = '#ff6633';
      ctx.shadowBlur = 20;
      for (let i = 0; i < 4; i++) {
        const x = w * 0.15 + i * (w * 0.22);
        const ly = groundY - 160;
        // String
        ctx.strokeStyle = '#444';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, ly - 10);
        ctx.lineTo(x, ly);
        ctx.stroke();
        // Lantern body
        ctx.fillStyle = '#ff6633';
        ctx.fillRect(x - 7, ly, 14, 18);
        // Lantern bottom cap
        ctx.fillStyle = '#cc4422';
        ctx.fillRect(x - 5, ly + 18, 10, 3);
        // Lantern top cap
        ctx.fillRect(x - 5, ly - 2, 10, 3);
        // Kanji-style mark on lantern
        ctx.strokeStyle = '#881100';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x, ly + 4);
        ctx.lineTo(x, ly + 14);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x - 3, ly + 8);
        ctx.lineTo(x + 3, ly + 8);
        ctx.stroke();
      }
      ctx.shadowBlur = 0;

      // Cherry blossom petals scattered
      ctx.fillStyle = '#ffaabb';
      const petals = [
        [0.08,0.35],[0.2,0.4],[0.3,0.28],[0.42,0.38],[0.55,0.32],
        [0.62,0.42],[0.7,0.3],[0.82,0.36],[0.15,0.5],[0.45,0.48],
        [0.75,0.46],[0.9,0.44],[0.35,0.55],[0.58,0.52],[0.25,0.6],
      ];
      for (const [px, py] of petals) {
        ctx.save();
        ctx.translate(w * px, groundY * py);
        ctx.rotate(px * 20);
        ctx.beginPath();
        ctx.ellipse(0, 0, 3, 1.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Ground - tatami-style wooden floor
      const groundGrad = ctx.createLinearGradient(0, groundY, 0, h);
      groundGrad.addColorStop(0, '#5a4738');
      groundGrad.addColorStop(1, '#3a2718');
      ctx.fillStyle = groundGrad;
      ctx.fillRect(0, groundY, w, h - groundY);

      // Tatami grid lines
      ctx.strokeStyle = '#6a5748';
      ctx.lineWidth = 1;
      for (let i = 0; i < 8; i++) {
        const y = groundY + 10 + i * 15;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
      // Vertical tatami lines
      ctx.strokeStyle = '#5a4230';
      const tileW = 80;
      for (let tx = tileW; tx < w; tx += tileW) {
        ctx.beginPath();
        ctx.moveTo(tx, groundY);
        ctx.lineTo(tx, h);
        ctx.stroke();
      }

      // Dojo emblem on floor (circle with inner design)
      ctx.save();
      ctx.globalAlpha = 0.08;
      ctx.strokeStyle = '#ffcc88';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(w * 0.5, groundY + (h - groundY) * 0.5, 40, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(w * 0.5, groundY + (h - groundY) * 0.5, 25, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    },
    initEffects(effects, w, h) {
      const groundY = h * 0.75;
      // Shooting stars / comets
      for (let i = 0; i < 3; i++) {
        effects.push({
          type: 'comet',
          x: Math.random() * w * 2,
          y: Math.random() * groundY * 0.4,
          speed: 3 + Math.random() * 4,
          length: 40 + Math.random() * 60,
          opacity: 0,
          delay: Math.random() * 300,
          life: 0,
          maxLife: 80 + Math.random() * 60,
        });
      }
      // Floating cherry blossom petals
      for (let i = 0; i < 12; i++) {
        effects.push({
          type: 'petal',
          x: Math.random() * w,
          y: Math.random() * groundY,
          vx: 0.2 + Math.random() * 0.5,
          vy: 0.3 + Math.random() * 0.4,
          rot: Math.random() * Math.PI * 2,
          rotSpeed: 0.02 + Math.random() * 0.04,
          size: 2 + Math.random() * 2,
          groundY: groundY,
        });
      }
      // Lantern flicker
      effects.push({ type: 'lanternFlicker', phase: 0 });
    },
    updateEffects(effects, w, h) {
      const groundY = h * 0.75;
      for (const e of effects) {
        if (e.type === 'comet') {
          if (e.delay > 0) { e.delay--; continue; }
          e.life++;
          e.x -= e.speed;
          e.y += e.speed * 0.4;
          // Fade in then out
          if (e.life < 15) e.opacity = e.life / 15;
          else if (e.life > e.maxLife - 20) e.opacity = (e.maxLife - e.life) / 20;
          else e.opacity = 1;
          // Reset when done
          if (e.life >= e.maxLife) {
            e.x = w + Math.random() * w * 0.5;
            e.y = Math.random() * groundY * 0.3;
            e.life = 0;
            e.delay = 100 + Math.random() * 400;
            e.opacity = 0;
            e.speed = 3 + Math.random() * 4;
            e.maxLife = 80 + Math.random() * 60;
          }
        } else if (e.type === 'petal') {
          e.x += e.vx + Math.sin(e.rot * 2) * 0.3;
          e.y += e.vy;
          e.rot += e.rotSpeed;
          if (e.y > e.groundY || e.x > w + 20) {
            e.x = -10 + Math.random() * w * 0.3;
            e.y = -10;
          }
        } else if (e.type === 'lanternFlicker') {
          e.phase += 0.05;
        }
      }
    },
    drawEffects(ctx, effects, w, h) {
      for (const e of effects) {
        if (e.type === 'comet' && e.opacity > 0) {
          ctx.save();
          ctx.globalAlpha = e.opacity * 0.8;
          // Comet tail
          const grad = ctx.createLinearGradient(e.x, e.y, e.x + e.length, e.y - e.length * 0.4);
          grad.addColorStop(0, '#ffffff');
          grad.addColorStop(0.3, '#ffddaa');
          grad.addColorStop(1, 'transparent');
          ctx.strokeStyle = grad;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(e.x, e.y);
          ctx.lineTo(e.x + e.length, e.y - e.length * 0.4);
          ctx.stroke();
          // Comet head
          ctx.fillStyle = '#fff';
          ctx.beginPath();
          ctx.arc(e.x, e.y, 2.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else if (e.type === 'petal') {
          ctx.save();
          ctx.globalAlpha = 0.7;
          ctx.translate(e.x, e.y);
          ctx.rotate(e.rot);
          ctx.fillStyle = '#ffaabb';
          ctx.beginPath();
          ctx.ellipse(0, 0, e.size, e.size * 0.5, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else if (e.type === 'lanternFlicker') {
          // Draw subtle flickering glow on lanterns
          ctx.save();
          const flicker = 0.7 + Math.sin(e.phase) * 0.15 + Math.sin(e.phase * 2.7) * 0.1;
          ctx.globalAlpha = flicker * 0.15;
          const groundY = h * 0.75;
          for (let i = 0; i < 4; i++) {
            const x = w * 0.15 + i * (w * 0.22);
            const ly = groundY - 151;
            ctx.fillStyle = '#ff8844';
            ctx.beginPath();
            ctx.arc(x, ly, 25, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }
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
      const stars = [
        [0.1,0.05],[0.25,0.12],[0.4,0.08],[0.55,0.2],[0.7,0.15],
        [0.85,0.03],[0.15,0.22],[0.35,0.18],[0.6,0.1],[0.8,0.07],
        [0.05,0.25],[0.45,0.13],[0.75,0.02],[0.92,0.19],[0.3,0.11],
        [0.18,0.06],[0.52,0.24],[0.67,0.04],[0.83,0.16],[0.02,0.14],
        [0.38,0.27],[0.72,0.21],[0.48,0.03],[0.62,0.28],[0.22,0.09],
      ];
      for (const [sx, sy] of stars) {
        const brightness = 0.3 + (sx * 7 % 1) * 0.7;
        ctx.fillStyle = `rgba(255,255,240,${brightness})`;
        const size = (sy * 13 % 1) > 0.6 ? 2 : 1;
        ctx.fillRect(w * sx, groundY * sy, size, size);
      }

      // Moon
      const moonX = w * 0.12;
      const moonY = groundY * 0.25;
      ctx.save();
      const moonGlow = ctx.createRadialGradient(moonX, moonY, 15, moonX, moonY, 80);
      moonGlow.addColorStop(0, 'rgba(200,220,255,0.12)');
      moonGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = moonGlow;
      ctx.fillRect(moonX - 80, moonY - 80, 160, 160);
      ctx.fillStyle = '#ddeeff';
      ctx.beginPath();
      ctx.arc(moonX, moonY, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#050a14';
      ctx.beginPath();
      ctx.arc(moonX + 8, moonY - 4, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // City skyline with varied shapes
      ctx.fillStyle = '#111828';
      const buildings = [
        [0.05, 0.4, 0.06], [0.12, 0.35, 0.055], [0.2, 0.5, 0.065],
        [0.28, 0.3, 0.05], [0.35, 0.45, 0.06], [0.42, 0.25, 0.055],
        [0.5, 0.38, 0.06], [0.58, 0.42, 0.065], [0.65, 0.32, 0.05],
        [0.72, 0.48, 0.06], [0.8, 0.28, 0.055], [0.88, 0.44, 0.06]
      ];
      buildings.forEach(([x, heightRatio, bw], idx) => {
        const bh = groundY * heightRatio;
        const bx = w * x;
        const bWidth = w * bw;
        const topY = groundY - bh;
        ctx.fillStyle = '#111828';
        ctx.fillRect(bx, topY, bWidth, bh);

        // Roof details on some buildings
        if (idx === 3 || idx === 8) {
          // Pointed roof
          ctx.beginPath();
          ctx.moveTo(bx, topY);
          ctx.lineTo(bx + bWidth / 2, topY - 15);
          ctx.lineTo(bx + bWidth, topY);
          ctx.fill();
        }
        if (idx === 5) {
          // Penthouse lit top
          ctx.fillStyle = '#1a2838';
          ctx.fillRect(bx + 8, topY - 12, bWidth - 16, 12);
          ctx.fillStyle = '#445566';
          ctx.fillRect(bx + 10, topY - 10, bWidth - 20, 8);
        }

        // Windows
        for (let wy = topY + 8; wy < groundY - 10; wy += 14) {
          for (let wx = bx + 4; wx < bx + bWidth - 4; wx += 10) {
            if (Math.random() > 0.3) {
              ctx.fillStyle = Math.random() > 0.7 ? '#556688' : (Math.random() > 0.5 ? '#334466' : '#223344');
              ctx.fillRect(wx, wy, 5, 7);
            }
          }
        }
      });

      // Water tower on distant building
      const wtX = w * 0.75;
      const wtBldgTop = groundY - groundY * 0.48;
      ctx.fillStyle = '#0d1420';
      // Tower legs
      ctx.fillRect(wtX + 2, wtBldgTop - 30, 3, 18);
      ctx.fillRect(wtX + 18, wtBldgTop - 30, 3, 18);
      // Tank
      ctx.fillRect(wtX - 2, wtBldgTop - 45, 28, 18);
      // Cone top
      ctx.beginPath();
      ctx.moveTo(wtX - 2, wtBldgTop - 45);
      ctx.lineTo(wtX + 12, wtBldgTop - 55);
      ctx.lineTo(wtX + 26, wtBldgTop - 45);
      ctx.fill();

      // Antenna on tall building
      const antX = w * 0.28 + w * 0.025;
      const antTop = groundY - groundY * 0.3;
      ctx.strokeStyle = '#1a2535';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(antX, antTop);
      ctx.lineTo(antX, antTop - 40);
      ctx.stroke();
      // Antenna cross-bars
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(antX - 8, antTop - 30);
      ctx.lineTo(antX + 8, antTop - 30);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(antX - 5, antTop - 36);
      ctx.lineTo(antX + 5, antTop - 36);
      ctx.stroke();

      // Satellite dish on building
      const dishX = w * 0.6;
      const dishY = groundY - groundY * 0.42 + 5;
      ctx.fillStyle = '#1a2535';
      ctx.beginPath();
      ctx.arc(dishX, dishY, 8, Math.PI * 0.8, Math.PI * 1.8);
      ctx.lineTo(dishX, dishY);
      ctx.fill();
      ctx.strokeStyle = '#1a2535';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(dishX, dishY);
      ctx.lineTo(dishX + 5, dishY - 10);
      ctx.stroke();

      // Rooftop ground
      const groundGrad = ctx.createLinearGradient(0, groundY, 0, h);
      groundGrad.addColorStop(0, '#4a4a4a');
      groundGrad.addColorStop(1, '#383838');
      ctx.fillStyle = groundGrad;
      ctx.fillRect(0, groundY, w, h - groundY);

      // Rooftop texture lines
      ctx.strokeStyle = '#505050';
      ctx.lineWidth = 1;
      for (let tx = 0; tx < w; tx += 50) {
        ctx.beginPath();
        ctx.moveTo(tx, groundY);
        ctx.lineTo(tx, h);
        ctx.stroke();
      }

      // Puddles on rooftop
      ctx.save();
      ctx.globalAlpha = 0.15;
      const puddles = [[0.2, 0.82], [0.55, 0.85], [0.78, 0.8]];
      for (const [px, py] of puddles) {
        const pudGrad = ctx.createRadialGradient(w * px, h * py, 0, w * px, h * py, 25);
        pudGrad.addColorStop(0, '#4488ff');
        pudGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = pudGrad;
        ctx.beginPath();
        ctx.ellipse(w * px, h * py, 30, 8, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // AC units on rooftop
      const drawAC = (ax, ay, sz) => {
        ctx.fillStyle = '#555';
        ctx.fillRect(ax, ay - sz, sz * 1.5, sz);
        ctx.fillStyle = '#4a4a4a';
        ctx.fillRect(ax + 2, ay - sz + 2, sz * 1.5 - 4, sz - 4);
        // Vent slats
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 1;
        for (let s = 0; s < 3; s++) {
          const sy = ay - sz + 5 + s * (sz / 4);
          ctx.beginPath();
          ctx.moveTo(ax + 4, sy);
          ctx.lineTo(ax + sz * 1.5 - 4, sy);
          ctx.stroke();
        }
        // Top fan grill
        ctx.strokeStyle = '#5a5a5a';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(ax + sz * 0.75, ay - sz - 1, sz * 0.3, 0, Math.PI, true);
        ctx.stroke();
      };
      drawAC(w * 0.08, groundY, 20);
      drawAC(w * 0.88, groundY, 18);

      // Pipes along rooftop edge
      ctx.strokeStyle = '#5a5a5a';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(w * 0.06, groundY - 5);
      ctx.lineTo(w * 0.22, groundY - 5);
      ctx.lineTo(w * 0.22, groundY - 15);
      ctx.lineTo(w * 0.25, groundY - 15);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(w * 0.82, groundY - 8);
      ctx.lineTo(w * 0.94, groundY - 8);
      ctx.stroke();
      // Pipe joint
      ctx.fillStyle = '#666';
      ctx.beginPath();
      ctx.arc(w * 0.22, groundY - 15, 4, 0, Math.PI * 2);
      ctx.fill();

      // Graffiti on ledge wall
      ctx.save();
      ctx.globalAlpha = 0.4;
      ctx.font = 'bold 10px sans-serif';
      ctx.fillStyle = '#ff4466';
      ctx.fillText('CHEVU', w * 0.32, groundY - 3);
      ctx.fillStyle = '#44ffaa';
      ctx.font = 'italic 8px sans-serif';
      ctx.fillText('WUZ HERE', w * 0.62, groundY - 4);
      ctx.fillStyle = '#ffaa22';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText('★', w * 0.48, groundY - 2);
      ctx.restore();

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

      // Neon sign on central building
      const signX = w * 0.42;
      const signBldgH = groundY * 0.25;
      const signY = groundY - signBldgH + 20;
      ctx.save();
      ctx.fillStyle = '#4488ff';
      ctx.shadowColor = '#4488ff';
      ctx.shadowBlur = 40;
      ctx.font = 'bold 28px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('FIGHT', signX + w * 0.03, signY);
      ctx.shadowBlur = 0;
      ctx.restore();
    },
    initEffects(effects, w, h) {
      effects.push({ type: 'neonFlicker', phase: 0, on: true, nextToggle: 60 });
      // Steam vents
      const groundY = h * 0.75;
      for (let i = 0; i < 12; i++) {
        effects.push({
          type: 'steam',
          x: w * 0.09 + Math.random() * w * 0.02,
          y: groundY - 20,
          vy: -0.5 - Math.random() * 0.8,
          vx: 0.2 + Math.random() * 0.3,
          size: 3 + Math.random() * 4,
          life: Math.random() * 60,
          maxLife: 60 + Math.random() * 40,
          source: Math.random() > 0.5 ? 0 : 1, // which AC unit
        });
      }
      // Airplane
      effects.push({
        type: 'airplane',
        x: -30,
        y: h * 0.08 + Math.random() * h * 0.1,
        speed: 0.4 + Math.random() * 0.3,
        blinkPhase: 0,
      });
    },
    updateEffects(effects, w, h) {
      const groundY = h * 0.75;
      for (const e of effects) {
        if (e.type === 'neonFlicker') {
          e.phase++;
          e.nextToggle--;
          if (e.nextToggle <= 0) {
            e.on = !e.on;
            e.nextToggle = e.on ? (40 + Math.random() * 120) : (2 + Math.random() * 8);
          }
        } else if (e.type === 'steam') {
          e.life++;
          e.x += e.vx;
          e.y += e.vy;
          e.size += 0.05;
          if (e.life >= e.maxLife) {
            const srcX = e.source === 0 ? w * 0.09 : w * 0.89;
            e.x = srcX + Math.random() * w * 0.02;
            e.y = groundY - 20;
            e.life = 0;
            e.size = 3 + Math.random() * 4;
            e.vy = -0.5 - Math.random() * 0.8;
            e.vx = (e.source === 0 ? 1 : -1) * (0.2 + Math.random() * 0.3);
          }
        } else if (e.type === 'airplane') {
          e.x += e.speed;
          e.blinkPhase += 0.1;
          if (e.x > w + 50) {
            e.x = -50;
            e.y = h * 0.05 + Math.random() * h * 0.12;
            e.speed = 0.3 + Math.random() * 0.3;
          }
        }
      }
    },
    drawEffects(ctx, effects, w, h) {
      const groundY = h * 0.75;
      const signX = w * 0.42;
      const signBldgH = groundY * 0.25;
      const signY = groundY - signBldgH + 20;
      for (const e of effects) {
        if (e.type === 'neonFlicker') {
          ctx.save();
          if (e.on) {
            const pulse = 0.6 + Math.sin(e.phase * 0.3) * 0.15;
            ctx.globalAlpha = pulse * 0.25;
            ctx.fillStyle = '#4488ff';
            ctx.shadowColor = '#4488ff';
            ctx.shadowBlur = 60;
            ctx.font = 'bold 28px monospace';
            ctx.textAlign = 'center';
            ctx.fillText('FIGHT', signX + w * 0.03, signY);
            ctx.fillText('FIGHT', signX + w * 0.03, signY);
            ctx.shadowBlur = 0;
          } else {
            ctx.globalAlpha = 0.15;
            ctx.fillStyle = '#223355';
            ctx.font = 'bold 28px monospace';
            ctx.textAlign = 'center';
            ctx.fillText('FIGHT', signX + w * 0.03, signY);
          }
          ctx.restore();
        } else if (e.type === 'steam') {
          const alpha = 1 - (e.life / e.maxLife);
          if (alpha > 0) {
            ctx.save();
            ctx.globalAlpha = alpha * 0.25;
            ctx.fillStyle = '#aabbcc';
            ctx.beginPath();
            ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        } else if (e.type === 'airplane') {
          ctx.save();
          // Airplane body (tiny silhouette)
          ctx.fillStyle = '#1a2535';
          ctx.fillRect(e.x - 6, e.y - 1, 12, 3);
          // Wings
          ctx.fillRect(e.x - 2, e.y - 4, 4, 9);
          // Tail
          ctx.fillRect(e.x - 7, e.y - 3, 3, 5);
          // Blinking light
          const blink = Math.sin(e.blinkPhase) > 0.7;
          if (blink) {
            ctx.fillStyle = '#ff2222';
            ctx.shadowColor = '#ff2222';
            ctx.shadowBlur = 6;
            ctx.beginPath();
            ctx.arc(e.x, e.y - 1, 1.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
          }
          // Navigation lights
          ctx.fillStyle = '#44ff44';
          ctx.fillRect(e.x - 2, e.y - 4, 1, 1);
          ctx.fillStyle = '#ff4444';
          ctx.fillRect(e.x + 1, e.y + 3, 1, 1);
          ctx.restore();
        }
      }
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

      // Crowd silhouettes (rows of heads + bodies)
      for (let row = 0; row < 5; row++) {
        const rowY = groundY - 40 - row * 35;
        const shade = 0.15 + row * 0.05; // back rows slightly lighter
        ctx.fillStyle = `rgba(80,30,30,${shade})`;
        // Body mass (continuous bar behind heads)
        ctx.fillRect(0, rowY, w, 35);
        // Individual heads
        const headSize = 6 + row * 1.5;
        const count = 25 + row * 5;
        for (let i = 0; i < count; i++) {
          const x = (w / count) * i + (w / count) * 0.5;
          const yOff = Math.sin(i * 1.7 + row) * 3; // slight variation
          // Head
          ctx.fillStyle = `rgba(100,40,40,${0.4 + row * 0.1})`;
          ctx.beginPath();
          ctx.arc(x, rowY - headSize * 0.3 + yOff, headSize, 0, Math.PI * 2);
          ctx.fill();
          // Shoulders
          ctx.fillStyle = `rgba(70,25,25,${0.35 + row * 0.08})`;
          ctx.beginPath();
          ctx.ellipse(x, rowY + headSize * 0.6 + yOff, headSize * 1.2, headSize * 0.6, 0, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Spotlights (cone beams from above down to the floor)
      const spotOriginY = groundY * 0.35;
      const drawSpotCone = (originX) => {
        ctx.save();
        // Light cone shape
        ctx.globalAlpha = 0.12;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(originX - 15, spotOriginY);
        ctx.lineTo(originX - w * 0.12, h);
        ctx.lineTo(originX + w * 0.12, h);
        ctx.lineTo(originX + 15, spotOriginY);
        ctx.closePath();
        ctx.fill();
        // Brighter inner cone
        ctx.globalAlpha = 0.08;
        ctx.beginPath();
        ctx.moveTo(originX - 8, spotOriginY);
        ctx.lineTo(originX - w * 0.06, h);
        ctx.lineTo(originX + w * 0.06, h);
        ctx.lineTo(originX + 8, spotOriginY);
        ctx.closePath();
        ctx.fill();
        // Floor pool of light
        ctx.globalAlpha = 0.1;
        const poolGrad = ctx.createRadialGradient(originX, groundY + 10, 0, originX, groundY + 10, w * 0.12);
        poolGrad.addColorStop(0, '#ffffff');
        poolGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = poolGrad;
        ctx.fillRect(originX - w * 0.15, groundY, w * 0.3, h - groundY);
        // Light source glow
        ctx.globalAlpha = 0.3;
        const srcGlow = ctx.createRadialGradient(originX, spotOriginY, 0, originX, spotOriginY, 20);
        srcGlow.addColorStop(0, '#ffffff');
        srcGlow.addColorStop(1, 'transparent');
        ctx.fillStyle = srcGlow;
        ctx.fillRect(originX - 20, spotOriginY - 20, 40, 40);
        ctx.restore();
      };
      drawSpotCone(w * 0.3);
      drawSpotCone(w * 0.7);

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
    },
    initEffects(effects, w, h) {
      // Sweeping spotlights
      effects.push({ type: 'spotlight', angle: 0, speed: 0.008, side: 'left' });
      effects.push({ type: 'spotlight', angle: Math.PI, speed: -0.006, side: 'right' });
      // Crowd movement (random arms raising)
      for (let i = 0; i < 24; i++) {
        const row = Math.floor(Math.random() * 5);
        const count = 25 + row * 5;
        effects.push({
          type: 'crowdArm',
          col: Math.floor(Math.random() * count),
          colCount: count,
          row: row,
          phase: Math.random() * Math.PI * 2,
          speed: 0.03 + Math.random() * 0.04,
          side: Math.random() > 0.5 ? 1 : -1,
        });
      }
      // Banners held by crowd members (ensure no duplicates at same row+col)
      const bannerColors = ['#ff4444', '#4488ff', '#ffcc00', '#44ff44', '#ff88ff', '#ff8800'];
      const bannerTexts = ['GO!', 'KO!', 'WIN', 'FIGHT', '!!!', '#1'];
      const usedSlots = new Set();
      let placed = 0;
      while (placed < 15) {
        const row = 2 + Math.floor(Math.random() * 3);
        const count = 25 + row * 5;
        const col = Math.floor(Math.random() * count);
        const key = `${row}_${col}`;
        if (usedSlots.has(key)) continue;
        usedSlots.add(key);
        effects.push({
          type: 'banner',
          col: col,
          colCount: count,
          row: row,
          color: bannerColors[placed % bannerColors.length],
          text: bannerTexts[placed % bannerTexts.length],
          phase: Math.random() * Math.PI * 2,
          speed: 0.02 + Math.random() * 0.02,
        });
        placed++;
      }
    },
    updateEffects(effects) {
      for (const e of effects) {
        if (e.type === 'spotlight') {
          e.angle += e.speed;
        } else if (e.type === 'crowdArm' || e.type === 'banner') {
          e.phase += e.speed;
        }
      }
    },
    drawEffects(ctx, effects, w, h) {
      const groundY = h * 0.75;
      for (const e of effects) {
        if (e.type === 'spotlight') {
          ctx.save();
          const cx = e.side === 'left' ? w * 0.2 : w * 0.8;
          const offset = Math.sin(e.angle) * w * 0.25;
          const originX = cx + offset;
          // Sweeping cone from top down to floor level
          ctx.globalAlpha = 0.06;
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.moveTo(originX - 10, 0);
          ctx.lineTo(originX - w * 0.1, groundY);
          ctx.lineTo(originX + w * 0.1, groundY);
          ctx.lineTo(originX + 10, 0);
          ctx.closePath();
          ctx.fill();
          // Floor pool
          ctx.globalAlpha = 0.05;
          const poolGrad = ctx.createRadialGradient(originX, groundY, 0, originX, groundY, w * 0.1);
          poolGrad.addColorStop(0, '#ffffff');
          poolGrad.addColorStop(1, 'transparent');
          ctx.fillStyle = poolGrad;
          ctx.fillRect(originX - w * 0.12, groundY, w * 0.24, h - groundY);
          ctx.restore();
        } else if (e.type === 'crowdArm') {
          const armUp = (Math.sin(e.phase) + 1) / 2; // 0 to 1
          if (armUp > 0.5) {
            const headSize = 6 + e.row * 1.5;
            const x = (w / e.colCount) * e.col + (w / e.colCount) * 0.5;
            const rowY = groundY - 40 - e.row * 35;
            const yOff = Math.sin(e.col * 1.7 + e.row) * 3;
            const headCenterY = rowY - headSize * 0.3 + yOff;
            const shoulderX = x + e.side * headSize * 0.8;
            const shoulderY = headCenterY + headSize * 0.5;
            const armLen = 15 + armUp * 10;
            const tipX = shoulderX + e.side * armLen * 0.3;
            const tipY = shoulderY - armLen;
            ctx.save();
            ctx.strokeStyle = `rgba(120,50,50,${0.5 + armUp * 0.3})`;
            ctx.lineWidth = 3;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(shoulderX, shoulderY);
            ctx.lineTo(tipX, tipY);
            ctx.stroke();
            ctx.fillStyle = `rgba(140,60,60,${0.5 + armUp * 0.3})`;
            ctx.beginPath();
            ctx.arc(tipX, tipY, 2.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        } else if (e.type === 'banner') {
          const headSize = 6 + e.row * 1.5;
          const x = (w / e.colCount) * e.col + (w / e.colCount) * 0.5;
          const rowY = groundY - 40 - e.row * 35;
          const yOff = Math.sin(e.col * 1.7 + e.row) * 3;
          const headCenterY = rowY - headSize * 0.3 + yOff;
          // Sway
          const sway = Math.sin(e.phase) * 3;
          // Stick
          const stickBaseY = headCenterY - headSize;
          const stickTopY = stickBaseY - 35;
          const stickTopX = x + sway;
          ctx.save();
          ctx.strokeStyle = `rgba(160,140,100,0.6)`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(x, stickBaseY);
          ctx.lineTo(stickTopX, stickTopY);
          ctx.stroke();
          // Banner rectangle
          const bannerW = 28;
          const bannerH = 16;
          ctx.fillStyle = e.color;
          ctx.globalAlpha = 0.7;
          ctx.fillRect(stickTopX, stickTopY, bannerW, bannerH);
          // Border
          ctx.strokeStyle = 'rgba(255,255,255,0.3)';
          ctx.lineWidth = 1;
          ctx.strokeRect(stickTopX, stickTopY, bannerW, bannerH);
          // Text
          ctx.globalAlpha = 0.9;
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 8px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(e.text, stickTopX + bannerW / 2, stickTopY + bannerH / 2);
          ctx.restore();
        }
      }
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
    },
    initEffects(effects, w, h) {
      const groundY = h * 0.75;
      // Flickering PC monitors
      for (let i = 0; i < 5; i++) {
        effects.push({
          type: 'pcScreen',
          index: i,
          phase: Math.random() * Math.PI * 2,
          speed: 0.03 + Math.random() * 0.04,
          colorShift: Math.random(),
        });
      }
      // TV screen glow
      effects.push({
        type: 'tvScreen',
        phase: Math.random() * Math.PI * 2,
        speed: 0.02 + Math.random() * 0.02,
        colorShift: Math.random(),
      });
      // Ceiling light flicker (per fixture)
      const lightPositions = [0.15, 0.35, 0.55, 0.75, 0.9];
      for (let i = 0; i < lightPositions.length; i++) {
        effects.push({
          type: 'ceilingLight',
          lx: lightPositions[i],
          phase: Math.random() * Math.PI * 2,
          speed: 0.03 + Math.random() * 0.03,
          flickerChance: 0.003, // small chance to briefly dim
          dimmed: false,
          dimTimer: 0,
        });
      }
    },
    updateEffects(effects) {
      for (const e of effects) {
        if (e.type === 'pcScreen') {
          e.phase += e.speed;
          e.colorShift += 0.002;
          if (e.colorShift > 1) e.colorShift -= 1;
        } else if (e.type === 'tvScreen') {
          e.phase += e.speed;
          e.colorShift += 0.001;
          if (e.colorShift > 1) e.colorShift -= 1;
        } else if (e.type === 'ceilingLight') {
          e.phase += e.speed;
          if (e.dimmed) {
            e.dimTimer--;
            if (e.dimTimer <= 0) e.dimmed = false;
          } else if (Math.random() < e.flickerChance) {
            e.dimmed = true;
            e.dimTimer = 3 + Math.floor(Math.random() * 8);
          }
        }
      }
    },
    drawEffects(ctx, effects, w, h) {
      const groundY = h * 0.75;
      const wallHeight = groundY;
      for (const e of effects) {
        if (e.type === 'pcScreen') {
          const pcStartX = w * 0.18;
          const pcSpacing = w * 0.09;
          const px = pcStartX + e.index * pcSpacing;
          const deskTopY = groundY - 50;
          const monX = px + 8;
          const monY = deskTopY - 32;
          const monW = 34;
          const monH = 26;
          const monCX = monX + monW / 2;
          const monCY = monY + monH / 2;
          ctx.save();
          const brightness = 0.5 + Math.sin(e.phase) * 0.2;
          const hue = Math.floor(e.colorShift * 360);
          // Screen color overlay
          ctx.globalAlpha = brightness * 0.35;
          ctx.fillStyle = `hsl(${hue}, 70%, 55%)`;
          ctx.fillRect(monX + 2, monY + 2, monW - 4, monH - 4);
          // Glow around monitor
          ctx.globalAlpha = brightness * 0.2;
          const glow = ctx.createRadialGradient(monCX, monCY, 5, monCX, monCY, 45);
          glow.addColorStop(0, `hsl(${hue}, 80%, 60%)`);
          glow.addColorStop(1, 'transparent');
          ctx.fillStyle = glow;
          ctx.fillRect(monCX - 50, monCY - 50, 100, 100);
          // Light spill on desk
          ctx.globalAlpha = brightness * 0.1;
          ctx.fillStyle = `hsl(${hue}, 70%, 50%)`;
          ctx.fillRect(px, deskTopY, 50, 10);
          ctx.restore();
        } else if (e.type === 'tvScreen') {
          // TV position matches static draw
          const couchX = w * 0.72;
          const couchW = w * 0.18;
          const tvX = couchX + couchW * 0.15;
          const tvW = couchW * 0.7;
          const tvH = 45;
          const tvY = groundY - 130;
          const tvCX = tvX + tvW / 2;
          const tvCY = tvY + tvH / 2;
          const brightness = 0.5 + Math.sin(e.phase) * 0.2;
          const hue = Math.floor(e.colorShift * 360);
          ctx.save();
          // Screen color overlay
          ctx.globalAlpha = brightness * 0.3;
          ctx.fillStyle = `hsl(${hue}, 60%, 50%)`;
          ctx.fillRect(tvX + 2, tvY + 2, tvW - 4, tvH - 4);
          // Glow around TV
          ctx.globalAlpha = brightness * 0.15;
          const glow = ctx.createRadialGradient(tvCX, tvCY, 10, tvCX, tvCY, 80);
          glow.addColorStop(0, `hsl(${hue}, 70%, 55%)`);
          glow.addColorStop(1, 'transparent');
          ctx.fillStyle = glow;
          ctx.fillRect(tvCX - 90, tvCY - 90, 180, 180);
          // Light spill on couch below
          ctx.globalAlpha = brightness * 0.08;
          ctx.fillStyle = `hsl(${hue}, 60%, 45%)`;
          const couchY = groundY - 40;
          ctx.fillRect(couchX, couchY - 25, couchW, 65);
          ctx.restore();
        } else if (e.type === 'ceilingLight') {
          ctx.save();
          const x = w * e.lx;
          const intensity = e.dimmed ? 0.01 : (0.04 + Math.sin(e.phase) * 0.01);
          ctx.globalAlpha = intensity;
          ctx.fillStyle = '#ffcc00';
          // Light cone matching static draw
          ctx.beginPath();
          ctx.moveTo(x - 10, 9);
          ctx.lineTo(x - 80, groundY);
          ctx.lineTo(x + 80, groundY);
          ctx.lineTo(x + 10, 9);
          ctx.closePath();
          ctx.fill();
          // Floor pool
          ctx.globalAlpha = e.dimmed ? 0.005 : (0.03 + Math.sin(e.phase) * 0.01);
          const pool = ctx.createRadialGradient(x, groundY, 0, x, groundY, 60);
          pool.addColorStop(0, '#ffcc00');
          pool.addColorStop(1, 'transparent');
          ctx.fillStyle = pool;
          ctx.fillRect(x - 60, groundY, 120, 30);
          ctx.restore();
        }
      }
    }
  },
  {
    id: 'beach',
    name: 'THE BEACH',
    skyColor: '#1a8aff',
    groundColor: '#e8c872',
    accentColor: '#ff8800',
    draw(ctx, w, h) {
      const groundY = h * 0.75;

      // Sky gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, groundY * 0.8);
      skyGrad.addColorStop(0, '#1a8aff');
      skyGrad.addColorStop(1, '#88ccff');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, groundY);

      // Sun
      const sunY = groundY * 0.55;
      ctx.fillStyle = '#ffee44';
      ctx.shadowColor = '#ffcc00';
      ctx.shadowBlur = 60;
      ctx.beginPath();
      ctx.arc(w * 0.82, sunY, 35, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Sun rays
      ctx.save();
      ctx.globalAlpha = 0.08;
      ctx.fillStyle = '#ffee44';
      for (let i = 0; i < 12; i++) {
        ctx.save();
        ctx.translate(w * 0.82, sunY);
        ctx.rotate(i * Math.PI / 6);
        ctx.fillRect(-3, -80, 6, 50);
        ctx.restore();
      }
      ctx.restore();

      // Clouds
      const drawCloud = (cx, cy, size) => {
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.beginPath();
        ctx.arc(cx, cy, size, 0, Math.PI * 2);
        ctx.arc(cx + size * 0.8, cy - size * 0.2, size * 0.7, 0, Math.PI * 2);
        ctx.arc(cx - size * 0.6, cy - size * 0.1, size * 0.6, 0, Math.PI * 2);
        ctx.arc(cx + size * 0.3, cy - size * 0.4, size * 0.5, 0, Math.PI * 2);
        ctx.fill();
      };
      drawCloud(w * 0.15, groundY * 0.48, 18);
      drawCloud(w * 0.45, groundY * 0.42, 14);
      drawCloud(w * 0.65, groundY * 0.56, 12);

      // Sea / ocean
      const seaTop = groundY * 0.78;
      const seaGrad = ctx.createLinearGradient(0, seaTop, 0, groundY);
      seaGrad.addColorStop(0, '#0066aa');
      seaGrad.addColorStop(0.4, '#0077bb');
      seaGrad.addColorStop(0.8, '#2299cc');
      seaGrad.addColorStop(1, '#55ccee');
      ctx.fillStyle = seaGrad;
      ctx.fillRect(0, seaTop, w, groundY - seaTop);

      // Waves
      ctx.strokeStyle = 'rgba(255,255,255,0.25)';
      ctx.lineWidth = 2;
      for (let row = 0; row < 5; row++) {
        const wy = seaTop + 20 + row * ((groundY - seaTop) / 5);
        ctx.beginPath();
        for (let x = 0; x < w; x += 4) {
          const y = wy + Math.sin(x * 0.03 + row * 2) * 4;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // Boats
      const drawSailboat = (bx, by, size, sailColor) => {
        // Hull
        ctx.fillStyle = '#553322';
        ctx.fillRect(bx - size, by, size * 2, size * 0.25);
        // Mast
        ctx.strokeStyle = '#442211';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(bx, by);
        ctx.lineTo(bx, by - size * 1.1);
        ctx.stroke();
        // Sail
        ctx.fillStyle = sailColor;
        ctx.beginPath();
        ctx.moveTo(bx, by - size * 1.1);
        ctx.lineTo(bx, by);
        ctx.lineTo(bx + size, by);
        ctx.fill();
      };

      drawSailboat(w * 0.12, seaTop + 18, 10, '#ffffff');
      drawSailboat(w * 0.3, seaTop + 28, 12, '#fff');
      drawSailboat(w * 0.52, seaTop + 14, 8, '#ffcccc');
      drawSailboat(w * 0.68, seaTop + 32, 11, '#ccddff');
      drawSailboat(w * 0.88, seaTop + 20, 9, '#ffffcc');

      // Shore foam line
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.beginPath();
      for (let x = 0; x < w; x += 4) {
        const y = groundY - 2 + Math.sin(x * 0.05) * 3;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.lineTo(w, groundY + 4);
      ctx.lineTo(0, groundY + 4);
      ctx.fill();

      // Sand
      const sandGrad = ctx.createLinearGradient(0, groundY, 0, h);
      sandGrad.addColorStop(0, '#f0d878');
      sandGrad.addColorStop(0.3, '#e8c872');
      sandGrad.addColorStop(1, '#d4b060');
      ctx.fillStyle = sandGrad;
      ctx.fillRect(0, groundY, w, h - groundY);

      // Sand texture dots
      ctx.fillStyle = 'rgba(180,150,80,0.3)';
      const sandDots = [
        0.05,0.12,0.19,0.27,0.34,0.41,0.48,0.55,0.63,0.7,0.78,0.85,0.92,
        0.08,0.16,0.24,0.31,0.38,0.45,0.52,0.6,0.67,0.74,0.82,0.89,0.96
      ];
      for (let i = 0; i < sandDots.length; i++) {
        const sx = w * sandDots[i];
        const sy = groundY + 8 + (i % 3) * 20 + (i % 5) * 8;
        ctx.fillRect(sx, sy, 2, 2);
      }

      // Shells
      ctx.fillStyle = '#eeddcc';
      ctx.beginPath();
      ctx.arc(w * 0.25, groundY + 15, 4, 0, Math.PI);
      ctx.fill();
      ctx.fillStyle = '#ffccaa';
      ctx.beginPath();
      ctx.arc(w * 0.7, groundY + 22, 3, 0, Math.PI);
      ctx.fill();

      // Palm tree helper
      const drawPalm = (px, py, trunkH, lean) => {
        // Trunk
        ctx.strokeStyle = '#8B6914';
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.moveTo(px, py);
        const topX = px + lean;
        const topY = py - trunkH;
        const cp1x = px + lean * 0.3;
        const cp1y = py - trunkH * 0.5;
        ctx.quadraticCurveTo(cp1x, cp1y, topX, topY);
        ctx.stroke();

        // Trunk segments
        ctx.strokeStyle = '#7a5a10';
        ctx.lineWidth = 1;
        for (let s = 0; s < 6; s++) {
          const t = s / 6;
          const segX = px + lean * t * t;
          const segY = py - trunkH * t;
          ctx.beginPath();
          ctx.moveTo(segX - 6, segY);
          ctx.lineTo(segX + 6, segY);
          ctx.stroke();
        }

        // Coconuts
        ctx.fillStyle = '#6B4226';
        ctx.beginPath();
        ctx.arc(topX - 3, topY + 5, 4, 0, Math.PI * 2);
        ctx.arc(topX + 4, topY + 6, 4, 0, Math.PI * 2);
        ctx.fill();

        // Palm leaves
        ctx.strokeStyle = '#228B22';
        ctx.lineWidth = 3;
        const leafAngles = [-2.2, -1.5, -0.8, -0.2, 0.4, 1.0, 1.6];
        for (const angle of leafAngles) {
          ctx.beginPath();
          ctx.moveTo(topX, topY);
          const leafLen = 50 + Math.abs(angle) * 10;
          const lx = topX + Math.cos(angle) * leafLen;
          const ly = topY + Math.sin(angle) * leafLen * 0.6 - 10;
          const lcx = topX + Math.cos(angle) * leafLen * 0.5;
          const lcy = topY - 20;
          ctx.quadraticCurveTo(lcx, lcy, lx, ly);
          ctx.stroke();

          // Leaf fronds
          ctx.strokeStyle = '#1a7a1a';
          ctx.lineWidth = 1;
          for (let f = 0.3; f < 1; f += 0.15) {
            const fx = topX + (lx - topX) * f;
            const fy = topY + (ly - topY) * f + (lcy - topY) * 4 * f * (1-f);
            ctx.beginPath();
            ctx.moveTo(fx, fy);
            ctx.lineTo(fx + Math.cos(angle + 0.8) * 8, fy + 6);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(fx, fy);
            ctx.lineTo(fx + Math.cos(angle - 0.8) * 8, fy - 4);
            ctx.stroke();
          }
          ctx.strokeStyle = '#228B22';
          ctx.lineWidth = 3;
        }
      };

      // Draw palm trees
      drawPalm(w * 0.08, groundY, 160, 25);
      drawPalm(w * 0.92, groundY, 150, -20);
      drawPalm(w * 0.18, groundY + 5, 120, 15);

      // Beach umbrella
      const umbX = w * 0.78;
      const umbY = groundY;
      // Pole
      ctx.strokeStyle = '#aa8844';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(umbX, umbY);
      ctx.lineTo(umbX, umbY - 80);
      ctx.stroke();
      // Umbrella top
      ctx.fillStyle = '#ff4444';
      ctx.beginPath();
      ctx.arc(umbX, umbY - 80, 40, Math.PI, 0);
      ctx.fill();
      ctx.fillStyle = '#ffcc00';
      ctx.beginPath();
      ctx.arc(umbX, umbY - 80, 40, Math.PI, Math.PI + Math.PI / 4);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(umbX, umbY - 80, 40, Math.PI + Math.PI / 2, Math.PI + Math.PI * 3 / 4);
      ctx.fill();
    },
    initEffects(effects, w, h) {
      const groundY = h * 0.75;
      const seaTop = groundY * 0.78;
      // Animated wave crests
      for (let i = 0; i < 6; i++) {
        effects.push({
          type: 'wave',
          x: (i / 6) * w,
          y: seaTop + 5 + Math.random() * (groundY - seaTop - 10),
          phase: Math.random() * Math.PI * 2,
          speed: 0.03 + Math.random() * 0.02,
          amplitude: 2 + Math.random() * 2,
          width: 30 + Math.random() * 40,
        });
      }
      // Seagulls
      for (let i = 0; i < 3; i++) {
        effects.push({
          type: 'seagull',
          x: Math.random() * w,
          y: groundY * 0.4 + Math.random() * groundY * 0.25,
          vx: 0.5 + Math.random() * 0.8,
          wingPhase: Math.random() * Math.PI * 2,
          size: 4 + Math.random() * 3,
        });
      }
      // Bobbing sailboats
      effects.push({ type: 'boatBob', phase: 0 });
    },
    updateEffects(effects, w, h) {
      for (const e of effects) {
        if (e.type === 'wave') {
          e.phase += e.speed;
        } else if (e.type === 'seagull') {
          e.x += e.vx;
          e.wingPhase += 0.08;
          e.y += Math.sin(e.wingPhase * 0.5) * 0.3;
          if (e.x > w + 30) {
            e.x = -30;
            const groundY = h * 0.75;
            e.y = groundY * 0.4 + Math.random() * groundY * 0.25;
          }
        } else if (e.type === 'boatBob') {
          e.phase += 0.02;
        }
      }
    },
    drawEffects(ctx, effects, w, h) {
      const groundY = h * 0.75;
      for (const e of effects) {
        if (e.type === 'wave') {
          ctx.save();
          ctx.globalAlpha = 0.4;
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.5;
          const yOff = Math.sin(e.phase) * e.amplitude;
          ctx.beginPath();
          ctx.moveTo(e.x, e.y + yOff);
          ctx.quadraticCurveTo(e.x + e.width / 2, e.y + yOff - 4, e.x + e.width, e.y + yOff);
          ctx.stroke();
          ctx.restore();
        } else if (e.type === 'seagull') {
          ctx.save();
          ctx.strokeStyle = '#333';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          const wingY = Math.sin(e.wingPhase) * e.size * 0.4;
          ctx.moveTo(e.x - e.size, e.y + wingY);
          ctx.quadraticCurveTo(e.x - e.size * 0.3, e.y - e.size * 0.3, e.x, e.y);
          ctx.quadraticCurveTo(e.x + e.size * 0.3, e.y - e.size * 0.3, e.x + e.size, e.y + wingY);
          ctx.stroke();
          ctx.restore();
        }
        // boatBob doesn't draw here - it influences the static boat drawing via the effect phase
      }
    }
  },
];

function drawMapPreview(canvas, map) {
  const ctx = canvas.getContext('2d');
  map.draw(ctx, canvas.width, canvas.height);
}
