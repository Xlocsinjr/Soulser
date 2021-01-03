const PLAYERSPEED = 150;
const PLAYER_MAX_HEALTH_DEFAULT = 20000;
const PLAYER_MAX_STAMINA_DEFAULT = 20000;
const PLAYER_MAX_MAGICPOINTS_DEFAULT = 20000;

class Player extends Phaser.Physics.Arcade.Sprite{
    maxHealth;
    health;
    maxStamina;
    stamina;
    maxMagicpoints;
    magicpoints;
    movementSpeed;

    isDodging;
    isSprinting;

    constructor (scene, x, y, texture){
        super(scene, x, y, texture);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Assigns default values to attributes on creation
        this.maxHealth = PLAYER_MAX_HEALTH_DEFAULT;
        this.health = PLAYER_MAX_HEALTH_DEFAULT;
        this.maxStamina = PLAYER_MAX_STAMINA_DEFAULT;
        this.stamina = PLAYER_MAX_STAMINA_DEFAULT;
        this.maxMagicpoints = PLAYER_MAX_MAGICPOINTS_DEFAULT;
        this.magicpoints = PLAYER_MAX_MAGICPOINTS_DEFAULT;
        this.movementSpeed = 0;

        this.isDodging = false;
        this.isSprinting = false;

        //player.body.setGravityY(300)     to give gravity to a sprite

        //player.setBounce(0.2);        to make sprite bounce
        this.setCollideWorldBounds(true);


    }

    playerMovement()
    {
    var horizontalMove = false;
    var verticalMove = false;
    this.movementspeed = PLAYERSPEED;

    this.setVelocity(0);

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
        this.movementspeed = PLAYERSPEED * Math.cos(0.25 * Math.PI);
    }

    // Determine if sprinting
    if (wasd.sprint.isDown)
    {
        this.isSprinting = true;
        this.movementspeed *= 2;
    }
    else
    {
        this.isSprinting = false;
    }

    // Determine vertical movementspeed
    if (cursors.up.isDown || wasd.up.isDown){
        this.setVelocityY(-this.movementspeed);
    }
    else if (cursors.down.isDown || wasd.down.isDown){
        this.setVelocityY(this.movementspeed);
    }

    // Determine horizontal movementspeed
    if (cursors.right.isDown || wasd.right.isDown){
        this.setVelocityX(this.movementspeed);
        this.anims.play('right', true);
    }
    else if (cursors.left.isDown || wasd.left.isDown){
        this.setVelocityX(-this.movementspeed);
        this.anims.play('left', true);
    }
    else{
        this.anims.play('turn', true);
    }
}
}