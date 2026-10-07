# Memory Match Puzzle Game

A progressive memory matching puzzle game with 15 levels of increasing challenge. Built with HTML, CSS, and JavaScript.

## Features

- **15 Progressive Levels**: Each level increases in grid size and complexity
- **Card Preview System**: Levels 6-15 show a brief preview of all cards at the start
  - Levels 6-10: 3-second preview
  - Levels 11-15: 1-second preview
- **Level Progress Tracking**:
  - Current level display
  - Attempts counter (counts down from max attempts per level, resets per level)
  - Timer (elapsed time per level)
- **User Controls**:
  - Reset game to start from level 1
  - Next Level button appears after completing a level
  - Toggle Light/Dark mode button (persists preference)
- **Responsive Design**: Works on desktop and mobile browsers
- **Visual Feedback**:
  - Card flip animations
  - Matched cards stay highlighted
  - Visual indication of flipped vs matched cards
  - Celebration animations for correct/incorrect matches
  - Golden buzzer reward for completing Level 1
  - Hint system when attempts run out (shows all cards briefly)
- **Audio Feedback**:
  - Sound effects for correct and incorrect matches
  - Special golden buzzer sound for Level 1 completion
- **Accessibility**:
  - Full dark/light mode support with automatic system preference detection
  - High contrast themes for better visibility

## How to Play

1. Open `index.html` in any web browser
2. The game starts at Level 1 with 5 attempts
3. Click on cards to flip them and reveal the symbols
4. Find two cards with matching symbols
5. When a match is found:
   - Correct match: Success sound + celebration emoji (🎉) appears after 2 seconds
   - Incorrect match: Error sound + sad emoji (😢) appears after 2 seconds
   - Attempts decrease by 1 for incorrect matches
6. Continue until all pairs are found or you run out of attempts
7. If you run out of attempts:
   - All unmatched cards briefly flip to show correct symbols (hint)
   - Attempts reset to maximum after the hint
   - You can continue playing with fresh attempts
8. Upon completing a level:
   - Level 1 completion triggers golden buzzer sound + falling golden bell animation
   - A congratulatory alert shows your attempts and time
   - Click the "Next Level" button to advance
9. Use the "Reset Game" button to start over from Level 1 at any time
10. Toggle between light and dark modes using the button in the controls panel

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

- **Attempts**: Starts at 5 per level. Decreases by 1 for each incorrect match. When attempts reach 0, a hint shows all unmatched cards for 2 seconds, then attempts reset to 5.
- **Time**: Tracks elapsed time since the level started (or since last reset).
- **Matching**: Two cards must have identical symbols to count as a match.
- **Flipping**: Only two cards can be flipped at once; mismatched cards flip back after a short delay (1 second).
- **Completed Levels**: Matched cards remain face-up and cannot be flipped again.
- **Audio Feedback**:
  - Correct match: Rising 800Hz beep
  - Incorrect match: Falling 200Hz beep
  - Level 1 completion: Special golden buzzer melody (dual-tone rising)
- **Visual Feedback**:
  - Correct match: 🎉 celebration emoji with pulse animation (appears after 2 seconds)
  - Incorrect match: 😢 sad emoji with pulse animation (appears after 2 seconds)
  - Level 1 completion: Golden bell emoji (🛎️) falls from top to bottom
  - Hint: All unmatched cards briefly flip to reveal symbols when attempts reach 0
  - Card flip animations using CSS transforms
  - Matched cards remain face-up with distinct styling
- **Themes**:
  - Light mode: Light background, dark text, blue accent colors
  - Dark mode: Dark background, light text, blue accent colors
  - Toggle persists via localStorage and respects system preference

## Technical Implementation

### Files
- `index.html`: Game structure and layout
- `style.css`: Styling, animations, responsive design, and theming
- `script.js`: Game logic, level management, interactivity, and audio

### Key JavaScript Functions
- `initGame()`: Initializes a new game
- `resetGame()`: Resets the current level's state (attempts, timer, board)
- `createBoard()`: Generates the game board for the current level
- `showPeek()`: Displays the card preview at the start of applicable levels
- `flipCard()`: Handles card click events
- `checkForMatch()`: Determines if two flipped cards match and handles audio/visual feedback
- `disableCards()`: Handles matched cards
- `unflipCards()`: Handles mismatched cards
- `completeLevel()`: Manages level completion, golden buzzer for Level 1, and shows the Next button
- `showAllCardsHint()`: Displays all unmatched cards as hint when attempts run out
- `showCelebration(isCorrect)`: Shows celebration emoji (🎉/😢) after delay
- `playBeep(frequency, duration)`: Generates beep sounds via Web Audio API
- `playGoldenBuzzerSound()`: Generates special golden buzzer melody
- `showGoldenBuzzer()`: Shows falling golden bell animation
- `shuffle()`: Randomizes card order using Fisher-Yates algorithm
- `updateEvenLevelBackground()`: Applies subtle shading to even-numbered levels
- `initializeTheme()` & `addThemeToggleListener()`: Manage light/dark mode persistence

### Styling
- Clean, modern interface with CSS variable-based theming
- Card flip animations using CSS transforms
- Responsive layout that adapts to screen size
- Visual distinction between normal, flipped, and matched cards
- Celebration and hint animations using CSS keyframes
- Button styling with shadows and hover effects for better feedback
- Even-level background shading for progression tracking

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
- Adjust `MAX_ATTEMPTS_PER_LEVEL` constant to change difficulty

### Styling Changes
Update `style.css` to change colors, spacing, animations, or card appearance.

### Audio Adjustments
Modify the `playBeep()` and `playGoldenBuzzerSound()` functions in `script.js` to change sound frequencies or durations.

## Credits

Built as a progressive memory challenge game with enhanced feedback systems. Enjoy testing your memory skills across increasingly complex levels!

--- 
*Last updated: October 2026*