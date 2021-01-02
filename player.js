class Player {
    static PLAYERSPEED = 160;
    static MAX_HEALTH_DEFAULT = 20000;
    static MAX_STAMINA_DEFAULT = 20000;
    static MAX_MAGICPOINTS_DEFAULT = 20000;

    playerSprite;

    maxHealth;
    health;
    maxStamina;
    stamina;
    maxMagicpoints;
    magicpoints;
    movementSpeed;

    isDodging;
    isSprinting;

    constructor (sprite){
        // assigns a sprite to the player
        this.playerSprite = sprite;

        // Assigns default values to attributes on creation
        this.maxHealth = MAX_HEALTH_DEFAULT;
        this.health = MAX_HEALTH_DEFAULT;
        this.maxStamina = MAX_STAMINA_DEFAULT;
        this.stamina = MAX_STAMINA_DEFAULT;
        this.maxMagicpoints = MAX_MAGICPOINTS_DEFAULT;
        this.magicpoints = MAX_MAGICPOINTS_DEFAULT;
        this.movementSpeed = 0;

        this.isDodging = false;
        this.isSprinting = false;


    }

    playerMovement()
    {
    var horizontalMove = false;
    var verticalMove = false;
    this.movementspeed = PLAYERSPEED;

    this.playerSprite.setVelocity(0);

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
        this.playerSprite.setVelocityY(-this.movementspeed);
    }
    else if (cursors.down.isDown || wasd.down.isDown){
        this.playerSprite.setVelocityY(this.movementspeed);
    }

    // Determine horizontal movementspeed
    if (cursors.right.isDown || wasd.right.isDown){
        this.playerSprite.setVelocityX(this.movementspeed);
        this.playerSprite.anims.play('right', true);
    }
    else if (cursors.left.isDown || wasd.left.isDown){
        this.playerSprite.setVelocityX(-this.movementspeed);
        this.playerSprite.anims.play('left', true);
    }
    else{
        this.playerSprite.anims.play('turn', true);
    }
}
}