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
