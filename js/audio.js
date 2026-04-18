/**
 * Procedural audio engine using Web Audio API.
 * Handles background music, sound effects, and mute toggle.
 * @module audio
 */

const AudioCtxClass = window.AudioContext || window.webkitAudioContext;

let audioCtx = null;
let masterGain = null;
let musicGain = null;
let sfxGain = null;
let bgmInterval = null;
let bgmStep = 0;
let soundEnabled = true;

/** Background music melody (note frequencies, 0 = rest). */
const BGM_MELODY = [
  262, 294, 330, 262, 330, 349, 392, 0,
  392, 440, 392, 349, 330, 262, 294, 0,
  330, 349, 392, 440, 392, 349, 330, 294,
  262, 330, 294, 262, 220, 262, 294, 0,
];

/**
 * Returns whether sound is currently enabled.
 * @returns {boolean}
 */
export function isSoundEnabled() {
  return soundEnabled;
}

/**
 * Toggles sound on/off and returns the new state.
 * @returns {boolean} New sound-enabled state.
 */
export function toggleSound() {
  soundEnabled = !soundEnabled;
  return soundEnabled;
}

/**
 * Initialises the Web Audio context and gain nodes.
 * Safe to call multiple times — only runs once.
 */
export function initAudio() {
  if (audioCtx) return;
  audioCtx = new AudioCtxClass();

  masterGain = audioCtx.createGain();
  masterGain.gain.value = 0.5;
  masterGain.connect(audioCtx.destination);

  musicGain = audioCtx.createGain();
  musicGain.gain.value = 0.25;
  musicGain.connect(masterGain);

  sfxGain = audioCtx.createGain();
  sfxGain.gain.value = 0.5;
  sfxGain.connect(masterGain);
}

/**
 * Plays a single synthesised note.
 * @param {number} freq   - Frequency in Hz.
 * @param {number} dur    - Duration in seconds.
 * @param {number} vol    - Peak gain (0-1).
 * @param {string} type   - Oscillator type.
 * @param {GainNode} dest - Destination gain node.
 */
function playNote(freq, dur, vol, type = 'square', dest = sfxGain) {
  if (!audioCtx || !soundEnabled) return;
  const osc = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  g.gain.setValueAtTime(vol, audioCtx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
  osc.connect(g);
  g.connect(dest);
  osc.start();
  osc.stop(audioCtx.currentTime + dur);
}

/* ---- Sound Effects ---- */

/** Play the "eat food" sound. */
export function sfxEat() {
  playNote(600, 0.1, 0.3, 'square');
  setTimeout(() => playNote(800, 0.12, 0.25, 'square'), 50);
}

/** Play the "bonus food" sound. */
export function sfxBonus() {
  playNote(500, 0.08, 0.3, 'square');
  setTimeout(() => playNote(700, 0.08, 0.3, 'square'), 60);
  setTimeout(() => playNote(900, 0.15, 0.3, 'square'), 120);
}

/** Play the "level up" fanfare. */
export function sfxLevelUp() {
  const notes = [523, 659, 784, 1047];
  notes.forEach((n, i) =>
    setTimeout(() => playNote(n, 0.2, 0.35, 'square'), i * 100),
  );
  setTimeout(() => playNote(1047, 0.5, 0.3, 'sine'), 400);
}

/** Play the "game over" sound. */
export function sfxGameOver() {
  playNote(400, 0.2, 0.4, 'sawtooth');
  setTimeout(() => playNote(300, 0.25, 0.4, 'sawtooth'), 150);
  setTimeout(() => playNote(200, 0.5, 0.35, 'sawtooth'), 350);
}

/* ---- Background Music ---- */

/** Start the procedural chiptune BGM loop. */
export function startBGM() {
  if (bgmInterval) return;
  bgmStep = 0;
  bgmInterval = setInterval(() => {
    if (!soundEnabled || !audioCtx) return;
    const note = BGM_MELODY[bgmStep % BGM_MELODY.length];
    if (note > 0) {
      playNote(note, 0.18, 0.15, 'triangle', musicGain);
      if (bgmStep % 4 === 0) {
        playNote(note / 2, 0.35, 0.08, 'sine', musicGain);
      }
    }
    bgmStep++;
  }, 220);
}

/** Stop the BGM loop. */
export function stopBGM() {
  clearInterval(bgmInterval);
  bgmInterval = null;
}
