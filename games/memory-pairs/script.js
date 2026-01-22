// ===== GAME CONFIGURATION =====
const DIFFICULTY = {
  easy: {
    name: 'Легкий',
    cols: 4,
    rows: 3,
    time: 80,
    themes: ['animals'],
    flipBackDelay: 1000
  },
  medium: {
    name: 'Середній',
    cols: 4,
    rows: 4,
    time: 100,
    themes: ['animals', 'food'],
    flipBackDelay: 1000
  },
  hard: {
    name: 'Важкий',
    cols: 5,
    rows: 4,
    time: 120,
    themes: ['animals', 'food', 'transport'],
    flipBackDelay: 800
  }
};

const CARD_THEMES = {
  animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮'],
  food: ['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍒', '🍑', '🥝', '🍍'],
  transport: ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🛵'],
  sports: ['⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🎱', '🏓', '🏸', '🥊'],
  nature: ['🌸', '🌺', '🌻', '🌹', '🌷', '🌵', '🎄', '🌴', '🍀', '🌈'],
  space: ['🌙', '⭐', '🌟', '✨', '☀️', '🪐', '🚀', '🛸', '🌍', '💫']
};

// Combo thresholds for consecutive matches
const COMBO_THRESHOLDS = [
  { streak: 2, multiplier: 1.5 },
  { streak: 3, multiplier: 2 },
  { streak: 5, multiplier: 3 }
];

const BASE_POINTS = 10;
const SPEED_BONUS = 5;
const SPEED_BONUS_TIME = 3000; // 3 seconds
const TIME_BONUS_MULTIPLIER = 2;

// ===== GAME STATE =====
let gameState = {
  isRunning: false,
  isPaused: false,
  difficulty: 'easy',
  score: 0,
  timeLeft: 120,
  cards: [],
  flippedCards: [],
  matchedPairs: 0,
  totalPairs: 8,
  moves: 0,
  streak: 0,
  bestStreak: 0,
  multiplier: 1,
  isProcessing: false,
  gameTimer: null,
  lastMatchTime: 0,
  startTime: 0
};

// ===== DOM ELEMENTS =====
const screens = {
  menu: document.getElementById('menu-screen'),
  game: document.getElementById('game-screen'),
  result: document.getElementById('result-screen')
};

const elements = {
  cardsGrid: document.getElementById('cards-grid'),
  score: document.getElementById('score'),
  time: document.getElementById('time'),
  pairs: document.getElementById('pairs'),
  moves: document.getElementById('moves'),
  pauseBtn: document.getElementById('pause-btn'),
  pauseOverlay: document.getElementById('pause-overlay'),
  resumeBtn: document.getElementById('resume-btn'),
  quitBtn: document.getElementById('quit-btn'),
  finalScore: document.getElementById('final-score'),
  newRecord: document.getElementById('new-record'),
  resultEmoji: document.getElementById('result-emoji'),
  resultTitle: document.getElementById('result-title'),
  statTime: document.getElementById('stat-time'),
  statMoves: document.getElementById('stat-moves'),
  statAccuracy: document.getElementById('stat-accuracy'),
  statBestStreak: document.getElementById('stat-best-streak'),
  playAgainBtn: document.getElementById('play-again-btn'),
  backMenuBtn: document.getElementById('back-menu-btn')
};

// ===== CARD CLASS =====
class Card {
  constructor(emoji, index) {
    this.id = index;
    this.emoji = emoji;
    this.isFlipped = false;
    this.isMatched = false;
    this.element = null;
  }

  createElement() {
    this.element = document.createElement('div');
    this.element.className = 'card';
    this.element.dataset.id = this.id;

    const inner = document.createElement('div');
    inner.className = 'card-inner';

    const back = document.createElement('div');
    back.className = 'card-back';

    const front = document.createElement('div');
    front.className = 'card-front';
    front.textContent = this.emoji;

    inner.appendChild(back);
    inner.appendChild(front);
    this.element.appendChild(inner);

    this.element.addEventListener('click', () => handleCardClick(this));

    return this.element;
  }

  flip() {
    if (this.isFlipped || this.isMatched) return;
    this.isFlipped = true;
    this.element.classList.add('flipped');
  }

  unflip() {
    if (!this.isFlipped || this.isMatched) return;
    this.isFlipped = false;
    this.element.classList.remove('flipped');
  }

