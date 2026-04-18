/**
 * UI overlay and button event wiring.
 * @module ui
 */

import {
  initGame, resumeFromSave, resume, stopGame,
  isRunning, isPaused, getStateSnapshot,
} from './game.js';
import { toggleSound, startBGM, stopBGM, setActiveMelody } from './audio.js';
import { saveGame, loadGame, hasSave } from './storage.js';
import {
  SNAKE_SKINS, MAP_THEMES,
  getCurrentSkin, setCurrentSkin,
  getCurrentTheme, setCurrentTheme,
} from './themes.js';
import { applyThemeToCanvas } from './renderer.js';

/**
 * Apply the active map theme to all DOM elements (body, canvas, overlays).
 */
export function applyThemeToDom() {
  const theme = getCurrentTheme();
  document.body.style.background = theme.bodyBg;
  applyThemeToCanvas();
  document.querySelectorAll('.overlay').forEach((el) => {
    el.style.background = theme.overlayBg;
  });
}

/* ---- Picker builders ---- */

/**
 * Build skin preview cards inside the picker container.
 */
function buildSkinPicker() {
  const container = document.getElementById('skinPicker');
  const activeSkin = getCurrentSkin();

  container.innerHTML = '';
  SNAKE_SKINS.forEach((skin) => {
    const opt = document.createElement('div');
    opt.className = 'picker-option' + (skin.id === activeSkin.id ? ' active' : '');
    opt.dataset.skinId = skin.id;

    /* Build a 6-segment colour strip preview */
    const strip = document.createElement('div');
    strip.className = 'preview-strip';
    for (let i = 0; i < 6; i++) {
      const seg = document.createElement('span');
      seg.style.background = skin.colorFn(i, 6);
      strip.appendChild(seg);
    }

    const label = document.createElement('div');
    label.className = 'label';
    label.textContent = skin.name;

    opt.appendChild(strip);
    opt.appendChild(label);

    opt.addEventListener('click', () => {
      setCurrentSkin(skin.id);
      container.querySelectorAll('.picker-option').forEach((el) => el.classList.remove('active'));
      opt.classList.add('active');
    });

    container.appendChild(opt);
  });
}

/**
 * Build theme preview cards inside the picker container.
 */
function buildThemePicker() {
  const container = document.getElementById('themePicker');
  const activeTheme = getCurrentTheme();

  container.innerHTML = '';
  MAP_THEMES.forEach((theme) => {
    const opt = document.createElement('div');
    opt.className = 'picker-option' + (theme.id === activeTheme.id ? ' active' : '');
    opt.dataset.themeId = theme.id;

    const circle = document.createElement('div');
    circle.className = 'preview-circle';
    circle.style.background = `radial-gradient(circle, ${theme.canvasBorder}, ${theme.canvasBg})`;

    const label = document.createElement('div');
    label.className = 'label';
    label.textContent = theme.name;

    opt.appendChild(circle);
    opt.appendChild(label);

    opt.addEventListener('click', () => {
      setCurrentTheme(theme.id);
      setActiveMelody();
      applyThemeToDom();
      container.querySelectorAll('.picker-option').forEach((el) => el.classList.remove('active'));
      opt.classList.add('active');
    });

    container.appendChild(opt);
  });
}

/* ---- Main binding ---- */

/** Wire up all UI button listeners and the sound toggle. */
export function bindUI() {
  /* Apply persisted theme on load */
  applyThemeToDom();

  /* Build pickers */
  buildSkinPicker();
  buildThemePicker();

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

  /* Start screen -- New Game */
  document.getElementById('startBtn').addEventListener('click', () => {
    document.getElementById('startScreen').style.display = 'none';
    initGame();
  });

  /* Start screen -- Continue (load save) */
  document.getElementById('continueBtn').addEventListener('click', () => {
    const state = loadGame();
    if (state) {
      document.getElementById('startScreen').style.display = 'none';
      resumeFromSave(state);
    }
  });

  /* Start screen -- Settings */
  document.getElementById('settingsBtn').addEventListener('click', () => {
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('settingsScreen').style.display = 'flex';
  });

  /* Settings -- Back */
  document.getElementById('settingsBackBtn').addEventListener('click', () => {
    document.getElementById('settingsScreen').style.display = 'none';
    document.getElementById('startScreen').style.display = 'flex';
  });

  /* Game Over -- Play Again */
  document.getElementById('restartBtn').addEventListener('click', () => {
    document.getElementById('gameOverScreen').style.display = 'none';
    initGame();
  });

  /* Pause -- Resume */
  document.getElementById('resumeBtn').addEventListener('click', () => {
    resume();
    document.getElementById('pauseScreen').style.display = 'none';
  });

  /* Pause -- Save & Quit */
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
