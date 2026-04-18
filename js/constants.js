/**
 * Game configuration constants.
 * @module constants
 */

/** Canvas pixel dimensions. */
export const CANVAS_WIDTH = 600;
export const CANVAS_HEIGHT = 600;

/** Size of each grid cell in pixels. */
export const CELL = 20;

/** Number of columns in the grid. */
export const COLS = CANVAS_WIDTH / CELL;

/** Number of rows in the grid. */
export const ROWS = CANVAS_HEIGHT / CELL;

/** Base tick interval in ms (level 1 speed). */
export const BASE_INTERVAL = 200;

/** Fastest possible tick interval in ms. */
export const MIN_INTERVAL = 60;

/** Food items needed to advance one level. */
export const FOOD_PER_LEVEL = 5;

/** New obstacles are added every N levels. */
export const OBSTACLE_INTERVAL = 3;

/** Maximum number of obstacles on the board. */
export const MAX_OBSTACLES = 40;

/** Sprint speed multiplier (fraction of current interval used while sprinting). */
export const SPRINT_MULTIPLIER = 0.45;
