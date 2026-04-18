/**
 * Canvas rendering helpers for the snake game.
 * @module renderer
 */

import { CELL, COLS, ROWS } from './constants.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

/**
 * Draw a cell-aligned rounded rectangle.
 * @param {number} x     - Grid column.
 * @param {number} y     - Grid row.
 * @param {string} color - CSS fill colour.
 * @param {number} radius - Corner radius.
 */
export function drawCell(x, y, color, radius = 4) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.roundRect(x * CELL + 1, y * CELL + 1, CELL - 2, CELL - 2, radius);
  ctx.fill();
}

/**
 * Draw a rounded rectangle at sub-pixel coordinates (for smooth interpolation).
 * @param {number} px    - Pixel X position.
 * @param {number} py    - Pixel Y position.
 * @param {string} color - CSS fill colour.
 * @param {number} radius - Corner radius.
 */
function drawCellSmooth(px, py, color, radius = 4) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.roundRect(px + 1, py + 1, CELL - 2, CELL - 2, radius);
  ctx.fill();
}

/**
 * Interpolate between two grid positions with wrap-around awareness.
 * @param {number} a   - Previous grid coordinate.
 * @param {number} b   - Current grid coordinate.
 * @param {number} t   - Interpolation factor (0-1).
 * @param {number} max - Grid size on this axis.
 * @returns {number} Pixel position.
 */
function lerpWrap(a, b, t, max) {
  let diff = b - a;
  if (diff > max / 2) diff -= max;
  if (diff < -max / 2) diff += max;
  return (a + diff * t) * CELL;
}

/** Draw the subtle background grid lines. */
function drawGrid() {
  ctx.strokeStyle = 'rgba(255,255,255,0.02)';
  for (let x = 0; x <= COLS; x++) {
    ctx.beginPath();
    ctx.moveTo(x * CELL, 0);
    ctx.lineTo(x * CELL, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y <= ROWS; y++) {
    ctx.beginPath();
    ctx.moveTo(0, y * CELL);
    ctx.lineTo(canvas.width, y * CELL);
    ctx.stroke();
  }
}

/**
 * Render a full frame of the game.
 * @param {number}   t         - Tick interpolation progress (0-1).
 * @param {Object}   state     - Current game state.
 * @param {Object[]} state.snake
 * @param {Object[]|null} state.prevSnake
 * @param {string}   state.direction
 * @param {Object}   state.food
 * @param {Object[]} state.obstacles
 */
export function draw(t, state) {
  const { snake, prevSnake, direction, food, obstacles, sprinting } = state;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();

  /* Obstacles */
  obstacles.forEach((o) => drawCell(o.x, o.y, '#ff2244', 2));

  /* Snake body (smoothly interpolated) */
  const prev = prevSnake || snake;
  const easeT = t * t * (3 - 2 * t); // smoothstep

  snake.forEach((seg, i) => {
    const frac = i / snake.length;
    const g = Math.round(255 - frac * 120);
    const b = Math.round(136 - frac * 80);
    const p = prev[i] || seg;
    const px = lerpWrap(p.x, seg.x, easeT, COLS);
    const py = lerpWrap(p.y, seg.y, easeT, ROWS);

    /* Sprint glow on head */
    if (i === 0 && sprinting) {
      ctx.shadowColor = '#00ffcc';
      ctx.shadowBlur = 16;
    }
    drawCellSmooth(px, py, `rgb(0,${g},${b})`, i === 0 ? 6 : 4);
    if (i === 0 && sprinting) {
      ctx.shadowBlur = 0;
    }
  });

  /* Eyes on the interpolated head */
  const h = snake[0];
  const hp = prev[0] || h;
  const hx = lerpWrap(hp.x, h.x, easeT, COLS) + CELL / 2;
  const hy = lerpWrap(hp.y, h.y, easeT, ROWS) + CELL / 2;
  ctx.fillStyle = '#0a0a2e';

  if (direction === 'right' || direction === 'left') {
    const dx = direction === 'right' ? 3 : -3;
    ctx.beginPath(); ctx.arc(hx + dx, hy - 4, 2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(hx + dx, hy + 4, 2, 0, Math.PI * 2); ctx.fill();
  } else {
    const dy = direction === 'down' ? 3 : -3;
    ctx.beginPath(); ctx.arc(hx - 4, hy + dy, 2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(hx + 4, hy + dy, 2, 0, Math.PI * 2); ctx.fill();
  }

  /* Food with pulsing glow */
  const pulse = 8 + Math.sin(performance.now() * 0.005) * 4;
  ctx.shadowColor = food.type === 'bonus' ? '#ffaa00' : '#00ffaa';
  ctx.shadowBlur = pulse;
  drawCell(food.x, food.y, food.type === 'bonus' ? '#ffaa00' : '#00ff88', 8);
  ctx.shadowBlur = 0;
}
