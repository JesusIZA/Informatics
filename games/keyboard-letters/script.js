// ===== GAME CONFIGURATION =====
const DIFFICULTY = {
  beginner: {
    name: 'Початківець',
    chars: 'абвгдеєжзиіїйклмнопрстуфхцчшщьюя',
    letterTime: 12000,
    spawnInterval: 2500,
    maxLetters: 2,
    goldenChance: 0.12,
    fastChance: 0,
    timeBonusChance: 0.08
  },
  easy: {
    name: 'Легкий',
    chars: 'абвгдеєжзиіїйклмнопрстуфхцчшщьюя',
    letterTime: 10000,
    spawnInterval: 2000,
    maxLetters: 3,
    goldenChance: 0.1,
    fastChance: 0,
    timeBonusChance: 0.06
  },
  medium: {
    name: 'Середній',
    chars: 'АБВГДЕЄЖЗИІЇЙКЛМНОПРСТУФХЦЧШЩЬЮЯабвгдеєжзиіїйклмнопрстуфхцчшщьюя',
    letterTime: 7000,
    spawnInterval: 1500,
    maxLetters: 3,
    goldenChance: 0.08,
    fastChance: 0.08,
    timeBonusChance: 0.05
  },
  hard: {
    name: 'Важкий',
    chars: 'АБВГДЕЄЖЗИІЇЙКЛМНОПРСТУФХЦЧШЩЬЮЯабвгдеєжзиіїйклмнопрстуфхцчшщьюя0123456789',
    letterTime: 5000,
    spawnInterval: 1200,
    maxLetters: 4,
    goldenChance: 0.06,
    fastChance: 0.12,
    timeBonusChance: 0.05
  },
  expert: {
    name: 'Експерт',
    chars: 'АБВГДЕЄЖЗИІЇЙКЛМНОПРСТУФХЦЧШЩЬЮЯабвгдеєжзиіїйклмнопрстуфхцчшщьюя0123456789.,!?:;',
    letterTime: 5000,
    spawnInterval: 1000,
    maxLetters: 4,
    goldenChance: 0.05,
    fastChance: 0.15,
    timeBonusChance: 0.04
  }
};

const GAME_DURATION = 60;
const INITIAL_LIVES = 3;
const FAST_LETTER_TIME_MULTIPLIER = 0.5;

// Combo thresholds
const COMBO_THRESHOLDS = [
  { streak: 5, multiplier: 2 },
  { streak: 10, multiplier: 3 },
  { streak: 15, multiplier: 4 }
];

// ===== GAME STATE =====
let gameState = {
  isRunning: false,
  isPaused: false,
  difficulty: 'easy',
  score: 0,
  lives: INITIAL_LIVES,
  timeLeft: GAME_DURATION,
  letters: [],
  correctCount: 0,
  wrongCount: 0,
  streak: 0,
  bestStreak: 0,
  multiplier: 1,
  spawnTimer: null,
  gameTimer: null,
  lastTimestamp: 0,
  animationFrameId: null
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
  pauseBtn: document.getElementById('pause-btn'),
  pauseOverlay: document.getElementById('pause-overlay'),
  resumeBtn: document.getElementById('resume-btn'),
  quitBtn: document.getElementById('quit-btn'),
  finalScore: document.getElementById('final-score'),
  newRecord: document.getElementById('new-record'),
  resultEmoji: document.getElementById('result-emoji'),
  resultTitle: document.getElementById('result-title'),
  statCorrect: document.getElementById('stat-correct'),
  statBestCombo: document.getElementById('stat-best-combo'),
  statAccuracy: document.getElementById('stat-accuracy'),
  playAgainBtn: document.getElementById('play-again-btn'),
  backMenuBtn: document.getElementById('back-menu-btn')
};

// ===== LETTER CLASS =====
class Letter {
  constructor(config) {
    this.id = Math.random().toString(36).substr(2, 9);
    this.char = config.char;
    this.key = config.key;
    this.x = config.x;
    this.y = config.y;
    this.type = config.type;
    this.maxTime = config.maxTime;
    this.timeLeft = config.maxTime;
    this.element = null;
    this.timerProgress = null;
    this.isCompleted = false;
    this.circumference = 2 * Math.PI * 44; // radius 44

    this.createElement();
  }

