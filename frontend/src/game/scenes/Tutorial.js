import { Scene } from 'phaser';

export class Tutorial extends Scene
{
    constructor ()
    {
        super('Tutorial');
    }

    create ()
    {

        this.add.image(650, 385, 'tutorial_background').setScale(0.51);

        this.input.once('pointerdown', () => {

            this.scene.start('Game');

        });
    }
}
