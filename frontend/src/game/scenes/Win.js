import { Scene } from 'phaser';

export class Win extends Scene
{
    constructor ()
    {
        super('Win');
    }

    create ()
    {
        this.cameras.main.setBackgroundColor(0x90EE90);

        this.add.image(650, 384, 'runway_background').setAlpha(0.5);

        this.add.text(650, 384, 'Congratulations, you successfully landed all planes!', {
            fontFamily: 'Arial Black', fontSize: 40, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        this.input.once('pointerdown', () => {

            this.scene.start('MainMenu');

        });
    }
}
