// Game Engine - handles fighter physics, combat, and rendering

class Fighter {
  constructor(config, playerNum, canvasWidth, canvasHeight) {
    this.config = config;
    this.playerNum = playerNum;
    this.facingRight = playerNum === 1;

    // Position
    this.groundY = canvasHeight * 0.75 - 5;
    this.x = playerNum === 1 ? canvasWidth * 0.15 : canvasWidth * 0.85;
    this.y = this.groundY;
    this.vx = 0;
    this.vy = 0;

    // Dimensions
    this.width = config.bodyWidth;
    this.height = config.bodyHeight;

    // State
    this.health = 100;
    this.maxHealth = 100;
    this.state = 'idle'; // idle, walking, jumping, punching, kicking, blocking, hit, ko
    this.stateTimer = 0;
    this.animFrame = 0;
    this.animTimer = 0;

    // Input state
    this.input = {
      left: false,
      right: false,
      up: false,
      down: false,
      punch: false,
      kick: false,
      block: false,
    };

    // Combat
    this.attackHitbox = null;
    this.hasHitThisAttack = false;
    this.comboCount = 0;
    this.lastHitTime = 0;
    this.invincible = false;
    this.invincibleTimer = 0;

    // Head image
    this.headImg = headImages[config.id] || null;

    // Movement params
    this.moveSpeed = 2.5 + config.speed * 0.4;
    this.jumpForce = -15;
    this.gravity = 0.55;
  }

  reset(canvasWidth, canvasHeight) {
    this.groundY = canvasHeight * 0.75 - 5;
    this.x = this.playerNum === 1 ? canvasWidth * 0.15 : canvasWidth * 0.85;
    this.y = this.groundY;
    this.vx = 0;
    this.vy = 0;
    this.health = 100;
    this.state = 'idle';
    this.stateTimer = 0;
    this.attackHitbox = null;
    this.hasHitThisAttack = false;
    this.invincible = false;
    this.input = { left: false, right: false, up: false, down: false, punch: false, kick: false, block: false };
  }

  handleInput(inputType, pressed) {
    if (inputType in this.input) {
      this.input[inputType] = pressed;
    }

    // Trigger attacks on press
    if (pressed && this.state !== 'hit' && this.state !== 'ko') {
      if (inputType === 'punch' && (this.state === 'idle' || this.state === 'walking' || this.state === 'jumping')) {
        this.startAttack('punching');
      } else if (inputType === 'kick' && (this.state === 'idle' || this.state === 'walking' || this.state === 'jumping')) {
        this.startAttack('kicking');
      }
    }
  }

  startAttack(type) {
    this.airborne = this.y < this.groundY;
    // Crouching = low attack, standing/airborne = high attack
    this.attackLevel = (this.input.down && this.y >= this.groundY) ? 'low' : 'high';
    this.state = type;
    this.stateTimer = type === 'punching' ? 20 : 28;
    this.hasHitThisAttack = false;
    this.attackHitbox = null;
  }

