// ===== GAME CONFIGURATION =====
const DIFFICULTY = {
  easy: {
    name: 'Легкий',
    sizeMin: 70,
    sizeMax: 90,
    speedMin: 80,
    speedMax: 150,
    spawnInterval: 1500,
    bombChance: 0
  },
  medium: {
    name: 'Середній',
    sizeMin: 50,
    sizeMax: 70,
    speedMin: 120,
    speedMax: 200,
    spawnInterval: 1000,
    bombChance: 0.1
  },
  hard: {
    name: 'Важкий',
    sizeMin: 35,
    sizeMax: 55,
    speedMin: 180,
    speedMax: 280,
    spawnInterval: 700,
    bombChance: 0.2
  }
};

const BALLOON_COLORS = [
  ['#667eea', '#764ba2'],
  ['#f093fb', '#f5576c'],
  ['#4facfe', '#00f2fe'],
  ['#43e97b', '#38f9d7'],
  ['#fa709a', '#fee140'],
  ['#a8edea', '#fed6e3'],
  ['#ff9a9e', '#fecfef'],
  ['#ffecd2', '#fcb69f']
];

const GAME_DURATION = 60;
const INITIAL_LIVES = 3;
const GOLDEN_CHANCE = 0.08;
const TIME_BONUS_CHANCE = 0.05;

// ===== GAME STATE =====
let gameState = {
  isRunning: false,
  isPaused: false,
  difficulty: 'easy',
  score: 0,
  lives: INITIAL_LIVES,
  timeLeft: GAME_DURATION,
  balloons: [],
  balloonsPopped: 0,
  totalClicks: 0,
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
  pauseBtn: document.getElementById('pause-btn'),
  pauseOverlay: document.getElementById('pause-overlay'),
  resumeBtn: document.getElementById('resume-btn'),
  quitBtn: document.getElementById('quit-btn'),
  finalScore: document.getElementById('final-score'),
  newRecord: document.getElementById('new-record'),
  resultEmoji: document.getElementById('result-emoji'),
  resultTitle: document.getElementById('result-title'),
  statPopped: document.getElementById('stat-popped'),
  statAccuracy: document.getElementById('stat-accuracy'),
  playAgainBtn: document.getElementById('play-again-btn'),
  backMenuBtn: document.getElementById('back-menu-btn')
};

// ===== BALLOON CLASS =====
class Balloon {
  constructor(config) {
    this.id = Math.random().toString(36).substr(2, 9);
    this.x = config.x;
    this.y = config.y;
    this.size = config.size;
    this.speed = config.speed;
    this.type = config.type;
    this.direction = config.direction;
    this.element = null;
    this.isPopped = false;

    this.createElement();
  }

  createElement() {
    this.element = document.createElement('div');
    this.element.className = `balloon ${this.type}`;
    this.element.style.width = `${this.size}px`;
    this.element.style.height = `${this.size * 1.15}px`;
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;

    if (this.type === 'normal') {
      const colors = BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)];
      this.element.style.setProperty('--balloon-color-1', colors[0]);
      this.element.style.setProperty('--balloon-color-2', colors[1]);
      this.element.style.color = colors[1];
    } else if (this.type === 'bomb') {
      this.element.textContent = '💣';
      this.element.style.color = '#2d2d2d';
    } else if (this.type === 'time-bonus') {
      this.element.textContent = '⏱️';
      this.element.style.color = '#38f9d7';
    } else if (this.type === 'golden') {
      this.element.textContent = '✨';
      this.element.style.color = '#ffd700';
    }

    this.element.addEventListener('click', (e) => this.onClick(e));
    elements.gameArea.appendChild(this.element);
  }

  update(dt) {
    if (this.isPopped) return;

    const dx = Math.cos(this.direction) * this.speed * dt;
    const dy = Math.sin(this.direction) * this.speed * dt;

    this.x += dx;
    this.y += dy;

    const areaRect = elements.gameArea.getBoundingClientRect();
    const maxX = areaRect.width - this.size;
    const maxY = areaRect.height - this.size * 1.15;

    // Bounce off walls
    if (this.x <= 0 || this.x >= maxX) {
      this.direction = Math.PI - this.direction;
      this.x = Math.max(0, Math.min(maxX, this.x));
    }
    if (this.y <= 0 || this.y >= maxY) {
      this.direction = -this.direction;
      this.y = Math.max(0, Math.min(maxY, this.y));
    }
  }

  render() {
    if (this.element && !this.isPopped) {
      this.element.style.left = `${this.x}px`;
      this.element.style.top = `${this.y}px`;
    }
  }

  onClick(e) {
    if (this.isPopped || gameState.isPaused) return;
    e.stopPropagation();
    this.pop();
  }

  pop() {
    if (this.isPopped) return;
    this.isPopped = true;
    this.element.classList.add('popping');

    let points = 0;
    let popupClass = 'positive';
    let popupText = '';

    switch (this.type) {
      case 'normal':
        points = 1;
        popupText = '+1';
        gameState.balloonsPopped++;
        break;
      case 'golden':
        points = 5;
        popupText = '+5';
        popupClass = 'golden';
        gameState.balloonsPopped++;
        break;
      case 'bomb':
        loseLife();
        popupText = '💥';
        popupClass = 'negative';
        break;
      case 'time-bonus':
        points = 2;
        gameState.timeLeft += 5;
        popupText = '+5s';
        popupClass = 'time';
        gameState.balloonsPopped++;
        break;
    }

    if (points !== 0) {
      gameState.score += points;
      updateHUD();
    }

    showScorePopup(this.x + this.size / 2, this.y, popupText, popupClass);

    setTimeout(() => this.remove(), 300);
  }

  remove() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    const index = gameState.balloons.indexOf(this);
    if (index > -1) {
      gameState.balloons.splice(index, 1);
    }
  }
}

