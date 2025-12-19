# Just Divide

Just Divide is a casual puzzle game built using **Phaser 3** where players place numbered tiles on a 4×4 grid and apply division and matching rules to clear tiles, score points, and survive as long as possible.

The game focuses on logical thinking, strategic planning, and clean visual feedback.

---

## Objective

- Place numbered tiles on a **4×4 grid**
- Merge tiles using game rules to free space
- Manage upcoming tiles using **KEEP** and **TRASH**
- The game ends when the grid becomes completely full

---

## Game Rules

### Tile Placement
- Drag the **active tile** into an empty grid slot
- Tiles automatically snap to the nearest valid slot

### Merge Logic
- **Equal numbers** → both tiles disappear
- **Divisible numbers** → larger ÷ smaller replaces the larger tile  
  - Example: `12 ÷ 4 = 3`
- If a division results in `1`, the tile disappears
- **Chain merges** are supported

### Tile Queue
- A queue of **3 upcoming tiles**
- Only **2 preview tiles** are shown side-by-side
- The active tile spawns from the queue

### KEEP Slot
- Stores **one tile**
- If empty → stores the current active tile
- If occupied → swaps with the active tile
- Using KEEP advances the tile queue

### TRASH Slot
- Discards the active tile
- Limited uses (**×10**)
- Advances the tile queue

### Game Over
- Triggered when the **grid is completely full**
- Tile spawning stops
- A Game Over overlay is supposed to be displayed but doesn't show up because of some bugs.

---

## Visual Design

- Color-coded tiles based on value  
  *(blue, green, purple, orange, red)*
- Clear UI layering:
  - Background → Board → Grid → Score/Level → Cat → Icons
- Game title: **JUST DIVIDE**
- Branding: **Ekalavya**

---

## Controls

- **Drag & Drop** → Place tiles
- **KEEP** → Store or swap tile
- **TRASH** → Discard tile
- **Pause / Help** → UI controls

---

## Tech Stack

- **JavaScript**
- **Phaser 3**
- **HTML5 / Canvas**

---



