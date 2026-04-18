/**
 * Snake skin and map theme definitions.
 * All procedural -- no external assets required.
 * @module themes
 */

/* ================================================================
   SNAKE SKINS
   Each skin: { id, name, colorFn(i, len) -> cssColor, eyeColor, sprintGlow }
   ================================================================ */

/** @type {Array<Object>} */
export const SNAKE_SKINS = [
  {
    id: 'classic',
    name: 'Classic Green',
    colorFn: (i, len) => {
      const t = i / Math.max(len, 1);
      return `rgb(0,${Math.round(255 - t * 120)},${Math.round(136 - t * 80)})`;
    },
    eyeColor: '#0a0a2e',
    sprintGlow: '#00ffcc',
  },
  {
    id: 'fire',
    name: 'Fire',
    colorFn: (i, len) => {
      const t = i / Math.max(len, 1);
      const r = Math.round(255 - t * 40);
      const g = Math.round(60 + t * 140);
      const b = Math.round(0 + t * 20);
      return `rgb(${r},${g},${b})`;
    },
    eyeColor: '#1a0000',
    sprintGlow: '#ff4400',
  },
  {
    id: 'ocean',
    name: 'Ocean Wave',
    colorFn: (i, len) => {
      const t = i / Math.max(len, 1);
      const r = Math.round(0 + t * 10);
      const g = Math.round(220 - t * 140);
      const b = Math.round(255 - t * 60);
      return `rgb(${r},${g},${b})`;
    },
    eyeColor: '#001133',
    sprintGlow: '#00ccff',
  },
  {
    id: 'zebra',
    name: 'Zebra',
    colorFn: (i) => (i % 2 === 0 ? '#e8e8e8' : '#222222'),
    eyeColor: '#ff0000',
    sprintGlow: '#ffffff',
  },
  {
    id: 'rainbow',
    name: 'Rainbow',
    colorFn: (i, len) => {
      const hue = Math.round((i / Math.max(len, 1)) * 360);
      return `hsl(${hue},90%,55%)`;
    },
    eyeColor: '#111111',
    sprintGlow: '#ffffff',
  },
  {
    id: 'neon',
    name: 'Neon Pink',
    colorFn: (i, len) => {
      const t = i / Math.max(len, 1);
      const r = Math.round(255 - t * 80);
      const g = Math.round(20 + t * 10);
      const b = Math.round(147 + t * 100);
      return `rgb(${r},${g},${b})`;
    },
    eyeColor: '#0a001a',
    sprintGlow: '#ff44cc',
  },
];

/* ================================================================
   MAP THEMES
   ================================================================ */

