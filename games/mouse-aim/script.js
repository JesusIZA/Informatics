// ===== GAME CONFIGURATION =====
const DIFFICULTY = {
  easy: {
    name: 'Легкий',
    targetTime: 4000,
    spawnInterval: 2000,
    maxTargets: 2,
    targetSize: { min: 80, max: 100 },
    goldenChance: 0.10,
    fastChance: 0.10,
    timeBonusChance: 0.05
  },
  medium: {
    name: 'Середній',
    targetTime: 3000,
    spawnInterval: 1500,
    maxTargets: 3,
    targetSize: { min: 60, max: 80 },
    goldenChance: 0.10,
    fastChance: 0.10,
    timeBonusChance: 0.05
  },
  hard: {
    name: 'Важкий',
    targetTime: 2000,
    spawnInterval: 1200,
    maxTargets: 4,
    targetSize: { min: 45, max: 60 },
    goldenChance: 0.10,
    fastChance: 0.10,
    timeBonusChance: 0.05
  }
};

// Points for each zone: [outer, middle, inner/bullseye]
const POINTS = {
  normal: [1, 2, 5],
  golden: [2, 5, 10],
  fast: [3, 5, 8],
  'time-bonus': [1, 2, 3]
};

const GAME_DURATION = 60;
const INITIAL_LIVES = 3;
const FAST_TARGET_TIME_MULTIPLIER = 0.6;

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
  targets: [],
  hitCount: 0,
  missCount: 0,
  bullseyeCount: 0,
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
  statHits: document.getElementById('stat-hits'),
  statAccuracy: document.getElementById('stat-accuracy'),
  statBestCombo: document.getElementById('stat-best-combo'),
  statBullseyes: document.getElementById('stat-bullseyes'),
  playAgainBtn: document.getElementById('play-again-btn'),
  backMenuBtn: document.getElementById('back-menu-btn')
};

// ===== TARGET CLASS =====
class Target {
  constructor(config) {
    this.id = Math.random().toString(36).substr(2, 9);
    this.x = config.x;
    this.y = config.y;
    this.size = config.size;
    this.type = config.type;
    this.maxTime = config.maxTime;
    this.timeLeft = config.maxTime;
    this.element = null;
    this.timerProgress = null;
    this.isCompleted = false;
    this.circumference = 2 * Math.PI * ((this.size / 2) + 4);

    this.createElement();
  }

  createElement() {
    this.element = document.createElement('div');
    this.element.className = `target ${this.type}`;
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;
    this.element.style.width = `${this.size}px`;
    this.element.style.height = `${this.size}px`;

    // Concentric rings
    const outerRing = document.createElement('div');
    outerRing.className = 'target-ring outer';
    this.element.appendChild(outerRing);

    const middleRing = document.createElement('div');
    middleRing.className = 'target-ring middle';
    this.element.appendChild(middleRing);

    const innerRing = document.createElement('div');
    innerRing.className = 'target-ring inner';
    this.element.appendChild(innerRing);

    // Timer ring
    const timerDiv = document.createElement('div');
    timerDiv.className = 'target-timer';
    const svgSize = this.size + 12;
    const radius = (this.size / 2) + 4;
    timerDiv.innerHTML = `
      <svg viewBox="0 0 ${svgSize} ${svgSize}">
        <circle class="timer-bg" cx="${svgSize / 2}" cy="${svgSize / 2}" r="${radius}"/>
        <circle class="timer-progress" cx="${svgSize / 2}" cy="${svgSize / 2}" r="${radius}"
          stroke-dasharray="${this.circumference}"
          stroke-dashoffset="0"/>
      </svg>
    `;
    this.element.appendChild(timerDiv);
    this.timerProgress = timerDiv.querySelector('.timer-progress');

    // Click handler
    this.element.addEventListener('click', (e) => {
      e.stopPropagation();
      // Use getBoundingClientRect to get correct position relative to target center
      const rect = this.element.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      this.hit(clickX, clickY);
    });

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

  hit(clickX, clickY) {
    if (this.isCompleted) return;
    this.isCompleted = true;

    // Calculate distance from center
    const centerX = this.size / 2;
    const centerY = this.size / 2;
    const distance = Math.sqrt(
      Math.pow(clickX - centerX, 2) + Math.pow(clickY - centerY, 2)
    );

    // Determine zone (based on distance from center)
    const innerRadius = this.size * 0.165; // 33% / 2
    const middleRadius = this.size * 0.33; // 66% / 2
    const outerRadius = this.size / 2;

    let zone;
    let zoneIndex;
    if (distance <= innerRadius) {
      zone = 'bullseye';
      zoneIndex = 2;
      gameState.bullseyeCount++;
    } else if (distance <= middleRadius) {
      zone = 'middle';
      zoneIndex = 1;
    } else {
      zone = 'outer';
      zoneIndex = 0;
    }

    // Calculate points
    const basePoints = POINTS[this.type][zoneIndex];
    const points = basePoints * gameState.multiplier;

    let popupClass = 'positive';
    let popupText = `+${points}`;

    if (zone === 'bullseye') {
      popupClass = 'bullseye';
      popupText = `🎯 +${points}`;
    } else if (this.type === 'golden') {
      popupClass = 'golden';
    }

    // Time bonus for time-bonus targets
    if (this.type === 'time-bonus') {
      gameState.timeLeft += 5;
      popupText += ' +5s';
      popupClass = 'time';
    }

    gameState.score += points;
    gameState.hitCount++;
    updateCombo(true);
    updateHUD();

    showScorePopup(this.x + this.size / 2, this.y, popupText, popupClass);

    this.element.classList.add('hit');
    setTimeout(() => this.remove(), 400);
  }

  expire() {
    if (this.isCompleted) return;
    this.isCompleted = true;

    loseLife();
    updateCombo(false);
    showScorePopup(this.x + this.size / 2, this.y, '💔', 'negative');

    this.element.classList.add('expired');
    setTimeout(() => this.remove(), 400);
  }

  remove() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    const index = gameState.targets.indexOf(this);
    if (index > -1) {
      gameState.targets.splice(index, 1);
    }
  }
}