  createElement() {
    this.element = document.createElement('div');
    this.element.className = `letter ${this.type}`;
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;

    // Letter content
    const charSpan = document.createElement('span');
    charSpan.className = 'letter-char';
    charSpan.textContent = this.char;
    this.element.appendChild(charSpan);

    // Timer ring
    const timerDiv = document.createElement('div');
    timerDiv.className = 'letter-timer';
    timerDiv.innerHTML = `
      <svg viewBox="0 0 100 100">
        <circle class="timer-bg" cx="50" cy="50" r="44"/>
        <circle class="timer-progress" cx="50" cy="50" r="44"
          stroke-dasharray="${this.circumference}"
          stroke-dashoffset="0"/>
      </svg>
    `;
    this.element.appendChild(timerDiv);
    this.timerProgress = timerDiv.querySelector('.timer-progress');

    elements.gameArea.appendChild(this.element);
  }

  update(dt) {
    if (this.isCompleted) return;

    this.timeLeft -= dt * 1000;

    // Update timer ring
    const progress = this.timeLeft / this.maxTime;
    const offset = this.circumference * (1 - progress);
    this.timerProgress.style.strokeDashoffset = offset;

    // Change color as time runs out
    if (progress < 0.3) {
      this.timerProgress.style.stroke = '#f5576c';
    }

    if (this.timeLeft <= 0) {
      this.expire();
    }
  }

  complete() {
    if (this.isCompleted) return;
    this.isCompleted = true;

    let points = 0;
    let popupClass = 'positive';
    let popupText = '';

    switch (this.type) {
      case 'normal':
        points = 1 * gameState.multiplier;
        popupText = `+${points}`;
        break;
      case 'golden':
        points = 5 * gameState.multiplier;
        popupText = `+${points}`;
        popupClass = 'golden';
        break;
      case 'fast':
        points = 3 * gameState.multiplier;
        popupText = `+${points}`;
        popupClass = 'fast';
        break;
      case 'time-bonus':
        points = 2 * gameState.multiplier;
        gameState.timeLeft += 5;
        popupText = `+${points} +5s`;
        popupClass = 'time';
        break;
    }

    gameState.score += points;
    gameState.correctCount++;
    updateCombo(true);
    updateHUD();

    showScorePopup(this.x + 40, this.y, popupText, popupClass);

    this.element.classList.add('correct');
    setTimeout(() => this.remove(), 400);
  }

  expire() {
    if (this.isCompleted) return;
    this.isCompleted = true;

    loseLife();
    updateCombo(false);
    showScorePopup(this.x + 40, this.y, '💔', 'negative');

    this.element.classList.add('expired');
    setTimeout(() => this.remove(), 400);
  }

  remove() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    const index = gameState.letters.indexOf(this);
    if (index > -1) {
      gameState.letters.splice(index, 1);
    }
  }
}

// ===== GAME FUNCTIONS =====
function showScreen(screenName) {
  Object.values(screens).forEach(screen => screen.classList.remove('active'));
  screens[screenName].classList.add('active');
}

function loadRecords() {
  const records = JSON.parse(localStorage.getItem('keyboardLettersRecords') || '{}');
  document.getElementById('record-beginner').textContent = `Рекорд: ${records.beginner?.highScore || 0}`;
  document.getElementById('record-easy').textContent = `Рекорд: ${records.easy?.highScore || 0}`;
  document.getElementById('record-medium').textContent = `Рекорд: ${records.medium?.highScore || 0}`;
  document.getElementById('record-hard').textContent = `Рекорд: ${records.hard?.highScore || 0}`;
  document.getElementById('record-expert').textContent = `Рекорд: ${records.expert?.highScore || 0}`;
}

