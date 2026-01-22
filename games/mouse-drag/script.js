// ===== GAME CONFIGURATION =====
const DIFFICULTY = {
  easy: {
    name: 'Легкий',
    time: 80,
    theme: 'fruitsVegetables',
    itemsPerCategory: 4,  // 4 items × 2 categories = 8 total
    pointsPerItem: 10,
    streakBonus: 5
  },
  medium: {
    name: 'Середній',
    time: 100,
    theme: 'animals',
    itemsPerCategory: 4,  // 4 items × 3 categories = 12 total
    pointsPerItem: 15,
    streakBonus: 8
  },
  hard: {
    name: 'Важкий',
    time: 120,
    theme: 'seasons',
    itemsPerCategory: 4,  // 4 items × 4 categories = 16 total
    pointsPerItem: 20,
    streakBonus: 10
  }
};

const THEMES = {
  fruitsVegetables: {
    categories: [
      { id: 'fruits', name: 'Фрукти', icon: '🍎' },
      { id: 'vegetables', name: 'Овочі', icon: '🥕' }
    ],
    items: [
      // Фрукти (15 шт)
      { emoji: '🍎', category: 'fruits' },
      { emoji: '🍐', category: 'fruits' },
      { emoji: '🍊', category: 'fruits' },
      { emoji: '🍋', category: 'fruits' },
      { emoji: '🍌', category: 'fruits' },
      { emoji: '🍇', category: 'fruits' },
      { emoji: '🍓', category: 'fruits' },
      { emoji: '🍒', category: 'fruits' },
      { emoji: '🍑', category: 'fruits' },
      { emoji: '🥝', category: 'fruits' },
      { emoji: '🍍', category: 'fruits' },
      { emoji: '🥭', category: 'fruits' },
      { emoji: '🍉', category: 'fruits' },
      { emoji: '🫐', category: 'fruits' },
      { emoji: '🍈', category: 'fruits' },
      // Овочі (15 шт)
      { emoji: '🥕', category: 'vegetables' },
      { emoji: '🥒', category: 'vegetables' },
      { emoji: '🍅', category: 'vegetables' },
      { emoji: '🌽', category: 'vegetables' },
      { emoji: '🥦', category: 'vegetables' },
      { emoji: '🧅', category: 'vegetables' },
      { emoji: '🥔', category: 'vegetables' },
      { emoji: '🍆', category: 'vegetables' },
      { emoji: '🌶️', category: 'vegetables' },
      { emoji: '🥬', category: 'vegetables' },
      { emoji: '🧄', category: 'vegetables' },
      { emoji: '🥜', category: 'vegetables' },
      { emoji: '🫑', category: 'vegetables' },
      { emoji: '🫛', category: 'vegetables' },
      { emoji: '🥗', category: 'vegetables' }
    ]
  },
  animals: {
    categories: [
      { id: 'farm', name: 'Ферма', icon: '🏠' },
      { id: 'forest', name: 'Ліс', icon: '🌲' },
      { id: 'water', name: 'Вода', icon: '🌊' }
    ],
    items: [
      // Ферма (12 шт)
      { emoji: '🐄', category: 'farm' },
      { emoji: '🐷', category: 'farm' },
      { emoji: '🐔', category: 'farm' },
      { emoji: '🐑', category: 'farm' },
      { emoji: '🐴', category: 'farm' },
      { emoji: '🐐', category: 'farm' },
      { emoji: '🐓', category: 'farm' },
      { emoji: '🦆', category: 'farm' },
      { emoji: '🐇', category: 'farm' },
      { emoji: '🐕', category: 'farm' },
      { emoji: '🐈', category: 'farm' },
      { emoji: '🦃', category: 'farm' },
      // Ліс (12 шт)
      { emoji: '🦊', category: 'forest' },
      { emoji: '🐻', category: 'forest' },
      { emoji: '🦌', category: 'forest' },
      { emoji: '🐿️', category: 'forest' },
      { emoji: '🦉', category: 'forest' },
      { emoji: '🐺', category: 'forest' },
      { emoji: '🦔', category: 'forest' },
      { emoji: '🐗', category: 'forest' },
      { emoji: '🦅', category: 'forest' },
      { emoji: '🐦', category: 'forest' },
      { emoji: '🦇', category: 'forest' },
      { emoji: '🐸', category: 'forest' },
      // Вода (12 шт)
      { emoji: '🐟', category: 'water' },
      { emoji: '🐬', category: 'water' },
      { emoji: '🐙', category: 'water' },
      { emoji: '🦈', category: 'water' },
      { emoji: '🐢', category: 'water' },
      { emoji: '🦭', category: 'water' },
      { emoji: '🐳', category: 'water' },
      { emoji: '🦑', category: 'water' },
      { emoji: '🦀', category: 'water' },
      { emoji: '🐠', category: 'water' },
      { emoji: '🦞', category: 'water' },
      { emoji: '🐡', category: 'water' }
    ]
  },
  seasons: {
    categories: [
      { id: 'winter', name: 'Зима', icon: '❄️' },
      { id: 'spring', name: 'Весна', icon: '🌸' },
      { id: 'summer', name: 'Літо', icon: '☀️' },
      { id: 'autumn', name: 'Осінь', icon: '🍂' }
    ],
    items: [
      // Зима (10 шт)
      { emoji: '⛄', category: 'winter' },
      { emoji: '🎿', category: 'winter' },
      { emoji: '🧣', category: 'winter' },
      { emoji: '🎄', category: 'winter' },
      { emoji: '❄️', category: 'winter' },
      { emoji: '🧤', category: 'winter' },
      { emoji: '⛷️', category: 'winter' },
      { emoji: '🏂', category: 'winter' },
      { emoji: '🎅', category: 'winter' },
      { emoji: '🛷', category: 'winter' },
      // Весна (10 шт)
      { emoji: '🌷', category: 'spring' },
      { emoji: '🐣', category: 'spring' },
      { emoji: '🌈', category: 'spring' },
      { emoji: '🦋', category: 'spring' },
      { emoji: '🌸', category: 'spring' },
      { emoji: '🐝', category: 'spring' },
      { emoji: '🌱', category: 'spring' },
      { emoji: '🐰', category: 'spring' },
      { emoji: '🌼', category: 'spring' },
      { emoji: '🪺', category: 'spring' },
      // Літо (10 шт)
      { emoji: '🏖️', category: 'summer' },
      { emoji: '🍦', category: 'summer' },
      { emoji: '🌻', category: 'summer' },
      { emoji: '🩴', category: 'summer' },
      { emoji: '🏊', category: 'summer' },
      { emoji: '🧴', category: 'summer' },
      { emoji: '😎', category: 'summer' },
      { emoji: '🍹', category: 'summer' },
      { emoji: '🩱', category: 'summer' },
      { emoji: '🌴', category: 'summer' },
      // Осінь (10 шт)
      { emoji: '🍁', category: 'autumn' },
      { emoji: '🎃', category: 'autumn' },
      { emoji: '🌰', category: 'autumn' },
      { emoji: '☂️', category: 'autumn' },
      { emoji: '🍂', category: 'autumn' },
      { emoji: '🥧', category: 'autumn' },
      { emoji: '🌾', category: 'autumn' },
      { emoji: '🍄', category: 'autumn' },
      { emoji: '🧥', category: 'autumn' },
      { emoji: '🫖', category: 'autumn' }
    ]
  }
};

