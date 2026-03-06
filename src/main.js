import Phaser from "phaser";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 700,
  backgroundColor: "#87CEEB",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  },
  scale: {
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }

}

let bhuvanesh;
let sridhar;
let score = 0;
let start = false;
let scoreText;
let startText;
let playmusic;
let endtext;


function preload() {
  this.load.image("bhu", "/assets/bhu.png");
  this.load.image("background", "/assets/Background8.png")
  this.load.image("sridhar", "/assets/Screenshot 2026-03-06 103913.png");
  this.load.spritesheet("explosion", "/assets/SpriteSheet.png", { frameWidth: 32, frameHeight: 32 });
  this.load.audio("gaand", "/assets/teri-gand-mari.mp3")
  this.load.audio("play", "/assets/play.mp3")
}

function spawnSridhar(scene) {

  const gap = 300;
  const sridharY = Phaser.Math.Between(100, 400);

  const topPipe = sridhar.create(800, sridharY - gap / 2, "sridhar")
    .setOrigin(0, 1)
    .setFlipY(true)
    .setScale(0.7);

  const bottomPipe = sridhar.create(800, sridharY + gap / 2, "sridhar")
    .setOrigin(0, 0)
    .setScale(0.7);

  topPipe.body.allowGravity = false;
  bottomPipe.body.allowGravity = false;

  topPipe.setVelocityX(-200);
  bottomPipe.setVelocityX(-200);

  topPipe.refreshBody();
  bottomPipe.refreshBody();

  const scoreZone = scene.add.zone(800, sridharY, 1, gap).setOrigin(0, 0.5);
  scene.physics.add.existing(scoreZone);
  scoreZone.body.allowGravity = false;
  scoreZone.body.setVelocityX(-200);

  scene.physics.add.overlap(bhuvanesh, scoreZone, () => {
    score++;
    scoreText.setText("Score:" + score);
    scoreZone.destroy();

  })

}

function create() {
  //background
  const screenCenterX = this.cameras.main.centerX;
  const screenCenterY = this.cameras.main.centerY;
  this.add.image(screenCenterX, screenCenterY, "background").setDisplaySize(800, 600);

  //bhuvanesh
  bhuvanesh = this.physics.add.image(100, 450, "bhu").setScale(.4);
  bhuvanesh.setCollideWorldBounds(true);
  this.input.keyboard.on("keydown-SPACE", () => {
    bhuvanesh.setVelocityY(-200);
  })

  //sridhar
  sridhar = this.physics.add.group();

  //explosion
  this.anims.create({
    key: "explode",
    frames: this.anims.generateFrameNumbers("explosion", { start: 0, end: 6 }),
    frameRate: 10,
    hideOnComplete: false
  })

  //collision
  this.physics.add.collider(bhuvanesh, sridhar, () => {
    playmusic.stop();
    bhuvanesh.setVelocity(0, 0);
    bhuvanesh.setVisible(false);
    const boom = this.add.sprite(bhuvanesh.x, bhuvanesh.y, "explosion").setScale(3);
    boom.play("explode");
    this.sound.play("gaand");
    this.cameras.main.shake(200, 0.01);
    this.time.delayedCall(400, () => {
      this.physics.pause();
    });

    endtext = this.add.text(100, 300, "HAPPY BIRTHDAY BHU!", { fontSize: "48px", fill: "#220afba5", backgroundColor: "#fff" })

  })
  //scoretext
  scoreText = this.add.text(16, 16, "Score:0", { fontSize: "32px", fill: "#000" })

  //start text
  startText = this.add.text(
    screenCenterX,
    screenCenterY,
    "Happy Birthday Bhu! \nClick to start",
    {
      fontSize: "32px",
      fill: "#1920f3",
      backgroundColor: "#53e726"
    }
  )
    .setOrigin(0.5)
    .setInteractive()

  startText.on("pointerdown", () => {
    start = true,
      startText.setVisible(false);
    playmusic.play();
    //sridharspawn
    this.time.addEvent({
      delay: 1500,
      callback: () => spawnSridhar(this),
      loop: true
    });
  });

  //music
  playmusic = this.sound.add("play", {
    loop: true,
    volume: 0.5
  });
}

function update() {
  sridhar.getChildren().forEach(pipe => {
    if (pipe.x < -100) {
      pipe.destroy();
    }
  });
}

new Phaser.Game(config);