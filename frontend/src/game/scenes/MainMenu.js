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
        this.add.image(650, 140, 'logo').setScale(0.7);
        this.add.sprite(650, 580, 'plane');

        const titleText = this.add.text(675, 300, 'Cleared for Landing', {
            fontFamily: 'Arial Black', fontSize: 45, color: '#074aaeff', //#1a4384 <- gatwick logo colour
            stroke: '#0000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        // start button logic
        const startButton = this.add.text(675, 430, 'Start', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        startButton.setInteractive();

        startButton.on('pointerover', function(){
            this.setStyle({ fill: 'rgba(215, 215, 215, 1)'});
        })

        startButton.on('pointerout', function(){
            this.setStyle({ fill: '#ffffffff'});
        })

        startButton.on('pointerdown', () => {
            this.scene.start('Game');
        });

        // music logic
        let music = this.sound.get('main_theme');
        if (!music) {
            music = this.sound.add('main_theme', { loop: true });
            music.play();
        }

        const volume = this.add.image(50, 50, 'volume').setScale(0.05).setInteractive();
        let isMuted = this.registry.get('isMuted') || false;

        if (isMuted) {
            music.pause();
            volume.setTexture('mute');
        }

        volume.on('pointerdown', () => {
            isMuted = !isMuted;
            this.registry.set('isMuted', isMuted);

            if (isMuted) {
                music.pause();
                volume.setTexture('mute');
            } else {
                music.resume();
                volume.setTexture('volume');
            }
        });

    }

    update ()
    {
        this.background.tilePositionX += 8
    }

}
