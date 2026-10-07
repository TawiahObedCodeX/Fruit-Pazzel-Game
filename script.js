// Game configuration
const levels = [
    { rows: 2, cols: 2, peekTime: 0 },   // Level 1: 2x2
    { rows: 3, cols: 4, peekTime: 0 },   // Level 2: 3x4
    { rows: 4, cols: 4, peekTime: 0 },   // Level 3: 4x4
    { rows: 4, cols: 5, peekTime: 0 },   // Level 4: 4x5
    { rows: 5, cols: 6, peekTime: 0 },   // Level 5: 5x6
    { rows: 5, cols: 8, peekTime: 3 },   // Level 6: 5x8
    { rows: 6, cols: 6, peekTime: 3 },   // Level 7: 6x6
    { rows: 6, cols: 7, peekTime: 3 },   // Level 8: 6x7
    { rows: 7, cols: 8, peekTime: 3 },   // Level 9: 7x8
    { rows: 8, cols: 8, peekTime: 3 },   // Level 10: 8x8
    { rows: 8, cols: 9, peekTime: 1 },   // Level 11: 8x9
    { rows: 9, cols: 10, peekTime: 1 },  // Level 12: 9x10
    { rows: 10, cols: 10, peekTime: 1 }, // Level 13: 10x10
    { rows: 10, cols: 11, peekTime: 1 }, // Level 14: 10x11
    { rows: 11, cols: 12, peekTime: 1 }  // Level 15: 11x12
];

// Symbols for cards (using emojis for simplicity)
const symbols = [
    '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍒', '🍑',
    '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒',
    '🌶️', '🌽', '🥕', '🥔', '🥕', '🌱', '🌿', '☘️', '🍀', '🎍',
    '🎋', '🎋', '🎋', '🎋', '🎋', '🎋', '🎋', '🎋', '🎋', '🎋',
    '🌸', '🌹', '🌺', '🌻', '🌼', '🌷', '🌱', '🌲', '🌳', '🌴',
    '🌵', '🌾', '🌿', '🍀', '🍁', '🍂', '🍃', '🍄', '🌰', '🥜',
    '🍯', '🥛', '🥚', '🍳', '🥞', '🥓', '🍖', '🍗', '🍘', '🍙',
    '🍚', '🍛', '🍜', '🍝', '🍞', '🍟', '🍕', '🌭', '🌮', '🌯',
    '🥗', '🥘', '🥙', '🥚', '🍳', '🥞', '🥓', '🍖', '🍗', '🍘',
    '🍙', '🍚', '🍛', '🍜', '🍝', '🍞', '🍟', '🍕', '🌭', '🌮',
    '🌯', '🥗', '🥘', '🥙', '🥓', '🍖', '🍗', '🍘', '🍙', '🍚'
];

/**
 * Shuffles array in place.
 * @param {Array} array items array
 */
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

let currentLevel = 0;
let timeElapsed = 0;
let timerInterval = null;
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchedPairs = 0;
let totalPairs = 0;
let peekTimeout = null;
const MAX_ATTEMPTS_PER_LEVEL = 5;
let attemptsLeft = 0;

// Sound functions
function playBeep(frequency, duration = 0.1) {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.frequency.value = frequency;
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + duration);
    } catch (e) {
        console.warn('Web Audio API not supported', e);
    }
}

// Celebration emoji
function showCelebration(isCorrect) {
    // Remove any existing celebration
    const existing = document.querySelector('.celebration');
    if (existing) existing.remove();

    const celebration = document.createElement('div');
    celebration.className = 'celebration';
    celebration.textContent = isCorrect ? '🎉' : '😢';
    document.body.appendChild(celebration);

    // Remove after animation ends (assuming 2s)
    setTimeout(() => {
        celebration.remove();
    }, 2000);
}

