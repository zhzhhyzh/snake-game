/**
 * Core game logic: state management, tick loop, collisions, and scoring.
 * @module game
 */

import {
  COLS, ROWS, BASE_INTERVAL, MIN_INTERVAL,
  FOOD_PER_LEVEL, OBSTACLE_INTERVAL, MAX_OBSTACLES, SPRINT_MULTIPLIER,
} from './constants.js';
import { initAudio, sfxEat, sfxBonus, sfxLevelUp, sfxGameOver, startBGM, stopBGM, setActiveMelody } from './audio.js';
import { showLevelUpAnimation } from './effects.js';
import { deleteSave, setHighScore, getHighScore } from './storage.js';
import { draw } from './renderer.js';

/* ---- Mutable game state ---- */
let snake = [];
let prevSnake = null;
let direction = 'right';
let nextDirection = 'right';
let food = { x: 0, y: 0, type: 'normal' };
let obstacles = [];

let score = 0;
let level = 1;
let foodEaten = 0;
let highScore = getHighScore();
let interval = BASE_INTERVAL;

let paused = false;
let running = false;
let lastTick = 0;
let animFrame = null;
let sprinting = false;

/* ---- State accessors (read-only for other modules) ---- */

/** @returns {boolean} */
export function isRunning() { return running; }

/** @returns {boolean} */
export function isPaused() { return paused; }

/** @returns {string} Current movement direction. */
export function getDirection() { return direction; }

/** @returns {number} */
export function getHighScoreValue() { return highScore; }

/**
 * Return a serialisable snapshot of the current game state.
 * @returns {Object}
 */
export function getStateSnapshot() {
  return {
    snake, direction, nextDirection, food, obstacles,
    score, level, foodEaten, interval,
  };
}

/* ---- Direction input ---- */

/**
 * Queue a direction change (applied on next tick).
 * @param {string} dir - 'up' | 'down' | 'left' | 'right'
 */
export function setDirection(dir) {
  nextDirection = dir;
}

/** @returns {boolean} Whether the snake is currently sprinting. */
export function isSprinting() { return sprinting; }

/**
 * Activate sprint mode (hold same-direction key).
 * @param {boolean} active
 */
export function setSprinting(active) {
  sprinting = active;
}

/* ---- Pause / Resume ---- */

/** Toggle the paused state and manage BGM accordingly. */
export function togglePause() {
  paused = !paused;
  if (paused) {
    stopBGM();
  } else {
    startBGM();
  }
  return paused;
}

/** Force-resume (used by UI resume button). */
export function resume() {
  paused = false;
  startBGM();
}

/* ---- HUD helpers ---- */

/** Push current values to the HUD DOM elements. */
function updateHUD() {
  document.getElementById('score').textContent = score;
  document.getElementById('level').textContent = level;
  document.getElementById('highscore').textContent = highScore;
  const speedMult = (BASE_INTERVAL / interval).toFixed(1);
  const sprintLabel = sprinting ? ' SPRINT' : '';
  document.getElementById('speed').textContent = speedMult + 'x' + sprintLabel;
  const pct = Math.min(100, ((level - 1) / 16) * 100);
  document.getElementById('diffBar').style.width = pct + '%';
}

/* ---- Board helpers ---- */

/**
 * Check whether a grid cell is occupied by the snake or an obstacle.
 * @param {number} x
 * @param {number} y
 * @returns {boolean}
 */
function isOccupied(x, y) {
  return (
    snake.some((s) => s.x === x && s.y === y) ||
    obstacles.some((o) => o.x === x && o.y === y)
  );
}

/** Place food on a random unoccupied cell. */
function spawnFood() {
  let x, y;
  do {
    x = Math.floor(Math.random() * COLS);
    y = Math.floor(Math.random() * ROWS);
  } while (isOccupied(x, y));
  const type = Math.random() < 0.15 ? 'bonus' : 'normal';
  food = { x, y, type };
}

/**
 * Add random obstacles to the board.
 * @param {number} count - How many to attempt to place.
 */
function addObstacles(count) {
  for (let i = 0; i < count && obstacles.length < MAX_OBSTACLES; i++) {
    let x, y, tries = 0;
    do {
      x = Math.floor(Math.random() * COLS);
      y = Math.floor(Math.random() * ROWS);
      tries++;
    } while (
      (isOccupied(x, y) ||
        (x === food.x && y === food.y) ||
        (Math.abs(x - snake[0].x) < 5 && Math.abs(y - snake[0].y) < 5)) &&
      tries < 100
    );
    if (tries < 100) obstacles.push({ x, y });
  }
}

