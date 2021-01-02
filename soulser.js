var config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
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
var stars;
var platforms;
var bomb;
var cursors;
var score = 0;
var scoreText;
var gameOver = false;


var playerSpeed = 160

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
    
    // CREATES PLATFORMS, STATIC OBJECTS
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
    player = this.physics.add.sprite(100, 450, 'dude');

    //player.body.setGravityY(300)     to give gravity to a sprite

    //player.setBounce(0.2);        to make sprite bounce
    player.setCollideWorldBounds(true);

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


    cursors = this.input.keyboard.createCursorKeys(); // Cursor goes in create, movement definition goes in update
    wasd = {
        up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
        down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
        left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
        right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
        sprint: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT)
    };
}

function update ()
{
    if (gameOver)
    {
        return;
    }
    
    playerMovement();
    
    
}





function playerMovement()
{
    var horizontalMove = false;
    var verticalMove = false;
    var moveSpeed = playerSpeed

    player.setVelocity(0);

    // Determine velocity when moving diagonally
    if (cursors.right.isDown || cursors.left.isDown || wasd.left.isDown || wasd.right.isDown)
    {
        horizontalMove = true;
    }
    if (cursors.up.isDown || cursors.down.isDown || wasd.up.isDown || wasd.down.isDown)
    {
        verticalMove = true;
    }
    if (horizontalMove && verticalMove)
    {
        moveSpeed = playerSpeed * Math.cos(0.25 * Math.PI);
    }

    // Determine if sprinting
    if (wasd.sprint.isDown)
    {
        moveSpeed *= 2;
    }

    // Determine vertical movementspeed
    if (cursors.up.isDown || wasd.up.isDown){
        player.setVelocityY(-moveSpeed);
    }
    else if (cursors.down.isDown || wasd.down.isDown){
        player.setVelocityY(moveSpeed);
    }

    // Determine horizontal movementspeed
    if (cursors.right.isDown || wasd.right.isDown){
        player.setVelocityX(moveSpeed);
        player.anims.play('right', true);
    }
    else if (cursors.left.isDown || wasd.left.isDown){
        player.setVelocityX(-moveSpeed);
        player.anims.play('left', true);
    }
    else{
        player.anims.play('turn', true);
    }
}