// Combo thresholds
const COMBO_THRESHOLDS = [
  { streak: 3, multiplier: 1.5 },
  { streak: 5, multiplier: 2 },
  { streak: 8, multiplier: 3 }
];

// ===== GAME STATE =====
let gameState = {
  isRunning: false,
  isPaused: false,
  difficulty: 'easy',
  score: 0,
  timeLeft: 80,
  items: [],
  totalItems: 0,
  completedItems: 0,
  correctCount: 0,
  wrongCount: 0,
  streak: 0,
  bestStreak: 0,
  multiplier: 1,
  gameTimer: null,
  draggedItem: null
};

// ===== DOM ELEMENTS =====
const screens = {
  menu: document.getElementById('menu-screen'),
  game: document.getElementById('game-screen'),
  result: document.getElementById('result-screen')
};

const elements = {
  itemsContainer: document.getElementById('items-container'),
  categoriesContainer: document.getElementById('categories-container'),
  score: document.getElementById('score'),
  time: document.getElementById('time'),
  progress: document.getElementById('progress'),
  streak: document.getElementById('streak'),
  pauseBtn: document.getElementById('pause-btn'),
  pauseOverlay: document.getElementById('pause-overlay'),
  resumeBtn: document.getElementById('resume-btn'),
  quitBtn: document.getElementById('quit-btn'),
  finalScore: document.getElementById('final-score'),
  newRecord: document.getElementById('new-record'),
  resultEmoji: document.getElementById('result-emoji'),
  resultTitle: document.getElementById('result-title'),
  statCorrect: document.getElementById('stat-correct'),
  statWrong: document.getElementById('stat-wrong'),
  statAccuracy: document.getElementById('stat-accuracy'),
  statBestStreak: document.getElementById('stat-best-streak'),
  playAgainBtn: document.getElementById('play-again-btn'),
  backMenuBtn: document.getElementById('back-menu-btn')
};