/** @type {Array<Object>} */
export const MAP_THEMES = [
  {
    id: 'space',
    name: 'Space',
    bodyBg: '#0a0a2e',
    canvasBg: '#0d0d35',
    canvasBorder: '#1a1a4e',
    gridColor: 'rgba(255,255,255,0.02)',
    obstacleColor: '#ff2244',
    foodColor: '#00ff88',
    bonusColor: '#ffaa00',
    foodGlow: '#00ffaa',
    bonusGlow: '#ffaa00',
    overlayBg: 'rgba(10,10,46,0.96)',
    melody: [
      262, 294, 330, 262, 330, 349, 392, 0,
      392, 440, 392, 349, 330, 262, 294, 0,
      330, 349, 392, 440, 392, 349, 330, 294,
      262, 330, 294, 262, 220, 262, 294, 0,
    ],
    melodyTempo: 220,
    melodyType: 'triangle',
    sfxType: 'square',
  },
  {
    id: 'lava',
    name: 'Lava',
    bodyBg: '#1a0500',
    canvasBg: '#2a0800',
    canvasBorder: '#5a1500',
    gridColor: 'rgba(255,80,0,0.04)',
    obstacleColor: '#ff6600',
    foodColor: '#ffcc00',
    bonusColor: '#ff3300',
    foodGlow: '#ffaa00',
    bonusGlow: '#ff4400',
    overlayBg: 'rgba(30,5,0,0.96)',
    melody: [
      196, 0, 220, 196, 0, 165, 196, 0,
      147, 165, 0, 196, 165, 0, 147, 0,
      131, 147, 165, 0, 147, 131, 0, 147,
      165, 0, 147, 131, 0, 131, 147, 0,
    ],
    melodyTempo: 280,
    melodyType: 'sawtooth',
    sfxType: 'sawtooth',
  },
  {
    id: 'spooky',
    name: 'Spooky',
    bodyBg: '#0a0a0a',
    canvasBg: '#111111',
    canvasBorder: '#2a2a2a',
    gridColor: 'rgba(100,0,100,0.03)',
    obstacleColor: '#8844aa',
    foodColor: '#44ff88',
    bonusColor: '#ff44ff',
    foodGlow: '#22ff66',
    bonusGlow: '#cc22cc',
    overlayBg: 'rgba(10,10,10,0.96)',
    melody: [
      262, 0, 277, 0, 262, 247, 0, 0,
      233, 0, 247, 0, 233, 220, 0, 0,
      208, 220, 0, 233, 0, 220, 208, 0,
      196, 0, 208, 0, 196, 185, 0, 0,
    ],
    melodyTempo: 340,
    melodyType: 'sine',
    sfxType: 'sine',
  },
  {
    id: 'dj',
    name: 'DJ Room',
    bodyBg: '#12001a',
    canvasBg: '#1a0025',
    canvasBorder: '#4400aa',
    gridColor: 'rgba(200,0,255,0.04)',
    obstacleColor: '#ff00aa',
    foodColor: '#00ffff',
    bonusColor: '#ffff00',
    foodGlow: '#00ffff',
    bonusGlow: '#ffff00',
    overlayBg: 'rgba(18,0,26,0.96)',
    melody: [
      523, 0, 523, 392, 0, 523, 0, 659,
      0, 523, 0, 392, 523, 0, 659, 784,
      0, 659, 523, 0, 392, 0, 523, 0,
      659, 784, 659, 523, 0, 392, 0, 0,
    ],
    melodyTempo: 140,
    melodyType: 'square',
    sfxType: 'square',
  },
  {
    id: 'jungle',
    name: 'Jungle',
    bodyBg: '#001a05',
    canvasBg: '#002a08',
    canvasBorder: '#1a5a20',
    gridColor: 'rgba(0,255,50,0.03)',
    obstacleColor: '#8b4513',
    foodColor: '#ff6347',
    bonusColor: '#ffd700',
    foodGlow: '#ff4500',
    bonusGlow: '#ffcc00',
    overlayBg: 'rgba(0,20,5,0.96)',
    melody: [
      330, 392, 440, 0, 330, 392, 0, 294,
      330, 0, 262, 294, 330, 0, 392, 0,
      440, 392, 330, 0, 294, 262, 0, 294,
      330, 392, 0, 440, 330, 0, 294, 0,
    ],
    melodyTempo: 200,
    melodyType: 'triangle',
    sfxType: 'triangle',
  },
];

/* ================================================================
   ACTIVE SELECTION (persisted to localStorage)
   ================================================================ */

const SKIN_KEY = 'snakeSkinId';
const THEME_KEY = 'snakeThemeId';

let activeSkinId = localStorage.getItem(SKIN_KEY) || 'classic';
let activeThemeId = localStorage.getItem(THEME_KEY) || 'space';

/**
 * Look up a skin by ID.
 * @param {string} id
 * @returns {Object}
 */
export function getSkinById(id) {
  return SNAKE_SKINS.find((s) => s.id === id) || SNAKE_SKINS[0];
}

/**
 * Look up a theme by ID.
 * @param {string} id
 * @returns {Object}
 */
export function getThemeById(id) {
  return MAP_THEMES.find((t) => t.id === id) || MAP_THEMES[0];
}

/**
 * Get the currently active skin object.
 * @returns {Object}
 */
export function getCurrentSkin() {
  return getSkinById(activeSkinId);
}

/**
 * Set the active skin and persist the choice.
 * @param {string} id
 */
export function setCurrentSkin(id) {
  activeSkinId = id;
  localStorage.setItem(SKIN_KEY, id);
}

/**
 * Get the currently active theme object.
 * @returns {Object}
 */
export function getCurrentTheme() {
  return getThemeById(activeThemeId);
}

/**
 * Set the active theme and persist the choice.
 * @param {string} id
 */
export function setCurrentTheme(id) {
  activeThemeId = id;
  localStorage.setItem(THEME_KEY, id);
}
