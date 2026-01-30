// ===== WORD DICTIONARY =====
const WORDS = {
  easy: [
    // Природа
    'дім', 'кіт', 'сон', 'ліс', 'мак', 'рік', 'час', 'око', 'ніс', 'рот',
    'вода', 'небо', 'хліб', 'сіль', 'мед', 'чай', 'рис', 'сир', 'гриб', 'лист',
    'річка', 'гора', 'море', 'поле', 'птах', 'звір', 'риба', 'жаба', 'муха',
    'дощ', 'сніг', 'град', 'лід', 'пар', 'дим', 'буря', 'роса',
    // Родина та люди
    'мама', 'тато', 'баба', 'дід', 'брат', 'син', 'друг', 'гість',
    'дядько', 'тітка', 'жінка', 'дитя',
    // Їжа та напої
    'суп', 'каша', 'сало', 'яйце', 'торт', 'сік', 'борщ', 'пиріг',
    // Предмети
    'стіл', 'стул', 'двері', 'вікно', 'лампа', 'книга', 'ручка',
    'сумка', 'ключ', 'замок', 'миска', 'ложка', 'ніж',
    // Тварини
    'пес', 'кінь', 'вовк', 'лис', 'заєць', 'їжак', 'олень', 'лось',
    'сова', 'качка', 'гуска', 'курка', 'коза', 'вівця',
    // Дії та стани
    'біг', 'крок', 'сміх', 'плач', 'спів', 'гра', 'бій', 'мир', 'труд',
    // Абстрактні
    'день', 'ніч', 'ранок', 'літо', 'зима', 'осінь', 'весна',
    'сонце', 'зірка', 'хмара', 'звук',
    // Школа
    'урок', 'клас', 'дошка', 'крейда', 'зошит', 'гумка',
    // Числа та форми
    'один', 'два', 'три', 'коло', 'куля', 'куб',
    // Додаткові слова
    'двір', 'край', 'шлях', 'вуха', 'нога', 'рука', 'тіло', 'душа',
    'сила', 'воля', 'доля', 'мрія', 'казка', 'пісня', 'танок',
    'квітка', 'дерево', 'трава', 'камінь', 'земля', 'вогонь', 'вітер',
    'голос', 'слово', 'думка', 'серце', 'любов', 'страх', 'біль'
  ],
  medium: [
    // Природа та географія
    'природа', 'погода', 'клімат', 'планета', 'океан', 'острів',
    'долина', 'берег', 'скеля', 'печера', 'озеро',
    'болото', 'степ', 'джунглі',
    // Люди та суспільство
    'людина', 'народ', 'нація', 'держава', 'країна', 'столиця', 'місто',
    'село', 'вулиця', 'будинок', 'кімната',
    'сусід', 'колега', 'товариш', 'родич', 'громада',
    // Професії
    'лікар', 'вчитель', 'інженер', 'водій', 'пілот', 'кухар', 'пекар',
    'художник', 'музикант', 'актор', 'співак',
    // Освіта
    'школа', 'ліцей', 'коледж', 'знання', 'наука', 'освіта',
    'урок', 'лекція', 'семінар', 'іспит', 'оцінка', 'диплом',
    'предмет', 'завдання', 'вправа', 'задача', 'питання',
    // Культура
    'музика', 'картина', 'театр', 'кіно', 'концерт',
    'виставка', 'галерея', 'музей', 'книжка', 'журнал',
    'пісня', 'мелодія', 'танець', 'балет', 'опера', 'вистава',
    // Техніка
    'машина', 'літак', 'корабель', 'поїзд', 'автобус', 'трамвай',
    'телефон', 'радіо', 'камера', 'принтер', 'сканер',
    // Їжа
    'сніданок', 'обід', 'вечеря', 'страва', 'салат', 'напій', 'десерт',
    'фрукти', 'овочі', 'ягоди', 'горіхи', 'крупа', 'молоко', 'масло',
    // Час та події
    'секунда', 'хвилина', 'година', 'доба', 'тиждень', 'свято', 'подія',
    'зустріч', 'весілля', 'ювілей',
    // Почуття
    'радість', 'щастя', 'смуток', 'страх', 'гнів', 'любов', 'надія',
    'захват', 'спокій', 'тривога', 'втома', 'сила',
    // Абстрактні
    'правда', 'брехня', 'таємниця', 'загадка', 'мрія', 'ідея', 'думка',
    'слово', 'мова', 'розмова', 'історія', 'казка', 'легенда', 'міф',
    // Додаткові слова
    'робота', 'справа', 'проект', 'успіх', 'невдача', 'перемога',
    'рішення', 'вибір', 'шанс', 'момент', 'період', 'епоха',
    'простір', 'форма', 'колір', 'світло', 'тінь', 'образ'
  ],
  hard: [
    // Інформатика
    'комп\'ютер', 'клавіатура', 'монітор', 'процесор', 'програма',
    'алгоритм', 'інтернет', 'браузер', 'документ', 'файл',
    'презентація', 'електронний', 'цифровий', 'віртуальний',
    'операційний', 'інформація', 'технологія', 'обладнання',
    // Наука та освіта
    'університет', 'лабораторія', 'експеримент', 'дослідження',
    'гіпотеза', 'теорія', 'формула', 'рівняння', 'обчислення',
    'математика', 'фізика', 'хімія', 'біологія', 'географія',
    'астрономія', 'історія', 'філософія', 'психологія', 'економіка',
    'література', 'мистецтво', 'архітектура',
    // Професії та діяльність
    'програміст', 'бухгалтер', 'менеджер', 'директор', 'президент',
    'журналіст', 'фотограф', 'дизайнер', 'архітектор', 'будівельник',
    'підприємець', 'перекладач', 'викладач', 'науковець', 'дослідник',
    // Суспільство
    'демократія', 'республіка', 'парламент', 'уряд', 'конституція',
    'громадянин', 'суспільство', 'організація', 'установа', 'підприємство',
    'співпраця', 'партнерство', 'конкуренція', 'розвиток',
    // Комунікація
    'спілкування', 'повідомлення', 'листування',
    'обговорення', 'переговори', 'презентація', 'доповідь', 'виступ',
    // Абстрактні поняття
    'відповідальність', 'самостійність', 'наполегливість',
    'справедливість', 'толерантність',
    'патріотизм', 'громадянськість', 'солідарність',
    'креативність', 'оригінальність', 'індивідуальність',
    // Природа та екологія
    'навколишній', 'середовище', 'забруднення', 'переробка',
    'збереження', 'відновлення', 'екосистема',
    'атмосфера', 'гідросфера', 'літосфера', 'кліматичний',
    // Техніка та транспорт
    'автомобіль', 'велосипед', 'мотоцикл', 'вертоліт', 'підводний',
    'електричний', 'автоматичний', 'механічний', 'гідравлічний',
    'навігація', 'супутник',
    // Медицина та здоров\'я
    'лікарня', 'поліклініка', 'діагностика', 'профілактика',
    'лікування', 'реабілітація', 'щеплення', 'імунітет',
    'вітаміни', 'антибіотик', 'температура',
    // Додаткові слова
    'можливість', 'неможливість', 'ймовірність', 'закономірність',
    'взаємодія', 'співвідношення', 'залежність', 'незалежність',
    'стабільність', 'нестабільність', 'ефективність', 'продуктивність'
  ]
};