  setMatched() {
    this.isMatched = true;
    this.element.classList.add('matched');
  }

  setWrong() {
    this.element.classList.add('wrong');
    setTimeout(() => {
      this.element.classList.remove('wrong');
    }, 500);
  }
}

// ===== UTILITY FUNCTIONS =====
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function getEmojisForDifficulty(difficulty) {
  const config = DIFFICULTY[difficulty];
  const pairsNeeded = (config.cols * config.rows) / 2;
  let availableEmojis = [];

  if (config.themes.includes('all')) {
    // Get all emojis from all themes
    Object.values(CARD_THEMES).forEach(theme => {
      availableEmojis = availableEmojis.concat(theme);
    });
  } else {
    // Get emojis only from specified themes
    config.themes.forEach(theme => {
      availableEmojis = availableEmojis.concat(CARD_THEMES[theme]);
    });
  }

  // Shuffle and pick required number of emojis
  const shuffled = shuffleArray(availableEmojis);
  return shuffled.slice(0, pairsNeeded);
}

// ===== GAME FUNCTIONS =====
function showScreen(screenName) {
  Object.values(screens).forEach(screen => screen.classList.remove('active'));
  screens[screenName].classList.add('active');
}

function loadRecords() {
  const records = JSON.parse(localStorage.getItem('memoryPairsRecords') || '{}');
  document.getElementById('record-easy').textContent = `Рекорд: ${records.easy?.highScore || 0}`;
  document.getElementById('record-medium').textContent = `Рекорд: ${records.medium?.highScore || 0}`;
  document.getElementById('record-hard').textContent = `Рекорд: ${records.hard?.highScore || 0}`;
}

function saveRecord(difficulty, score, time, moves) {
  const records = JSON.parse(localStorage.getItem('memoryPairsRecords') || '{}');
  const currentRecord = records[difficulty]?.highScore || 0;

  if (score > currentRecord) {
    records[difficulty] = {
      highScore: score,
      bestTime: time,
      fewestMoves: moves,
      lastPlayed: new Date().toISOString().split('T')[0]
    };
    localStorage.setItem('memoryPairsRecords', JSON.stringify(records));
    return true;
  }
  return false;
}

function generateCards(difficulty) {
  const config = DIFFICULTY[difficulty];
  const emojis = getEmojisForDifficulty(difficulty);

  // Create pairs (each emoji appears twice)
  const cardPairs = [...emojis, ...emojis];
  const shuffledCards = shuffleArray(cardPairs);

  return shuffledCards.map((emoji, index) => new Card(emoji, index));
}

function startGame(difficulty) {
  const config = DIFFICULTY[difficulty];

  gameState = {
    isRunning: true,
    isPaused: false,
    difficulty: difficulty,
    score: 0,
    timeLeft: config.time,
    cards: [],
    flippedCards: [],
    matchedPairs: 0,
    totalPairs: (config.cols * config.rows) / 2,
    moves: 0,
    streak: 0,
    bestStreak: 0,
    multiplier: 1,
    isProcessing: false,
    gameTimer: null,
    lastMatchTime: 0,
    startTime: Date.now()
  };

  // Clear grid and set layout
  elements.cardsGrid.innerHTML = '';
  elements.cardsGrid.className = `grid-${config.rows}x${config.cols}`;

  // Generate and render cards
  gameState.cards = generateCards(difficulty);
  gameState.cards.forEach(card => {
    elements.cardsGrid.appendChild(card.createElement());
  });

  updateHUD();
  showScreen('game');

  // Start timer
  gameState.gameTimer = setInterval(() => {
    if (!gameState.isPaused) {
      gameState.timeLeft--;
      updateHUD();
      if (gameState.timeLeft <= 0) {
        endGame(false);
      }
    }
  }, 1000);
}

function handleCardClick(card) {
  if (!gameState.isRunning || gameState.isPaused) return;
  if (gameState.isProcessing) return;
  if (card.isFlipped || card.isMatched) return;
  if (gameState.flippedCards.length >= 2) return;

  card.flip();
  gameState.flippedCards.push(card);

  if (gameState.flippedCards.length === 2) {
    gameState.moves++;
    updateHUD();
    checkMatch();
  }
}

