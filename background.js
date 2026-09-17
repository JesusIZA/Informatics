// ===== ТЕМИ, ЛОГОТИП І ФОНОВІ СТІКЕРИ =====
// 1. Теми: атрибут data-theme на <html> перемикає палітру (styles.css),
//    пул стікерів і темп їхніх анімацій. Типова тема — "retro"; ручний вибір
//    зберігається в localStorage назавжди (theme-init.js застосовує його до
//    першого рендеру). Перемикається лише вручну.
// 2. Логотип: заголовок h1.logo розбивається на літери для окремого стилю кожної.
// 3. Стікери: екран ділиться на сітку клітинок, у кожну потрапляє один емодзі
//    зі випадковим зсувом — розподіл рівномірний, позиції щоразу різні.
//    Кожен емодзі має власну анімацію (класи stk-* у styles.css).
(function () {
  'use strict';

  const STORAGE_KEY = 'siteTheme';
  const DEFAULT_THEME = 'retro'; // типова тема; ручний вибір зберігається в браузері назавжди

  // ----- Іконки перемикача тем -----
  // Кожна тема має три варіанти своєї іконки; який саме показувати,
  // вирішує iconStyle АКТИВНОЇ теми (у "Цукерках" — емодзі-стікери,
  // у "Космосі" — тонкі контурні лінії, у "Ретро" — піксельні).
  const svg = (inner) => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + inner + '</svg>';
  const px = (inner) => '<svg viewBox="0 0 16 16" fill="currentColor" shape-rendering="crispEdges" aria-hidden="true">' + inner + '</svg>';

  const ICONS = {
    candy: {
      sticker: '🍬',
      // цукерка у фантику з хвостиками і смужками
      line: svg('<ellipse cx="12" cy="12" rx="5" ry="4"/><path d="M7 12 3 8.5l.6 3.5L3 15.5 7 12zM17 12l4-3.5-.6 3.5.6 3.5L17 12z"/><path d="M10.5 8.4 9 15.6M13.5 8.4 12 15.6"/>'),
      // піксельний льодяник
      pixel: px('<rect x="5" y="1" width="6" height="1"/><rect x="4" y="2" width="8" height="1"/><rect x="3" y="3" width="10" height="5"/><rect x="4" y="8" width="8" height="1"/><rect x="5" y="9" width="6" height="1"/><rect x="7" y="10" width="2" height="5"/><rect x="6" y="4" width="2" height="2" fill="#000" opacity=".35"/><rect x="9" y="5" width="2" height="2" fill="#000" opacity=".35"/>')
    },
    cosmos: {
      sticker: '🪐',
      // планета з кільцем
      line: svg('<circle cx="12" cy="12" r="5.5"/><path d="M3.5 14.5c3.5 3.2 12.5 1.6 17-2.6M20.5 9.5c-1-1.1-2.6-1.8-4.4-2.1M3.5 14.5c-.9-1.2-.5-2.3.7-3.2"/>'),
      // піксельна планета з кільцем по діагоналі
      pixel: px('<rect x="6" y="3" width="4" height="1"/><rect x="5" y="4" width="6" height="1"/><rect x="4" y="5" width="8" height="1"/><rect x="4" y="6" width="8" height="1"/><rect x="4" y="7" width="8" height="1"/><rect x="4" y="8" width="8" height="1"/><rect x="4" y="9" width="8" height="1"/><rect x="4" y="10" width="8" height="1"/><rect x="5" y="11" width="6" height="1"/><rect x="6" y="12" width="4" height="1"/><rect x="0" y="10" width="2" height="1" opacity=".7"/><rect x="1" y="9" width="3" height="1" opacity=".7"/><rect x="12" y="6" width="3" height="1" opacity=".7"/><rect x="14" y="5" width="2" height="1" opacity=".7"/><rect x="3" y="9" width="10" height="1" fill="#000" opacity=".45"/>')
    },
    retro: {
      sticker: '👾',
      // геймпад
      line: svg('<path d="M7 8h10a4 4 0 0 1 4 4v1.5a3.5 3.5 0 0 1-6.3 2.1L14 14h-4l-.7 1.6A3.5 3.5 0 0 1 3 13.5V12a4 4 0 0 1 4-4z"/><path d="M8 11v3M6.5 12.5h3"/><circle cx="16" cy="11.5" r=".8" fill="currentColor"/><circle cx="18" cy="13.5" r=".8" fill="currentColor"/>'),
      // піксельний прибулець
      pixel: px('<rect x="5" y="2" width="1" height="1"/><rect x="10" y="2" width="1" height="1"/><rect x="6" y="3" width="1" height="1"/><rect x="9" y="3" width="1" height="1"/><rect x="5" y="4" width="6" height="1"/><rect x="4" y="5" width="8" height="1"/><rect x="3" y="6" width="10" height="1"/><rect x="2" y="7" width="12" height="2"/><rect x="2" y="9" width="1" height="2"/><rect x="13" y="9" width="1" height="2"/><rect x="4" y="9" width="8" height="1"/><rect x="5" y="10" width="2" height="1"/><rect x="9" y="10" width="2" height="1"/><rect x="4" y="11" width="1" height="1"/><rect x="11" y="11" width="1" height="1"/><rect x="5" y="6" width="2" height="1" fill="#000" opacity=".45"/><rect x="9" y="6" width="2" height="1" fill="#000" opacity=".45"/>')
    }
  };

  // ----- Реєстр тем -----
  // iconStyle: у якому стилі малювати іконки перемикача, коли ця тема активна
  // count: кількість стікерів [телефон, планшет, комп'ютер]
  // durScale: множник тривалості анімацій (більше = спокійніше)
  // grades: для яких класів тема задумана (довідково; тема перемикається лише вручну)
  const THEMES = {
    candy: {
      label: 'Цукерки',
      iconStyle: 'sticker',
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
      iconStyle: 'line',
      grades: [7],
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
    },
    retro: {
      label: 'Ретро',
      iconStyle: 'pixel',
      grades: [8, 9],
      count: [6, 10, 14],
      durScale: 1.2, // анімації в CSS теми йдуть кадрами (steps), тому трохи повільніше
      pixelate: 18,  // емодзі малюються на полотні 18×18 точок і розтягуються без згладжування
      stickers: [
        { emoji: '👾', anim: 'stk-hop' },
        { emoji: '🕹️', anim: 'stk-joystick' },
        { emoji: '👻', anim: 'stk-hover' },
        { emoji: '💾', anim: 'stk-flip' },
        { emoji: '📼', anim: 'stk-slide' },
        { emoji: '🎮', anim: 'stk-rumble' },
        { emoji: '💿', anim: 'stk-spin' },
        { emoji: '🪙', anim: 'stk-twinkle' },
        { emoji: '🍄', anim: 'stk-bob' },
        { emoji: '⭐', anim: 'stk-pulse' },
        { emoji: '💣', anim: 'stk-wobble' },
        { emoji: '🧱', anim: 'stk-breathe' },
        { emoji: '📺', anim: 'stk-flash' },
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

  function applyTheme(name, options) {
    const opts = options || {};
    if (!THEMES[name] || name === currentTheme()) {
      if (opts.persist) persistTheme(name);
      return;
    }
    root.setAttribute('data-theme', name);
    if (opts.persist) persistTheme(name);
    renderStickers();
    updateSwitcher();
  }

  function persistTheme(name) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ theme: name }));
    } catch (e) { /* ignore */ }
  }

  // Якщо theme-init.js не спрацював (або тема невідома) — ставимо типову
  if (!THEMES[root.getAttribute('data-theme')]) root.setAttribute('data-theme', DEFAULT_THEME);

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
    const style = THEMES[active].iconStyle || 'sticker';
    switcher.dataset.iconStyle = style;
    switcher.querySelectorAll('.theme-btn').forEach(btn => {
      const key = btn.dataset.theme;
      const on = key === active;
      btn.classList.toggle('is-active', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      // Іконка кожної кнопки малюється у стилі активної теми
      const icon = (ICONS[key] && ICONS[key][style]) || (ICONS[key] && ICONS[key].sticker) || '';
      if (btn.dataset.iconStyle !== style) {
        btn.dataset.iconStyle = style;
        if (style === 'sticker') btn.textContent = icon;
        else btn.innerHTML = icon;
      }
    });
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

  // Піксельна версія емодзі: гліф малюється на крихітному полотні (grid × grid),
  // а CSS розтягує його з image-rendering: pixelated — виходить піксель-арт.
  const pixelCache = new Map();
  function pixelEmoji(emoji, grid) {
    const key = emoji + '@' + grid;
    let src = pixelCache.get(key);
    if (!src) {
      const c = document.createElement('canvas');
      c.width = c.height = grid;
      const ctx = c.getContext('2d');
      ctx.font = Math.round(grid * 0.82) + 'px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(emoji, grid / 2, grid / 2 + grid * 0.06);
      src = c.toDataURL();
      pixelCache.set(key, src);
    }
    const img = document.createElement('img');
    img.src = src;
    img.alt = '';
    img.draggable = false;
    return img;
  }

  // Емодзі в інтерфейсі (іконки ігор, папка в анімації входу): у піксельній темі
  // замінюються на піксель-арт, в інших темах повертається звичайний гліф.
  function applyPixelIcons(theme) {
    document.querySelectorAll('.game-icon, .success-icon').forEach(el => {
      if (theme.pixelate) {
        if (el.classList.contains('is-pixel')) return;
        const emoji = el.textContent.trim();
        if (!emoji) return;
        el.dataset.emoji = emoji;
        el.textContent = '';
        el.appendChild(pixelEmoji(emoji, theme.pixelate));
        el.classList.add('is-pixel');
      } else if (el.classList.contains('is-pixel')) {
        el.textContent = el.dataset.emoji || '';
        el.classList.remove('is-pixel');
      }
    });
  }

  function renderStickers() {
    const theme = THEMES[currentTheme()];
    applyPixelIcons(theme);
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
      if (theme.pixelate) {
        el.classList.add('sticker-pixel');
        el.appendChild(pixelEmoji(sticker.emoji, theme.pixelate));
      } else {
        el.textContent = sticker.emoji;
      }
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