// ===== GAME CONFIGURATION =====
const DIFFICULTY = {
  easy: {
    name: 'Легкий',
    wordTime: 12000,
    spawnInterval: 3000,
    maxWords: 1,
    goldenChance: 0.10,
    fastChance: 0.10,
    timeBonusChance: 0.05
  },
  medium: {
    name: 'Середній',
    wordTime: 10000,
    spawnInterval: 2500,
    maxWords: 2,
    goldenChance: 0.10,
    fastChance: 0.10,
    timeBonusChance: 0.05
  },
  hard: {
    name: 'Важкий',
    wordTime: 9000,
    spawnInterval: 2000,
    maxWords: 2,
    goldenChance: 0.10,
    fastChance: 0.10,
    timeBonusChance: 0.05
  }
};

const GAME_DURATION = 60;
const INITIAL_LIVES = 3;
const FAST_WORD_TIME_MULTIPLIER = 0.6;
const MAX_ERRORS_PER_WORD = 3;

// Combo thresholds
const COMBO_THRESHOLDS = [
  { streak: 3, multiplier: 1.5 },
  { streak: 6, multiplier: 2 },
  { streak: 10, multiplier: 3 }
];

// ===== GAME STATE =====
let gameState = {
  isRunning: false,
  isPaused: false,
  difficulty: 'easy',
  score: 0,
  lives: INITIAL_LIVES,
  timeLeft: GAME_DURATION,
  words: [],
  activeWord: null,
  currentPosition: 0,
  currentInput: '',
  wordsCompleted: 0,
  charsTyped: 0,
  correctChars: 0,
  wrongChars: 0,
  streak: 0,
  bestStreak: 0,
  multiplier: 1,
  usedWords: new Set(),
  spawnTimer: null,
  gameTimer: null,
  lastTimestamp: 0,
  animationFrameId: null,
  gameStartTime: 0
};

