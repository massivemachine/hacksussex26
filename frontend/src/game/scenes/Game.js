import { Scene } from 'phaser';

export class Game extends Scene
{
    constructor ()
    {
        super({
            key: 'Game',
            physics: {
                default: 'arcade',
                arcade: {
                    debug: false
                }
            }
        });
    }

    create ()
    {
        const background = this.physics.add.sprite(650, 375, 'gatwick_background');
        const monitor = this.add.image(650, 383, 'monitor');

        background.setDisplaySize(1240, 705);
        monitor.setDisplaySize(1305, 780);
        monitor.setDepth(90);

        // notes logic
        const notes = this.add.sprite(250, 1020, 'notes').setScale(0.25).setInteractive();
        notes.setDepth(100);

        notes.on('pointerover', () => {
            this.tweens.add({
                targets: notes,
                y: 1000,
                duration: 200,
                ease: 'Back'
            });
        });

        notes.on('pointerout', () => {
            this.tweens.add({
                targets: notes,
                y: 1020,
                duration: 200,
                ease: 'Back'
            });
        });

        notes.on('pointerdown', () => {
            this.tweens.add({
                targets: notes,
                y: 500,
                duration: 200,
                ease: 'Back'
            });
        });

        // exit button logic
        const exitButton = this.add.text(1200, 675, 'X', {
            fontFamily: 'Arial Black', fontSize: 75, color: '#c63535ff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        exitButton.setDepth(100);
        exitButton.setInteractive();

        exitButton.on('pointerover', function(){
            this.setStyle({ fill: '#e40808ff'});
        })

        exitButton.on('pointerout', function(){
            this.setStyle({ fill: '#c63535ff'});
        })

        exitButton.on('pointerdown', () => {
            this.scene.start('MainMenu');
        });

        // plane spawning logic
        this.spawnPoints = [
            { x: 0, y: 300 },
            { x: 0, y: 500 },
            { x: 0, y: 700 },
            { x: 1300, y: 300 },
            { x: 1300, y: 500 },
            { x: 1300, y: 700 }
        ];

        // spawn location visualisation
        /*
        const spawnPoint = this.add.text(0, 100, 'X', {
            fontFamily: 'Arial Black', fontSize: 25, color: '#c63535ff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);
        */        

        this.time.addEvent({
            delay: 2000,
            callback: this.spawnPlane,
            callbackScope: this
        });

        this.planeDict = [];

        fetch("http://10.1.135.19:5000/flightdata")
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error: ${response.status}`);
                }

                return response.text();
            })
            .then((text) => {
                this.planeDict = text;
            })
            .catch((error) => {
                console.log("error");
            });
        
        this.rightSide = false;
        this.leftSide = false;
    
    }

    spawnPlane () {
        const point = Phaser.Utils.Array.GetRandom(this.spawnPoints);
        console.log(point.x);
        console.log(this.leftSide);
        console.log(this.rightSide);

        if ((point.x == 0 && !this.leftSide) || (point.x != 0 && !this.rightSide)) {
            const plane = this.physics.add.sprite(point.x, point.y, 'plane_sprite');
            plane.setDisplaySize(50, 50);
            plane.setOrigin(0, 0);
            plane.setVelocityY(25);

            var cleared = false;

            if (point.x == 0) {
                this.leftSide = true;
            } else {
                this.rightSide = true;
            }

            // textbox and landing button logic
            let textbox, allowLanding, denyLanding;
            if (point.x !== 0) {
                textbox = this.add.sprite(1030, 140, 'textbox').setScale(0.45).setAlpha(0.9);
                allowLanding = this.add.image(970, 260, 'allow').setScale(0.15).setInteractive();
                denyLanding = this.add.image(1090, 265, 'deny').setScale(0.15).setInteractive();
            } else {
                textbox = this.add.sprite(270, 140, 'textbox').setScale(0.45).setAlpha(0.9);
                allowLanding = this.add.image(200, 260, 'allow').setScale(0.15).setInteractive();
                denyLanding = this.add.image(320, 265, 'deny').setScale(0.15).setInteractive();
            }

            // helper that removes the UI
            const clearDecisionUI = () => {
                textbox.destroy();
                allowLanding.destroy();
                denyLanding.destroy();
            };

            // shared constants
            const runwayX = 235;
            const runwayY = 490;
            const landingX = 760;
            const landingY = 390;
            const planeSpeed = 40;

            // line plane up to runway and wait for plane to reach point
            this.physics.moveTo(plane, runwayX, runwayY, planeSpeed);
            const runwayAngle = Phaser.Math.Angle.Between(plane.x, plane.y, runwayX, runwayY) + Math.PI/2;
            plane.setRotation(runwayAngle);

            const distanceToRunway = Phaser.Math.Distance.Between(plane.x, plane.y, runwayX, runwayY);
            const travelTimeMs = (distanceToRunway / Math.max(planeSpeed, 1)) * 1000;

            this.time.delayedCall(Math.max(0, Math.round(travelTimeMs)), () => {
                if (!plane.active) return;
                this.physics.moveTo(plane, landingX, landingY, planeSpeed);
                const landingAngle = Phaser.Math.Angle.Between(plane.x, plane.y, landingX, landingY) + Math.PI/2;
                plane.setRotation(landingAngle);

                const distanceToLanding = Phaser.Math.Distance.Between(plane.x, plane.y, landingX, landingY);
                const landingTimeMs = (distanceToLanding / Math.max(planeSpeed, 1)) * 1000;

                this.time.delayedCall(Math.max(0, Math.round(landingTimeMs)), () => {
                    if (!plane.active) return;
                    if (plane.body) {
                        plane.body.velocity.x = 0;
                        plane.body.velocity.y = 0;
                        plane.body.moves = false;
                    }
                    plane.setPosition(landingX, landingY);

                    if (!cleared) {
                        this.scene.start('GameOver');
                    }
                    cleared = false;

                    this.time.delayedCall(5000, () => {
                        if (plane.active) {
                            plane.destroy();
                        }
                    }, [], this);
                }, [], this);
            }, [], this);

            allowLanding.on('pointerdown', () => {
                clearDecisionUI();

                // free spawn side for a new aircraft
                if (point.x === 0) {
                    this.leftSide = false;
                } else {
                    this.rightSide = false;
                }

                cleared = true;

            });

            denyLanding.on('pointerdown', () => {
                clearDecisionUI();

                // send plane off screen
                const offscreenX = point.x === 0 ? -200 : 1500;
                const offscreenY = point.y;
                const turnAngle = Phaser.Math.Angle.Between(plane.x, plane.y, offscreenX, offscreenY) + Math.PI / 2;
                plane.setRotation(turnAngle);
                this.physics.moveTo(plane, offscreenX, offscreenY, planeSpeed);

                // free spawn side for a new aircraft
                if (point.x === 0) {
                    this.leftSide = false;
                } else {
                    this.rightSide = false;
                }

                this.time.delayedCall(3000, () => {
                    plane.destroy();
                }, [], this);
            });
            
        }

        this.time.addEvent({
            delay: Phaser.Math.Between(10000, 15000),
            callback: this.spawnPlane,
            callbackScope: this,
        });
    }

}