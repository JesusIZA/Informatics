// ===== ФОНОВІ СТІКЕРИ =====
// Розкидає емодзі-стікери по всьому екрану: екран ділиться на сітку клітинок,
// у кожну клітинку потрапляє один стікер зі випадковим зсувом усередині неї.
// Так розподіл виходить рівномірним, а позиції — щоразу різними.
// Кожен емодзі має власну анімацію (класи stk-* у styles.css).
(function () {
  'use strict';

  // Кожен емодзі — зі своєю унікальною анімацією
  const STICKERS = [
    { emoji: '🚀', anim: 'stk-rocket' },
    { emoji: '💡', anim: 'stk-glow' },
    { emoji: '⭐', anim: 'stk-twinkle' },
    { emoji: '🧩', anim: 'stk-wobble' },
    { emoji: '🖱️', anim: 'stk-nudge' },
    { emoji: '📚', anim: 'stk-bob' },
    { emoji: '💻', anim: 'stk-hover' },
    { emoji: '⌨️', anim: 'stk-typing' },
    { emoji: '🤖', anim: 'stk-robot' },
    { emoji: '🎮', anim: 'stk-rumble' },
    { emoji: '✏️', anim: 'stk-write' },
    { emoji: '💾', anim: 'stk-flip' },
    { emoji: '🧮', anim: 'stk-slide' },
    { emoji: '⚡', anim: 'stk-flash' },
    { emoji: '🖥️', anim: 'stk-breathe' },
    { emoji: '🎯', anim: 'stk-pulse' },
    { emoji: '🔍', anim: 'stk-search' },
    { emoji: '🧠', anim: 'stk-heartbeat' },
    { emoji: '📐', anim: 'stk-tick' },
    { emoji: '🔢', anim: 'stk-hop' },
    { emoji: '🎧', anim: 'stk-sway' },
    { emoji: '📝', anim: 'stk-flutter' },
    { emoji: '🧲', anim: 'stk-magnet' },
    { emoji: '🔋', anim: 'stk-charge' },
    { emoji: '🛰️', anim: 'stk-orbit' },
    { emoji: '💿', anim: 'stk-spin' },
    { emoji: '🕹️', anim: 'stk-joystick' },
    { emoji: '📡', anim: 'stk-signal' }
  ];

  // ===== ЛОГОТИП: розбити заголовок на літери, щоб кожну стилізувати окремо =====
  const logo = document.querySelector('h1.logo');
  if (logo && !logo.querySelector('.logo-letter')) {
    const text = logo.textContent.trim();
    logo.setAttribute('aria-label', text);
    logo.textContent = '';
    [...text].forEach((ch, i) => {
      const span = document.createElement('span');
      span.className = 'logo-letter';
      span.textContent = ch;
      span.style.setProperty('--i', i);
      span.setAttribute('aria-hidden', 'true');
      logo.appendChild(span);
    });
  }

  const host = document.querySelector('.shapes');
  if (!host || document.querySelector('.game-container')) return;

  const rand = (min, max) => min + Math.random() * (max - min);

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function render() {
    const W = window.innerWidth;
    const H = window.innerHeight;

    // Кількість стікерів залежить від площі екрана
    const count = W < 500 ? 10 : W < 900 ? 18 : 28;

    // Сітка клітинок, пропорційна екрану: у кожну клітинку — один стікер
    const cols = Math.max(3, Math.round(Math.sqrt(count * W / H)));
    const rows = Math.ceil(count / cols);
    const cells = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) cells.push({ c, r });
    }
    shuffle(cells);

    const pool = shuffle(STICKERS.slice());
    const cellW = 100 / cols;
    const cellH = 100 / rows;
    const frag = document.createDocumentFragment();

    for (let i = 0; i < count; i++) {
      const cell = cells[i];
      const sticker = pool[i % pool.length];
      const el = document.createElement('span');
      el.className = 'sticker ' + sticker.anim;
      el.textContent = sticker.emoji;
      el.setAttribute('aria-hidden', 'true');

      // Випадковий зсув у межах клітинки (з відступом від її країв)
      const x = (cell.c + rand(0.15, 0.85)) * cellW;
      const y = (cell.r + rand(0.15, 0.85)) * cellH;

      el.style.setProperty('--x', x.toFixed(2) + '%');
      el.style.setProperty('--y', y.toFixed(2) + '%');
      el.style.setProperty('--size', Math.round(rand(40, 68)) + 'px');
      el.style.setProperty('--tilt', Math.round(rand(-18, 18)) + 'deg');
      el.style.setProperty('--dur', rand(3.5, 7).toFixed(2) + 's');
      el.style.setProperty('--delay', (-rand(0, 6)).toFixed(2) + 's');
      frag.appendChild(el);
    }

    host.replaceChildren(frag);
    host.classList.add('stickers-ready');
  }

  render();

  // Перебудувати при суттєвій зміні розміру вікна (поворот екрана тощо)
  let resizeTimer = null;
  let lastW = window.innerWidth;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (Math.abs(window.innerWidth - lastW) > 120) {
        lastW = window.innerWidth;
        render();
      }
    }, 250);
  });
})();
