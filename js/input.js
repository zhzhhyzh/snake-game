/**
 * Keyboard input handler.
 * @module input
 */

import { isRunning, getDirection, setDirection, togglePause, setSprinting } from './game.js';

/** Map key names to direction strings. */
const KEY_TO_DIR = {
  arrowup: 'up',    w: 'up',
  arrowdown: 'down', s: 'down',
  arrowleft: 'left', a: 'left',
  arrowright: 'right', d: 'right',
};

/** Opposite directions (to prevent 180-degree turns). */
const OPPOSITE = { up: 'down', down: 'up', left: 'right', right: 'left' };

/** Bind keyboard controls for movement, sprint, and pause. */
export function bindKeyboard() {
  document.addEventListener('keydown', (e) => {
    if (!isRunning()) return;

    const key = e.key.toLowerCase();
    const dir = getDirection();
    const mapped = KEY_TO_DIR[key];

    if (mapped) {
      if (mapped === dir) {
        /* Same direction — activate sprint */
        setSprinting(true);
      } else if (mapped !== OPPOSITE[dir]) {
        /* New valid direction — change & stop any sprint */
        setSprinting(false);
        setDirection(mapped);
      }
    } else if (key === 'p') {
      const nowPaused = togglePause();
      document.getElementById('pauseScreen').style.display = nowPaused ? 'flex' : 'none';
    }

    /* Prevent page scrolling on arrow / space keys */
    if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(key)) {
      e.preventDefault();
    }
  });

  /* Release sprint when key is released */
  document.addEventListener('keyup', (e) => {
    const key = e.key.toLowerCase();
    const mapped = KEY_TO_DIR[key];
    if (mapped) {
      setSprinting(false);
    }
  });
}
