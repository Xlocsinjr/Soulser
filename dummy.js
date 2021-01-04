class Dummy extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y, sprite)
    {
        super(scene, x, y, sprite);

        this.health = 20000;

        scene.add.existing(this);
        scene.physics.add.existing(this);


    }
}