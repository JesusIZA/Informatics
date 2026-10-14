// ===== GAME KIT — спільні дрібниці для всіх ігор =====
// 1. Звуки: синтезуються через Web Audio (без файлів), перемикач 🔊/🔇
//    у правому верхньому куті, стан зберігається в localStorage["gameSound"].
// 2. Відлік «3-2-1-Старт!» перед початком партії: GameKit.countdown() → Promise.
// 3. Єдиний екран результату: коли з'являється «Новий рекорд» — фанфари й анімація,
//    інакше — короткий сигнал завершення (спостерігач за #new-record / #result-screen).
//
// Підключення: <link rel="stylesheet" href="../common/game-kit.css">
//              <script src="../common/game-kit.js"></script> перед script.js гри,
// а в кінці script.js: startGame = GameKit.withCountdown(startGame).
(function () {
  'use strict';

  const STORAGE_KEY = 'gameSound';

  // ---------- Звук ----------
  let ctx = null;
  let enabled = true;
  try { enabled = localStorage.getItem(STORAGE_KEY) !== 'off'; } catch (e) { /* ignore */ }

  function audio() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  // Один тон: частота, тривалість (с), тип хвилі, гучність, ковзання частоти
  function tone(freq, dur, type, gain, slideTo, delay) {
    const ac = audio();
    if (!ac) return;
    const t0 = ac.currentTime + (delay || 0);
    const osc = ac.createOscillator();
    const g = ac.createGain();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, t0);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain || 0.2, t0 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g).connect(ac.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  }

  // Короткий шум (для «лопання»)
  function noise(dur, gain, delay) {
    const ac = audio();
    if (!ac) return;
    const t0 = ac.currentTime + (delay || 0);
    const len = Math.floor(ac.sampleRate * dur);
    const buf = ac.createBuffer(1, len, ac.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = ac.createBufferSource();
    src.buffer = buf;
    const g = ac.createGain();
    g.gain.setValueAtTime(gain || 0.25, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    const f = ac.createBiquadFilter();
    f.type = 'highpass';
    f.frequency.value = 800;
    src.connect(f).connect(g).connect(ac.destination);
    src.start(t0);
  }

  const SOUNDS = {
    pop:    () => { noise(0.08, 0.3); tone(520, 0.08, 'triangle', 0.15, 260); },
    flip:   () => tone(380, 0.06, 'triangle', 0.08, 520),
    good:   () => { tone(660, 0.09, 'triangle', 0.18); tone(880, 0.12, 'triangle', 0.18, null, 0.08); },
    bonus:  () => { tone(784, 0.08, 'square', 0.1); tone(988, 0.08, 'square', 0.1, null, 0.08); tone(1319, 0.14, 'square', 0.1, null, 0.16); },
    bad:    () => tone(220, 0.18, 'sawtooth', 0.12, 110),
    life:   () => { tone(330, 0.12, 'square', 0.12, 165); tone(165, 0.2, 'square', 0.12, 82, 0.12); },
    tick:   () => tone(880, 0.06, 'square', 0.08),
    go:     () => { tone(660, 0.1, 'square', 0.12); tone(990, 0.22, 'square', 0.12, null, 0.1); },
    end:    () => { tone(523, 0.12, 'triangle', 0.14); tone(392, 0.2, 'triangle', 0.14, null, 0.12); },
    record: () => { [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.16, 'square', 0.12, null, i * 0.11)); tone(1319, 0.4, 'square', 0.12, null, 0.46); }
  };

  function play(name) {
    if (!enabled || !SOUNDS[name]) return;
    try { SOUNDS[name](); } catch (e) { /* звук не критичний */ }
  }

  function setEnabled(on) {
    enabled = !!on;
    try { localStorage.setItem(STORAGE_KEY, enabled ? 'on' : 'off'); } catch (e) { /* ignore */ }
    updateToggle();
  }

  // ---------- Перемикач звуку ----------
  let toggleBtn = null;
  function mountToggle() {
    toggleBtn = document.createElement('button');
    toggleBtn.type = 'button';
    toggleBtn.className = 'sound-toggle';
    toggleBtn.addEventListener('click', () => { setEnabled(!enabled); if (enabled) play('tick'); });
    document.body.appendChild(toggleBtn);
    updateToggle();
  }
  function updateToggle() {
    if (!toggleBtn) return;
    toggleBtn.textContent = enabled ? '🔊' : '🔇';
    toggleBtn.title = enabled ? 'Вимкнути звук' : 'Увімкнути звук';
    toggleBtn.setAttribute('aria-label', toggleBtn.title);
    toggleBtn.classList.toggle('is-off', !enabled);
  }

  // Аудіоконтекст можна створити лише після дії користувача
  document.addEventListener('pointerdown', () => audio(), { once: true, capture: true });
  document.addEventListener('keydown', () => audio(), { once: true, capture: true });

  // ---------- Відлік перед стартом ----------
  let overlay = null;
  function countdown(steps) {
    const seq = steps || ['3', '2', '1', 'Старт!'];
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'countdown-overlay';
      overlay.innerHTML = '<div class="countdown-number"></div>';
      document.body.appendChild(overlay);
    }
    const num = overlay.querySelector('.countdown-number');
    overlay.classList.add('active');
    return new Promise(resolve => {
      let i = 0;
      const step = () => {
        if (i >= seq.length) {
          overlay.classList.remove('active');
          resolve();
          return;
        }
        const text = seq[i];
        num.textContent = text;
        num.classList.toggle('go', i === seq.length - 1);
        num.classList.remove('pulse');
        void num.offsetWidth;
        num.classList.add('pulse');
        play(i === seq.length - 1 ? 'go' : 'tick');
        i++;
        setTimeout(step, i === seq.length ? 500 : 750);
      };
      step();
    });
  }

  // Обгортка для startGame гри: спершу відлік, потім справжній старт
  function withCountdown(launch) {
    return function (...args) {
      return countdown().then(() => launch.apply(this, args));
    };
  }

  // ---------- Екран результату: рекорд / завершення ----------
  function watchResult() {
    const rec = document.getElementById('new-record');
    const result = document.getElementById('result-screen');
    if (!result) return;
    let wasActive = false;
    const check = () => {
      const active = result.classList.contains('active');
      if (active && !wasActive) {
        const isRecord = rec && rec.style.display !== 'none' && rec.offsetParent !== null;
        if (isRecord) {
          rec.classList.remove('celebrate');
          void rec.offsetWidth;
          rec.classList.add('celebrate');
          burst(rec);
          play('record');
        } else {
          play('end');
        }
      }
      wasActive = active;
    };
    new MutationObserver(check).observe(result, { attributes: true, attributeFilter: ['class'] });
  }

  // Конфеті навколо напису «Новий рекорд»
  function burst(anchor) {
    const colors = ['#43e97b', '#fee140', '#4facfe', '#f093fb', '#fa709a'];
    for (let i = 0; i < 18; i++) {
      const p = document.createElement('span');
      p.className = 'record-confetti';
      p.style.setProperty('--dx', (Math.cos(i / 18 * Math.PI * 2) * (60 + Math.random() * 50)).toFixed(0) + 'px');
      p.style.setProperty('--dy', (Math.sin(i / 18 * Math.PI * 2) * (40 + Math.random() * 40) - 20).toFixed(0) + 'px');
      p.style.background = colors[i % colors.length];
      anchor.appendChild(p);
      setTimeout(() => p.remove(), 1200);
    }
  }

  function init() {
    mountToggle();
    watchResult();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  window.GameKit = { play, countdown, withCountdown, get soundEnabled() { return enabled; }, setSound: setEnabled };
})();
