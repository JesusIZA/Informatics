// ===== CYBER UPGRADE — вікторина для початкової школи =====
// Запитання йдуть у випадковому порядку, 3 життя, рекорди локально
// та (за наявності адреси) у Google Таблиці через Apps Script (JSONP).
// Список рекордів тримається в пам'яті (board.records) і оновлюється з таблиці
// при відкритті гри, при кожному поверненні в меню, при відкритті Топ-100
// і перед перевіркою імені — щоб завжди бачити найсвіжіші рекорди.

// ===== НАЛАШТУВАННЯ =====
// Адреса веб-застосунку Google Apps Script (див. docs/cyber-upgrade-leaderboard.md).
// Порожній рядок = таблиця не підключена, рекорди лише в цьому браузері.
const LEADERBOARD_URL = 'https://script.google.com/macros/s/AKfycbxm9zLdiVI-MxYUFp6EonXncELOIVownSZafHKkFHscIdfdyCgXJpUDDGTB3ixHlcuctA/exec';

const SCORE_PER_CORRECT = 10;
const STREAK_STEP = 3;          // кожні 3 правильні поспіль…
const STREAK_BONUS = 5;         // …дають бонус
const INITIAL_LIVES = 3;
const STORAGE_KEY = 'cyberUpgradeRecords';
const SESSION_NAME_KEY = 'cyberUpgradeSessionName'; // sessionStorage: живе лише поки відкрита вкладка
const MAX_NAME = 20;
const BOARD_LIMIT = 100;        // скільки записів показує вікно "Топ-100"
const FETCH_LIMIT = 5000;       // скільки записів просимо у таблиці (для перевірки імен потрібні всі)

// Рівні "кібер апгрейду" за кількістю очок
const UPGRADES = [
  { min: 0,   title: 'Новачок',        robot: '🤖',     part: 'Базовий корпус' },
  { min: 50,  title: 'Юний кіборг',    robot: '🤖🛡️',   part: 'Щит безпеки' },
  { min: 120, title: 'Кібер-агент',    robot: '🤖🛡️⚡', part: 'Турбо-процесор' },
  { min: 220, title: 'Кібер-майстер',  robot: '🤖🛡️⚡🚀', part: 'Реактивний ранець' },
  { min: 350, title: 'Кібер-легенда',  robot: '👑🤖🛡️⚡🚀', part: 'Корона легенди' }
];

// ===== СТАН =====
const state = {
  name: '',
  queue: [],
  index: 0,
  score: 0,
  lives: INITIAL_LIVES,
  streak: 0,
  correct: 0,
  answered: 0,
  locked: false,
  timer: null
};

// ===== DOM =====
const $ = (id) => document.getElementById(id);
const screens = {
  menu: $('menu-screen'),
  game: $('game-screen'),
  result: $('result-screen')
};
const nameInput = $('player-name');
const nameError = $('name-error');
const startBtn = $('start-btn');
const top3List = $('top3-list');
const top3Note = $('top3-note');
const boardOverlay = $('board-overlay');
const boardList = $('board-list');
const boardStatus = $('board-status');

const hudScore = $('score');
const hudLives = $('lives');
const hudProgress = $('progress');
const hudStreak = $('streak');
const qPic = $('q-pic');
const qText = $('q-text');
const optionsBox = $('options');
const feedback = $('feedback');

// ===== ДОПОМІЖНІ =====
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function cleanName(raw) {
  return String(raw || '')
    .replace(/[<>"'`\\/{}\[\]]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, MAX_NAME);
}

function showScreen(name) {
  Object.keys(screens).forEach(k => screens[k].classList.toggle('active', k === name));
}

function upgradeFor(score) {
  let level = UPGRADES[0];
  for (const u of UPGRADES) if (score >= u.min) level = u;
  return level;
}

function nextUpgrade(score) {
  return UPGRADES.find(u => u.min > score) || null;
}

// ===== ЛОКАЛЬНІ РЕКОРДИ (цей браузер) =====
function loadLocal() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return Array.isArray(data.records) ? data : { records: [] };
  } catch (e) {
    return { records: [] };
  }
}

function saveLocalRecord(name, score) {
  const data = loadLocal();
  const existing = data.records.find(r => r.name.toLowerCase() === name.toLowerCase());
  let isNewBest = false;
  if (!existing) {
    data.records.push({ name, score, date: new Date().toISOString() });
    isNewBest = true;
  } else if (score > existing.score) {
    existing.score = score;
    existing.date = new Date().toISOString();
    isNewBest = true;
  }
  data.records.sort((a, b) => b.score - a.score);
  data.records = data.records.slice(0, 500);
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (e) { /* ignore */ }
  return { isNewBest, best: existing ? Math.max(existing.score, score) : score };
}

function localRecords() {
  return loadLocal().records.map(r => ({ name: r.name, score: r.score }));
}

