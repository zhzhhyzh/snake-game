/**
 * Game state persistence via localStorage.
 * @module storage
 */

const SAVE_KEY = 'snakeSaveGame';
const HIGH_SCORE_KEY = 'snakeHighScore';

/**
 * Persist the current game state to localStorage.
 * @param {Object} state - Serialisable game state snapshot.
 */
export function saveGame(state) {
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
}

/**
 * Load a previously saved game state.
 * @returns {Object|null} Parsed state or null if none exists.
 */
export function loadGame() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/** Remove the saved game from storage. */
export function deleteSave() {
  localStorage.removeItem(SAVE_KEY);
}

/**
 * Check whether a saved game exists.
 * @returns {boolean}
 */
export function hasSave() {
  return !!localStorage.getItem(SAVE_KEY);
}

/**
 * Read the persisted high score.
 * @returns {number}
 */
export function getHighScore() {
  return parseInt(localStorage.getItem(HIGH_SCORE_KEY) || '0', 10);
}

/**
 * Persist a new high score.
 * @param {number} score
 */
export function setHighScore(score) {
  localStorage.setItem(HIGH_SCORE_KEY, String(score));
}