// ===== UTILITY FUNCTIONS =====
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// ===== GAME FUNCTIONS =====
function showScreen(screenName) {
  Object.values(screens).forEach(screen => screen.classList.remove('active'));
  screens[screenName].classList.add('active');
}

function loadRecords() {
  const records = JSON.parse(localStorage.getItem('mouseDragRecords') || '{}');
  document.getElementById('record-easy').textContent = `Рекорд: ${records.easy?.highScore || 0}`;
  document.getElementById('record-medium').textContent = `Рекорд: ${records.medium?.highScore || 0}`;
  document.getElementById('record-hard').textContent = `Рекорд: ${records.hard?.highScore || 0}`;
}

function saveRecord(difficulty, score) {
  const records = JSON.parse(localStorage.getItem('mouseDragRecords') || '{}');
  const currentRecord = records[difficulty]?.highScore || 0;

  if (score > currentRecord) {
    records[difficulty] = {
      highScore: score,
      lastPlayed: new Date().toISOString().split('T')[0]
    };
    localStorage.setItem('mouseDragRecords', JSON.stringify(records));
    return true;
  }
  return false;
}

function getRandomItemsForGame(theme, itemsPerCategory) {
  const categories = theme.categories;
  const selectedItems = [];

  // For each category, select random items
  categories.forEach(cat => {
    const categoryItems = theme.items.filter(item => item.category === cat.id);
    const shuffled = shuffleArray(categoryItems);
    const selected = shuffled.slice(0, itemsPerCategory);
    selectedItems.push(...selected);
  });

  return shuffleArray(selectedItems);
}

