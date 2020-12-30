var config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
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
    this.add.image(400, 300, 'star');

    
    // CREATES PLATFORMS, STATIC OBJECTS
    platforms = this.physics.add.staticGroup();

    platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    // The call to refreshBody() is required because we have scaled a static physics body, so we have to tell the physics world about the changes we made.

    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');
    
    for (var i = 0; i < 40; i++)
    {
        platforms.create(i*32 + 16, 22*32 - 16, 'ground');
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


    stars = this.physics.add.group({
        key: 'star',
        repeat: 11,     // 12 total
        setXY: { x: 12, y: 0, stepX: 70 }
    });
    
    // iterates through all children of group stars to give random bounceY
    stars.children.iterate(function (child) {
    
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    
    });

    bombs = this.physics.add.group();

    


    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    this.physics.add.collider(player, platforms);
    this.physics.add.collider(stars, platforms);
    this.physics.add.collider(bombs, platforms);
    this.physics.add.collider(player, bombs, hitBomb, null, this);

    // check if player overlaps with stars, if true: execute collectStar function
    this.physics.add.overlap(player, stars, collectStar, null, this);

    cursors = this.input.keyboard.createCursorKeys(); // Cursor goes in create, movement definition goes in update
}

function update ()
{
    if (gameOver)
    {
        return;
    }
    
    if (cursors.left.isDown)
    {
        player.setVelocityX(-160);

        player.anims.play('left', true);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(160);

        player.anims.play('right', true);
    }
    else
    {
        player.setVelocityX(0);

        player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down)
    {
        player.setVelocityY(-330);
    }
}

function collectStar (player, star)
{
    // disables star body
    star.disableBody(true, true);

    score += 10;
    scoreText.setText('Score: ' + score);

    if (stars.countActive(true) === 0)      // countActive counts how many stars are still active
    {
        stars.children.iterate(function (child) {

            child.enableBody(true, child.x, 0, true, true); 
            // reenables stars, set x to current x (?), set y to 0, ?? ??

        });

        // random x coords for bombs
        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        // creates bomb
        var bomb = bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);

    }
}

function hitBomb (player, bomb)
{
    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play('turn');

    gameOver = true;
}