// ===== GOOGLE ТАБЛИЦЯ (JSONP) =====
function jsonp(params, timeoutMs) {
  return new Promise((resolve, reject) => {
    if (!LEADERBOARD_URL) return reject(new Error('no-url'));
    const cb = 'cyberCb' + Date.now() + Math.floor(Math.random() * 1e6);
    const script = document.createElement('script');
    const timer = setTimeout(() => finish(new Error('timeout')), timeoutMs || 10000);

    function finish(err, data) {
      clearTimeout(timer);
      delete window[cb];
      script.remove();
      err ? reject(err) : resolve(data);
    }

    window[cb] = (data) => finish(null, data);
    script.onerror = () => finish(new Error('network'));
    const query = Object.keys(params).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])).join('&');
    script.src = LEADERBOARD_URL + (LEADERBOARD_URL.includes('?') ? '&' : '?') + query + '&callback=' + cb + '&_t=' + Date.now();
    document.head.appendChild(script);
  });
}

// Об'єднує списки: найкращий результат кожного імені (без урахування регістру), за спаданням
function mergeRecords(lists) {
  const byName = new Map();
  lists.forEach(list => list.forEach(r => {
    const name = cleanName(r.name);
    const score = Number(r.score) || 0;
    if (!name) return;
    const key = name.toLowerCase();
    const prev = byName.get(key);
    if (!prev || score > prev.score) byName.set(key, { name, score });
  }));
  return [...byName.values()].sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
}

// ----- Кеш списку рекордів -----
// board.records — повний відсортований список (таблиця + локальні),
// board.source — 'sheet' | 'local' (звідки взято), board.loading — чи триває завантаження
const board = { records: null, source: 'local', loading: null };

async function loadBoard(force) {
  if (board.records && !force) return board.records;
  if (board.loading && !force) return board.loading;

  board.loading = (async () => {
    let remote = null;
    if (LEADERBOARD_URL) {
      try {
        const data = await jsonp({ action: 'top', limit: FETCH_LIMIT });
        if (data && Array.isArray(data.records)) remote = data.records;
      } catch (e) { /* немає зв'язку — лишаємось на локальних */ }
    }
    // Поки таблиця доступна — показуємо ЛИШЕ її (локальні записи цього комп'ютера
    // не домішуються, інакше видалені з таблиці імена "воскресали" б).
    // Локальні рекорди — тільки запасний варіант без зв'язку.
    board.source = remote ? 'sheet' : 'local';
    board.records = mergeRecords(remote ? [remote] : [localRecords()]);
    board.loading = null;
    return board.records;
  })();
  return board.loading;
}

function boardNote() {
  if (!LEADERBOARD_URL) return 'Рекорди цього комп\'ютера';
  return board.source === 'sheet' ? 'Найкращі гравці школи' : 'Немає зв\'язку з таблицею, показую рекорди цього комп\'ютера';
}

async function submitScore(name, score) {
  const data = await jsonp({ action: 'submit', name, score });
  if (!data || data.ok !== true) throw new Error('rejected');
  return data;
}

// Чи зайняте ім'я — перед перевіркою завантажуємо найсвіжіший список із таблиці
async function checkName(name) {
  const records = await loadBoard(true);
  const hit = records.find(r => r.name.toLowerCase() === name.toLowerCase());
  return hit ? { exists: true, best: hit.score, name: hit.name } : { exists: false };
}

// ===== РЕНДЕР СПИСКІВ РЕКОРДІВ =====
function renderList(container, records, emptyText) {
  container.innerHTML = '';
  if (!records.length) {
    const li = document.createElement('li');
    li.className = 'board-empty';
    li.textContent = emptyText;
    container.appendChild(li);
    return;
  }
  const medals = ['🥇', '🥈', '🥉'];
  records.forEach((r, i) => {
    const li = document.createElement('li');
    const place = document.createElement('span');
    place.className = 'board-place';
    place.textContent = medals[i] || (i + 1) + '.';
    const name = document.createElement('span');
    name.className = 'board-name';
    name.textContent = r.name || '—';
    const score = document.createElement('span');
    score.className = 'board-score';
    score.textContent = r.score;
    li.append(place, name, score);
    container.appendChild(li);
  });
}

// Поки список завантажується — "Завантажую…", а не "немає рекордів"
function renderLoading(container) {
  container.innerHTML = '';
  const li = document.createElement('li');
  li.className = 'board-empty board-loading';
  li.textContent = 'Завантажую…';
  container.appendChild(li);
}

// Топ-3 у меню: завжди підтягує свіжий список; поки він іде — показує попередній
async function refreshTop3() {
  if (!board.records) {
    renderLoading(top3List);
    top3Note.textContent = 'Завантажую…';
  } else {
    renderList(top3List, board.records.slice(0, 3), 'Ще немає рекордів — стань першим!');
    top3Note.textContent = 'Оновлюю…';
  }
  const records = await loadBoard(true);
  renderList(top3List, records.slice(0, 3), 'Ще немає рекордів — стань першим!');
  top3Note.textContent = boardNote();
}

