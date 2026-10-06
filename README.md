# Memory Match Puzzle Game

A progressive memory matching puzzle game with 15 levels of increasing challenge. Built with HTML, CSS, and JavaScript.

## Features

- **15 Progressive Levels**: Each level increases in grid size and complexity
- **Card Preview System**: Levels 6-15 show a brief preview of all cards at the start
  - Levels 6-10: 3-second preview
  - Levels 11-15: 1-second preview
- **Level Progress Tracking**:
  - Current level display
  - Attempts counter (resets per level)
  - Timer (elapsed time per level)
- **User Controls**:
  - Reset game to start from level 1
  - Next Level button appears after completing a level
- **Responsive Design**: Works on desktop and mobile browsers
- **Visual Feedback**:
  - Card flip animations
  - Matched cards stay highlighted
  - Visual indication of flipped vs matched cards

## How to Play

1. Open `index.html` in any web browser
2. The game starts at Level 1
3. Click on cards to flip them and reveal the symbols
4. Find two cards with matching symbols
5. When a match is found, the cards remain face-up
6. Continue until all pairs are found
7. Upon completing a level:
   - A congratulatory alert shows your attempts and time
   - Click the "Next Level" button to advance
8. Use the "Reset Game" button to start over from Level 1 at any time

## Level Progression

| Level | Grid Size | Total Cards | Pairs | Preview Time |
|-------|-----------|-------------|-------|--------------|
| 1     | 2 x 2     | 4           | 2     | None         |
| 2     | 3 x 4     | 12          | 6     | None         |
| 3     | 4 x 4     | 16          | 8     | None         |
| 4     | 4 x 5     | 20          | 10    | None         |
| 5     | 5 x 6     | 30          | 15    | None         |
| 6     | 5 x 8     | 40          | 20    | 3 seconds    |
| 7     | 6 x 6     | 36          | 18    | 3 seconds    |
| 8     | 6 x 7     | 42          | 21    | 3 seconds    |
| 9     | 7 x 8     | 56          | 28    | 3 seconds    |
| 10    | 8 x 8     | 64          | 32    | 3 seconds    |
| 11    | 8 x 9     | 72          | 36    | 1 second     |
| 12    | 9 x 10    | 90          | 45    | 1 second     |
| 13    | 10 x 10   | 100         | 50    | 1 second     |
| 14    | 10 x 11   | 110         | 55    | 1 second     |
| 15    | 11 x 12   | 132         | 66    | 1 second     |

## Game Mechanics

- **Attempts**: Counts the number of card flip pairs you've made in the current level
- **Time**: Tracks elapsed time since the level started (or since last reset)
- **Matching**: Two cards must have identical symbols to count as a match
- **Flipping**: Only two cards can be flipped at once; mismatched cards flip back after a short delay
- **Completed Levels**: Matched cards remain face-up and cannot be flipped again

## Technical Implementation

### Files
- `index.html`: Game structure and layout
- `style.css`: Styling, animations, and responsive design
- `script.js`: Game logic, level management, and interactivity

### Key JavaScript Functions
- `initGame()`: Initializes a new game
- `resetGame()`: Resets the current level's state
- `createBoard()`: Generates the game board for the current level
- `showPeek()`: Displays the card preview at the start of applicable levels
- `flipCard()`: Handles card click events
- `checkForMatch()`: Determines if two flipped cards match
- `disableCards()`: Handles matched cards
- `unflipCards()`: Handles mismatched cards
- `completeLevel()`: Manages level completion and shows the Next button
- `shuffle()`: Randomizes card order using Fisher-Yates algorithm

### Styling
- Clean, modern interface with soft colors
- Card flip animations using CSS transforms
- Responsive layout that adapts to screen size
- Visual distinction between normal, flipped, and matched cards

## How to Run

1. Download or clone this repository
2. Open `index.html` in your preferred web browser (Chrome, Firefox, Safari, Edge)
3. No installation or dependencies required

## Customization

### Changing Symbols
Modify the `symbols` array in `script.js` to use different emojis or images.

### Adjusting Difficulty
- Edit the `levels` array to change grid sizes per level
- Adjust `peekTime` values to change preview durations
- Modify the `symbols` array length to affect symbol variety

### Styling Changes
Update `style.css` to change colors, spacing, animations, or card appearance.

## Credits

Built as a progressive memory challenge game. Enjoy testing your memory skills across increasingly complex levels!