// ===== DOM ELEMENTS =====
const screens = {
  menu: document.getElementById('menu-screen'),
  game: document.getElementById('game-screen'),
  result: document.getElementById('result-screen')
};

const elements = {
  gameArea: document.getElementById('game-area'),
  score: document.getElementById('score'),
  time: document.getElementById('time'),
  lives: document.getElementById('lives'),
  combo: document.getElementById('combo'),
  inputText: document.getElementById('input-text'),
  inputCursor: document.getElementById('input-cursor'),
  pauseBtn: document.getElementById('pause-btn'),
  pauseOverlay: document.getElementById('pause-overlay'),
  resumeBtn: document.getElementById('resume-btn'),
  quitBtn: document.getElementById('quit-btn'),
  finalScore: document.getElementById('final-score'),
  newRecord: document.getElementById('new-record'),
  resultEmoji: document.getElementById('result-emoji'),
  resultTitle: document.getElementById('result-title'),
  statWords: document.getElementById('stat-words'),
  statChars: document.getElementById('stat-chars'),
  statAccuracy: document.getElementById('stat-accuracy'),
  statBestCombo: document.getElementById('stat-best-combo'),
  statSpeed: document.getElementById('stat-speed'),
  playAgainBtn: document.getElementById('play-again-btn'),
  backMenuBtn: document.getElementById('back-menu-btn')
};

// ===== WORD CLASS =====
class Word {
  constructor(config) {
    this.id = Math.random().toString(36).substr(2, 9);
    this.text = config.text;
    this.type = config.type;
    this.maxTime = config.maxTime;
    this.timeLeft = config.maxTime;
    this.position = 0;
    this.errors = 0;
    this.element = null;
    this.timerElement = null;
    this.letterElements = [];
    this.isCompleted = false;

    this.createElement();
  }

  createElement() {
    // Container
    this.element = document.createElement('div');
    this.element.className = 'word-container';

    // Word element
    const wordDiv = document.createElement('div');
    wordDiv.className = `word ${this.type}`;

    // Create letter spans (all start as waiting)
    for (let i = 0; i < this.text.length; i++) {
      const letterSpan = document.createElement('span');
      letterSpan.className = 'word-letter waiting';
      letterSpan.textContent = this.text[i];

      this.letterElements.push(letterSpan);
      wordDiv.appendChild(letterSpan);
    }

    this.element.appendChild(wordDiv);

    // Timer bar
    const timerDiv = document.createElement('div');
    timerDiv.className = 'word-timer';
    const timerProgress = document.createElement('div');
    timerProgress.className = `word-timer-progress ${this.type}`;
    timerProgress.style.width = '100%';
    timerDiv.appendChild(timerProgress);
    this.element.appendChild(timerDiv);
    this.timerElement = timerProgress;

    elements.gameArea.appendChild(this.element);
  }

  update(dt) {
    if (this.isCompleted) return;

    this.timeLeft -= dt * 1000;

    // Update timer bar
    const progress = Math.max(0, this.timeLeft / this.maxTime) * 100;
    this.timerElement.style.width = `${progress}%`;

    // Warning color - start earlier at 40%
    if (progress < 40) {
      this.timerElement.classList.add('warning');
    }

    if (this.timeLeft <= 0) {
      this.expire();
    }
  }