  update(opponent, canvasWidth) {
    // Face opponent
    if (this.state !== 'hit' && this.state !== 'ko') {
      this.facingRight = opponent.x > this.x;
    }

    // Invincibility frames
    if (this.invincible) {
      this.invincibleTimer--;
      if (this.invincibleTimer <= 0) this.invincible = false;
    }

    // State machine
    switch (this.state) {
      case 'idle':
      case 'walking':
        this.handleMovement(canvasWidth);
        break;
      case 'jumping':
        this.handleMovement(canvasWidth);
        this.vy += this.gravity;
        this.y += this.vy;
        if (this.y >= this.groundY) {
          this.y = this.groundY;
          this.vy = 0;
          this.state = 'idle';
        }
        break;
      case 'punching':
      case 'kicking':
        this.stateTimer--;
        // Apply gravity and movement if airborne
        if (this.airborne || this.y < this.groundY) {
          this.vy += this.gravity;
          this.y += this.vy;
          if (this.input.left) this.x -= this.moveSpeed;
          else if (this.input.right) this.x += this.moveSpeed;
          if (this.y >= this.groundY) {
            this.y = this.groundY;
            this.vy = 0;
            this.airborne = false;
          }
        }
        // Create hitbox at the right moment
        const attackFrame = this.state === 'punching' ? 12 : 16;
        if (this.stateTimer === attackFrame) {
          const range = this.state === 'punching' ? this.config.punchRange : this.config.kickRange;
          const dir = this.facingRight ? 1 : -1;
          // High attacks hit upper body, low attacks hit legs
          const hitY = this.attackLevel === 'low'
            ? this.y - this.height * 0.2
            : this.y - this.height * 0.6;
          this.attackHitbox = {
            x: this.x + dir * 20,
            y: hitY,
            width: range * dir,
            height: 30,
            damage: this.state === 'punching' ? this.config.punchDamage : this.config.kickDamage,
            type: this.state === 'punching' ? 'punch' : 'kick',
            level: this.attackLevel,
          };
        }
        if (this.stateTimer <= attackFrame - 5) {
          this.attackHitbox = null;
        }
        if (this.stateTimer <= 0) {
          this.state = (this.y < this.groundY) ? 'jumping' : 'idle';
          this.attackHitbox = null;
        }
        break;
      case 'blocking':
        // Apply gravity while blocking in air
        if (this.y < this.groundY) {
          this.vy += this.gravity;
          this.y += this.vy;
          if (this.y >= this.groundY) {
            this.y = this.groundY;
            this.vy = 0;
          }
        }
        if (!this.input.block) {
          this.state = (this.y < this.groundY) ? 'jumping' : 'idle';
        }
        break;
      case 'hit':
        this.stateTimer--;
        // Knockback
        this.x += this.vx;
        this.vx *= 0.85;
        if (this.stateTimer <= 0) {
          this.state = this.health <= 0 ? 'ko' : 'idle';
        }
        break;
      case 'ko':
        // Fall down animation
        if (this.stateTimer > 0) this.stateTimer--;
        break;
    }

    // Animation
    this.animTimer++;
    if (this.animTimer >= 8) {
      this.animTimer = 0;
      this.animFrame = (this.animFrame + 1) % 4;
    }

    // Boundary check
    const margin = 30;
    this.x = Math.max(margin, Math.min(canvasWidth - margin, this.x));
  }

  handleMovement(canvasWidth) {
    if (this.state === 'hit' || this.state === 'ko') return;

    // Block
    if (this.input.block) {
      this.state = 'blocking';
      this.vx = 0;
      return;
    }

    const crouching = this.input.down && this.y >= this.groundY;
    const speed = crouching ? this.moveSpeed * 0.4 : this.moveSpeed;

    let moving = false;
    if (this.input.left) {
      this.vx = -speed;
      moving = true;
    } else if (this.input.right) {
      this.vx = speed;
      moving = true;
    } else {
      this.vx = 0;
    }

    if (moving) {
      this.x += this.vx;
      if (this.state !== 'jumping') this.state = 'walking';
    } else {
      if (this.state === 'walking') this.state = 'idle';
    }

    // Jump
    if (this.input.up && this.y >= this.groundY && this.state !== 'jumping') {
      this.vy = this.jumpForce;
      this.state = 'jumping';
    }
  }

  takeHit(damage, fromRight, attackLevel) {
    if (this.invincible) return false;

    if (this.state === 'blocking') {
      // Block level: crouching = low block, standing = high block
      const blockLevel = (this.input.down && this.y >= this.groundY) ? 'low' : 'high';

      if (blockLevel === attackLevel) {
        // Correct block - heavily reduced damage
        damage = Math.floor(damage * 0.15);
        this.vx = fromRight ? -2 : 2;
      } else {
        // Wrong block level - attack breaks through
        this.state = 'hit';
        this.stateTimer = 15;
        this.vx = fromRight ? -5 : 5;
      }
    } else {
      this.state = 'hit';
      this.stateTimer = 15;
      this.vx = fromRight ? -6 : 6;
    }

    this.health = Math.max(0, this.health - damage);
    this.invincible = true;
    this.invincibleTimer = 10;
    return true;
  }

  getHitbox() {
    return {
      x: this.x - this.width / 2,
      y: this.y - this.height,
      width: this.width,
      height: this.height,
    };
  }

