import { Scene } from 'phaser';

export class MainMenu extends Scene
{

    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        this.background = this.add.tileSprite(675, 360, 0, 0, 'background');
        this.add.image(675, 200, 'logo');
        this.add.sprite(675, 580, 'plane');

        const menuText = this.add.text(675, 440, 'Main Menu', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        menuText.setInteractive();

        menuText.on('pointerdown', () => {
            this.scene.start('Game');
        });
    }

    update ()
    {
        this.background.tilePositionX += 8
    }

}
