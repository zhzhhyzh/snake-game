/**
 * UI overlay and button event wiring.
 * @module ui
 */

import { initGame, resumeFromSave, resume, stopGame, isRunning, isPaused, getStateSnapshot } from './game.js';
import { toggleSound, isSoundEnabled, startBGM, stopBGM } from './audio.js';
import { saveGame, loadGame, hasSave } from './storage.js';

/** Wire up all UI button listeners and the sound toggle. */
export function bindUI() {
  /* Sound toggle */
  const soundToggleBtn = document.getElementById('soundToggle');
  soundToggleBtn.addEventListener('click', () => {
    const enabled = toggleSound();
    soundToggleBtn.textContent = enabled ? '\u{1F50A}' : '\u{1F507}';
    soundToggleBtn.classList.toggle('muted', !enabled);
    if (!enabled) {
      stopBGM();
    } else if (isRunning() && !isPaused()) {
      startBGM();
    }
  });

  /* Start screen — New Game */
  document.getElementById('startBtn').addEventListener('click', () => {
    document.getElementById('startScreen').style.display = 'none';
    initGame();
  });

  /* Start screen — Continue (load save) */
  document.getElementById('continueBtn').addEventListener('click', () => {
    const state = loadGame();
    if (state) {
      document.getElementById('startScreen').style.display = 'none';
      resumeFromSave(state);
    }
  });

  /* Game Over — Play Again */
  document.getElementById('restartBtn').addEventListener('click', () => {
    document.getElementById('gameOverScreen').style.display = 'none';
    initGame();
  });

  /* Pause — Resume */
  document.getElementById('resumeBtn').addEventListener('click', () => {
    resume();
    document.getElementById('pauseScreen').style.display = 'none';
  });

  /* Pause — Save & Quit */
  document.getElementById('saveBtn').addEventListener('click', () => {
    saveGame(getStateSnapshot());
    stopGame();
    document.getElementById('pauseScreen').style.display = 'none';
    document.getElementById('continueBtn').style.display = '';
    document.getElementById('startScreen').style.display = 'flex';
  });

  /* Show Continue button if a save exists on load */
  if (hasSave()) {
    document.getElementById('continueBtn').style.display = '';
  }
}
