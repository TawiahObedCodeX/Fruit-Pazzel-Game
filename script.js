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

let currentLevel = 0;
let attempts = 0; // attempts per level
let timeElapsed = 0;
let timerInterval = null;
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchedPairs = 0;
let totalPairs = 0;
let peekTimeout = null;

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
}

// Reset game state (for current level)
function resetGame() {
    clearInterval(timerInterval);
    clearTimeout(peekTimeout);
    attempts = 0;
    timeElapsed = 0;
    firstCard = null;
    secondCard = null;
    lockBoard = false;
    matchedPairs = 0;
    attemptCounter.textContent = attempts;
    timerDisplay.textContent = `${timeElapsed}s`;
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
        card.textContent = card.dataset.value;
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
    this.textContent = this.dataset.value;

    if (!firstCard) {
        firstCard = this;
        return;
    }

    secondCard = this;
    attempts++;
    attemptCounter.textContent = attempts;

    checkForMatch();
}

// Check if two cards match
function checkForMatch() {
    const isMatch = firstCard.dataset.value === secondCard.dataset.value;

    if (isMatch) {
        disableCards();
        matchedPairs++;

        // Check if level is complete
        if (matchedPairs === totalPairs) {
            completeLevel();
        }
    } else {
        unflipCards();
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
        firstCard.textContent = '';
        secondCard.textContent = '';
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