  activate() {
    // Mark word container as active
    this.element.classList.add('active');

    // Mark first letter as current (pulsing)
    if (this.letterElements.length > 0 && this.position === 0) {
      this.letterElements[0].classList.remove('waiting');
      this.letterElements[0].classList.add('current');
    }
  }

  deactivate() {
    // Remove active state from container
    this.element.classList.remove('active');
  }

  getNextChar() {
    if (this.position >= this.text.length) return null;
    return this.text[this.position].toLowerCase();
  }

  advancePosition() {
    if (this.position < this.text.length) {
      this.letterElements[this.position].classList.remove('current');
      this.letterElements[this.position].classList.add('correct');
      this.position++;

      if (this.position < this.text.length) {
        this.letterElements[this.position].classList.remove('waiting');
        this.letterElements[this.position].classList.add('current');
      }
    }
  }

  registerError() {
    this.errors++;

    // Animate error on current letter
    if (this.position < this.text.length) {
      const currentLetter = this.letterElements[this.position];
      currentLetter.classList.add('error');
      setTimeout(() => {
        currentLetter.classList.remove('error');
      }, 300);
    }

    if (this.errors >= MAX_ERRORS_PER_WORD) {
      this.skip();
    }
  }

  isComplete() {
    return this.position >= this.text.length;
  }

  complete() {
    if (this.isCompleted) return;
    this.isCompleted = true;

    let points = 0;
    let popupClass = 'positive';
    let popupText = '';

    const basePoints = this.text.length;

    switch (this.type) {
      case 'normal':
        points = Math.round(basePoints * gameState.multiplier);
        popupText = `+${points}`;
        break;
      case 'golden':
        points = Math.round(basePoints * 2 * gameState.multiplier);
        popupText = `+${points}`;
        popupClass = 'golden';
        break;
      case 'fast':
        points = Math.round(basePoints * 1.5 * gameState.multiplier);
        popupText = `+${points}`;
        popupClass = 'fast';
        break;
      case 'time-bonus':
        points = Math.round(basePoints * gameState.multiplier);
        gameState.timeLeft += 5;
        popupText = `+${points} +5s`;
        popupClass = 'time';
        break;
    }

    gameState.score += points;
    gameState.wordsCompleted++;
    gameState.charsTyped += this.text.length;
    gameState.correctChars += this.text.length;
    updateCombo(true);
    updateHUD();

    showScorePopup(this.element, popupText, popupClass);

    // Remove from array immediately so new word can spawn
    const index = gameState.words.indexOf(this);
    if (index > -1) {
      gameState.words.splice(index, 1);
    }

    this.element.classList.add('removing');
    this.element.classList.add('completed');
    setTimeout(() => this.removeElement(), 550);

    // Clear active word
    if (gameState.activeWord === this) {
      gameState.activeWord = null;
      gameState.currentPosition = 0;
      gameState.currentInput = '';
      updateInputDisplay();

      // Activate next word if exists, or spawn new one immediately
      activateNextWord();
      if (!gameState.activeWord && gameState.isRunning) {
        spawnWord();
      }
    }
  }

  expire() {
    if (this.isCompleted) return;
    this.isCompleted = true;

    loseLife();
    updateCombo(false);
    showScorePopup(this.element, '💔', 'negative');

    // Remove from array immediately so new word can spawn
    const index = gameState.words.indexOf(this);
    if (index > -1) {
      gameState.words.splice(index, 1);
    }

    this.element.classList.add('removing');
    this.element.classList.add('expired');
    setTimeout(() => this.removeElement(), 550);

    // Clear active word
    if (gameState.activeWord === this) {
      gameState.activeWord = null;
      gameState.currentPosition = 0;
      gameState.currentInput = '';
      updateInputDisplay();

      activateNextWord();
      if (!gameState.activeWord && gameState.isRunning) {
        spawnWord();
      }
    }
  }