function saveRecord(difficulty, score, bestCombo) {
  const records = JSON.parse(localStorage.getItem('keyboardLettersRecords') || '{}');
  const currentRecord = records[difficulty]?.highScore || 0;

  if (score > currentRecord) {
    records[difficulty] = {
      highScore: score,
      bestCombo: bestCombo,
      lastPlayed: new Date().toISOString().split('T')[0]
    };
    localStorage.setItem('keyboardLettersRecords', JSON.stringify(records));
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
    letters: [],
    correctCount: 0,
    wrongCount: 0,
    streak: 0,
    bestStreak: 0,
    multiplier: 1,
    spawnTimer: null,
    gameTimer: null,
    lastTimestamp: 0,
    animationFrameId: null
  };

  elements.gameArea.innerHTML = '';
  updateHUD();
  updateLivesDisplay();
  updateComboDisplay();
  showScreen('game');

  // Wait for the screen to render
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      spawnLetter();
      gameState.spawnTimer = setInterval(spawnLetter, DIFFICULTY[difficulty].spawnInterval);
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

    gameState.letters.forEach(letter => {
      letter.update(dt);
    });
  } else {
    gameState.lastTimestamp = timestamp;
  }

  gameState.animationFrameId = requestAnimationFrame(gameLoop);
}

function spawnLetter() {
  if (gameState.isPaused || !gameState.isRunning) return;

  const config = DIFFICULTY[gameState.difficulty];
  const areaRect = elements.gameArea.getBoundingClientRect();

  if (areaRect.width < 100 || areaRect.height < 100) return;

  // Don't spawn if max letters reached
  if (gameState.letters.length >= config.maxLetters) return;

  // Pick random character
  const char = config.chars[Math.floor(Math.random() * config.chars.length)];

  // Determine type
  let type = 'normal';
  let letterTime = config.letterTime;
  const rand = Math.random();

  if (rand < config.goldenChance) {
    type = 'golden';
  } else if (rand < config.goldenChance + config.fastChance) {
    type = 'fast';
    letterTime = config.letterTime * FAST_LETTER_TIME_MULTIPLIER;
  } else if (rand < config.goldenChance + config.fastChance + config.timeBonusChance) {
    type = 'time-bonus';
  }

  // Find non-overlapping position
  const letterSize = 80;
  const padding = 20;
  let x, y;
  let attempts = 0;
  const maxAttempts = 50;

  do {
    x = padding + Math.random() * (areaRect.width - letterSize - padding * 2);
    y = padding + Math.random() * (areaRect.height - letterSize - padding * 2);
    attempts++;
  } while (isOverlapping(x, y, letterSize) && attempts < maxAttempts);

  const letter = new Letter({
    char: char,
    key: char,
    x: x,
    y: y,
    type: type,
    maxTime: letterTime
  });

  gameState.letters.push(letter);
}

function isOverlapping(x, y, size) {
  const minDistance = size + 20;
  return gameState.letters.some(letter => {
    const dx = letter.x - x;
    const dy = letter.y - y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < minDistance;
  });
}

function handleKeyPress(event) {
  if (!gameState.isRunning || gameState.isPaused) return;

  // Ignore modifier keys
  if (event.ctrlKey || event.altKey || event.metaKey) return;

  const key = event.key;

  // Find matching letter
  const matchingLetter = gameState.letters.find(
    letter => !letter.isCompleted && letter.key === key
  );

  if (matchingLetter) {
    matchingLetter.complete();
  } else {
    // Wrong key pressed
    handleWrongKey(key);
  }
}

function handleWrongKey(key) {
  // Only count as wrong if the key is a valid character
  const config = DIFFICULTY[gameState.difficulty];
  if (config.chars.includes(key)) {
    gameState.wrongCount++;
    updateCombo(false);

    // Shake all letters briefly
    gameState.letters.forEach(letter => {
      letter.element.classList.add('wrong');
      setTimeout(() => letter.element.classList.remove('wrong'), 500);
    });
  }
}

function showScorePopup(x, y, text, className) {
  const popup = document.createElement('div');
  popup.className = `score-popup ${className}`;
  popup.textContent = text;
  popup.style.left = `${x}px`;
  popup.style.top = `${y}px`;
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
  if (gameState.multiplier >= 3) {
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
  const totalAttempts = gameState.correctCount + gameState.wrongCount;
  const accuracy = totalAttempts > 0
    ? Math.round((gameState.correctCount / totalAttempts) * 100)
    : 0;

  // Check for new record
  const isNewRecord = saveRecord(gameState.difficulty, gameState.score, gameState.bestStreak);

  // Update result screen
  elements.finalScore.textContent = gameState.score;
  elements.statCorrect.textContent = gameState.correctCount;
  elements.statBestCombo.textContent = gameState.bestStreak;
  elements.statAccuracy.textContent = `${accuracy}%`;

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
