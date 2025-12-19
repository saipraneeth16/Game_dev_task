const config = {
  type: Phaser.AUTO,
  width: 1440,
  height: 1024,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: {
    preload,
    create
  }
};

new Phaser.Game(config);

/* =========================
   PRELOAD
========================= */
function preload() {
  this.load.image('bg', 'assets/bg1.png');
  this.load.image('cat', 'assets/Cat.png');
  this.load.image('gridSlot', 'assets/Placement_Box.png');

  this.load.image('levelBadge', 'assets/Levels and Score.png');
  this.load.image('scoreBadge', 'assets/Levels and Score.png');

  this.load.image('rightPanel', 'assets/right_panel.png');
  this.load.image('keepSlot', 'assets/keep_slot.png');
  this.load.image('trashSlot', 'assets/trash_slot.png');

  this.load.image('pause', 'assets/pause.png');
  this.load.image('help', 'assets/help.png');

  this.load.image('tileBlue', 'assets/blue.png');
  this.load.image('tileRed', 'assets/red.png');
  this.load.image('tileOrange', 'assets/orange.png');
  this.load.image('tilePurple', 'assets/purple.png');
  this.load.image('tileGreen', 'assets/green.png');

  this.load.image('gameOver', 'assets/game_over.png');

  this.load.image('pauseIcon', 'assets/pause.png');
  this.load.image('helpIcon', 'assets/help.png');

  this.load.image('eklavyaIcon', 'assets/eklavya.png');

}


/* =========================
   CREATE
========================= */
function create() {

  /* Background */
  const bg = this.add.image(720, 512, 'bg');
  bg.setDisplaySize(1440, 1024);
  
    this.headerText = this.add.text(
      720,     // center X
      120,     // top area
      'JUST DIVIDE',
      {
        fontFamily: 'Arial',
        fontSize: '48px',
        fontStyle: 'bold',
        color: '#2b2b2b',
        letterSpacing: '4px'
      }
    )
  .setOrigin(0.5)


  /* Header */
  this.add.image(720, 220, 'cat').setScale(0.9);

  this.add.image(560, 300, 'levelBadge');
  this.add.text(560, 300, 'LEVEL 1', {
    fontSize: '26px',
    fontStyle: 'bold',
    color: '#ffffff'
  }).setOrigin(0.5);

  this.add.image(880, 300, 'scoreBadge');
  this.score = 0;
  this.scoreText = this.add.text(880, 300, 'SCORE 0', {
    fontSize: '26px',
    fontStyle: 'bold',
    color: '#ffffff'
  }).setOrigin(0.5);

  /* Grid */
  const GRID_SIZE = 4;
  const SLOT_SIZE = 120;
  const GAP = 14;
  const startX = 720 - ((SLOT_SIZE * 4 + GAP * 3) / 2);
  const startY = 380;

  this.gridSlots = [];
  this.gridState = Array(16).fill(null);
  this.queue = [];
  for (let i = 0; i < 3; i++) {
    this.queue.push(generateTileValue());
  }

  renderQueue(this);
  spawnActiveFromQueue(this);



  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const x = startX + c * (SLOT_SIZE + GAP);
      const y = startY + r * (SLOT_SIZE + GAP);
      const slot = this.add.image(x, y, 'gridSlot');
      slot.setOrigin(0);
      slot.setDisplaySize(SLOT_SIZE, SLOT_SIZE);
      this.gridSlots.push(slot);
    }
  }

  /* Right panel */
  this.add.image(1080, 560, 'rightPanel');
  this.keepSlot = this.add.image(1080, 430, 'keepSlot');
  this.keepSlot.setInteractive();
  this.trashSlot = this.add.image(1080, 720, 'trashSlot');
  this.trashSlot.setInteractive();

  this.eklavyaIcon = this.add.image(
  1320,
  900,
  'eklavyaIcon'
)
.setScale(0.35)
.setDepth(6);



  /* Spawn first tile */
  // initialize queue with 3 tiles
  for (let i = 0; i < 3; i++) {
    this.queue.push(generateTileValue());
  }

  // render queue
  renderQueue(this);


  /* Drag */
  this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
    if (gameObject !== this.activeTile) return;
    gameObject.x = dragX;
    gameObject.y = dragY;
    this.activeText.x = dragX;
    this.activeText.y = dragY;
  });

  this.trashSlot.on('pointerdown', () => {

    // no trash left
    if (this.trashCount <= 0) return;

    // no active tile
    if (!this.activeTile) return;

    // consume trash
    this.trashCount--;
    this.trashText.setText('x' + this.trashCount);

    // remove active tile
    this.activeTile.destroy();
    this.activeText.destroy();
    this.activeTile = null;
    this.activeText = null;

    // advance queue
    this.queue.shift();
    this.queue.push(generateTileValue());

    renderQueue(this);
    spawnActiveFromQueue(this);
    
    checkGameOver(this);
  });
  this.pauseIcon = this.add.image(60, 60, 'pauseIcon')
  .setScale(0.6)
  .setDepth(100)
  .setInteractive({ useHandCursor: true });
  this.helpIcon = this.add.image(1380, 60, 'helpIcon')
  .setScale(0.6)
  .setDepth(100)
  .setInteractive({ useHandCursor: true }); 

  /* Drop */
  this.input.on('dragend', () => {
    let closest = -1;
    let minDist = 99999;

    this.gridSlots.forEach((slot, i) => {
      if (this.gridState[i]) return;
      const cx = slot.x + 60;
      const cy = slot.y + 60;
      const d = Phaser.Math.Distance.Between(
        this.activeTile.x,
        this.activeTile.y,
        cx,
        cy
      );
      if (d < minDist) {
        minDist = d;
        closest = i;
      }
    });

    if (closest !== -1 && minDist < 80) {
      const slot = this.gridSlots[closest];

      this.activeTile.x = slot.x + 60;
      this.activeTile.y = slot.y + 60;
      this.activeText.x = this.activeTile.x;
      this.activeText.y = this.activeTile.y;

      this.gridState[closest] = {
        value: Number(this.activeTile.value),
        tile: this.activeTile,
        text: this.activeText
      };

      this.activeTile.disableInteractive();

      while (tryMerge(this, closest)) {}

      this.activeTile = null;
      this.activeText = null;

      // spawn next tile (TEMP)
      const nextValues = [4, 6, 8, 12];
      const v = Phaser.Utils.Array.GetRandom(nextValues);
      // advance queue
      this.queue.shift();
      this.queue.push(generateTileValue());

      renderQueue(this);
      spawnActiveFromQueue(this);

      checkGameOver(this);

      this.queue.push(generateTileValue());
      renderQueue(this);

    } else {
      // return
      this.activeTile.x = 720;
      this.activeTile.y = 860;
      this.activeText.x = 720;
      this.activeText.y = 860;
    }
  });
  this.trashCount = 10;

  this.trashText = this.add.text(
    1080,
    760,
    'x10',
    {
      fontSize: '24px',
      fontStyle: 'bold',
      color: '#ffffff'
    }
  ).setOrigin(0.5).setDepth(7);

  this.keepSlot.on('pointerdown', () => {

    // no active tile → nothing to keep
    if (!this.activeTile) return;

    // KEEP is empty
    if (this.keepValue === null) {

      // store value
      this.keepValue = this.activeTile.value;

      // remove active tile
      this.activeTile.destroy();
      this.activeText.destroy();
      this.activeTile = null;
      this.activeText = null;

      // 🔴 ADVANCE QUEUE (missing before)
      this.queue.shift();
      this.queue.push(generateTileValue());

      renderQueue(this);
      renderKeep(this);
      if (checkGameOver(this)) return;
      spawnActiveFromQueue(this);
    }
 
    else {
      // SWAP
      const temp = this.keepValue;
      this.keepValue = this.activeTile.value;
      this.activeTile.value = temp;
      this.activeText.setText(this.activeTile.value);

      renderKeep(this);
    }
  });
  this.keepValue = null;
  this.keepTile = null;
  this.keepText = null;
}

