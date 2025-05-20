var SideScroller = SideScroller || {};

SideScroller.LevelOne = function(){};

SideScroller.LevelOne.prototype = {

    preload: function() {
        // This should be empty now as loading is done in Preload prototype
    },
    create: function() {
        const gameWidth = this.scale.width;
        const gameHeight = this.scale.height;

        this.jumpTimer = 0;
        this.score = 0;
        this.randomx = 0;
        this.health = 3;
        this.pStartX = 200;
        this.pStartY = 700;
        this.textBubbleTimer = 0;
        this.bobSpeaking = 0;
        this.counter = 0;
        this.facing = 'left';
        this.bg = this.add.tileSprite(0, 0, 960, 600, 'background').setOrigin(0, 0);

        // Calculate the scale factors
        const scaleX = gameWidth / this.bg.width;
        const scaleY = gameHeight / this.bg.height;

        // Set the scale of the tile sprite
        this.bg.setScale(scaleX, scaleY);
        this.bg.fixedToCamera = true;
        this.bg.setScrollFactor(0);

        //Adding tilemap stuff
        this.map = this.make.tilemap({ key: 'levelone' });

        const tileset1 = this.map.addTilesetImage('tiles01', 'tiles01');
        const hillsTileset = this.map.addTilesetImage('hills', 'hills');
        const treesTileset = this.map.addTilesetImage('trees', 'trees');
        const houseTileset = this.map.addTilesetImage('house', 'house');
        const lemonadeTileset = this.map.addTilesetImage('lemonadestand', 'lemonadestand');

        this.layer2 = this.map.createLayer('layer02', [tileset1, hillsTileset, treesTileset, houseTileset, lemonadeTileset], 0, 0);
        this.layer3 = this.map.createLayer('layer03', [tileset1, hillsTileset, treesTileset, houseTileset, lemonadeTileset], 0, 0);
        this.layer = this.map.createLayer('layer01', [tileset1, hillsTileset, treesTileset, houseTileset, lemonadeTileset], 0, 0);


        this.map.setCollision([0, 1, 2, 3, 4], true, this.layer); // Now 'this.layer' is defined

        this.layer2.scrollFactorX = .25
        this.layer3.scrollFactorX = .5

        this.physics.world.setBounds(0, 0, this.layer.width, this.layer.height);
        this.cameras.main.setBounds(0, 0, this.layer.width, this.layer.height);

        // Add lemons from map
        this.lemons = this.physics.add.group();
        const checklemons = this.map.createFromObjects('objectlayer', { gid: 907, key: 'lemon', classType: Phaser.Physics.Arcade.Sprite });

        checklemons.forEach(lemonObject => {
            // Add the object to your lemons group
            this.lemons.add(lemonObject);
            this.physics.world.enableBody(lemonObject, Phaser.Physics.Arcade.STATIC_BODY); // Enable the body *after* creation
            lemonObject.body.setImmovable(true);
            
        });

        // Add animations to all of the lemon sprites
        this.anims.create({
            key: 'lemonSpin', // A unique key for this animation
            frames: this.anims.generateFrameNumbers('lemon', { start: 0, end: 11 }),
            frameRate: 10,
            repeat: -1 // -1 for infinite loop
        });

        // Play the animation on each lemon sprite in the group
        this.lemons.getChildren().forEach(lemon => {
            lemon.play('lemonSpin');
        });

        // Add rotten lemons from map
        this.rottenlemon = this.physics.add.group();
        this.map.createFromObjects('objectlayer', { gid: 908, key: 'rottenLemon' }, this.rottenlemon); // Corrected key
        this.rottenlemon.getChildren().forEach(rottenLemon => {
            this.physics.world.enableBody(rottenLemon, Phaser.Physics.Arcade.STATIC_BODY);
            rottenLemon.body.setImmovable(true);
        });

        // Add next level object from map
        this.nextLevelObject = this.physics.add.group();
        this.map.createFromObjects('objectlayer', { id: 9, key: 'nextLevelTexture' }, this.nextLevelObject);
        this.nextLevelObject.getChildren().forEach(nextLevel => {
            this.physics.world.enableBody(nextLevel, Phaser.Physics.Arcade.STATIC_BODY);
            nextLevel.body.setImmovable(true);
        });

        // Create NPCs group
        this.npcs = this.physics.add.group();

        // Add Bob from bob
        this.bob = this.physics.add.sprite(600, this.pStartY+32, 'bob');
        this.anims.create({
            key: 'bobMoving',
            frames: this.anims.generateFrameNumbers('bob', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        this.bob.setOrigin(0.5, 1);
        this.bob.setScale(1, 1);
        this.bob.setCollideWorldBounds(true);
        this.bob.name = 'bob'; // Assign a name to the NPC
        this.npcs.add(this.bob);
        this.bob.setGravityY(500);
        this.bob.play('bobMoving');
        this.bob.nextTargetTime = 0; // Initialize the timer for the first target


        this.isDialogVisible = false;
        this.currentDialogLines = [];
        this.currentDialogIndex = 0;
        this.currentCompanion = null; // To store the NPC we're talking to

        // Create the chat box container (initially hidden)
        this.dialogBox = this.add.container(this.game.config.width / 2, this.game.config.height - 100);
        const dialogBackground = this.add.graphics()
            .fillStyle(0x000000, 0.8)
            .fillRect(-this.game.config.width / 2, -50, this.game.config.width, 100);
        this.dialogText = this.add.text( -this.game.config.width / 2 + 20, -40, '', { fontFamily: 'Arial', fontSize: 20, color: '#fff', wordWrap: { width: this.game.config.width - 40 } });
        this.dialogBox.add(dialogBackground);
        this.dialogBox.add(this.dialogText);
        this.dialogBox.setDepth(100); // Ensure it's on top
        this.dialogBox.setVisible(false);
        this.dialogBox.setScale(scaleX, scaleY);
        this.dialogBox.fixedToCamera = true;
        this.dialogBox.setScrollFactor(0);

       	this.dialogData = {
            'bob': [
                "Hey there, traveler!",
                "Nice weather we're having, isn't it?",
                "Come back anytime!"
            ],
            'badbob': [
                "Dude did you just eat that rotton lemon?",
                "Hey are you feeling okay?"
            ]
            // ... more NPCs and their dialog
        };
        // The player and its settings
        this.player = this.physics.add.sprite(this.pStartX, this.pStartY, 'player');
        this.player.setBounceY(0.1);
        this.player.setCollideWorldBounds(true);
        this.player.setGravityY(500);
        this.anims.create({
            key: 'playerMoving',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        this.player.setOrigin(0.5, 1);
        this.player.setScale(1, 1);
        this.cameras.main.startFollow(this.player);
        this.player.play('playerMoving');

        // Input
        this.cursors = this.input.keyboard.createCursorKeys();
        this.jumpButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.actionButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // HUD
        const hudY = 2; // A fixed Y position for the top of the HUD

        this.scoreText = this.add.text(gameWidth - 28, hudY, this.score, { // Use gameWidth for right alignment
            fontFamily: 'Arial Black',
            fontSize: 36,
            fontWeight: 'bold',
            stroke: '#000000',
            strokeThickness: 6,
            fill: '#FFFF00',
            align: 'right'
        }).setOrigin(1, 0).setScrollFactor(0);

        // Lemon HUD icon
        this.hudlemon = this.add.image(gameWidth - 36 - this.scoreText.width - 16, hudY + 22, 'hudLemon').setScrollFactor(0); // Position relative to score

        // Health HUD icons
        for (let i = 0; i < this.health; i++) {
            const hudheart = this.add.image(20 + i * 36, hudY + 20, 'heart').setScrollFactor(0);
            this.add.existing(hudheart);
        }

        // Sound effects
        this.sfx = this.sound.add('coin');
    },

    update: function() {
        // Collide everything with map layer
        this.physics.add.collider(this.lemons, this.layer);
        this.physics.add.collider(this.player, this.layer);
        this.physics.add.collider(this.bob, this.layer);

        // Checks for overlap
        this.physics.add.overlap(this.player, this.lemons, this.collectLemon, null, this); // Only call collectLemon
        this.physics.add.overlap(this.player, this.npcs, this.handleNPCollision, null, this);
        this.input.keyboard.on('keydown-SPACE', this.advanceDialog, this);
        this.physics.add.overlap(this.player, this.rottenlemon, this.collectRottenLemon, null, this);
        this.physics.add.overlap(this.player, this.nextLevelObject, this.nextLevelStart, null, this);



        this.player.setVelocityX(0);

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-200);
            if (this.facing != 'left') {
                this.player.play('playerMoving', true);
                this.facing = 'left';
                this.player.setScale(-1, 1);
            }
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(200);
            if (this.facing != 'right') {
                this.player.play('playerMoving', true);
                this.facing = 'right';
                this.player.setScale(1, 1);
            }
        } else {
            if (this.facing != 'idle') {
                this.player.anims.stop();
                if (this.facing == 'left') {
                    this.player.setFrame(0);
                    this.player.setScale(-1, 1);
                } else {
                    this.player.setFrame(0);
                    this.player.setScale(1, 1);
                }
                this.facing = 'idle';
            }
        }

        if (this.jumpButton.isDown && this.player.body.onFloor() && this.time.now > this.jumpTimer) {
            this.player.setVelocityY(-315);
            this.jumpTimer = this.time.now + 750;
        }

        this.scoreText.setText(this.score);
        this.updateBob();
    },

    updateBob: function() {
        if (!this.bob || !this.bob.body) {
            return;
        }

        const wanderSpeed = 30; // Adjust for desired wandering speed
        const targetUpdateInterval = 650; // Adjust for how often Bob picks a new target
        const proximityThreshold = 50; // How close Bob needs to be to the target to stop

        if (this.time.now > this.bob.nextTargetTime) {
            this.randomx = Phaser.Math.Between(100, this.layer.width - 100); // Stay within reasonable bounds
            this.bob.nextTargetTime = this.time.now + targetUpdateInterval;
        }

        const distanceToTarget = Math.abs(this.randomx - this.bob.x);

        if (distanceToTarget > proximityThreshold) {
            if (this.randomx > this.bob.x) {
                this.bob.setVelocityX(wanderSpeed);
                this.bob.setScale(1, 1);
            } else if (this.randomx < this.bob.x) {
                this.bob.setVelocityX(-wanderSpeed);
                this.bob.setScale(-1, 1);
            }
        } else {
            this.bob.setVelocityX(0); // Stop when close to the target
        }

        this.bob.play('bobMoving', true);
    },

    resetPlayer: function() { // Moved resetPlayer into the prototype
        this.player.setPosition(this.pStartX, this.pStartY);
        this.time.addEvent({
            delay: 500,
            callback: this.resetPlayerPos,
            callbackScope: this,
            loop: false
        });
        this.playerAlive = false;
    },

    resetPlayerPos: function() { // Moved resetPlayerPos into the prototype
        this.playerAlive = true;
    },

    handleNPCollision: function(player, npc) {
        if (!this.isDialogVisible) {
            this.startDialog(npc);
        }
    },

    startDialog: function(npc) {
        this.isDialogVisible = true;
        this.currentCompanion = npc;
        this.currentDialogLines = this.dialogData[npc.name] || ["(No dialog available)"];
        this.currentDialogIndex = 0;
        this.showDialogLine();
        this.dialogBox.setVisible(true);
    },

    showDialogLine: function() {
        this.dialogText.setText(this.currentDialogLines[this.currentDialogIndex]);
    },

    advanceDialog: function() {
        if (this.isDialogVisible) {
            this.currentDialogIndex++;
            if (this.currentDialogIndex < this.currentDialogLines.length) {
                this.showDialogLine();
            } else {
                // End of dialog
                this.isDialogVisible = false;
                this.dialogBox.setVisible(false);
                this.currentCompanion = null;
            }
        }
    },
  
    nextLevelStart: function(player, tile) { // Moved nextLevelStart into the prototype
        this.resetPlayer();
        this.scene.start('levelTwoState');
    },
    
    collectLemon: function(player, lemon) {
    
        lemon.disableBody(true, true); // This should now work!

        this.score += 1;
        this.scoreText.setText(this.score);
        // You might want to play a sound effect here
        // if (this.sfx) {
        //     this.sfx.play('coin');
        // }
    },

    collectRottenLemon: function(player, rottenLemon) { // Added a basic collectRottenLemon
        console.log('Ouch! Rotten lemon!');
        rottenLemon.disableBody(true, true);
        this.health -= 1;
        // Update health HUD here
    }

};