// ===== GAME FUNCTIONS =====
function showScreen(screenName) {
  Object.values(screens).forEach(screen => screen.classList.remove('active'));
  screens[screenName].classList.add('active');
}

function loadRecords() {
  const records = JSON.parse(localStorage.getItem('aimTrainerRecords') || '{}');
  document.getElementById('record-easy').textContent = `Рекорд: ${records.easy?.highScore || 0}`;
  document.getElementById('record-medium').textContent = `Рекорд: ${records.medium?.highScore || 0}`;
  document.getElementById('record-hard').textContent = `Рекорд: ${records.hard?.highScore || 0}`;
}

function saveRecord(difficulty, score, bestCombo) {
  const records = JSON.parse(localStorage.getItem('aimTrainerRecords') || '{}');
  const currentRecord = records[difficulty]?.highScore || 0;

  if (score > currentRecord) {
    records[difficulty] = {
      highScore: score,
      bestCombo: bestCombo,
      lastPlayed: new Date().toISOString().split('T')[0]
    };
    localStorage.setItem('aimTrainerRecords', JSON.stringify(records));
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
    targets: [],
    hitCount: 0,
    missCount: 0,
    bullseyeCount: 0,
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
      spawnTarget();
      gameState.spawnTimer = setInterval(spawnTarget, DIFFICULTY[difficulty].spawnInterval);
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

    gameState.targets.forEach(target => {
      target.update(dt);
    });
  } else {
    gameState.lastTimestamp = timestamp;
  }

  gameState.animationFrameId = requestAnimationFrame(gameLoop);
}

function spawnTarget() {
  if (gameState.isPaused || !gameState.isRunning) return;

  const config = DIFFICULTY[gameState.difficulty];
  const areaRect = elements.gameArea.getBoundingClientRect();

  if (areaRect.width < 100 || areaRect.height < 100) return;

  // Don't spawn if max targets reached
  if (gameState.targets.length >= config.maxTargets) return;

  // Random size within difficulty range
  const size = config.targetSize.min +
    Math.random() * (config.targetSize.max - config.targetSize.min);

  // Determine type
  let type = 'normal';
  let targetTime = config.targetTime;
  const rand = Math.random();

  if (rand < config.goldenChance) {
    type = 'golden';
  } else if (rand < config.goldenChance + config.fastChance) {
    type = 'fast';
    targetTime = config.targetTime * FAST_TARGET_TIME_MULTIPLIER;
  } else if (rand < config.goldenChance + config.fastChance + config.timeBonusChance) {
    type = 'time-bonus';
  }

  // Find non-overlapping position
  const padding = 20;
  let x, y;
  let attempts = 0;
  const maxAttempts = 50;

  do {
    x = padding + Math.random() * (areaRect.width - size - padding * 2);
    y = padding + Math.random() * (areaRect.height - size - padding * 2);
    attempts++;
  } while (isOverlapping(x, y, size) && attempts < maxAttempts);

  const target = new Target({
    x: x,
    y: y,
    size: size,
    type: type,
    maxTime: targetTime
  });

  gameState.targets.push(target);
}

function isOverlapping(x, y, size) {
  const minDistance = size + 20;
  return gameState.targets.some(target => {
    const dx = (target.x + target.size / 2) - (x + size / 2);
    const dy = (target.y + target.size / 2) - (y + size / 2);
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < (target.size / 2 + size / 2 + 20);
  });
}

function handleMiss(e) {
  if (!gameState.isRunning || gameState.isPaused) return;

  // Only count as miss if clicking on game area, not on targets
  if (e.target === elements.gameArea) {
    gameState.missCount++;
    updateCombo(false);

    // Show miss indicator
    const rect = elements.gameArea.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    showMissIndicator(x, y);
    showScorePopup(x, y, 'Промах', 'miss');
  }
}

function showMissIndicator(x, y) {
  const indicator = document.createElement('div');
  indicator.className = 'miss-indicator';
  indicator.style.left = `${x}px`;
  indicator.style.top = `${y}px`;
  elements.gameArea.appendChild(indicator);

  setTimeout(() => {
    if (indicator.parentNode) {
      indicator.parentNode.removeChild(indicator);
    }
  }, 500);
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
  const totalAttempts = gameState.hitCount + gameState.missCount;
  const accuracy = totalAttempts > 0
    ? Math.round((gameState.hitCount / totalAttempts) * 100)
    : 0;

  // Check for new record
  const isNewRecord = saveRecord(gameState.difficulty, gameState.score, gameState.bestStreak);

  // Update result screen
  elements.finalScore.textContent = gameState.score;
  elements.statHits.textContent = gameState.hitCount;
  elements.statAccuracy.textContent = `${accuracy}%`;
  elements.statBestCombo.textContent = gameState.bestStreak;
  elements.statBullseyes.textContent = gameState.bullseyeCount;

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

// Click on game area (miss)
elements.gameArea.addEventListener('click', handleMiss);

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
});

// ===== INITIALIZATION =====
loadRecords();