/* =========================
   TILE SPAWNER
========================= */
function spawnActiveTile(scene, value) {
  scene.activeTile = scene.add.image(720, 860, 'tileBlue');
  scene.activeTile.setDisplaySize(110, 110);
  scene.activeTile.setDepth(5);
  scene.activeTile.setInteractive({ draggable: true });

  scene.activeTile.value = Number(value);

  scene.activeText = scene.add.text(
    scene.activeTile.x,
    scene.activeTile.y,
    String(scene.activeTile.value),
    {
      fontSize: '40px',
      fontStyle: 'bold',
      color: '#ffffff'
    }
  ).setOrigin(0.5).setDepth(6);
}

/* =========================
   MERGE HELPERS
========================= */
function getNeighbors(index) {
  const r = Math.floor(index / 4);
  const c = index % 4;
  const n = [];
  if (r > 0) n.push(index - 4);
  if (r < 3) n.push(index + 4);
  if (c > 0) n.push(index - 1);
  if (c < 3) n.push(index + 1);
  return n;
}

function tryMerge(scene, placedIndex) {
  const placed = scene.gridState[placedIndex];
  if (!placed) return false;

  for (const ni of getNeighbors(placedIndex)) {
    const neighbor = scene.gridState[ni];
    if (!neighbor) continue;

    const a = Number(placed.value);
    const b = Number(neighbor.value);

    // Equal
    if (a === b) {
      placed.tile.destroy();
      placed.text.destroy();
      neighbor.tile.destroy();
      neighbor.text.destroy();
      scene.gridState[placedIndex] = null;
      scene.gridState[ni] = null;
      scene.score += a * 2;
      scene.scoreText.setText(`SCORE ${scene.score}`);
      return true;
    }

    // placed bigger
    if (a > b && a % b === 0) {
      const r = a / b;
      neighbor.tile.destroy();
      neighbor.text.destroy();
      scene.gridState[ni] = null;
      if (r === 1) {
        placed.tile.destroy();
        placed.text.destroy();
        scene.gridState[placedIndex] = null;
      } else {
        placed.value = r;
        placed.text.setText(r);
      }
      scene.score += r * 2;
      scene.scoreText.setText(`SCORE ${scene.score}`);
      return true;
    }

    // neighbor bigger
    if (b > a && b % a === 0) {
      const r = b / a;
      placed.tile.destroy();
      placed.text.destroy();
      scene.gridState[placedIndex] = null;
      if (r === 1) {
        neighbor.tile.destroy();
        neighbor.text.destroy();
        scene.gridState[ni] = null;
      } else {
        neighbor.value = r;
        neighbor.text.setText(r);
      }
      scene.score += r * 2;
      scene.scoreText.setText(`SCORE ${scene.score}`);
      return true;
    }
  }
  return false;
}
function generateTileValue() {
  const values = [2, 3, 4, 6, 8, 12];
  return Phaser.Utils.Array.GetRandom(values);
}
function renderQueue(scene) {

  // destroy old previews
  if (scene.queueSprites) {
    scene.queueSprites.forEach(t => {
      t.tile.destroy();
      t.text.destroy();
    });
  }

  scene.queueSprites = [];

  // 🔴 ONLY SHOW 2 PREVIEW TILES
  const previewValues = scene.queue.slice(1, 3);

  // positions: side by side (middle right)
  const y = 560;
  const x1 = 1020;
  const x2 = 1140;

  previewValues.forEach((value, index) => {

    const x = index === 0 ? x1 : x2;

    const tile = scene.add.image(x, y, 'tileBlue')
      .setDisplaySize(90, 90)
      .setDepth(5);

    const text = scene.add.text(
      x,
      y,
      String(value),
      {
        fontSize: '32px',
        fontStyle: 'bold',
        color: '#ffffff'
      }
    ).setOrigin(0.5).setDepth(6);

    scene.queueSprites.push({ tile, text });
  });
}