// Show all cards as hint when attempts run out
function showAllCardsHint() {
    lockBoard = true;
    const cards = gameBoard.querySelectorAll('.card:not(.matched)');
    cards.forEach(card => {
        card.classList.add('flipped');
    });
    // Hide after 2 seconds
    setTimeout(() => {
        cards.forEach(card => {
            card.classList.remove('flipped');
        });
        lockBoard = false;
    }, 2000);
}

// Golden buzzer sound and animation
function playGoldenBuzzerSound() {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        // Create a short melody or buzzer sound
        const oscillator1 = audioCtx.createOscillator();
        const oscillator2 = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        oscillator1.connect(gainNode);
        oscillator2.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        // Golden buzzer sound: two tones rising
        oscillator1.frequency.setValueAtTime(400, audioCtx.currentTime); // G4
        oscillator1.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.3);

        oscillator2.frequency.setValueAtTime(500, audioCtx.currentTime); // B4
        oscillator2.frequency.exponentialRampToValueAtTime(1000, audioCtx.currentTime + 0.3);

        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);

        oscillator1.start();
        oscillator2.start();
        oscillator1.stop(audioCtx.currentTime + 0.4);
        oscillator2.stop(audioCtx.currentTime + 0.4);
    } catch (e) {
        console.warn('Web Audio API not supported for golden buzzer', e);
    }
}

function showGoldenBuzzer() {
    // Remove any existing golden buzzer
    const existing = document.querySelector('.golden-buzzer');
    if (existing) existing.remove();

    const buzzer = document.createElement('div');
    buzzer.className = 'golden-buzzer';
    buzzer.textContent = '🛎️'; // bell emoji, styled gold via CSS
    document.body.appendChild(buzzer);

    // Remove after animation ends
    setTimeout(() => {
        buzzer.remove();
    }, 3000); // matches animation duration
}

// Theme handling
const STORAGE_KEY = 'fruit-pazzel-theme';
function getPreferredTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
function setTheme(theme) {
    document.body.classList.toggle('dark-mode', theme === 'dark');
    document.body.classList.toggle('light-mode', theme === 'light');
    localStorage.setItem(STORAGE_KEY, theme);
}
function updateEvenLevelBackground() {
    const isEven = (currentLevel + 1) % 2 === 0;
    document.body.classList.toggle('even-level', isEven);
}
function initializeTheme() {
    const theme = getPreferredTheme();
    setTheme(theme);
}

// Event listeners for theme toggle
function addThemeToggleListener() {
    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            const currentTheme = document.body.classList.contains('dark-mode') ? 'light' : 'dark';
            setTheme(currentTheme);
        });
    }
}

const levelDisplay = document.getElementById('level-display');
const attemptCounter = document.getElementById('attempt-counter');
const timerDisplay = document.getElementById('timer');
const gameBoard = document.getElementById('game-board');
const resetButton = document.getElementById('reset-button');
const nextButton = document.getElementById('next-button');

// Initialize game
function initGame() {
    alert('Game initialized'); // Debug
    resetGame();
    startTimer();
    createBoard();
    initializeTheme();
    addThemeToggleListener();
}

// Reset game state (for current level)
function resetGame() {
    clearInterval(timerInterval);
    clearTimeout(peekTimeout);
    attemptsLeft = MAX_ATTEMPTS_PER_LEVEL;
    timeElapsed = 0;
    firstCard = null;
    secondCard = null;
    lockBoard = false;
    matchedPairs = 0;
    attemptCounter.textContent = attemptsLeft;
    timerDisplay.textContent = `${timeElapsed}s`;
    levelDisplay.textContent = currentLevel + 1;
    updateEvenLevelBackground();
    gameBoard.innerHTML = '';
    nextButton.style.display = 'none'; // hide next button when starting/resetting level
}

// Start timer
function startTimer() {
    timerInterval = setInterval(() => {
        timeElapsed++;
        timerDisplay.textContent = `${timeElapsed}s`;
    }, 1000);
}