  skip() {
    if (this.isCompleted) return;
    this.isCompleted = true;

    loseLife();
    updateCombo(false);
    showScorePopup(this.element, '❌', 'negative');

    // Remove from array immediately so new word can spawn
    const index = gameState.words.indexOf(this);
    if (index > -1) {
      gameState.words.splice(index, 1);
    }

    this.element.classList.add('removing');
    this.element.classList.add('skipped');
    setTimeout(() => this.removeElement(), 450);

    // Clear active word
    if (gameState.activeWord === this) {
      gameState.activeWord = null;
      gameState.currentPosition = 0;
      gameState.currentInput = '';
      updateInputDisplay();

      activateNextWord();
      if (!gameState.activeWord && gameState.isRunning) {
        spawnWord();
      }
    }
  }

  removeElement() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }

  remove() {
    this.removeElement();
    const index = gameState.words.indexOf(this);
    if (index > -1) {
      gameState.words.splice(index, 1);
    }
  }
}

// ===== GAME FUNCTIONS =====
function showScreen(screenName) {
  Object.values(screens).forEach(screen => screen.classList.remove('active'));
  screens[screenName].classList.add('active');
}

function loadRecords() {
  const records = JSON.parse(localStorage.getItem('keyboardTypingRecords') || '{}');
  document.getElementById('record-easy').textContent = `Рекорд: ${records.easy?.highScore || 0}`;
  document.getElementById('record-medium').textContent = `Рекорд: ${records.medium?.highScore || 0}`;
  document.getElementById('record-hard').textContent = `Рекорд: ${records.hard?.highScore || 0}`;
}

function saveRecord(difficulty, score, bestCombo) {
  const records = JSON.parse(localStorage.getItem('keyboardTypingRecords') || '{}');
  const currentRecord = records[difficulty]?.highScore || 0;

  if (score > currentRecord) {
    records[difficulty] = {
      highScore: score,
      bestCombo: bestCombo,
      lastPlayed: new Date().toISOString().split('T')[0]
    };
    localStorage.setItem('keyboardTypingRecords', JSON.stringify(records));
    return true;
  }
  return false;
}

function startGame(difficulty) {
  gameState = {
    isRunning: true,
    isPaused: false,
    difficulty: difficulty,
    score: 0,
    lives: INITIAL_LIVES,
    timeLeft: GAME_DURATION,
    words: [],
    activeWord: null,
    currentPosition: 0,
    currentInput: '',
    wordsCompleted: 0,
    charsTyped: 0,
    correctChars: 0,
    wrongChars: 0,
    streak: 0,
    bestStreak: 0,
    multiplier: 1,
    usedWords: new Set(),
    spawnTimer: null,
    gameTimer: null,
    lastTimestamp: 0,
    animationFrameId: null,
    gameStartTime: Date.now()
  };

  elements.gameArea.innerHTML = '';

  // Reset input display text
  elements.inputText.textContent = '';

  updateHUD();
  updateLivesDisplay();
  updateComboDisplay();
  updateInputDisplay();
  showScreen('game');

  // Wait for the screen to render
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      spawnWord();
      gameState.spawnTimer = setInterval(spawnWord, DIFFICULTY[difficulty].spawnInterval);
    });
  });

  // Start game timer
  gameState.gameTimer = setInterval(() => {
    if (!gameState.isPaused) {
      gameState.timeLeft--;
      updateHUD();
      if (gameState.timeLeft <= 0) {
        endGame();
      }
    }
  }, 1000);

  // Start game loop
  gameState.lastTimestamp = performance.now();
  gameState.animationFrameId = requestAnimationFrame(gameLoop);
}

function gameLoop(timestamp) {
  if (!gameState.isRunning) return;

  if (!gameState.isPaused) {
    const dt = (timestamp - gameState.lastTimestamp) / 1000;
    gameState.lastTimestamp = timestamp;

    gameState.words.forEach(word => {
      word.update(dt);
    });
  } else {
    gameState.lastTimestamp = timestamp;
  }

  gameState.animationFrameId = requestAnimationFrame(gameLoop);
}

function getRandomWord(difficulty) {
  const wordList = WORDS[difficulty];
  const availableWords = wordList.filter(word => !gameState.usedWords.has(word));

  // Reset used words if we've used most of them
  if (availableWords.length < 10) {
    gameState.usedWords.clear();
    return wordList[Math.floor(Math.random() * wordList.length)];
  }

  const word = availableWords[Math.floor(Math.random() * availableWords.length)];
  gameState.usedWords.add(word);
  return word;
}

