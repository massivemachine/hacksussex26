import { Scene } from 'phaser';

export class Game extends Scene
{
    constructor ()
    {
        super('Game');
    }

    create ()
    {
        const background = this.add.sprite(650, 375, 'gatwick_background');
        const monitor = this.add.image(650, 383, 'monitor');

        background.setDisplaySize(1240, 705);
        monitor.setDisplaySize(1305, 780);

        const exitButton = this.add.text(1200, 675, 'X', {
            fontFamily: 'Arial Black', fontSize: 75, color: '#c63535ff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        exitButton.setInteractive();

        exitButton.on('pointerover', function(){
            this.setStyle({ fill: '#e40808ff'});
        })

        exitButton.on('pointerout', function(){
            this.setStyle({ fill: '#c63535ff'});
        })

        this.input.once('pointerdown', () => {
            this.scene.start('MainMenu');
        });
    }
}
