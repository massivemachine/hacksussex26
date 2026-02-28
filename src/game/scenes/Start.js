export class Start extends Phaser.Scene {

    constructor() {
        super('Start');
    }

    preload() {
        this.load.image('background', 'assets/runway.jpg');
        this.load.image('logo', 'assets/LGW_airport_logo.svg');

        //  The ship sprite is CC0 from https://ansimuz.itch.io - check out his other work!
        this.load.spritesheet('plane', 'assets/plane.png', { frameWidth: 335, frameHeight: 150 });
    }

    create() {
        this.background = this.add.tileSprite(640, 360, 0, 0, 'background');

        const logo = this.add.image(640, 200, 'logo');

        const plane = this.add.sprite(640, 580, 'plane');

        plane.anims.create({
            key: 'fly',
            frames: this.anims.generateFrameNumbers('plane', { start: 0, end: 2 }),
            frameRate: 15,
            repeat: -1
        });

        plane.play('fly');

        //this.tweens.add({
        //    targets: plane,
        //    y: 400,
        //    duration: 1500,
            //ease: 'Sine.inOut',
            //yoyo: true,
        //    loop: -1
        //});
    }

    update() {
        this.background.tilePositionX += 10;
    }
    
}