// ===== GAME FUNCTIONS =====
function showScreen(screenName) {
  Object.values(screens).forEach(screen => screen.classList.remove('active'));
  screens[screenName].classList.add('active');
}

function loadRecords() {
  const records = JSON.parse(localStorage.getItem('balloonGameRecords') || '{}');
  document.getElementById('record-easy').textContent = `Рекорд: ${records.easy?.highScore || 0}`;
  document.getElementById('record-medium').textContent = `Рекорд: ${records.medium?.highScore || 0}`;
  document.getElementById('record-hard').textContent = `Рекорд: ${records.hard?.highScore || 0}`;
}

function saveRecord(difficulty, score) {
  const records = JSON.parse(localStorage.getItem('balloonGameRecords') || '{}');
  const currentRecord = records[difficulty]?.highScore || 0;

  if (score > currentRecord) {
    records[difficulty] = {
      highScore: score,
      lastPlayed: new Date().toISOString().split('T')[0]
    };
    localStorage.setItem('balloonGameRecords', JSON.stringify(records));
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
    balloons: [],
    balloonsPopped: 0,
    totalClicks: 0,
    spawnTimer: null,
    gameTimer: null,
    lastTimestamp: 0,
    animationFrameId: null
  };

  elements.gameArea.innerHTML = '';
  updateHUD();
  updateLivesDisplay();
  showScreen('game');

  // Track clicks for accuracy
  elements.gameArea.addEventListener('click', onGameAreaClick);

  // Wait for the screen to render before spawning balloons
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      // Start spawning balloons
      spawnBalloon();
      gameState.spawnTimer = setInterval(spawnBalloon, DIFFICULTY[difficulty].spawnInterval);
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

    gameState.balloons.forEach(balloon => {
      balloon.update(dt);
      balloon.render();
    });
  } else {
    gameState.lastTimestamp = timestamp;
  }

  gameState.animationFrameId = requestAnimationFrame(gameLoop);
}

function spawnBalloon() {
  if (gameState.isPaused || !gameState.isRunning) return;

  const config = DIFFICULTY[gameState.difficulty];
  const areaRect = elements.gameArea.getBoundingClientRect();

  // Don't spawn if game area has no size yet
  if (areaRect.width < 100 || areaRect.height < 100) return;

  const size = Math.random() * (config.sizeMax - config.sizeMin) + config.sizeMin;
  const speed = Math.random() * (config.speedMax - config.speedMin) + config.speedMin;

  let type = 'normal';
  const rand = Math.random();
  if (rand < config.bombChance) {
    type = 'bomb';
  } else if (rand < config.bombChance + GOLDEN_CHANCE) {
    type = 'golden';
  } else if (rand < config.bombChance + GOLDEN_CHANCE + TIME_BONUS_CHANCE) {
    type = 'time-bonus';
  }

  const balloon = new Balloon({
    x: Math.random() * (areaRect.width - size),
    y: Math.random() * (areaRect.height - size * 1.15),
    size: size,
    speed: speed,
    type: type,
    direction: Math.random() * Math.PI * 2
  });

  gameState.balloons.push(balloon);

  // Remove old balloons if too many
  if (gameState.balloons.length > 15) {
    const oldest = gameState.balloons[0];
    if (!oldest.isPopped) {
      oldest.remove();
    }
  }
}

function onGameAreaClick() {
  gameState.totalClicks++;
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

  elements.gameArea.removeEventListener('click', onGameAreaClick);
  elements.pauseOverlay.classList.remove('active');

  // Calculate stats
  const accuracy = gameState.totalClicks > 0
    ? Math.round((gameState.balloonsPopped / gameState.totalClicks) * 100)
    : 0;

  // Check for new record
  const isNewRecord = saveRecord(gameState.difficulty, gameState.score);

  // Update result screen
  elements.finalScore.textContent = gameState.score;
  elements.statPopped.textContent = gameState.balloonsPopped;
  elements.statAccuracy.textContent = `${accuracy}%`;

  if (isNewRecord) {
    elements.newRecord.style.display = 'inline-block';
    elements.resultEmoji.textContent = '🏆';
    elements.resultTitle.textContent = 'Новий рекорд!';
  } else {
    elements.newRecord.style.display = 'none';
    if (gameState.lives <= 0) {
      elements.resultEmoji.textContent = '💥';
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

  elements.gameArea.removeEventListener('click', onGameAreaClick);
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

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && gameState.isRunning) {
    if (gameState.isPaused) {
      resumeGame();
    } else {
      pauseGame();
    }
  }
});

// ===== INITIALIZATION =====
loadRecords();
