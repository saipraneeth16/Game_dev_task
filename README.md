# Game_dev_task
Just Divide is a casual puzzle game built using Phaser 3, where players strategically place numbered tiles on a 4×4 grid and apply division and matching rules to clear tiles, score points, and survive as long as possible.

The game combines logical thinking with simple, colorful visuals and intuitive drag-and-drop controls.

🧠 Game Objective

Place numbered tiles onto a 4×4 grid

Merge tiles using specific rules to clear space

Manage upcoming tiles using KEEP and TRASH

The game ends when the grid is completely full

🎯 Game Rules
1. Tile Placement

Drag the active tile into an empty grid slot

Tiles snap automatically to the nearest valid slot

2. Merge Rules

Equal numbers → both tiles disappear

Divisible numbers → larger ÷ smaller replaces the larger tile

Example: 12 ÷ 4 = 3

If a division results in 1, the tile disappears

Chain merges are supported

3. Tile Queue

A queue of 3 upcoming tiles is maintained

Only 2 preview tiles are shown side-by-side

The active tile is spawned from the queue

4. KEEP Slot

Stores one tile

If empty → stores the current active tile

If occupied → swaps with the active tile

Using KEEP advances the tile queue

5. TRASH Slot

Discards the active tile

Limited uses (×10)

Advances the tile queue

6. Game Over

Triggered when the grid becomes completely full

Tile spawning stops

A Game Over overlay is displayed

🎨 Visual Design

Color-coded tiles based on values:

Blue, Green, Purple, Orange, Red

Clear UI layering:

Background → Board → Grid → Score/Level → Cat → Icons

Custom Game Over PNG overlay

Header: JUST DIVIDE

Branding: Ekalavya icon

🕹️ Controls

Drag & Drop → Place tiles

KEEP button → Store or swap tile

TRASH button → Discard tile

Pause / Help icons → UI controls (non-gameplay)

🛠️ Tech Stack

JavaScript

Phaser 3

HTML5 / Canvas