/* ---- Level progression ---- */

function levelUp() {
  level++;
  foodEaten = 0;
  interval = Math.max(MIN_INTERVAL, BASE_INTERVAL - (level - 1) * 6);
  if (level % OBSTACLE_INTERVAL === 0) {
    addObstacles(2 + Math.floor(level / 5));
  }
  updateHUD();
  sfxLevelUp();
  showLevelUpAnimation(level);
}

/* ---- Core tick ---- */

function tick() {
  direction = nextDirection;
  prevSnake = snake.map((s) => ({ ...s }));
  const head = { ...snake[0] };

  switch (direction) {
    case 'up':    head.y--; break;
    case 'down':  head.y++; break;
    case 'left':  head.x--; break;
    case 'right': head.x++; break;
  }

  /* Wrap around edges */
  if (head.x < 0)       head.x = COLS - 1;
  else if (head.x >= COLS) head.x = 0;
  if (head.y < 0)       head.y = ROWS - 1;
  else if (head.y >= ROWS) head.y = 0;

  /* Collisions */
  if (snake.some((s) => s.x === head.x && s.y === head.y)) return gameOver();
  if (obstacles.some((o) => o.x === head.x && o.y === head.y)) return gameOver();

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    const isBonus = food.type === 'bonus';
    const pts = isBonus ? 3 * level : level;
    score += pts;
    foodEaten++;

    if (score > highScore) {
      highScore = score;
      setHighScore(highScore);
    }

    isBonus ? sfxBonus() : sfxEat();
    prevSnake.push(prevSnake[prevSnake.length - 1]);
    spawnFood();

    if (foodEaten >= FOOD_PER_LEVEL) {
      levelUp();
    } else {
      updateHUD();
    }
  } else {
    snake.pop();
  }
}

/* ---- Render loop (requestAnimationFrame) ---- */

function gameFrame(now) {
  if (!running) return;
  animFrame = requestAnimationFrame(gameFrame);

  if (paused) {
    draw(1, { snake, prevSnake, direction, food, obstacles });
    return;
  }

  const effectiveInterval = sprinting ? interval * SPRINT_MULTIPLIER : interval;
  const elapsed = now - lastTick;
  if (elapsed >= effectiveInterval) {
    tick();
    lastTick = now - (elapsed % effectiveInterval);
  }

  const progress = Math.min((now - lastTick) / effectiveInterval, 1);
  draw(progress, { snake, prevSnake, direction, food, obstacles, sprinting });
}

/* ---- Game lifecycle ---- */

function gameOver() {
  running = false;
  cancelAnimationFrame(animFrame);
  stopBGM();
  sfxGameOver();
  deleteSave();
  document.getElementById('finalScore').textContent = 'Score: ' + score;
  document.getElementById('finalHigh').textContent = 'High Score: ' + highScore;
  document.getElementById('gameOverScreen').style.display = 'flex';
}

/** Start a brand-new game. */
export function initGame() {
  initAudio();
  setActiveMelody();
  snake = [{ x: Math.floor(COLS / 2), y: Math.floor(ROWS / 2) }];
  direction = 'right';
  nextDirection = 'right';
  score = 0;
  level = 1;
  foodEaten = 0;
  obstacles = [];
  interval = BASE_INTERVAL;
  paused = false;
  running = true;
  sprinting = false;
  prevSnake = null;
  spawnFood();
  updateHUD();
  draw(1, { snake, prevSnake, direction, food, obstacles });
  deleteSave();
  lastTick = performance.now();
  animFrame = requestAnimationFrame(gameFrame);
  startBGM();
}

/**
 * Resume from a previously saved state.
 * @param {Object} state - State object from storage.
 */
export function resumeFromSave(state) {
  initAudio();
  setActiveMelody();
  snake = state.snake;
  direction = state.direction;
  nextDirection = state.nextDirection;
  food = state.food;
  obstacles = state.obstacles;
  score = state.score;
  level = state.level;
  foodEaten = state.foodEaten;
  interval = state.interval;
  paused = false;
  running = true;
  prevSnake = null;
  updateHUD();
  draw(1, { snake, prevSnake, direction, food, obstacles });
  deleteSave();
  lastTick = performance.now();
  animFrame = requestAnimationFrame(gameFrame);
  startBGM();
}

/**
 * Stop the game loop (used when saving and quitting).
 */
export function stopGame() {
  running = false;
  cancelAnimationFrame(animFrame);
  stopBGM();
}
