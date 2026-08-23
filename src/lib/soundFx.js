// Procedural Web Audio API Sound Engine (Zero external assets required)
let audioCtx = null;
let soundEnabled = true;

if (typeof window !== 'undefined') {
  const saved = localStorage.getItem('bp_sound_enabled');
  if (saved !== null) {
    soundEnabled = saved === 'true';
  }
}

export function initAudioContext() {
  if (typeof window === 'undefined') return null;
  try {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  } catch (err) {
    console.debug('AudioContext init error:', err);
  }
  return audioCtx;
}

// Global user activation listeners to unlock audio instantly on first interaction
if (typeof window !== 'undefined') {
  const unlockAudio = () => {
    initAudioContext();
  };

  const events = ['click', 'pointerdown', 'mousedown', 'touchstart', 'touchend', 'keydown', 'pointerover'];
  events.forEach((evt) => {
    window.addEventListener(evt, unlockAudio, { passive: true, capture: true });
    document.addEventListener(evt, unlockAudio, { passive: true, capture: true });
  });
}

export function isSoundEnabled() {
  return soundEnabled;
}

export function toggleSound() {
  soundEnabled = !soundEnabled;
  if (typeof window !== 'undefined') {
    localStorage.setItem('bp_sound_enabled', String(soundEnabled));
  }
  if (soundEnabled) {
    playSwitchClick();
  }
  return soundEnabled;
}

// 1. Mechanical Relay Switch Click (Punchy & Crisp) - Used on click
export function playSwitchClick() {
  if (!soundEnabled) return;
  try {
    const ctx = initAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.26, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.05);
  } catch (err) {
    console.debug('Audio error:', err);
  }
}

// 2. High-Frequency Drafting Micro-blip (Clear & Soft) - Used on hover
export function playHoverTick() {
  if (!soundEnabled) return;
  try {
    const ctx = initAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(2400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1900, ctx.currentTime + 0.025);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.025);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.025);
  } catch (err) {
    console.debug('Audio error:', err);
  }
}