// Create game board for current level
function createBoard() {
    const { rows, cols, peekTime } = levels[currentLevel];
    totalPairs = (rows * cols) / 2;
    matchedPairs = 0;

    // Set grid template
    gameBoard.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

    // Generate symbols for this level
    const levelSymbols = symbols.slice(0, totalPairs);
    const cards = [...levelSymbols, ...levelSymbols]; // pairs

    // Shuffle cards
    shuffle(cards);

    // Create card elements
    cards.forEach(symbol => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.value = symbol;
        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
    });

    // Debug: update title to show level and pairs
    document.title = `Level ${currentLevel + 1}: ${totalPairs} pairs`;

    // Show peek if peekTime > 0
    if (peekTime > 0) {
        showPeek(peekTime);
    }
}

// Show all cards for peekTime seconds
function showPeek(seconds) {
    lockBoard = true;
    const cards = gameBoard.querySelectorAll('.card');
    cards.forEach(card => {
        card.classList.add('flipped');
    });
    // Hide after seconds
    peekTimeout = setTimeout(() => {
        cards.forEach(card => {
            card.classList.remove('flipped');
            card.textContent = '';
        });
        lockBoard = false;
    }, seconds * 1000);
}

// Flip card logic
function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flipped');

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;

    checkForMatch();
}

// Check if two cards match
function checkForMatch() {
    const isMatch = firstCard.dataset.value === secondCard.dataset.value;

    if (isMatch) {
        disableCards();
        matchedPairs++;
        playBeep(800, 0.2); // correct beep
        // Show celebration after 2 seconds
        setTimeout(() => {
            showCelebration(true);
        }, 2000);

        // Check if level is complete
        if (matchedPairs === totalPairs) {
            completeLevel();
        }
    } else {
        unflipCards();
        playBeep(200, 0.2); // wrong beep
        setTimeout(() => {
            showCelebration(false);
        }, 2000);
        attemptsLeft--;
        attemptCounter.textContent = attemptsLeft;
        if (attemptsLeft === 0) {
            // Show all cards as hint
            showAllCardsHint();
            // Reset attempts after hint
            setTimeout(() => {
                attemptsLeft = MAX_ATTEMPTS_PER_LEVEL;
                attemptCounter.textContent = attemptsLeft;
            }, 2000); // after hint duration
        }
    }
}

// Disable matched cards
function disableCards() {
    firstCard.classList.add('matched');
    secondCard.classList.add('matched');
    resetBoard();
}

// Unflip cards if not matched
function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        resetBoard();
    }, 1000);
}

// Reset board state
function resetBoard() {
    [firstCard, secondCard, lockBoard] = [null, null, false];
}

// Complete current level (show next button)
function completeLevel() {
    clearInterval(timerInterval);
    clearTimeout(peekTimeout);
    // Golden buzzer for first level completion
    if (currentLevel === 0) {
        playGoldenBuzzerSound();
        showGoldenBuzzer();
    }
    // Show next button
    nextButton.style.display = 'inline-block';
    // Optionally show a message
    alert(`Congratulations! You completed Level ${currentLevel + 1} in ${attempts} attempts and ${timeElapsed} seconds! Click "Next Level" to continue.`);
}

// Event listeners
resetButton.addEventListener('click', () => {
    currentLevel = 0;
    levelDisplay.textContent = currentLevel + 1;
    resetGame();
    startTimer();
    createBoard();
});

nextButton.addEventListener('click', () => {
    currentLevel++;
    if (currentLevel < levels.length) {
        resetGame();
        startTimer();
        createBoard();
        levelDisplay.textContent = currentLevel + 1;
        nextButton.style.display = 'none'; // hide until next level completed
    } else {
        alert('Congratulations! You have completed all levels!');
        currentLevel = 0;
        levelDisplay.textContent = currentLevel + 1;
        resetGame();
        startTimer();
        createBoard();
    }
});

// Start the game when page loads
window.addEventListener('load', initGame);