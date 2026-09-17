/* Small, self-contained browser experiment. No Unity runtime or dependencies. */
(() => {
  'use strict';
  const canvas = document.getElementById('gravity-canvas');
  const ctx = canvas?.getContext('2d');
  if (!ctx) return;
  const el = id => document.getElementById(id);
  const start = el('lab-start');
  const overlay = el('lab-overlay');
  const status = el('lab-state');
  const debug = el('lab-debug');
  const gravity = el('gravity-strength');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const keys = new Set();
  const held = new Map();
  const blocks = [{ x: 245, y: 184, w: 46, h: 68 }, { x: 469, y: 48, w: 46, h: 70 }];
  const checkpoints = [{ x: 175, y: 232 }, { x: 380, y: 68 }, { x: 635, y: 232 }];
  const p = { x: 45, y: 230, w: 22, h: 22, vx: 0, vy: 0, facing: 1 };
  let collected = new Set();
  let running = false, hasStarted = false, won = false, direction = 1;
  let frame = 0, last = 0, dashTime = 0, cooldown = 0, flipCooldown = 0;
  let trail = [];

  function setStatus(message) { status.textContent = message; }
  function stop(message = 'Paused') {
    running = false;
    keys.clear(); held.clear();
    cancelAnimationFrame(frame);
    start.textContent = won ? 'Play again' : hasStarted ? 'Resume' : 'Play experiment';
    setStatus(message);
    draw();
  }
  function reset() {
    stop('Ready to play');
    Object.assign(p, { x: 45, y: 230, vx: 0, vy: 0, facing: 1 });
    direction = 1; dashTime = 0; cooldown = 0; flipCooldown = 0;
    collected = new Set(); trail = []; won = false; hasStarted = false;
    el('lab-score').textContent = '0 / 3';
    start.textContent = 'Play experiment';
    overlay.hidden = false;
    draw();
  }
  function play() {
    if (running) { stop(); return; }
    if (won) reset();
    hasStarted = true; running = true; overlay.hidden = true;
    start.textContent = 'Pause';
    setStatus(direction > 0 ? 'Gravity ↓' : 'Gravity ↑');
    canvas.focus({ preventScroll: true });
    last = performance.now();
    frame = requestAnimationFrame(tick);
  }
  function action(name) {
    if (!running) return;
    if (name === 'flip' && flipCooldown <= 0) {
      direction *= -1; flipCooldown = .18;
      setStatus(direction > 0 ? 'Gravity ↓' : 'Gravity ↑');
    }
    if (name === 'dash' && cooldown <= 0) { dashTime = .14; cooldown = .65; }
  }
  function overlaps(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  }
  function update(dt) {
    cooldown = Math.max(0, cooldown - dt);
    flipCooldown = Math.max(0, flipCooldown - dt);
    dashTime = Math.max(0, dashTime - dt);
    const controls = [...held.values()];
    const right = keys.has('KeyD') || keys.has('ArrowRight') || controls.includes('right');
    const left = keys.has('KeyA') || keys.has('ArrowLeft') || controls.includes('left');
    const axis = Number(right) - Number(left);
    if (axis) p.facing = axis;
    const target = dashTime > 0 ? p.facing * 680 : axis * 210;
    p.vx += (target - p.vx) * Math.min(1, dt * (dashTime > 0 ? 100 : 16));
    p.vy = Math.max(-650, Math.min(650, p.vy + Number(gravity.value) * direction * dt));
    // Resolve each axis separately; fixed small steps prevent thin-wall tunnelling.
    p.x += p.vx * dt;
    for (const block of blocks) {
      if (overlaps(p, block)) { p.x = p.vx > 0 ? block.x - p.w : block.x + block.w; p.vx = 0; }
    }
    p.x = Math.max(18, Math.min(702 - p.w, p.x));
    p.y += p.vy * dt;
    for (const block of blocks) {
      if (overlaps(p, block)) { p.y = p.vy > 0 ? block.y - p.h : block.y + block.h; p.vy = 0; }
    }
    if (p.y < 48) { p.y = 48; p.vy = 0; }
    if (p.y + p.h > 252) { p.y = 252 - p.h; p.vy = 0; }
    checkpoints.forEach((point, index) => {
      if (!collected.has(index) && overlaps(p, { x: point.x - 13, y: point.y - 13, w: 26, h: 26 })) {
        collected.add(index);
        el('lab-score').textContent = `${collected.size} / 3`;
        setStatus(`Checkpoint ${collected.size} of 3`);
      }
    });
    if (collected.size === checkpoints.length) { won = true; stop('All checkpoints found. Nicely done.'); }
  }
  function draw() {
    ctx.clearRect(0, 0, 720, 300);
    ctx.fillStyle = '#22251f'; ctx.fillRect(0, 0, 720, 300);
    ctx.strokeStyle = '#343a2f'; ctx.lineWidth = 1;
    for (let x = 20; x < 720; x += 40) { ctx.beginPath(); ctx.moveTo(x, 48); ctx.lineTo(x, 252); ctx.stroke(); }
    for (let y = 52; y < 252; y += 40) { ctx.beginPath(); ctx.moveTo(18, y); ctx.lineTo(702, y); ctx.stroke(); }
    ctx.fillStyle = '#92947f'; ctx.fillRect(18, 44, 684, 4); ctx.fillRect(18, 252, 684, 4);
    ctx.fillStyle = '#525b45';
    blocks.forEach(b => { ctx.fillRect(b.x, b.y, b.w, b.h); });
    ctx.font = '14px monospace'; ctx.fillStyle = '#b8bea6';
    ctx.fillText('FLIP / FIND / REPEAT', 20, 28);
    ctx.fillText(direction > 0 ? 'GRAVITY: DOWN' : 'GRAVITY: UP', 548, 28);
    checkpoints.forEach((point, i) => {
      ctx.strokeStyle = collected.has(i) ? '#738463' : '#e1a176'; ctx.lineWidth = 2;
      ctx.strokeRect(point.x - 10, point.y - 10, 20, 20);
      if (collected.has(i)) { ctx.fillStyle = '#738463'; ctx.fillRect(point.x - 5, point.y - 5, 10, 10); }
      ctx.fillStyle = '#d7c7a6'; ctx.fillText(`0${i + 1}`, point.x - 9, point.y > 150 ? point.y - 22 : point.y + 33);
    });
    if (!reducedMotion.matches) trail.forEach((point, i) => {
      ctx.globalAlpha = (i / trail.length) * .22; ctx.fillStyle = '#ead8b3'; ctx.fillRect(point.x, point.y, p.w, p.h);
    });
    ctx.globalAlpha = 1;
    ctx.fillStyle = dashTime > 0 ? '#e1a176' : '#ece8cf'; ctx.fillRect(p.x, p.y, p.w, p.h);
    ctx.fillStyle = '#33392b'; ctx.fillRect(p.x + (p.facing > 0 ? 15 : 4), p.y + 6, 3, 3);
    if (debug.checked) {
      ctx.strokeStyle = '#e1a176'; ctx.strokeRect(p.x - 3, p.y - 3, p.w + 6, p.h + 6);
      ctx.beginPath(); ctx.moveTo(p.x + 11, p.y + 11); ctx.lineTo(p.x + 11 + p.vx * .12, p.y + 11 + p.vy * .12); ctx.stroke();
      ctx.fillStyle = '#d9bd98'; ctx.fillText(`VX ${Math.round(p.vx)}  VY ${Math.round(p.vy)}  G ${gravity.value}`, 20, 283);
    } else {
      ctx.fillStyle = '#b8bea6'; ctx.fillText('A / D  MOVE     SPACE  FLIP', 20, 283);
    }
    ctx.fillStyle = '#b8bea6'; ctx.fillText(cooldown > 0 ? 'DASH: CHARGING' : 'DASH: READY', 548, 283);
  }
  function tick(now) {
    if (!running) return;
    // Clamp long frames after interruptions and substep at 120 Hz or finer.
    const elapsed = Math.min((now - last) / 1000, .05); last = now;
    const steps = Math.max(1, Math.ceil(elapsed * 120));
    for (let i = 0; i < steps && running; i++) update(elapsed / steps);
    if (!reducedMotion.matches) { trail.push({ x: p.x, y: p.y }); if (trail.length > 7) trail.shift(); }
    draw();
    if (running) frame = requestAnimationFrame(tick);
  }
  start.disabled = false; el('lab-reset').disabled = false;
  start.addEventListener('click', play);
  el('lab-reset').addEventListener('click', reset);
  debug.addEventListener('change', draw);
  gravity.addEventListener('input', () => { el('gravity-value').textContent = Number(gravity.value).toLocaleString('en'); draw(); });
  canvas.addEventListener('keydown', event => {
    if (['KeyA', 'KeyD', 'ArrowLeft', 'ArrowRight', 'Space', 'ShiftLeft', 'ShiftRight', 'Escape'].includes(event.code)) {
      event.preventDefault();
      if (event.code === 'Escape') { stop(); start.focus({ preventScroll: true }); return; }
      keys.add(event.code);
      if (!event.repeat) { if (event.code === 'Space') action('flip'); if (event.code.startsWith('Shift')) action('dash'); }
    }
  });
  window.addEventListener('keyup', event => keys.delete(event.code));
  canvas.addEventListener('blur', () => keys.clear());
  document.querySelectorAll('[data-control]').forEach(button => {
    button.disabled = false;
    button.addEventListener('pointerdown', event => {
      if (!running) return;
      event.preventDefault();
      button.setPointerCapture(event.pointerId);
      held.set(event.pointerId, button.dataset.control);
      action(button.dataset.control);
    });
    for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) button.addEventListener(type, event => held.delete(event.pointerId));
    // Native click from keyboard/assistive technology has no pointer gesture.
    button.addEventListener('click', event => {
      if (event.detail !== 0 || !running) return;
      if (['left', 'right'].includes(button.dataset.control)) {
        p.facing = button.dataset.control === 'right' ? 1 : -1;
        action('dash');
      } else action(button.dataset.control);
    });
  });
  window.addEventListener('blur', () => { if (running) stop(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden && running) stop(); });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => { if (!entries[0].isIntersecting && running) stop(); }).observe(canvas);
  }
  draw();
})();
