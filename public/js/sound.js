// Sound effects using Web Audio API - no audio files needed
const SFX = (() => {
  let ctx = null;

  function getCtx() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    return ctx;
  }

  function playTone(freq, duration, type, volume, decay) {
    const ac = getCtx();
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = type || 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(volume || 0.3, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + (decay || duration));
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.start(ac.currentTime);
    osc.stop(ac.currentTime + duration);
  }

  function playNoise(duration, volume, filterFreq, filterType) {
    const ac = getCtx();
    const bufferSize = ac.sampleRate * duration;
    const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const source = ac.createBufferSource();
    source.buffer = buffer;
    const filter = ac.createBiquadFilter();
    filter.type = filterType || 'lowpass';
    filter.frequency.value = filterFreq || 2000;
    const gain = ac.createGain();
    gain.gain.setValueAtTime(volume || 0.3, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + duration);
    source.connect(filter);
    filter.connect(gain);
    gain.connect(ac.destination);
    source.start();
  }

  return {
    // === COMBAT SOUNDS ===

    punch() {
      playNoise(0.1, 0.4, 1500, 'bandpass');
      playTone(200, 0.08, 'square', 0.15);
    },

    kick() {
      playNoise(0.15, 0.45, 800, 'lowpass');
      playTone(120, 0.12, 'square', 0.2);
    },

    block() {
      playTone(800, 0.06, 'square', 0.12);
      playTone(600, 0.08, 'square', 0.1);
      playNoise(0.05, 0.15, 3000, 'highpass');
    },

    blockBreak() {
      playNoise(0.12, 0.35, 1200, 'bandpass');
      playTone(300, 0.1, 'sawtooth', 0.15);
    },

    ko() {
      const ac = getCtx();
      // Heavy impact
      playNoise(0.3, 0.5, 600, 'lowpass');
      playTone(80, 0.4, 'sine', 0.35);
      // Dramatic low boom
      setTimeout(() => playTone(50, 0.6, 'sine', 0.3), 100);
    },

    // === ROUND SOUNDS ===

    countdownTick() {
      playTone(880, 0.12, 'sine', 0.25);
      playTone(440, 0.08, 'square', 0.08);
    },

    fight() {
      // Rising tone burst
      const ac = getCtx();
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(300, ac.currentTime);
      osc.frequency.linearRampToValueAtTime(900, ac.currentTime + 0.15);
      gain.gain.setValueAtTime(0.25, ac.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.start(ac.currentTime);
      osc.stop(ac.currentTime + 0.4);
      // Crash
      playNoise(0.3, 0.3, 4000, 'highpass');
    },

    roundWin() {
      // Victory jingle - ascending notes
      playTone(523, 0.15, 'sine', 0.2); // C
      setTimeout(() => playTone(659, 0.15, 'sine', 0.2), 120); // E
      setTimeout(() => playTone(784, 0.15, 'sine', 0.2), 240); // G
      setTimeout(() => playTone(1047, 0.3, 'sine', 0.25), 360); // High C
    },

    matchWin() {
      // Extended victory fanfare
      playTone(523, 0.15, 'sine', 0.25);
      setTimeout(() => playTone(659, 0.15, 'sine', 0.25), 100);
      setTimeout(() => playTone(784, 0.15, 'sine', 0.25), 200);
      setTimeout(() => playTone(1047, 0.2, 'sine', 0.3), 300);
      setTimeout(() => {
        playTone(1047, 0.12, 'sine', 0.2);
        playTone(1319, 0.4, 'sine', 0.3);
      }, 500);
      setTimeout(() => playNoise(0.2, 0.15, 5000, 'highpass'), 500);
    },

    // === UI SOUNDS ===

    select() {
      playTone(600, 0.06, 'sine', 0.12);
    },

    confirm() {
      playTone(500, 0.08, 'sine', 0.15);
      setTimeout(() => playTone(800, 0.1, 'sine', 0.15), 60);
    },

    pause() {
      playTone(400, 0.1, 'sine', 0.15);
      setTimeout(() => playTone(300, 0.12, 'sine', 0.12), 80);
    },

    resume() {
      playTone(300, 0.08, 'sine', 0.12);
      setTimeout(() => playTone(500, 0.1, 'sine', 0.15), 60);
    },

    // === MOVEMENT SOUNDS ===

    whoosh() {
      playNoise(0.08, 0.08, 3000, 'highpass');
    },

    jump() {
      const ac = getCtx();
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(200, ac.currentTime);
      osc.frequency.linearRampToValueAtTime(500, ac.currentTime + 0.1);
      gain.gain.setValueAtTime(0.1, ac.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.start(ac.currentTime);
      osc.stop(ac.currentTime + 0.15);
    },

    land() {
      playNoise(0.06, 0.12, 400, 'lowpass');
    },
  };
})();

// === PROCEDURAL FIGHT MUSIC ===
const Music = (() => {
  let ctx = null;
  let masterGain = null;
  let playing = false;
  let nodes = [];
  let loopTimer = null;
  let currentMap = null;
  let stepIndex = 0;

  // Map-specific music configs
  const mapMusic = {
    arena: {
      bpm: 140,
      key: [65.41, 82.41, 98.00, 110.00, 130.81], // C minor pentatonic (bass)
      bassOctave: 1,
      leadOctave: 4,
      feel: 'aggressive',
    },
    colizeum: {
      bpm: 128,
      key: [73.42, 87.31, 98.00, 110.00, 130.81], // D minor
      bassOctave: 1,
      leadOctave: 4,
      feel: 'electronic',
    },
    beach: {
      bpm: 110,
      key: [82.41, 98.00, 110.00, 123.47, 146.83], // E minor pentatonic
      bassOctave: 1,
      leadOctave: 3,
      feel: 'chill',
    },
    dojo: {
      bpm: 120,
      key: [65.41, 73.42, 82.41, 98.00, 110.00], // C eastern
      bassOctave: 1,
      leadOctave: 3,
      feel: 'eastern',
    },
    rooftop: {
      bpm: 135,
      key: [55.00, 65.41, 73.42, 82.41, 98.00], // A minor
      bassOctave: 1,
      leadOctave: 4,
      feel: 'dark',
    },
  };

  function getCtx() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      masterGain = ctx.createGain();
      masterGain.gain.value = 0.25;
      masterGain.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function stopAllNodes() {
    for (const n of nodes) {
      try { n.stop(); } catch(e) {}
      try { n.disconnect(); } catch(e) {}
    }
    nodes = [];
  }

  function scheduleNote(freq, startTime, duration, type, volume, dest) {
    const ac = getCtx();
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(volume, startTime + 0.01);
    gain.gain.setValueAtTime(volume, startTime + duration * 0.7);
    gain.gain.linearRampToValueAtTime(0, startTime + duration);
    osc.connect(gain);
    gain.connect(dest || masterGain);
    osc.start(startTime);
    osc.stop(startTime + duration + 0.05);
    nodes.push(osc);
    return osc;
  }

  function scheduleNoise(startTime, duration, volume, filterFreq, dest) {
    const ac = getCtx();
    const bufSize = Math.floor(ac.sampleRate * duration);
    const buf = ac.createBuffer(1, bufSize, ac.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
    const src = ac.createBufferSource();
    src.buffer = buf;
    const filter = ac.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = filterFreq;
    filter.Q.value = 1;
    const gain = ac.createGain();
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(volume, startTime + 0.005);
    gain.gain.linearRampToValueAtTime(0, startTime + duration);
    src.connect(filter);
    filter.connect(gain);
    gain.connect(dest || masterGain);
    src.start(startTime);
    nodes.push(src);
  }

  function playBar() {
    if (!playing) return;
    const ac = getCtx();
    const config = mapMusic[currentMap] || mapMusic.arena;
    const key = config.key;
    const secPerBeat = 60 / config.bpm;
    const barLen = secPerBeat * 4; // 4 beats per bar
    const now = ac.currentTime + 0.05;

    // === BASS LINE ===
    const bassPattern = getBassPattern(config.feel);
    for (let i = 0; i < bassPattern.length; i++) {
      const step = bassPattern[i];
      if (step !== null) {
        const freq = key[step % key.length] * config.bassOctave;
        const t = now + i * (secPerBeat / 2);
        scheduleNote(freq, t, secPerBeat * 0.45, 'sawtooth', 0.12);
        // Sub bass
        scheduleNote(freq * 0.5, t, secPerBeat * 0.4, 'sine', 0.1);
      }
    }

    // === DRUMS ===
    const drumPattern = getDrumPattern(config.feel);
    for (let i = 0; i < 8; i++) {
      const t = now + i * (secPerBeat / 2);
      if (drumPattern.kick[i]) {
        // Kick drum - low sine with pitch drop
        const kickOsc = ac.createOscillator();
        const kickGain = ac.createGain();
        kickOsc.type = 'sine';
        kickOsc.frequency.setValueAtTime(150, t);
        kickOsc.frequency.exponentialRampToValueAtTime(40, t + 0.12);
        kickGain.gain.setValueAtTime(0.2, t);
        kickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
        kickOsc.connect(kickGain);
        kickGain.connect(masterGain);
        kickOsc.start(t);
        kickOsc.stop(t + 0.2);
        nodes.push(kickOsc);
      }
      if (drumPattern.snare[i]) {
        scheduleNoise(t, 0.1, 0.12, 3000);
      }
      if (drumPattern.hihat[i]) {
        scheduleNoise(t, 0.04, 0.06, 8000);
      }
    }

    // === LEAD / MELODY (every other bar) ===
    if (stepIndex % 2 === 0) {
      const melody = getMelody(config.feel, key.length);
      for (let i = 0; i < melody.length; i++) {
        if (melody[i] !== null) {
          const freq = key[melody[i] % key.length] * config.leadOctave;
          const t = now + i * secPerBeat;
          const type = config.feel === 'electronic' ? 'square' : (config.feel === 'eastern' ? 'triangle' : 'sawtooth');
          // Lead with slight filter
          const leadGain = ac.createGain();
          const leadFilter = ac.createBiquadFilter();
          leadFilter.type = 'lowpass';
          leadFilter.frequency.value = config.feel === 'chill' ? 1500 : 2500;
          leadGain.gain.value = 0.06;
          leadFilter.connect(leadGain);
          leadGain.connect(masterGain);
          scheduleNote(freq, t, secPerBeat * 0.8, type, 0.08, leadFilter);
        }
      }
    }

    stepIndex++;
    loopTimer = setTimeout(playBar, barLen * 1000);
  }

  function getBassPattern(feel) {
    // 8 eighth-note steps, values are scale degree indices (null = rest)
    const patterns = {
      aggressive: [
        [0, null, 0, null, 2, null, 3, null],
        [0, null, 0, null, 4, null, 2, null],
        [0, null, 3, null, 2, null, 0, null],
      ],
      electronic: [
        [0, 0, null, 0, null, 2, null, 3],
        [0, null, 0, 2, null, null, 3, null],
      ],
      chill: [
        [0, null, null, 2, null, null, 3, null],
        [0, null, null, 4, null, null, 2, null],
      ],
      eastern: [
        [0, null, 1, null, 0, null, 3, null],
        [0, null, 2, null, 1, null, 0, null],
      ],
      dark: [
        [0, null, 0, null, 3, null, 4, null],
        [0, null, 2, null, 0, null, 3, null],
        [0, null, 0, null, 2, null, 1, null],
      ],
    };
    const arr = patterns[feel] || patterns.aggressive;
    return arr[stepIndex % arr.length];
  }

  function getDrumPattern(feel) {
    const patterns = {
      aggressive: {
        kick:  [1,0,0,0,1,0,0,0],
        snare: [0,0,1,0,0,0,1,0],
        hihat: [1,1,1,1,1,1,1,1],
      },
      electronic: {
        kick:  [1,0,0,1,1,0,0,0],
        snare: [0,0,1,0,0,0,1,0],
        hihat: [1,0,1,0,1,0,1,1],
      },
      chill: {
        kick:  [1,0,0,0,1,0,0,0],
        snare: [0,0,1,0,0,0,1,0],
        hihat: [0,1,0,1,0,1,0,1],
      },
      eastern: {
        kick:  [1,0,0,1,0,0,1,0],
        snare: [0,0,1,0,0,1,0,0],
        hihat: [1,0,1,1,0,1,1,0],
      },
      dark: {
        kick:  [1,0,0,0,1,0,1,0],
        snare: [0,0,1,0,0,0,1,0],
        hihat: [1,1,1,1,1,1,1,1],
      },
    };
    return patterns[feel] || patterns.aggressive;
  }

  function getMelody(feel, keyLen) {
    // 4 quarter-note steps
    const melodies = {
      aggressive: [
        [4, 3, 2, 0],
        [0, 2, 4, 3],
        [2, null, 4, 0],
      ],
      electronic: [
        [0, 2, 0, 4],
        [3, null, 2, 0],
        [0, 4, 3, null],
      ],
      chill: [
        [0, null, 2, null],
        [4, null, 3, null],
        [2, null, 0, null],
      ],
      eastern: [
        [0, 1, 3, 2],
        [4, 3, 1, 0],
        [0, 3, 4, 1],
      ],
      dark: [
        [0, null, 3, 4],
        [2, 0, null, 3],
        [4, 3, 0, null],
      ],
    };
    const arr = melodies[feel] || melodies.aggressive;
    return arr[Math.floor(stepIndex / 2) % arr.length];
  }

  return {
    start(mapId) {
      if (playing && currentMap === mapId) return;
      this.stop();
      currentMap = mapId || 'arena';
      stepIndex = 0;
      playing = true;
      getCtx();
      masterGain.gain.setValueAtTime(0, ctx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.5);
      playBar();
    },

    stop() {
      playing = false;
      if (loopTimer) {
        clearTimeout(loopTimer);
        loopTimer = null;
      }
      if (masterGain && ctx) {
        masterGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);
      }
      setTimeout(() => stopAllNodes(), 400);
      currentMap = null;
    },

    pause() {
      if (!playing) return;
      playing = false;
      if (loopTimer) {
        clearTimeout(loopTimer);
        loopTimer = null;
      }
      if (masterGain && ctx) {
        masterGain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.3);
      }
    },

    resume() {
      if (playing) return;
      playing = true;
      if (masterGain && ctx) {
        masterGain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.3);
      }
      playBar();
    },

    isPlaying() {
      return playing;
    },
  };
})();
