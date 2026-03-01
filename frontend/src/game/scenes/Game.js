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

        fetch("http://10.1.214.126:5000/flightdata")
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error: ${response.status}`);
                }
                //console.log(response.text())
                var responsejson = response.json()
                console.log(responsejson)
                return responsejson;
            })
            .then((text) => {
                this.planeDict = text["data"];
                console.log(this.planeDict)
            })
            .catch((error) => {
                console.log("error");
            });
        
        this.rightSide = false;
        this.leftSide = false;

        this.planeStats = [
            {"type":"Commercial", "altitude":2700, "gspeed":175, "fuel":180, "glideangle":3, "transmission":"30m late, no other issues. Over.", "solution":"clear"},
            {"type":"Light", "altitude":3300, "gspeed":80, "fuel":50, "glideangle":3, "transmission":"Clear for Gatwick landing? Over.", "solution":"clear"},
            {"type":"Commercial", "altitude":3000, "gspeed":170, "fuel":210, "glideangle":3, "transmission":"Ill passenger, request LGW priority.", "solution":"clear"},
            {"type":"Commercial", "altitude":3200, "gspeed":165, "fuel":140, "glideangle":3, "transmission":"Heavy headwind, arrival adjusted. Over.", "solution":"clear"},
            {"type":"light", "altitude":2600, "gspeed":75, "fuel":12, "glideangle":3, "transmission":"Request touch and go, Runway 26L.", "solution":"clear"},
            {"type":"Commercial", "altitude":3900, "gspeed":182, "fuel":240, "glideangle":3, "transmission":"Descending, smooth ride so far. Over.", "solution":"clear"},
            {"type":"Light", "altitude":3100, "gspeed":72, "fuel":45, "glideangle":3, "transmission":"Final fixed, gear down and locked.", "solution":"clear"},
            {"type":"Commercial", "altitude":2850, "gspeed":155, "fuel":95, "glideangle":3, "transmission":"Minor turbulence, staying at 2850.", "solution":"clear"},
            {"type":"Light", "altitude":3500, "gspeed":78, "fuel":30, "glideangle":3, "transmission":"VFR active, sightseeing the M23. Over.", "solution":"clear"},
            {"type":"Commercial", "altitude":3400, "gspeed":170, "fuel":110, "glideangle":3, "transmission":"Medical priority: Allergy. Over.", "solution":"clear"},
            {"type":"Light", "altitude":2700, "gspeed":70, "fuel":8, "glideangle":3, "transmission":"Low fuel, request direct to LGW.", "solution":"clear"},
            {"type":"Commercial", "altitude":3000, "gspeed":160, "fuel":185, "glideangle":3, "transmission":"Standard approach, no delays. Over.", "solution":"clear"},
            {"type":"Light", "altitude":3300, "gspeed":74, "fuel":22, "glideangle":3, "transmission":"Inbound north, 5 miles out. Over.", "solution":"clear"},
            {"type":"Commercial", "altitude":3600, "gspeed":178, "fuel":210, "glideangle":3, "transmission":"Cabin secure for Gatwick. Over.", "solution":"clear"},
            {"type":"Light", "altitude":2900, "gspeed":71, "fuel":15, "glideangle":3, "transmission":"Requesting wind check on runway.", "solution":"clear"},
            {"type":"Commercial", "altitude":2550, "gspeed":152, "fuel":75, "glideangle":3, "transmission":"Switching to Gatwick Tower now.", "solution":"clear"},
            {"type":"Light", "altitude":3800, "gspeed":76, "fuel":55, "glideangle":3, "transmission":"Maintaining altitude for traffic.", "solution":"clear"},
            {"type":"Commercial", "altitude":3150, "gspeed":168, "fuel":130, "glideangle":3, "transmission":"Bag delay at South Terminal. Over.", "solution":"clear"},
            {"type":"Light", "altitude":2650, "gspeed":73, "fuel":10, "glideangle":3, "transmission":"Crosswind done, turning base. Over.", "solution":"clear"},
            {"type":"Commercial", "altitude":3750, "gspeed":185, "fuel":300, "glideangle":3, "transmission":"International, request gate. Over.", "solution":"clear"},
            {"type":"Light", "altitude":3450, "gspeed":79, "fuel":38, "glideangle":3, "transmission":"Student on board, need space. Over.", "solution":"clear"},
            {"type":"Commercial", "altitude":2950, "gspeed":158, "fuel":88, "glideangle":3, "transmission":"Anti-ice active, light icing. Over.", "solution":"clear"},
            {"type":"Light", "altitude":3050, "gspeed":72, "fuel":25, "glideangle":3, "transmission":"Entering downwind for Runway 08R.", "solution":"clear"},
            {"type":"Commercial", "altitude":3350, "gspeed":172, "fuel":160, "glideangle":3, "transmission":"Nav glitch fixed, proceeding. Over.", "solution":"clear"},
            {"type":"Light", "altitude":2800, "gspeed":75, "fuel":18, "glideangle":3, "transmission":"Holding short for departing heavy.", "solution":"clear"},
            {"type":"Commercial", "altitude":3850, "gspeed":180, "fuel":225, "glideangle":3, "transmission":"Fuel conservation mode active. Over.", "solution":"clear"},
            {"type":"Light", "altitude":3600, "gspeed":77, "fuel":40, "glideangle":3, "transmission":"Requesting airspace transition. Over.", "solution":"clear"},
            {"type":"Commercial", "altitude":2750, "gspeed":162, "fuel":105, "glideangle":3, "transmission":"Manual approach, autopilot off. Over.", "solution":"clear"},
            {"type":"Light", "altitude":3250, "gspeed":74, "fuel":14, "glideangle":3, "transmission":"Bird activity near tree line. Over.", "solution":"clear"},
            {"type":"Commercial", "altitude":3550, "gspeed":175, "fuel":190, "glideangle":3, "transmission":"FO on radio, Captain flying. Over.", "solution":"clear"},
            {"type":"Light", "altitude":3950, "gspeed":70, "fuel":50, "glideangle":3, "transmission":"Returning to base, sunset limit.", "solution":"clear"},
            {"type":"Commercial", "altitude":3050, "gspeed":166, "fuel":120, "glideangle":3, "transmission":"Passenger issue contained. Over.", "solution":"clear"},
            {"type":"Light", "altitude":2550, "gspeed":78, "fuel":9, "glideangle":3, "transmission":"On glide slope, 3 miles out. Over.", "solution":"clear"},
            {"type":"Commercial", "altitude":2200, "gspeed":170, "fuel":110, "glideangle":3, "transmission":"Standard approach, clear landing?", "solution":"denied"},
            {"type":"Light", "altitude":3100, "gspeed":95, "fuel":25, "glideangle":2, "transmission":"Inbound for Runway 26L. Over.", "solution":"denied"},
            {"type":"Commercial", "altitude":3500, "gspeed":130, "fuel":150, "glideangle":3, "transmission":"Reducing speed for spacing. Over.", "solution":"denied"},
            {"type":"Light", "altitude":4500, "gspeed":75, "fuel":30, "glideangle":3, "transmission":"Maintaining VFR at 4500. Over.", "solution":"denied"},
            {"type":"Commercial", "altitude":3300, "gspeed":175, "fuel":40, "glideangle":3, "transmission":"Continuing vector, all green. Over.", "solution":"denied"},
            {"type":"Light", "altitude":2800, "gspeed":60, "fuel":18, "glideangle":3, "transmission":"Slow flight practice done. Over.", "solution":"denied"},
            {"type":"Commercial", "altitude":4200, "gspeed":165, "fuel":200, "glideangle":3, "transmission":"Request descent to 3000. Over.", "solution":"denied"},
            {"type":"Light", "altitude":3000, "gspeed":74, "fuel":4, "glideangle":3, "transmission":"Short hop, 5 miles out. Over.", "solution":"denied"},
            {"type":"Commercial", "altitude":2700, "gspeed":195, "fuel":120, "glideangle":3, "transmission":"Increasing speed, making time. Over.", "solution":"denied"},
            {"type":"Light", "altitude":2100, "gspeed":78, "fuel":15, "glideangle":3, "transmission":"Low level M23 flyover. Clear? Over.", "solution":"denied"},
            {"type":"Commercial", "altitude":3800, "gspeed":172, "fuel":55, "glideangle":3, "transmission":"Checking in, all green here. Over.", "solution":"denied"},
            {"type":"Light", "altitude":3400, "gspeed":110, "fuel":40, "glideangle":3, "transmission":"Express arrival, keeping speed up.", "solution":"denied"},
            {"type":"Commercial", "altitude":2400, "gspeed":140, "fuel":90, "glideangle":3, "transmission":"On localizer, gear coming down.", "solution":"denied"},
            {"type":"Light", "altitude":4300, "gspeed":65, "fuel":22, "glideangle":3, "transmission":"High observation, landing in 10.", "solution":"denied"},
            {"type":"Commercial", "altitude":3100, "gspeed":182, "fuel":35, "glideangle":3, "transmission":"Approaching marker, clear us. Over.", "solution":"denied"},
            {"type":"Commercial", "altitude":2200, "gspeed":170, "fuel":110, "glideangle":4, "transmission":"Approach too high and steep. Over.", "solution":"denied"},
            {"type":"Light", "altitude":3100, "gspeed":95, "fuel":25, "glideangle":3, "transmission":"Pushing engine to beat storm. Over.", "solution":"denied"},
            {"type":"Commercial", "altitude":3500, "gspeed":130, "fuel":150, "glideangle":2, "transmission":"Flap issues, angle unstable. Over.", "solution":"denied"},
            {"type":"Light", "altitude":4500, "gspeed":75, "fuel":30, "glideangle":3, "transmission":"Accidental climb above 4000. Over.", "solution":"denied"},
            {"type":"Commercial", "altitude":3300, "gspeed":175, "fuel":40, "glideangle":3, "transmission":"Fuel light on, checking reserves.", "solution":"denied"},
            {"type":"Light", "altitude":2800, "gspeed":60, "fuel":18, "glideangle":3.2, "transmission":"Headwind dropping ground speed.", "solution":"denied"},
            {"type":"Commercial", "altitude":4200, "gspeed":165, "fuel":200, "glideangle":3, "transmission":"Overshot cruise altitude. Over.", "solution":"denied"},
            {"type":"Light", "altitude":3000, "gspeed":74, "fuel":4, "glideangle":3, "transmission":"Low fuel, request priority now.", "solution":"denied"},
            {"type":"Commercial", "altitude":2700, "gspeed":195, "fuel":120, "glideangle":4, "transmission":"Overspeeding, forcing nose down.", "solution":"denied"},
            {"type":"Light", "altitude":2100, "gspeed":78, "fuel":15, "glideangle":2.8, "transmission":"Too low, adding power. Over.", "solution":"denied"},
            {"type":"Commercial", "altitude":3100, "gspeed":165, "fuel":145, "glideangle":3, "transmission":"Passing 3100, checking in. Over.", "solution":"clear"},
            {"type":"Light", "altitude":2850, "gspeed":72, "fuel":12, "glideangle":3, "transmission":"Student solo, request full stop.", "solution":"clear"},
            {"type":"Commercial", "altitude":3950, "gspeed":180, "fuel":210, "glideangle":3, "transmission":"Request lower to avoid clouds. Over.", "solution":"clear"},
            {"type":"Light", "altitude":3300, "gspeed":77, "fuel":28, "glideangle":3, "transmission":"Clear of active, ground next. Over.", "solution":"clear"},
            {"type":"Commercial", "altitude":2600, "gspeed":155, "fuel":90, "glideangle":3, "transmission":"Bird activity on departure. Over.", "solution":"clear"},
            {"type":"Light", "altitude":3700, "gspeed":71, "fuel":44, "glideangle":3, "transmission":"Visual on field, entering left.", "solution":"clear"},
            {"type":"Commercial", "altitude":3450, "gspeed":172, "fuel":135, "glideangle":3, "transmission":"Hydraulic green, normal arrival.", "solution":"clear"},
            {"type":"Light", "altitude":2950, "gspeed":75, "fuel":9, "glideangle":3, "transmission":"Rectangular patterns, field tight.", "solution":"clear"},
            {"type":"Commercial", "altitude":3150, "gspeed":160, "fuel":195, "glideangle":3, "transmission":"Catering confirmed, North Terminal.", "solution":"clear"},
            {"type":"Light", "altitude":3200, "gspeed":79, "fuel":16, "glideangle":3, "transmission":"Heading back to hangar now. Over.", "solution":"clear"}
        ];
    
    }

    spawnPlane () {
        const point = Phaser.Utils.Array.GetRandom(this.spawnPoints);

        if (this.planeDict.length == 0){
            this.scene.start('Win')
        }

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
            let textbox, allowLanding, denyLanding, header, body;
            var plane_selection = this.planeStats[Math.floor(Math.random() * this.planeStats.length)];

            var array_sel = this.planeDict[Math.floor(Math.random() * this.planeDict.length)];
            this.planeDict.splice(this.planeDict.indexOf(array_sel), 1);

            var plane_name = array_sel["name"];
            
            var header_text = `Transmission from flight ${plane_name}`;
            var body_text = `${plane_selection["type"]} aircraft flight ${plane_name} requesting\nlanding. Approach altitude ${plane_selection["altitude"]}ft, ground speed\n${plane_selection["gspeed"]}mph, ${plane_selection["fuel"]}gal remaining fuel and ${plane_selection["glideangle"]}° glide angle.\n\n>> "${plane_selection["transmission"]}"`;

            if (point.x !== 0) {
                textbox = this.add.sprite(1030, 140, 'textbox').setScale(0.45).setAlpha(0.9);
                header = this.add.text(825,42, header_text, { fontFamily: 'Consolas, monaco, monospace', color: 'white'});
                body = this.add.text(825,77, body_text, { fontFamily: 'Consolas, monaco, monospace', color: 'white', fontSize: 14.5});
                allowLanding = this.add.image(970, 260, 'allow').setScale(0.15).setInteractive();
                denyLanding = this.add.image(1090, 265, 'deny').setScale(0.15).setInteractive();
            } else {
                textbox = this.add.sprite(270, 140, 'textbox').setScale(0.45).setAlpha(0.9);
                header = this.add.text(65,42, header_text, { fontFamily: 'Consolas, monaco, monospace', color: 'white'});
                body = this.add.text(65,77, body_text, { fontFamily: 'Consolas, monaco, monospace', color: 'white', fontSize: 14.5});
                allowLanding = this.add.image(200, 260, 'allow').setScale(0.15).setInteractive();
                denyLanding = this.add.image(320, 265, 'deny').setScale(0.15).setInteractive();
            }

            // helper that removes the UI
            const clearDecisionUI = () => {
                textbox.destroy();
                allowLanding.destroy();
                denyLanding.destroy();
                header.destroy();
                body.destroy();
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

                    this.time.delayedCall(5000, () => {
                        if (plane.active) {
                            plane.destroy();
                            if (plane_selection["solution"] == "denied") {
                                this.scene.start('GameOver');
                            }
                            if (!cleared) {
                                this.scene.start('GameOver');
                            }
                            cleared = false;
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
                    if (plane_selection["solution"] == "clear") {
                        this.scene.start('GameOver');
                    }
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