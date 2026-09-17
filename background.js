// ===== ТЕМИ, ЛОГОТИП І ФОНОВІ СТІКЕРИ =====
// 1. Теми: атрибут data-theme на <html> перемикає палітру (styles.css),
//    пул стікерів і темп їхніх анімацій. Вибір зберігається на день у localStorage
//    (theme-init.js застосовує його до першого рендеру). При натисканні кнопки
//    класу тема тимчасово перемикається під вік класу (без збереження).
// 2. Логотип: заголовок h1.logo розбивається на літери для окремого стилю кожної.
// 3. Стікери: екран ділиться на сітку клітинок, у кожну потрапляє один емодзі
//    зі випадковим зсувом — розподіл рівномірний, позиції щоразу різні.
//    Кожен емодзі має власну анімацію (класи stk-* у styles.css).
(function () {
  'use strict';

  const STORAGE_KEY = 'siteTheme';
  const DEFAULT_THEME = 'candy';

  // ----- Реєстр тем -----
  // count: кількість стікерів [телефон, планшет, комп'ютер]
  // durScale: множник тривалості анімацій (більше = спокійніше)
  // grades: класи, для яких тема вмикається автоматично при натисканні кнопки класу
  const THEMES = {
    candy: {
      label: 'Цукерки',
      icon: '🍬',
      grades: [5, 6],
      count: [10, 18, 28],
      durScale: 1,
      stickers: [
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
      ]
    },
    cosmos: {
      label: 'Космос',
      icon: '🪐',
      grades: [7, 8, 9], // поки немає теми 3-го рівня, старші класи теж отримують Космос
      count: [6, 12, 16],
      durScale: 1.6,
      stickers: [
        { emoji: '🚀', anim: 'stk-rocket' },
        { emoji: '🪐', anim: 'stk-orbit' },
        { emoji: '🛸', anim: 'stk-hover' },
        { emoji: '👽', anim: 'stk-wobble' },
        { emoji: '🌙', anim: 'stk-bob' },
        { emoji: '⭐', anim: 'stk-twinkle' },
        { emoji: '☄️', anim: 'stk-write' },
        { emoji: '🔭', anim: 'stk-tick' },
        { emoji: '🛰️', anim: 'stk-sway' },
        { emoji: '👨‍🚀', anim: 'stk-breathe' },
        { emoji: '🌌', anim: 'stk-glow' },
        { emoji: '🌍', anim: 'stk-spin' },
        { emoji: '💫', anim: 'stk-pulse' },
        { emoji: '✨', anim: 'stk-flash' },
        { emoji: '🌠', anim: 'stk-magnet' },
        { emoji: '🤖', anim: 'stk-robot' }
      ]
    }
  };

  const root = document.documentElement;
  const rand = (min, max) => min + Math.random() * (max - min);

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // ----- Теми -----
  function currentTheme() {
    const t = root.getAttribute('data-theme');
    return THEMES[t] ? t : DEFAULT_THEME;
  }

  function savedTheme() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (saved && THEMES[saved.theme] && saved.day === new Date().toDateString()) return saved.theme;
    } catch (e) { /* ignore */ }
    return DEFAULT_THEME;
  }

  function applyTheme(name, options) {
    const opts = options || {};
    if (!THEMES[name] || name === currentTheme()) {
      if (opts.persist) persistTheme(name);
      return;
    }
    if (name === DEFAULT_THEME) root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', name);
    if (opts.persist) persistTheme(name);
    renderStickers();
    updateSwitcher();
  }

  function persistTheme(name) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ theme: name, day: new Date().toDateString() }));
    } catch (e) { /* ignore */ }
  }

  function themeForGrade(grade) {
    for (const key of Object.keys(THEMES)) {
      if (THEMES[key].grades.includes(grade)) return key;
    }
    return DEFAULT_THEME;
  }

  // ----- Перемикач тем (кнопки-стікери у правому верхньому куті) -----
  let switcher = null;

  function buildSwitcher() {
    switcher = document.createElement('div');
    switcher.className = 'theme-switcher';
    switcher.setAttribute('role', 'group');
    switcher.setAttribute('aria-label', 'Тема сайту');
    for (const key of Object.keys(THEMES)) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'theme-btn';
      btn.dataset.theme = key;
      btn.title = THEMES[key].label;
      btn.setAttribute('aria-label', 'Тема: ' + THEMES[key].label);
      btn.textContent = THEMES[key].icon;
      btn.addEventListener('click', () => {
        switcher.classList.add('is-switching');
        root.classList.add('theme-fade');
        setTimeout(() => {
          applyTheme(key, { persist: true });
          root.classList.remove('theme-fade');
          switcher.classList.remove('is-switching');
        }, 220);
      });
      switcher.appendChild(btn);
    }
    document.body.appendChild(switcher);
    updateSwitcher();
  }

  function updateSwitcher() {
    if (!switcher) return;
    const active = currentTheme();
    switcher.querySelectorAll('.theme-btn').forEach(btn => {
      const on = btn.dataset.theme === active;
      btn.classList.toggle('is-active', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  // ----- Авто-тема за класом (лише на головній) -----
  function bindClassButtons() {
    const modal = document.getElementById('code-modal');
    document.querySelectorAll('.class-btn[data-class]').forEach(btn => {
      btn.addEventListener('click', () => {
        const grade = parseInt(btn.dataset.class, 10);
        if (!isNaN(grade)) applyTheme(themeForGrade(grade), { persist: false });
      });
    });
    // Якщо вікно з кодом закрили без входу — повернути збережену тему
    if (modal) {
      new MutationObserver(() => {
        const overlay = document.getElementById('success-overlay');
        const redirecting = overlay && overlay.classList.contains('active');
        if (!modal.classList.contains('active') && !redirecting) {
          applyTheme(savedTheme(), { persist: false });
        }
      }).observe(modal, { attributes: true, attributeFilter: ['class'] });
    }
  }

  // ----- Логотип: розбити заголовок на літери -----
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

  // ----- Стікери -----
  const host = document.querySelector('.shapes');
  if (!host || document.querySelector('.game-container')) return;

  function renderStickers() {
    const theme = THEMES[currentTheme()];
    const W = window.innerWidth;
    const H = window.innerHeight;

    const count = W < 500 ? theme.count[0] : W < 900 ? theme.count[1] : theme.count[2];

    // Сітка клітинок, пропорційна екрану: у кожну клітинку — один стікер
    const cols = Math.max(3, Math.round(Math.sqrt(count * W / H)));
    const rows = Math.ceil(count / cols);
    const cells = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) cells.push({ c, r });
    }
    shuffle(cells);

    const pool = shuffle(theme.stickers.slice());
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
      el.style.setProperty('--dur', (rand(3.5, 7) * theme.durScale).toFixed(2) + 's');
      el.style.setProperty('--delay', (-rand(0, 6)).toFixed(2) + 's');
      frag.appendChild(el);
    }

    host.replaceChildren(frag);
    host.classList.add('stickers-ready');
  }

  renderStickers();
  buildSwitcher();
  bindClassButtons();

  // Перебудувати при суттєвій зміні розміру вікна (поворот екрана тощо)
  let resizeTimer = null;
  let lastW = window.innerWidth;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (Math.abs(window.innerWidth - lastW) > 120) {
        lastW = window.innerWidth;
        renderStickers();
      }
    }, 250);
  });
})();
