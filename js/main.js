/**
 * Application entry point.
 * Wires up all modules and initialises the UI.
 * @module main
 */

import { getHighScore } from './storage.js';
import { bindUI } from './ui.js';
import { bindKeyboard } from './input.js';

/* Display persisted high score on load */
document.getElementById('highscore').textContent = getHighScore();

/* Attach event listeners */
bindUI();
bindKeyboard();