function makeTileActive(scene, tile, text, value) {

  scene.activeTile = tile;
  scene.activeText = text;
  scene.activeTile.value = Number(value);

  tile.setInteractive({ draggable: true });

  scene.input.setDraggable(tile);
}
function spawnActiveFromQueue(scene) {

  const value = scene.queue[0];

  const x = 720;
  const y = 820;

  const tile = scene.add.image(x, y, 'tileBlue')
    .setDisplaySize(100, 100)
    .setDepth(10)
    .setInteractive();

  const text = scene.add.text(
    x,
    y,
    String(value),
    {
      fontSize: '36px',
      fontStyle: 'bold',
      color: '#ffffff'
    }
  ).setOrigin(0.5).setDepth(11);

  tile.value = value;

  scene.activeTile = tile;
  scene.activeText = text;

  scene.input.setDraggable(tile);
}

function renderKeep(scene) {

  if (scene.keepTile) {
    scene.keepTile.destroy();
    scene.keepText.destroy();
  }

  if (scene.keepValue === null) return;

  scene.keepTile = scene.add.image(1080, 430, 'tileBlue')
    .setDisplaySize(90, 90)
    .setDepth(6);

  scene.keepText = scene.add.text(
    1080,
    430,
    String(scene.keepValue),
    {
      fontSize: '32px',
      fontStyle: 'bold',
      color: '#ffffff'
    }
  ).setOrigin(0.5).setDepth(7);
}
function isGridFull(scene) {
  return scene.gridState.every(cell => cell !== null);
}
function hasAnyValidMerge(scene) {
  console.log(
    'Has merge?',
    hasAnyValidMerge(scene)
  );

  for (let i = 0; i < scene.gridState.length; i++) {
    const cell = scene.gridState[i];
    if (!cell) continue;

    const a = Number(cell.value);

    for (const ni of getNeighbors(i)) {
      const n = scene.gridState[ni];
      if (!n) continue;

      const b = Number(n.value);

      // equal merge always valid
      if (a === b) return true;

      // division merge BUT result must not be 1
      if (a > b && a % b === 0 && a / b !== 1) return true;
      if (b > a && b % a === 0 && b / a !== 1) return true;
    }
  }
  return false;
}

function checkGameOver(scene) {

  if (!isGridFull(scene)) return false;
  if (hasAnyValidMerge(scene)) return false;

  showGameOver(scene);
  return true;
}


function showGameOver(scene) {

  // stop all interaction
  scene.input.enabled = false;

  // dim background
  scene.add.rectangle(
    720,
    512,
    1440,
    1024,
    0x000000,
    0.6
  ).setDepth(1000);

  // GAME OVER PNG
  scene.add.image(
    720,
    512,
    'gameOver'
  ).setDepth(1001);
}