  draw(ctx) {
    ctx.save();
    const dir = this.facingRight ? 1 : -1;
    const bx = this.x;
    const by = this.y;
    const cfg = this.config;

    // Flicker when invincible
    if (this.invincible && Math.floor(this.invincibleTimer / 2) % 2 === 0) {
      ctx.globalAlpha = 0.4;
    }

    // Body bob for idle animation
    let bodyOffsetY = 0;
    if (this.state === 'idle') {
      bodyOffsetY = Math.sin(this.animFrame * Math.PI / 2) * 2;
    }

    const crouching = this.input.down && this.y >= this.groundY && this.state !== 'jumping';
    const heightMod = crouching ? 0.7 : 1;

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.ellipse(bx, this.groundY + 2, 25, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // KO state - draw fallen
    if (this.state === 'ko') {
      this.drawKO(ctx, bx, by, dir, cfg);
      ctx.restore();
      return;
    }

    // Helper: filled rect with light outline
    const outlinedRect = (x, y, w, h, fill) => {
      ctx.fillStyle = fill;
      ctx.fillRect(x, y, w, h);
      ctx.strokeStyle = 'rgba(255,255,255,0.15)';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, w, h);
    };

    // Legs
    const legSpread = this.state === 'walking' ? Math.sin(this.animTimer * 0.4) * 10 : 4;
    // Left leg
    outlinedRect(bx - 12 * dir - 5, by - 35 * heightMod + bodyOffsetY, 10, 30 * heightMod, cfg.pantsColor);
    // Right leg
    outlinedRect(bx + (legSpread - 5) * dir, by - 35 * heightMod + bodyOffsetY, 10, 30 * heightMod, cfg.pantsColor);

    // Kicking leg
    if (this.state === 'kicking' && this.stateTimer > 8 && this.stateTimer < 22) {
      const kickExtend = this.stateTimer > 12 ? cfg.kickRange * 0.7 : cfg.kickRange * 0.3;
      const kickYOffset = this.attackLevel === 'low' ? 20 : 0;
      outlinedRect(bx + 5 * dir, by - 45 * heightMod + bodyOffsetY + kickYOffset, kickExtend * dir, 10, cfg.pantsColor);
      // Foot
      outlinedRect(bx + (5 + kickExtend * 0.9) * dir, by - 48 * heightMod + bodyOffsetY + kickYOffset, 14 * dir, 14, '#222');
    }

    // Torso
    const torsoH = 35 * heightMod;
    outlinedRect(bx - 16, by - 35 * heightMod - torsoH + bodyOffsetY, 32, torsoH, cfg.shirtColor);

    // Arms
    const armY = by - 60 * heightMod + bodyOffsetY;

    if (this.state === 'punching' && this.stateTimer > 6) {
      // Punching arm extended - low punch drops down toward legs
      const punchExtend = this.stateTimer > 12 ? cfg.punchRange * 0.8 : cfg.punchRange * 0.4;
      const punchYOffset = this.attackLevel === 'low' ? 30 : 0;
      outlinedRect(bx + 14 * dir, armY + 5 + punchYOffset, punchExtend * dir, 10, cfg.skinColor);
      // Fist
      outlinedRect(bx + (14 + punchExtend * 0.9) * dir, armY + 2 + punchYOffset, 14 * dir, 14, '#cc8800');
      // Back arm
      outlinedRect(bx - 20 * dir, armY + 5, -15 * dir, 10, cfg.skinColor);
    } else if (this.state === 'blocking') {
      const blockLow = this.input.down && this.y >= this.groundY;
      const blockYOffset = blockLow ? 25 : 0;
      // Arms crossed in front
      outlinedRect(bx + 5 * dir, armY + blockYOffset, 12 * dir, 30, cfg.skinColor);
      outlinedRect(bx + 10 * dir, armY + 5 + blockYOffset, 12 * dir, 25, cfg.skinColor);
      // Block effect - blue for high, orange for low
      const blockColor = blockLow ? 'rgba(255,150,50,0.5)' : 'rgba(100,150,255,0.5)';
      ctx.strokeStyle = blockColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(bx + 20 * dir, armY + 15 + blockYOffset, 20, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      // Regular arms with idle sway
      const armSway = Math.sin(this.animTimer * 0.3) * 3;
      outlinedRect(bx + 16 * dir, armY + 5 + armSway, 12 * dir, 25, cfg.skinColor);
      outlinedRect(bx - 18 * dir, armY + 5 - armSway, -12 * dir, 25, cfg.skinColor);
    }

    // Head
    const headSize = cfg.bodyWidth * 1.1;
    const headY = by - 75 * heightMod + bodyOffsetY;

    if (this.headImg) {
      ctx.save();
      if (!this.facingRight) {
        ctx.translate(bx, headY);
        ctx.scale(-1, 1);
        ctx.translate(-bx, -headY);
      }
      ctx.drawImage(this.headImg, bx - headSize / 2, headY - headSize / 2, headSize, headSize);
      ctx.restore();
    } else {
      const headRadius = 16;
      // Default drawn head
      ctx.fillStyle = cfg.skinColor;
      ctx.beginPath();
      ctx.arc(bx, headY, headRadius, 0, Math.PI * 2);
      ctx.fill();

      // Hair
      ctx.fillStyle = cfg.hairColor;
      ctx.beginPath();
      ctx.arc(bx, headY - 5, 14, Math.PI, 0);
      ctx.fill();

      // Eyes
      ctx.fillStyle = '#fff';
      ctx.fillRect(bx + 3 * dir, headY - 3, 6, 5);
      ctx.fillRect(bx - 9 * dir, headY - 3, 6, 5);
      ctx.fillStyle = '#111';
      ctx.fillRect(bx + (3 + 3 * dir) * (dir > 0 ? 1 : 0.3), headY - 2, 3, 4);
      ctx.fillRect(bx + (-9 + 3 * dir) * (dir > 0 ? 0.3 : 1), headY - 2, 3, 4);
    }

    // Hit effect
    if (this.state === 'hit') {
      ctx.fillStyle = 'rgba(255,0,0,0.3)';
      ctx.fillRect(bx - 25, by - cfg.bodyHeight - 5, 50, cfg.bodyHeight + 5);
    }

    ctx.restore();
  }

  drawKO(ctx, bx, by, dir, cfg) {
    // Draw fighter lying on the ground
    const groundLevel = this.groundY;

    const koOutline = (x, y, w, h, fill) => {
      ctx.fillStyle = fill;
      ctx.fillRect(x, y, w, h);
      ctx.strokeStyle = 'rgba(255,255,255,0.15)';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, w, h);
    };

    // Body horizontal
    koOutline(bx - 30 * dir, groundLevel - 15, 60 * dir, 20, cfg.shirtColor);

    // Legs
    koOutline(bx - 50 * dir, groundLevel - 12, 25 * dir, 14, cfg.pantsColor);

    // Head
    const koHeadSize = cfg.bodyWidth * 1.1;
    const headCx = bx + 30 * dir;
    const headCy = groundLevel - 12;
    if (this.headImg) {
      ctx.save();
      ctx.translate(headCx, headCy);
      ctx.rotate(dir > 0 ? Math.PI / 2 : -Math.PI / 2);
      ctx.drawImage(this.headImg, -koHeadSize / 2, -koHeadSize / 2, koHeadSize, koHeadSize);
      ctx.restore();
    } else {
      ctx.fillStyle = cfg.skinColor;
      ctx.beginPath();
      ctx.arc(bx + 30 * dir, groundLevel - 12, 14, 0, Math.PI * 2);
      ctx.fill();
    }

    // X eyes
    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 2;
    const ex = bx + 30 * dir;
    const ey = groundLevel - 14;
    ctx.beginPath(); ctx.moveTo(ex-4, ey-4); ctx.lineTo(ex+4, ey+4); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ex+4, ey-4); ctx.lineTo(ex-4, ey+4); ctx.stroke();
  }
}

class GameEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.resizeCanvas();

    this.fighter1 = null;
    this.fighter2 = null;
    this.currentMap = null;

    // Game state
    this.gameState = 'waiting'; // waiting, countdown, fighting, roundEnd, matchEnd
    this.timer = 99;
    this.timerInterval = null;
    this.round = 1;
    this.maxRounds = 3;
    this.wins = { 1: 0, 2: 0 };
    this.winsNeeded = 2;

    this.countdownValue = 0;
    this.countdownTimer = 0;

    this.announcement = '';
    this.announcementTimer = 0;

    // Map effects (dynamic particles/animations per map)
    this.mapEffects = [];

    // Camera
    this.camera = { x: 0, y: 0, scale: 1 };
    this.cameraSmooth = { x: 0, y: 0, scale: 1 };
    this.cameraMinScale = 0.6;
    this.cameraMaxScale = 1.8;
    this.cameraPadding = 200; // extra space around fighters

    // Particles for hit effects
    this.particles = [];

    this.running = false;

    window.addEventListener('resize', () => this.resizeCanvas());
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  init(fighter1Config, fighter2Config, mapConfig) {
    this.currentMap = mapConfig;
    this.mapEffects = [];
    if (mapConfig.initEffects) {
      mapConfig.initEffects(this.mapEffects, this.canvas.width, this.canvas.height);
    }
    this.fighter1 = new Fighter(fighter1Config, 1, this.canvas.width, this.canvas.height);
    this.fighter2 = new Fighter(fighter2Config, 2, this.canvas.width, this.canvas.height);
    this.wins = { 1: 0, 2: 0 };
    this.round = 1;
    this.startRound();
  }

  startRound() {
    this.fighter1.reset(this.canvas.width, this.canvas.height);
    this.fighter2.reset(this.canvas.width, this.canvas.height);
    this.timer = 99;
    this.particles = [];
    this.gameState = 'countdown';
    this.countdownValue = 3;
    this.countdownTimer = 0;

    this.showAnnouncement(`ROUND ${this.round}`, '#ffcc00');

    if (!this.running) {
      this.running = true;
      this.gameLoop();
    }
  }

  showAnnouncement(text, color) {
    this.announcement = text;
    this.announcementColor = color || '#ffffff';
    this.announcementTimer = 90;
    const el = document.getElementById('announcement');
    if (el) {
      el.textContent = text;
      el.style.color = color || '#ffffff';
      el.classList.remove('hidden');
    }
  }

  hideAnnouncement() {
    const el = document.getElementById('announcement');
    if (el) el.classList.add('hidden');
  }

  handleInput(player, inputType, pressed) {
    const fighter = player === 1 ? this.fighter1 : this.fighter2;
    if (!fighter) return;

    if (this.gameState === 'fighting') {
      fighter.handleInput(inputType, pressed);
    }
  }

  update() {
    switch (this.gameState) {
      case 'countdown':
        this.countdownTimer++;
        if (this.countdownTimer >= 60) {
          this.countdownTimer = 0;
          this.countdownValue--;
          if (this.countdownValue > 0) {
            this.showAnnouncement(`${this.countdownValue}`, '#ffcc00');
          } else {
            this.showAnnouncement('FIGHT!', '#ff3333');
            this.gameState = 'fighting';
            this.startTimer();
            setTimeout(() => this.hideAnnouncement(), 1000);
          }
        }
        break;

      case 'fighting':
        this.fighter1.update(this.fighter2, this.canvas.width);
        this.fighter2.update(this.fighter1, this.canvas.width);
        this.checkCombat();
        this.checkPushback();
        this.updateParticles();
        this.checkRoundEnd();
        break;

      case 'roundEnd':
      case 'matchEnd':
        this.fighter1.update(this.fighter2, this.canvas.width);
        this.fighter2.update(this.fighter1, this.canvas.width);
        this.updateParticles();
        break;
    }

    // Update map effects
    if (this.currentMap && this.currentMap.updateEffects) {
      this.currentMap.updateEffects(this.mapEffects, this.canvas.width, this.canvas.height);
    }

    // Update camera
    this.updateCamera();

    // Update HUD
    this.updateHUD();
  }

  updateCamera() {
    if (!this.fighter1 || !this.fighter2) return;

    const w = this.canvas.width;
    const h = this.canvas.height;

    // Midpoint between fighters
    const midX = (this.fighter1.x + this.fighter2.x) / 2;
    const midY = (this.fighter1.y + this.fighter2.y) / 2;

    // Distance between fighters
    const dx = Math.abs(this.fighter1.x - this.fighter2.x);
    const dy = Math.abs(this.fighter1.y - this.fighter2.y);

    // Calculate scale so both fighters fit with padding
    const neededWidth = dx + this.cameraPadding * 2;
    const neededHeight = dy + this.cameraPadding * 1.5;
    const scaleX = w / neededWidth;
    const scaleY = h / neededHeight;
    let targetScale = Math.min(scaleX, scaleY);
    targetScale = Math.max(this.cameraMinScale, Math.min(this.cameraMaxScale, targetScale));

    // Target camera position (center on midpoint)
    const targetX = w / 2 - midX * targetScale;
    const targetY = h / 2 - (midY - 50) * targetScale; // offset up a bit to keep ground visible

    // Clamp vertical so ground stays in view
    const groundY = h * 0.75;
    const maxY = h - groundY * targetScale - 20;
    const clampedY = Math.min(targetY, maxY + h * 0.15);

    // Smooth interpolation
    const lerp = 0.08;
    this.cameraSmooth.x += (targetX - this.cameraSmooth.x) * lerp;
    this.cameraSmooth.y += (clampedY - this.cameraSmooth.y) * lerp;
    this.cameraSmooth.scale += (targetScale - this.cameraSmooth.scale) * lerp;
  }

  checkCombat() {
    // Check fighter1's attack against fighter2
    if (this.fighter1.attackHitbox && !this.fighter1.hasHitThisAttack) {
      if (this.hitboxOverlap(this.fighter1.attackHitbox, this.fighter2.getHitbox())) {
        const fromRight = this.fighter1.x > this.fighter2.x;
        const hit = this.fighter2.takeHit(this.fighter1.attackHitbox.damage, fromRight, this.fighter1.attackHitbox.level);
        if (hit) {
          this.fighter1.hasHitThisAttack = true;
          this.spawnHitParticles(
            (this.fighter1.x + this.fighter2.x) / 2,
            this.fighter1.attackHitbox.y,
            this.fighter1.attackHitbox.type
          );
        }
      }
    }

    // Check fighter2's attack against fighter1
    if (this.fighter2.attackHitbox && !this.fighter2.hasHitThisAttack) {
      if (this.hitboxOverlap(this.fighter2.attackHitbox, this.fighter1.getHitbox())) {
        const fromRight = this.fighter2.x > this.fighter1.x;
        const hit = this.fighter1.takeHit(this.fighter2.attackHitbox.damage, fromRight, this.fighter2.attackHitbox.level);
        if (hit) {
          this.fighter2.hasHitThisAttack = true;
          this.spawnHitParticles(
            (this.fighter1.x + this.fighter2.x) / 2,
            this.fighter2.attackHitbox.y,
            this.fighter2.attackHitbox.type
          );
        }
      }
    }
  }

  hitboxOverlap(attack, target) {
    const ax = attack.width > 0 ? attack.x : attack.x + attack.width;
    const aw = Math.abs(attack.width);
    return ax < target.x + target.width &&
           ax + aw > target.x &&
           attack.y < target.y + target.height &&
           attack.y + attack.height > target.y;
  }

  checkPushback() {
    // Only push apart when both fighters are on the ground
    const f1Grounded = this.fighter1.y >= this.fighter1.groundY;
    const f2Grounded = this.fighter2.y >= this.fighter2.groundY;
    if (!f1Grounded || !f2Grounded) return;

    const dist = Math.abs(this.fighter1.x - this.fighter2.x);
    const minDist = 45;
    if (dist < minDist) {
      const push = (minDist - dist) / 2;
      if (this.fighter1.x < this.fighter2.x) {
        this.fighter1.x -= push;
        this.fighter2.x += push;
      } else {
        this.fighter1.x += push;
        this.fighter2.x -= push;
      }
    }
  }

  spawnHitParticles(x, y, type) {
    const color = type === 'punch' ? '#ffcc00' : '#ff6600';
    for (let i = 0; i < 8; i++) {
      this.particles.push({
        x, y,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8,
        life: 15 + Math.random() * 10,
        maxLife: 25,
        color,
        size: 3 + Math.random() * 4,
      });
    }
    // Impact flash
    this.particles.push({
      x, y,
      vx: 0, vy: 0,
      life: 6,
      maxLife: 6,
      color: '#ffffff',
      size: 25,
      flash: true,
    });
  }

  updateParticles() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  checkRoundEnd() {
    let winner = null;

    if (this.fighter1.health <= 0) {
      winner = 2;
    } else if (this.fighter2.health <= 0) {
      winner = 1;
    } else if (this.timer <= 0) {
      winner = this.fighter1.health >= this.fighter2.health ? 1 : 2;
    }

    if (winner) {
      this.stopTimer();
      this.wins[winner]++;
      this.gameState = 'roundEnd';

      const loser = winner === 1 ? this.fighter2 : this.fighter1;
      if (loser.state !== 'ko') {
        loser.state = 'ko';
        loser.stateTimer = 60;
      }

      if (this.wins[winner] >= this.winsNeeded) {
        this.gameState = 'matchEnd';
        const winnerFighter = winner === 1 ? this.fighter1 : this.fighter2;
        this.showAnnouncement(`${winnerFighter.config.name} WINS!`, '#ffcc00');
        setTimeout(() => {
          this.hideAnnouncement();
        }, 3000);
      } else {
        const winnerFighter = winner === 1 ? this.fighter1 : this.fighter2;
        this.showAnnouncement(`${winnerFighter.config.name} WINS ROUND ${this.round}`, '#ffcc00');
        this.round++;
        setTimeout(() => {
          this.hideAnnouncement();
          this.startRound();
        }, 2500);
      }
    }
  }

  startTimer() {
    this.stopTimer();
    this.timerInterval = setInterval(() => {
      if (this.gameState === 'fighting' && this.timer > 0) {
        this.timer--;
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  updateHUD() {
    const p1Health = document.getElementById('p1-health');
    const p2Health = document.getElementById('p2-health');
    const timerEl = document.getElementById('timer');

    if (p1Health && this.fighter1) {
      const pct = (this.fighter1.health / this.fighter1.maxHealth) * 100;
      p1Health.style.width = pct + '%';
      p1Health.className = 'health-bar' + (pct < 25 ? ' low' : '');
    }
    if (p2Health && this.fighter2) {
      const pct = (this.fighter2.health / this.fighter2.maxHealth) * 100;
      p2Health.style.width = pct + '%';
      p2Health.className = 'health-bar' + (pct < 25 ? ' low' : '');
    }
    if (timerEl) {
      timerEl.textContent = this.timer;
    }

    // Round markers
    for (let p = 1; p <= 2; p++) {
      for (let r = 1; r <= 2; r++) {
        const el = document.getElementById(`p${p}-r${r}`);
        if (el) {
          el.className = 'marker' + (this.wins[p] >= r ? ' won' : '');
        }
      }
    }

    // Round text
    const roundText = document.getElementById('round-text');
    if (roundText) roundText.textContent = `ROUND ${this.round}`;

    // Player names
    const p1Name = document.getElementById('hud-p1-name');
    const p2Name = document.getElementById('hud-p2-name');
    if (p1Name && this.fighter1) p1Name.textContent = this.fighter1.config.name;
    if (p2Name && this.fighter2) p2Name.textContent = this.fighter2.config.name;
  }

  draw() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const cam = this.cameraSmooth;

    // Clear
    ctx.clearRect(0, 0, w, h);

    // Apply camera transform
    ctx.save();
    ctx.translate(cam.x, cam.y);
    ctx.scale(cam.scale, cam.scale);

    // Draw map (at full canvas size in world space)
    if (this.currentMap) {
      this.currentMap.draw(ctx, w, h);
    }

    // Draw map effects (behind fighters)
    if (this.currentMap && this.currentMap.drawEffects) {
      this.currentMap.drawEffects(ctx, this.mapEffects, w, h);
    }

    // Draw fighters
    if (this.fighter1) this.fighter1.draw(ctx);
    if (this.fighter2) this.fighter2.draw(ctx);

    // Draw particles
    for (const p of this.particles) {
      ctx.save();
      const alpha = p.life / p.maxLife;
      ctx.globalAlpha = alpha;
      if (p.flash) {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - p.size/2, p.y - p.size/2, p.size, p.size);
      }
      ctx.restore();
    }

    // Restore camera transform
    ctx.restore();

    // Countdown is shown via the HTML #announcement overlay only
  }

  gameLoop() {
    if (!this.running) return;
    this.update();
    this.draw();
    requestAnimationFrame(() => this.gameLoop());
  }

  destroy() {
    this.running = false;
    this.stopTimer();
  }
}
