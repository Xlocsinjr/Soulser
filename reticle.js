class Reticle extends Phaser.Physics.Arcade.Sprite{
    deltaX;
    deltaY;
    playerAnchor;

    constructor (scene, texture, spriteAnchor){
        // constructs via constructor of sprite. places reticle on the spriteAnchor
        super(scene, spriteAnchor.x, spriteAnchor.y, texture);

        // sets deltas to 0: coords of playerAnchor and reticle are same on initialisation
        this.deltaX = 0;
        this.deltaY = 0;

        // adds the reticle to the scene
        scene.add.existing(this);
        scene.physics.add.existing(this);   // NOTE: is this still necessary for the reticle???

        this.setCollideWorldBounds(false);

        // assigns the reticle to the given player sprite
        this.playerAnchor = spriteAnchor;
    }

    limitReticleDistance()
    {
        // Ensures reticle cannot be moved further than dist(radius) from player
        var distBetween = Phaser.Math.Distance.Between(this.playerAnchor.x, this.playerAnchor.y, this.x, this.y);
        if (distBetween > RETICLE_MAX_DISTANCE)
        {
            // Place reticle on perimeter of circle on line intersecting player & reticle
            var scale = distBetween/RETICLE_MAX_DISTANCE;

            this.x = this.playerAnchor.x + (this.deltaX)/scale;
            this.y = this.playerAnchor.y + (this.deltaY)/scale;
        }

    }

    reticleMovement()
    {
        // Makes the reticle move along with the player
        this.x = this.playerAnchor.x + this.deltaX;
        this.y = this.playerAnchor.y + this.deltaY;
    }

    

    reticlePointing(pointer)
    // Defines what happens on mouse pointer move
    {   
        // Move reticle with mouse
        this.x += pointer.movementX;
        this.y += pointer.movementY;

        this.limitReticleDistance()
        
        // Update deltas when the reticle moves
        this.deltaX = this.x-this.playerAnchor.x;
        this.deltaY = this.y-this.playerAnchor.y;

        
    }
}