// Топ-100: те саме — попередній список одразу, свіжий після завантаження
async function openBoard() {
  boardOverlay.classList.add('active');
  if (!board.records) {
    renderLoading(boardList);
    boardStatus.textContent = 'Завантажую таблицю…';
  } else {
    renderList(boardList, board.records.slice(0, BOARD_LIMIT), 'Ще немає рекордів');
    boardStatus.textContent = 'Оновлюю…';
  }
  const records = await loadBoard(true);
  if (!boardOverlay.classList.contains('active')) return;
  renderList(boardList, records.slice(0, BOARD_LIMIT), 'Ще немає рекордів');
  boardStatus.textContent = boardNote();
}

function closeBoard() {
  boardOverlay.classList.remove('active');
}

// ===== ГРА =====
// Ім'я сесії: обране в цій вкладці. Поки вкладка відкрита, можна грати ним знову.
// Після закриття вкладки sessionStorage очищається, і ім'я треба вводити заново,
// а вже зайняті імена (у таблиці чи на цьому комп'ютері) взяти не можна.
let sessionName = '';
try { sessionName = sessionStorage.getItem(SESSION_NAME_KEY) || ''; } catch (e) { /* ignore */ }
let checking = false;

// Після вибору ім'я фіксується до закриття вкладки: поле стає нередагованим
function lockName(name) {
  nameInput.value = name;
  nameInput.readOnly = true;
  nameInput.classList.add('locked');
  nameInput.closest('.name-section').classList.add('locked');
  $('name-label').textContent = 'Ти граєш як';
  $('name-hint').textContent = 'Ім\'я закріплено до закриття вкладки';
  nameError.textContent = '';
}

// Крок 1: перевірка імені. Зайняте ім'я відхиляємо.
async function requestStart() {
  if (checking) return;
  if (sessionName) return startGame(sessionName); // ім'я вже закріплене
  const name = cleanName(nameInput.value);
  if (name.length < 2) {
    nameError.textContent = 'Напиши своє ім\'я (хоча б 2 літери)';
    nameInput.focus();
    return;
  }
  nameError.textContent = '';
  if (typeof window.isBadName === 'function' && window.isBadName(name)) {
    nameError.textContent = 'Таке ім\'я не підходить. Обери інше';
    nameInput.focus();
    nameInput.select();
    return;
  }

  checking = true;
  startBtn.disabled = true;
  startBtn.textContent = 'Перевіряю ім\'я…';
  const info = await checkName(name);
  checking = false;
  startBtn.disabled = false;
  startBtn.textContent = '🚀 Старт';

  if (info.exists) {
    nameError.textContent = 'Ім\'я «' + info.name + '» уже зайняте. Обери інше';
    nameInput.focus();
    nameInput.select();
    return;
  }
  startGame(name);
}

// Резервування імені: щойно гра стартувала з новим іменем, воно записується
// в таблицю (і локально) з результатом 0, щоб ніхто інший не взяв його, поки йде партія.
let reservedName = '';
function reserveName(name) {
  if (reservedName.toLowerCase() === name.toLowerCase()) return;
  reservedName = name;
  saveLocalRecord(name, 0);
  if (LEADERBOARD_URL) {
    submitScore(name, 0).catch(() => { /* без зв'язку ім'я лишається зарезервованим локально */ });
  }
}

// Крок 2: власне старт
function startGame(name) {
  state.name = name;
  sessionName = name;
  try { sessionStorage.setItem(SESSION_NAME_KEY, name); } catch (e) { /* ignore */ }
  lockName(name);
  reserveName(name);

  state.queue = shuffle(window.CYBER_QUESTIONS.slice());
  state.index = 0;
  state.score = 0;
  state.lives = INITIAL_LIVES;
  state.streak = 0;
  state.correct = 0;
  state.answered = 0;
  state.locked = false;

  updateHud();
  showScreen('game');
  showQuestion();
}

function updateHud() {
  hudScore.textContent = state.score;
  hudProgress.textContent = Math.min(state.index + 1, state.queue.length) + '/' + state.queue.length;
  hudStreak.textContent = state.streak >= 2 ? '🔥 ' + state.streak : '';
  hudLives.querySelectorAll('.heart').forEach((h, i) => h.classList.toggle('lost', i >= state.lives));
}