function spawnWord() {
  if (gameState.isPaused || !gameState.isRunning) return;

  const config = DIFFICULTY[gameState.difficulty];

  // Don't spawn if max words reached
  if (gameState.words.length >= config.maxWords) return;

  // Pick random word
  const text = getRandomWord(gameState.difficulty);

  // Determine type
  let type = 'normal';
  let wordTime = config.wordTime;
  const rand = Math.random();

  if (rand < config.goldenChance) {
    type = 'golden';
  } else if (rand < config.goldenChance + config.fastChance) {
    type = 'fast';
    wordTime = config.wordTime * FAST_WORD_TIME_MULTIPLIER;
  } else if (rand < config.goldenChance + config.fastChance + config.timeBonusChance) {
    type = 'time-bonus';
  }

  const word = new Word({
    text: text,
    type: type,
    maxTime: wordTime
  });

  gameState.words.push(word);

  // Activate the word if no active word
  if (!gameState.activeWord) {
    activateWord(word);
  }
}

function activateWord(word) {
  gameState.activeWord = word;
  gameState.currentPosition = 0;
  gameState.currentInput = '';
  // Small delay to let wordAppear animation start before adding active class
  requestAnimationFrame(() => {
    word.activate();
  });
  updateInputDisplay();
}

function activateNextWord() {
  // Find next non-completed word
  const nextWord = gameState.words.find(w => !w.isCompleted);
  if (nextWord) {
    activateWord(nextWord);
  }
}

function handleKeyPress(event) {
  if (!gameState.isRunning || gameState.isPaused) return;

  // Ignore modifier keys
  if (event.ctrlKey || event.altKey || event.metaKey) return;

  // Ignore special keys
  if (event.key.length > 1 && event.key !== 'Backspace') return;

  const activeWord = gameState.activeWord;
  if (!activeWord) return;

  // Handle backspace - allow correcting input
  if (event.key === 'Backspace') {
    // Don't allow backspace in this game - keeps it challenging
    return;
  }

  const key = event.key.toLowerCase();
  const expectedChar = activeWord.getNextChar();

  if (!expectedChar) return;

  // Normalize for comparison (handle apostrophe variations)
  const normalizedKey = key === "'" ? "'" : key;
  const normalizedExpected = expectedChar === "'" ? "'" : expectedChar;

  if (normalizedKey === normalizedExpected) {
    // Correct key
    activeWord.advancePosition();
    gameState.currentInput += activeWord.text[activeWord.position - 1];
    updateInputDisplay();

    if (activeWord.isComplete()) {
      activeWord.complete();
    }
  } else {
    // Wrong key
    gameState.wrongChars++;
    activeWord.registerError();
  }
}

function updateInputDisplay() {
  elements.inputText.textContent = gameState.currentInput;
}

function showScorePopup(element, text, className) {
  const popup = document.createElement('div');
  popup.className = `score-popup ${className}`;
  popup.textContent = text;

  const rect = element.getBoundingClientRect();
  const gameRect = elements.gameArea.getBoundingClientRect();

  popup.style.left = `${rect.left - gameRect.left + rect.width / 2}px`;
  popup.style.top = `${rect.top - gameRect.top}px`;

  elements.gameArea.appendChild(popup);

  setTimeout(() => {
    if (popup.parentNode) {
      popup.parentNode.removeChild(popup);
    }
  }, 1000);
}

function showComboPopup(multiplier) {
  const popup = document.createElement('div');
  popup.className = 'combo-popup';
  popup.textContent = `x${multiplier} COMBO!`;
  document.body.appendChild(popup);

  setTimeout(() => {
    if (popup.parentNode) {
      popup.parentNode.removeChild(popup);
    }
  }, 800);
}

function updateHUD() {
  elements.score.textContent = gameState.score;
  elements.time.textContent = gameState.timeLeft;
}

function updateLivesDisplay() {
  const hearts = elements.lives.querySelectorAll('.heart');
  hearts.forEach((heart, index) => {
    if (index >= gameState.lives) {
      heart.classList.add('lost');
    } else {
      heart.classList.remove('lost');
    }
  });
}

