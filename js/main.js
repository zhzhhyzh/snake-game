/**
 * Application entry point.
 * Wires up all modules and initialises the UI.
 * @module main
 */

import { getHighScore } from './storage.js';
import { bindUI } from './ui.js';
import { bindKeyboard } from './input.js';
import { bindTouch } from './touch.js';

/* Display persisted high score on load */
document.getElementById('highscore').textContent = getHighScore();

/* Attach event listeners */
bindUI();
bindKeyboard();
bindTouch();
