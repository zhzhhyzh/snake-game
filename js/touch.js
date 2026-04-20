/**
 * Touch input handler: swipe gestures and on-screen D-pad.
 * @module touch
 */

import {
  isRunning, isPaused, getDirection, setDirection,
  togglePause, setSprinting,
} from './game.js';

/** Opposite directions (to prevent 180-degree turns). */
const OPPOSITE = { up: 'down', down: 'up', left: 'right', right: 'left' };

/* ---- Swipe detection ---- */

let touchStartX = 0;
let touchStartY = 0;
let touchStartTime = 0;
const SWIPE_THRESHOLD = 30;
const SWIPE_TIME_LIMIT = 300;

/**
 * Process a detected swipe direction.
 * @param {string} dir - 'up' | 'down' | 'left' | 'right'
 */
function handleSwipeDir(dir) {
  if (!isRunning() || isPaused()) return;
  const current = getDirection();
  if (dir === current) {
    setSprinting(true);
    setTimeout(() => setSprinting(false), 300);
  } else if (dir !== OPPOSITE[current]) {
    setSprinting(false);
    setDirection(dir);
  }
}

/**
 * Bind swipe gesture detection on the game canvas.
 */
function bindSwipe() {
  const canvas = document.getElementById('game');

  canvas.addEventListener('touchstart', (e) => {
    const t = e.touches[0];
    touchStartX = t.clientX;
    touchStartY = t.clientY;
    touchStartTime = Date.now();
  }, { passive: true });

  canvas.addEventListener('touchend', (e) => {
    if (!isRunning()) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStartX;
    const dy = t.clientY - touchStartY;
    const dt = Date.now() - touchStartTime;
    if (dt > SWIPE_TIME_LIMIT) return;

    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    if (absDx < SWIPE_THRESHOLD && absDy < SWIPE_THRESHOLD) return;

    if (absDx > absDy) {
      handleSwipeDir(dx > 0 ? 'right' : 'left');
    } else {
      handleSwipeDir(dy > 0 ? 'down' : 'up');
    }
  }, { passive: true });
}

/* ---- D-Pad buttons ---- */

/**
 * Bind the on-screen D-pad direction buttons and sprint button.
 */
function bindDpad() {
  const dpad = document.getElementById('dpad');
  if (!dpad) return;

  /* Direction buttons */
  dpad.querySelectorAll('[data-dir]').forEach((btn) => {
    const dir = btn.dataset.dir;

    btn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      handleSwipeDir(dir);
    }, { passive: false });

    btn.addEventListener('mousedown', (e) => {
      e.preventDefault();
      handleSwipeDir(dir);
    });
  });

  /* Sprint button */
  const sprintBtn = document.getElementById('sprintBtn');
  if (sprintBtn) {
    sprintBtn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      if (isRunning() && !isPaused()) setSprinting(true);
    }, { passive: false });

    sprintBtn.addEventListener('touchend', (e) => {
      e.preventDefault();
      setSprinting(false);
    }, { passive: false });

    sprintBtn.addEventListener('mousedown', (e) => {
      e.preventDefault();
      if (isRunning() && !isPaused()) setSprinting(true);
    });

    sprintBtn.addEventListener('mouseup', () => setSprinting(false));
  }
}

/* ---- Prevent default touch behaviours during gameplay ---- */

/**
 * Prevent pull-to-refresh, pinch zoom, and accidental scrolling
 * while the game is running.
 */
function preventDefaults() {
  /* Prevent zoom on double-tap */
  document.addEventListener('touchstart', (e) => {
    if (e.touches.length > 1) e.preventDefault();
  }, { passive: false });

  /* Prevent pinch zoom */
  document.addEventListener('gesturestart', (e) => e.preventDefault());
  document.addEventListener('gesturechange', (e) => e.preventDefault());

  /* Prevent pull-to-refresh when touching the game area */
  document.body.style.overscrollBehavior = 'none';
}

/* ---- Public API ---- */

/** Initialise all touch controls. */
export function bindTouch() {
  bindSwipe();
  bindDpad();
  preventDefaults();
}
