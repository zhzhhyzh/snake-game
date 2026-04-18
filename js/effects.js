/**
 * Level-up visual effects: particle burst, text flash, and screen shake.
 * @module effects
 */

const particleCanvas = document.getElementById('particles');
const pCtx = particleCanvas.getContext('2d');

let particles = [];
let particleAnim = null;

/** Resize the particle canvas to match the viewport. */
function resizeParticleCanvas() {
  particleCanvas.width = window.innerWidth;
  particleCanvas.height = window.innerHeight;
}

resizeParticleCanvas();
window.addEventListener('resize', resizeParticleCanvas);

/** Spawn a burst of colourful particles from the centre of the screen. */
function spawnLevelParticles() {
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;
  const colors = ['#ffaa00', '#ff6600', '#00ff88', '#00ccff', '#ff44aa', '#ffff00'];

  for (let i = 0; i < 60; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 2 + Math.random() * 6;
    particles.push({
      x: cx,
      y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 2,
      life: 1,
      decay: 0.01 + Math.random() * 0.02,
      size: 3 + Math.random() * 5,
      color: colors[Math.floor(Math.random() * colors.length)],
    });
  }

  if (!particleAnim) {
    animateParticles();
  }
}

/** Render-loop for active particles. */
function animateParticles() {
  pCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
  particles = particles.filter((p) => p.life > 0);

  particles.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.1;
    p.life -= p.decay;
    pCtx.globalAlpha = p.life;
    pCtx.fillStyle = p.color;
    pCtx.beginPath();
    pCtx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
    pCtx.fill();
  });

  pCtx.globalAlpha = 1;

  if (particles.length > 0) {
    particleAnim = requestAnimationFrame(animateParticles);
  } else {
    particleAnim = null;
  }
}

/**
 * Trigger the full level-up animation: text flash, particles, and screen shake.
 * @param {number} level - The new level number to display.
 */
export function showLevelUpAnimation(level) {
  /* Text flash */
  const flash = document.getElementById('levelupFlash');
  const txt = document.getElementById('lvlText');
  txt.textContent = 'LEVEL ' + level;
  flash.classList.remove('active');
  void flash.offsetWidth; // force reflow
  flash.classList.add('active');

  /* Particles */
  spawnLevelParticles();

  /* Screen shake */
  const container = document.querySelector('.container');
  container.style.transition = 'transform 0.05s';
  let shakes = 0;
  const shakeInt = setInterval(() => {
    const dx = (Math.random() - 0.5) * 8;
    const dy = (Math.random() - 0.5) * 8;
    container.style.transform = `translate(${dx}px, ${dy}px)`;
    shakes++;
    if (shakes > 8) {
      clearInterval(shakeInt);
      container.style.transform = '';
    }
  }, 40);
}