function checkMatch() {
  gameState.isProcessing = true;
  const [card1, card2] = gameState.flippedCards;
  const isMatch = card1.emoji === card2.emoji;

  if (isMatch) {
    // Calculate score
    const now = Date.now();
    const timeSinceLastMatch = now - gameState.lastMatchTime;
    let points = BASE_POINTS;

    // Speed bonus
    if (gameState.lastMatchTime > 0 && timeSinceLastMatch < SPEED_BONUS_TIME) {
      points += SPEED_BONUS;
    }

    // Update streak and multiplier
    gameState.streak++;
    if (gameState.streak > gameState.bestStreak) {
      gameState.bestStreak = gameState.streak;
    }

    // Check for combo upgrade
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

    // Apply multiplier
    points = Math.round(points * gameState.multiplier);
    gameState.score += points;
    gameState.lastMatchTime = now;

    // Show score popup
    const rect = card2.element.getBoundingClientRect();
    showScorePopup(rect.left + rect.width / 2, rect.top, `+${points}`, 'positive');

    // Mark cards as matched
    setTimeout(() => {
      card1.setMatched();
      card2.setMatched();
      gameState.matchedPairs++;
      gameState.flippedCards = [];
      gameState.isProcessing = false;
      updateHUD();

      // Check win condition
      if (gameState.matchedPairs === gameState.totalPairs) {
        endGame(true);
      }
    }, 300);
  } else {
    // Wrong match
    gameState.streak = 0;
    gameState.multiplier = 1;

    card1.setWrong();
    card2.setWrong();

    setTimeout(() => {
      card1.unflip();
      card2.unflip();
      gameState.flippedCards = [];
      gameState.isProcessing = false;
    }, DIFFICULTY[gameState.difficulty].flipBackDelay);
  }
}

function showScorePopup(x, y, text, className) {
  const popup = document.createElement('div');
  popup.className = `score-popup ${className}`;
  popup.textContent = text;
  popup.style.left = `${x}px`;
  popup.style.top = `${y}px`;
  document.body.appendChild(popup);

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
  elements.pairs.textContent = `${gameState.matchedPairs}/${gameState.totalPairs}`;
  elements.moves.textContent = gameState.moves;
}

function pauseGame() {
  gameState.isPaused = true;
  elements.pauseOverlay.classList.add('active');
}

function resumeGame() {
  gameState.isPaused = false;
  elements.pauseOverlay.classList.remove('active');
}

function endGame(isWin) {
  gameState.isRunning = false;

  clearInterval(gameState.gameTimer);
  elements.pauseOverlay.classList.remove('active');

  // Calculate final score with time bonus
  const timeElapsed = Math.round((Date.now() - gameState.startTime) / 1000);
  let finalScore = gameState.score;

  if (isWin && gameState.timeLeft > 0) {
    const timeBonus = gameState.timeLeft * TIME_BONUS_MULTIPLIER;
    finalScore += timeBonus;
  }

  // Calculate accuracy (perfect is moves = totalPairs)
  const perfectMoves = gameState.totalPairs;
  const accuracy = Math.min(100, Math.round((perfectMoves / gameState.moves) * 100));

  // Check for new record
  const isNewRecord = isWin && saveRecord(
    gameState.difficulty,
    finalScore,
    timeElapsed,
    gameState.moves
  );

  // Update result screen
  elements.finalScore.textContent = finalScore;
  elements.statTime.textContent = `${timeElapsed}с`;
  elements.statMoves.textContent = gameState.moves;
  elements.statAccuracy.textContent = `${accuracy}%`;
  elements.statBestStreak.textContent = gameState.bestStreak;

  if (isNewRecord) {
    elements.newRecord.style.display = 'inline-block';
    elements.resultEmoji.textContent = '🏆';
    elements.resultTitle.textContent = 'Новий рекорд!';
  } else if (isWin) {
    elements.newRecord.style.display = 'none';
    elements.resultEmoji.textContent = '🎉';
    elements.resultTitle.textContent = 'Вітаємо!';
  } else {
    elements.newRecord.style.display = 'none';
    elements.resultEmoji.textContent = '⏰';
    elements.resultTitle.textContent = 'Час вийшов!';
  }

  showScreen('result');
  loadRecords();
}

function quitToMenu() {
  gameState.isRunning = false;

  clearInterval(gameState.gameTimer);
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

// Escape key for pause
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