function showQuestion() {
  const q = state.queue[state.index];
  if (!q) return endGame();

  state.locked = false;
  feedback.textContent = '';
  feedback.className = 'feedback';
  qPic.textContent = q.pic;
  qText.textContent = q.text;

  const card = $('question-card');
  card.classList.remove('pop');
  void card.offsetWidth; // перезапуск анімації
  card.classList.add('pop');

  optionsBox.innerHTML = '';
  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.type = 'button';
    btn.dataset.index = i;
    btn.innerHTML = '<span class="option-key">' + (i + 1) + '</span><span class="option-text"></span>';
    btn.querySelector('.option-text').textContent = opt;
    btn.addEventListener('click', () => answer(i));
    optionsBox.appendChild(btn);
  });
  updateHud();
}

function answer(i) {
  if (state.locked) return;
  state.locked = true;
  const q = state.queue[state.index];
  const buttons = optionsBox.querySelectorAll('.option-btn');
  const isCorrect = i === q.answer;
  state.answered++;

  buttons.forEach(b => b.disabled = true);
  buttons[q.answer].classList.add('correct');

  if (isCorrect) {
    state.correct++;
    state.streak++;
    let gained = SCORE_PER_CORRECT;
    if (state.streak > 0 && state.streak % STREAK_STEP === 0) gained += STREAK_BONUS;
    state.score += gained;
    feedback.textContent = (state.streak % STREAK_STEP === 0 ? '🔥 Серія! ' : '✅ Правильно! ') + '+' + gained;
    feedback.className = 'feedback ok';
  } else {
    state.streak = 0;
    state.lives--;
    buttons[i].classList.add('wrong');
    feedback.textContent = '❌ Правильна відповідь: ' + q.options[q.answer];
    feedback.className = 'feedback bad';
    hudLives.classList.add('shake');
    setTimeout(() => hudLives.classList.remove('shake'), 500);
  }
  updateHud();

  state.timer = setTimeout(() => {
    state.index++;
    if (state.lives <= 0 || state.index >= state.queue.length) endGame();
    else showQuestion();
  }, isCorrect ? 900 : 1700);
}

async function endGame() {
  clearTimeout(state.timer);
  const score = state.score;
  const local = saveLocalRecord(state.name, score);
  const level = upgradeFor(score);
  const next = nextUpgrade(score);
  const finished = state.lives > 0;

  $('result-title').textContent = finished ? 'Усі запитання пройдено!' : 'Життя закінчились';
  $('result-emoji').textContent = finished ? '🏆' : '💥';
  $('final-score').textContent = score;
  $('stat-correct').textContent = state.correct;
  $('stat-answered').textContent = state.answered;
  $('stat-best').textContent = local.best;
  $('upgrade-robot').textContent = level.robot;
  $('upgrade-title').textContent = level.title;
  $('upgrade-part').textContent = 'Апгрейд: ' + level.part;
  $('upgrade-next').textContent = next
    ? 'До наступного апгрейду «' + next.title + '» ще ' + (next.min - score) + ' очок'
    : 'Максимальний рівень! Ти кібер-легенда';
  $('new-record').style.display = local.isNewBest && score > 0 ? 'block' : 'none';

  const status = $('submit-status');
  status.textContent = '';
  showScreen('result');

  if (LEADERBOARD_URL && score > 0) {
    status.textContent = 'Записую результат у таблицю…';
    try {
      const res = await submitScore(state.name, score);
      if (res.updated === false) {
        status.textContent = 'У таблиці лишається твій кращий результат: ' + res.best;
        $('stat-best').textContent = res.best;
      } else {
        status.textContent = 'Результат записано в таблицю школи ✅';
      }
    } catch (e) {
      status.textContent = 'Не вдалося записати в таблицю, результат збережено на цьому комп\'ютері';
    }
  }
  // Після запису — підтягнути свіжий список, щоб новий результат був у кеші
  loadBoard(true);
}

function quitToMenu() {
  clearTimeout(state.timer);
  showScreen('menu');
  refreshTop3(); // при кожному поверненні в меню список оновлюється
}

// ===== ПОДІЇ =====
startBtn.addEventListener('click', requestStart);
nameInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') requestStart(); });
nameInput.addEventListener('input', () => { nameError.textContent = ''; });

$('board-btn').addEventListener('click', openBoard);
$('board-close').addEventListener('click', closeBoard);
boardOverlay.addEventListener('click', (e) => { if (e.target === boardOverlay) closeBoard(); });

$('quit-btn').addEventListener('click', quitToMenu);
$('play-again-btn').addEventListener('click', () => startGame(state.name));
$('result-board-btn').addEventListener('click', openBoard);
$('back-menu-btn').addEventListener('click', quitToMenu);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && boardOverlay.classList.contains('active')) return closeBoard();
  if (!screens.game.classList.contains('active') || state.locked) return;
  if (['1', '2', '3'].includes(e.key)) answer(Number(e.key) - 1);
});

// ===== СТАРТ =====
if (sessionName) lockName(sessionName); // у цій вкладці ім'я вже обрано — поле заблоковане
refreshTop3();
