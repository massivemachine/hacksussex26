import { Scene } from 'phaser';

export class MainMenu extends Scene
{

    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        this.background = this.add.tileSprite(675, 360, 0, 0, 'runway_background');
        this.add.image(650, 200, 'logo');
        this.add.sprite(650, 580, 'plane');

        const menuText = this.add.text(675, 430, 'Start', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        menuText.setInteractive();

        menuText.on('pointerover', function(){
            this.setStyle({ fill: 'rgba(215, 215, 215, 1)'});
        })

        menuText.on('pointerout', function(){
            this.setStyle({ fill: '#ffffffff'});
        })

        menuText.on('pointerdown', () => {
            this.scene.start('Game');
        });
    }

    update ()
    {
        this.background.tilePositionX += 8
    }

}
