import { Scene } from 'phaser';

export class Game extends Scene
{
    constructor ()
    {
        super('Game');
    }

    create ()
    {
        this.add.image(650, 384, 'gatwick_background');

        this.input.once('pointerdown', () => {

            this.scene.start('GameOver');

        });
    }
}