function startGame(difficulty) {
  const config = DIFFICULTY[difficulty];
  const theme = THEMES[config.theme];
  const gameItems = getRandomItemsForGame(theme, config.itemsPerCategory);

  gameState = {
    isRunning: true,
    isPaused: false,
    difficulty: difficulty,
    score: 0,
    timeLeft: config.time,
    items: gameItems,
    totalItems: gameItems.length,
    completedItems: 0,
    correctCount: 0,
    wrongCount: 0,
    streak: 0,
    bestStreak: 0,
    multiplier: 1,
    gameTimer: null,
    draggedItem: null
  };

  // Clear containers
  elements.itemsContainer.innerHTML = '';
  elements.categoriesContainer.innerHTML = '';

  // Create drop zones
  theme.categories.forEach(cat => {
    const zone = document.createElement('div');
    zone.className = 'drop-zone';
    zone.dataset.category = cat.id;
    zone.innerHTML = `
      <div class="zone-icon">${cat.icon}</div>
      <div class="zone-title">${cat.name}</div>
      <div class="zone-count">0 предметів</div>
      <div class="zone-items"></div>
    `;
    elements.categoriesContainer.appendChild(zone);

    // Drop zone events
    zone.addEventListener('dragover', handleDragOver);
    zone.addEventListener('dragleave', handleDragLeave);
    zone.addEventListener('drop', handleDrop);

    // Touch events for drop zones
    zone.addEventListener('touchmove', handleTouchMove, { passive: false });
  });

  // Create draggable items
  gameState.items.forEach((item, index) => {
    const itemEl = document.createElement('div');
    itemEl.className = 'drag-item';
    itemEl.textContent = item.emoji;
    itemEl.draggable = true;
    itemEl.dataset.index = index;
    itemEl.dataset.category = item.category;

    // Mouse drag events
    itemEl.addEventListener('dragstart', handleDragStart);
    itemEl.addEventListener('dragend', handleDragEnd);

    // Touch events
    itemEl.addEventListener('touchstart', handleTouchStart, { passive: false });
    itemEl.addEventListener('touchmove', handleTouchMove, { passive: false });
    itemEl.addEventListener('touchend', handleTouchEnd);

    elements.itemsContainer.appendChild(itemEl);
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

// ===== DRAG AND DROP HANDLERS =====
function handleDragStart(e) {
  if (!gameState.isRunning || gameState.isPaused) {
    e.preventDefault();
    return;
  }
  gameState.draggedItem = e.target;
  e.target.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
}

function handleDragEnd(e) {
  e.target.classList.remove('dragging');
  gameState.draggedItem = null;

  // Remove drag-over from all zones
  document.querySelectorAll('.drop-zone').forEach(zone => {
    zone.classList.remove('drag-over');
  });
}

function handleDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
  e.currentTarget.classList.add('drag-over');
}

function handleDragLeave(e) {
  e.currentTarget.classList.remove('drag-over');
}

function handleDrop(e) {
  e.preventDefault();
  const zone = e.currentTarget;
  zone.classList.remove('drag-over');

  if (!gameState.draggedItem) return;

  const itemCategory = gameState.draggedItem.dataset.category;
  const zoneCategory = zone.dataset.category;

  processItemDrop(gameState.draggedItem, zone, itemCategory === zoneCategory);
}

// ===== TOUCH HANDLERS =====
let touchDragItem = null;
let touchClone = null;
let touchStartX = 0;
let touchStartY = 0;

function handleTouchStart(e) {
  if (!gameState.isRunning || gameState.isPaused) return;

  const touch = e.touches[0];
  const item = e.currentTarget;

  touchDragItem = item;
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;

  // Create visual clone for dragging
  touchClone = item.cloneNode(true);
  touchClone.style.position = 'fixed';
  touchClone.style.left = `${touch.clientX - 40}px`;
  touchClone.style.top = `${touch.clientY - 40}px`;
  touchClone.style.zIndex = '1000';
  touchClone.style.pointerEvents = 'none';
  touchClone.classList.add('dragging');
  document.body.appendChild(touchClone);

  item.style.opacity = '0.5';
}

function handleTouchMove(e) {
  if (!touchClone) return;
  e.preventDefault();

  const touch = e.touches[0];
  touchClone.style.left = `${touch.clientX - 40}px`;
  touchClone.style.top = `${touch.clientY - 40}px`;

  // Check which drop zone we're over
  document.querySelectorAll('.drop-zone').forEach(zone => {
    const rect = zone.getBoundingClientRect();
    if (touch.clientX >= rect.left && touch.clientX <= rect.right &&
        touch.clientY >= rect.top && touch.clientY <= rect.bottom) {
      zone.classList.add('drag-over');
    } else {
      zone.classList.remove('drag-over');
    }
  });
}

function handleTouchEnd(e) {
  if (!touchDragItem || !touchClone) return;

  const touch = e.changedTouches[0];

  // Find drop zone under touch point
  let targetZone = null;
  document.querySelectorAll('.drop-zone').forEach(zone => {
    const rect = zone.getBoundingClientRect();
    if (touch.clientX >= rect.left && touch.clientX <= rect.right &&
        touch.clientY >= rect.top && touch.clientY <= rect.bottom) {
      targetZone = zone;
    }
    zone.classList.remove('drag-over');
  });

  if (targetZone) {
    const itemCategory = touchDragItem.dataset.category;
    const zoneCategory = targetZone.dataset.category;
    processItemDrop(touchDragItem, targetZone, itemCategory === zoneCategory);
  }

  // Cleanup
  touchDragItem.style.opacity = '1';
  if (touchClone && touchClone.parentNode) {
    touchClone.parentNode.removeChild(touchClone);
  }
  touchDragItem = null;
  touchClone = null;
}

// ===== ITEM PROCESSING =====
function processItemDrop(item, zone, isCorrect) {
  const config = DIFFICULTY[gameState.difficulty];
  const rect = zone.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top;

  if (isCorrect) {
    // Correct drop
    gameState.correctCount++;
    gameState.streak++;
    if (gameState.streak > gameState.bestStreak) {
      gameState.bestStreak = gameState.streak;
    }

    // Update multiplier
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

    // Calculate points
    let points = Math.round(config.pointsPerItem * gameState.multiplier);
    if (gameState.streak > 1) {
      points += config.streakBonus;
    }
    gameState.score += points;

    showScorePopup(x, y, `+${points}`, 'positive');

    // Add item to zone
    const zoneItems = zone.querySelector('.zone-items');
    const droppedItem = document.createElement('div');
    droppedItem.className = 'dropped-item';
    droppedItem.textContent = item.textContent;
    zoneItems.appendChild(droppedItem);

    // Update zone count
    const count = zoneItems.children.length;
    zone.querySelector('.zone-count').textContent = `${count} предметів`;

    // Animate and remove item
    item.classList.add('correct');
    setTimeout(() => {
      if (item.parentNode) {
        item.parentNode.removeChild(item);
      }
    }, 500);

    gameState.completedItems++;
    updateHUD();

    // Check win condition
    if (gameState.completedItems >= gameState.totalItems) {
      endGame(true);
    }
  } else {
    // Wrong drop
    gameState.wrongCount++;
    gameState.streak = 0;
    gameState.multiplier = 1;

    showScorePopup(x, y, '✗', 'negative');

    item.classList.add('wrong');
    zone.classList.add('wrong-drop');

    setTimeout(() => {
      item.classList.remove('wrong');
      zone.classList.remove('wrong-drop');
    }, 500);

    updateHUD();
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
  elements.progress.textContent = `${gameState.completedItems}/${gameState.totalItems}`;
  elements.streak.textContent = gameState.streak;
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

  // Add time bonus for win
  if (isWin && gameState.timeLeft > 0) {
    gameState.score += gameState.timeLeft * 2;
  }

  // Calculate accuracy
  const totalAttempts = gameState.correctCount + gameState.wrongCount;
  const accuracy = totalAttempts > 0
    ? Math.round((gameState.correctCount / totalAttempts) * 100)
    : 0;

  // Check for new record
  const isNewRecord = saveRecord(gameState.difficulty, gameState.score);

  // Update result screen
  elements.finalScore.textContent = gameState.score;
  elements.statCorrect.textContent = gameState.correctCount;
  elements.statWrong.textContent = gameState.wrongCount;
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