function updateCombo(success) {
  if (success) {
    gameState.streak++;
    if (gameState.streak > gameState.bestStreak) {
      gameState.bestStreak = gameState.streak;
    }

    // Check for multiplier upgrade
    let newMultiplier = 1;
    for (const threshold of COMBO_THRESHOLDS) {
      if (gameState.streak >= threshold.streak) {
        newMultiplier = threshold.multiplier;
      }
    }

    if (newMultiplier > gameState.multiplier) {
      gameState.multiplier = newMultiplier;
      showComboPopup(newMultiplier);
    }
  } else {
    gameState.streak = 0;
    gameState.multiplier = 1;
  }

  updateComboDisplay();
}

function updateComboDisplay() {
  elements.combo.textContent = `x${gameState.multiplier}`;
  if (gameState.multiplier >= 2) {
    elements.combo.classList.add('high');
  } else {
    elements.combo.classList.remove('high');
  }
}

function loseLife() {
  gameState.lives--;
  updateLivesDisplay();

  if (gameState.lives <= 0) {
    endGame();
  }
}

function pauseGame() {
  gameState.isPaused = true;
  elements.pauseOverlay.classList.add('active');
}

function resumeGame() {
  gameState.isPaused = false;
  gameState.lastTimestamp = performance.now();
  elements.pauseOverlay.classList.remove('active');
}

function endGame() {
  gameState.isRunning = false;

  clearInterval(gameState.spawnTimer);
  clearInterval(gameState.gameTimer);
  cancelAnimationFrame(gameState.animationFrameId);

  elements.pauseOverlay.classList.remove('active');

  // Calculate stats
  const totalChars = gameState.correctChars + gameState.wrongChars;
  const accuracy = totalChars > 0
    ? Math.round((gameState.correctChars / totalChars) * 100)
    : 0;

  // Calculate speed (characters per minute)
  const gameDuration = (Date.now() - gameState.gameStartTime) / 1000 / 60; // in minutes
  const speed = gameDuration > 0
    ? Math.round(gameState.correctChars / gameDuration)
    : 0;

  // Check for new record
  const isNewRecord = saveRecord(gameState.difficulty, gameState.score, gameState.bestStreak);

  // Update result screen
  elements.finalScore.textContent = gameState.score;
  elements.statWords.textContent = gameState.wordsCompleted;
  elements.statChars.textContent = gameState.correctChars;
  elements.statAccuracy.textContent = `${accuracy}%`;
  elements.statBestCombo.textContent = gameState.bestStreak;
  elements.statSpeed.textContent = speed;

  if (isNewRecord) {
    elements.newRecord.style.display = 'inline-block';
    elements.resultEmoji.textContent = '🏆';
    elements.resultTitle.textContent = 'Новий рекорд!';
  } else {
    elements.newRecord.style.display = 'none';
    if (gameState.lives <= 0) {
      elements.resultEmoji.textContent = '💔';
      elements.resultTitle.textContent = 'Гру завершено!';
    } else {
      elements.resultEmoji.textContent = '🎉';
      elements.resultTitle.textContent = 'Час вийшов!';
    }
  }

  showScreen('result');
  loadRecords();
}

function quitToMenu() {
  gameState.isRunning = false;

  clearInterval(gameState.spawnTimer);
  clearInterval(gameState.gameTimer);
  cancelAnimationFrame(gameState.animationFrameId);

  elements.pauseOverlay.classList.remove('active');

  showScreen('menu');
}

// ===== EVENT LISTENERS =====
document.querySelectorAll('.difficulty-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    startGame(btn.dataset.level);
  });
});

elements.pauseBtn.addEventListener('click', pauseGame);
elements.resumeBtn.addEventListener('click', resumeGame);
elements.quitBtn.addEventListener('click', quitToMenu);
elements.playAgainBtn.addEventListener('click', () => startGame(gameState.difficulty));
elements.backMenuBtn.addEventListener('click', () => showScreen('menu'));

// Keyboard handling
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && gameState.isRunning) {
    if (gameState.isPaused) {
      resumeGame();
    } else {
      pauseGame();
    }
    return;
  }

  handleKeyPress(e);
});

// ===== INITIALIZATION =====
loadRecords();
