// Custom fighter sounds - loads audio files from /assets/sounds/<fighterId>/<type>/
// Falls back to procedural SFX if no custom sounds available

const FighterSounds = (() => {
  // Cache: { fighterId: { hit: [Audio], taunt: [Audio] } }
  const cache = {};
  // Track which fighters have been loaded
  const loaded = {};

  async function loadForFighter(fighterId) {
    if (loaded[fighterId]) return;
    loaded[fighterId] = true;
    cache[fighterId] = { hit: [], taunt: [] };

    for (const type of ['hit', 'taunt']) {
      try {
        const resp = await fetch(`/api/sounds/${fighterId}/${type}`);
        const files = await resp.json();
        for (const url of files) {
          const audio = new Audio();
          audio.preload = 'auto';
          audio.src = url;
          cache[fighterId][type].push(audio);
        }
      } catch {
        // No custom sounds, will use defaults
      }
    }
  }

  function playRandom(fighterId, type) {
    const sounds = cache[fighterId] && cache[fighterId][type];
    if (sounds && sounds.length > 0) {
      const sound = sounds[Math.floor(Math.random() * sounds.length)];
      // Clone to allow overlapping playback
      const clone = sound.cloneNode();
      clone.volume = 0.6;
      clone.play().catch(() => {});
      return true;
    }
    return false;
  }

  return {
    // Preload sounds for both fighters (call when fight starts or fighters selected)
    async preload(fighter1Id, fighter2Id) {
      await Promise.all([loadForFighter(fighter1Id), loadForFighter(fighter2Id)]);
    },

    // Play hit sound - returns true if custom sound played, false for fallback
    playHit(fighterId) {
      return playRandom(fighterId, 'hit');
    },

    // Play taunt sound - returns true if custom sound played, false for fallback
    playTaunt(fighterId) {
      return playRandom(fighterId, 'taunt');
    },

    // Check if a fighter has custom sounds of a given type
    hasCustom(fighterId, type) {
      return cache[fighterId] && cache[fighterId][type] && cache[fighterId][type].length > 0;
    }
  };
})();
