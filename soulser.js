const GAMEWIDTH = 1280;
const GAMEHEIGHT = 720;
const CAMERA_ZOOM = 1.5;
const RETICLE_MAX_DISTANCE = 400;

var config = {
    type: Phaser.AUTO,
    width: GAMEWIDTH,
    height: GAMEHEIGHT,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var player;
var reticle;
var stars;
var platforms;
var bomb;
var cursors;
var score = 0;
var scoreText;
var gameOver = false;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('BG', 'assets/bgtest.png');
    this.load.image('ground', 'assets/groundblocktest.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('dude', 
        'assets/dude.png',
        { frameWidth: 32, frameHeight: 48 }
    );
}

function create ()
{
    // CREATES BACKGROUND =====================================================================================
    this.add.image(0, 0, 'BG').setOrigin(0,0);
    this.add.image(1280, 0, 'BG').setOrigin(0,0);
    this.add.image(0, 720, 'BG').setOrigin(0,0);
    this.add.image(1280, 720, 'BG').setOrigin(0,0);
    
    // Creates platforms, static objects
    platforms = this.physics.add.staticGroup();

    platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    // The call to refreshBody() is required because we have scaled a static physics body, so we have to tell the physics world about the changes we made.

    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');
    
    for (var i = 0; i < 40; i++)
    {
        platforms.create(i*32 + 16, 16, 'ground');
        platforms.create(i*32 + 16, 22*32 + 720 - 16, 'ground');
    }


    // CREATES THE PLAYER =====================================================================================
    // creates sprite called player
    //player = this.physics.add.sprite(new Player(100, 450, 'dude'));
    player = new Player(this, 640, 360, 'dude');

    // defines animations of player
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),      // uses frames 0,1,2 and 3 from the spritesheet
        frameRate: 10,
        repeat: -1      // repeat -1 means to loop the animation
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });


    // Adds player with platforms collision
    this.physics.add.collider(player, platforms);

    // =========================== ADDS DUMMY =======================================================
    dummy = new Dummy(this, 840, 360, 'dude');
    // dummy animation
    dummy.anims.play('turn', true);


    // =========================== DEFINES CONTROLS ==================================================
    cursors = this.input.keyboard.createCursorKeys(); // Cursor goes in create, movement definition goes in update
    wasd = {
        up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
        down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
        left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
        right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
        sprint: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT)
    };

    // ========================= RETICLE AND CAMERA ================================================
    // determines camera zoom
    this.cameras.main.zoom = CAMERA_ZOOM;

    // Locks pointer on mousedown
    game.canvas.addEventListener('mousedown', function () {
        game.input.mouse.requestPointerLock();
    });

    // Exit pointer lock when Q or escape (by default) is pressed.
    this.input.keyboard.on('keydown_Q', function (event) {
        if (game.input.mouse.locked)
            game.input.mouse.releasePointerLock();
    }, 0, this);

    // creates the reticle object
    reticle = new Reticle(this, 'star', player);

    // defines reticle properties
    reticle.setOrigin(0.5, 0.5).setDisplaySize(25, 25);


    // Move reticle upon locked pointer move
    this.input.on('pointermove', function (pointer) {
        if (this.input.mouse.locked)
        {
            reticle.reticleMovement();
            reticle.reticlePointing(pointer);
        }
    }, this);
    
}

function update ()
{
    if (gameOver)
    {
        return;
    }

    // Camera position is average between reticle and player positions
    avgX = ((player.x+reticle.x)/2)-(GAMEWIDTH/2);
    avgY = ((player.y+reticle.y)/2)-(GAMEHEIGHT/2);
    this.cameras.main.scrollX = avgX;
    this.cameras.main.scrollY = avgY;
    
    // Update player movement
    player.playerMovement();

    // Update reticle movement
    reticle.reticleMovement();

    
    
    
    
    
}












function hitDetection()
{

}