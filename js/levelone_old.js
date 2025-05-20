/*
* Happy Time Lemon Song
* Copyright 2015
* Original Gamester
* 
*/

/* Level one is the only level. It is a multi-environment tiled map. */
var levelOne = function(game) {  };  // State object created, a function accepting a game Object as parameter

var map;
var tileset;
var layer, layer2, layer3;
var lemons;
var player, bob;
var pStartX = 64;
var pStartY = 600;
var facing = 'left';
var jumpTimer = 0;
var cursors;
var jumpButton, actionButton;
var bg;
var score = 0;
var counter = 0;
var score, scoreText;
var randomx = 0;
var health = 3;
var textBubble;
var textBubbleTimer = 0;
var bobSpeaking = 0;

//var nextLevel;


levelOne.prototype = {

    preload: function () {

	    this.game.load.tilemap('levelone', 'assets/levelone.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('tiles01', 'assets/tiles01.png');
        this.game.load.image('background', 'assets/sky.png');
        this.game.load.image('textbubble', 'assets/textbubble.png');

        this.game.load.image('hills', 'assets/hills.png');
        this.game.load.image('trees', 'assets/trees.png');
        this.game.load.image('heart', 'assets/heart.png');
        this.game.load.image('hudlemon', 'assets/hudlemon.png');
        
        this.game.load.image('house', 'assets/house.png');
        this.game.load.image('lemonadestand', 'assets/lemonadestand.png');
        this.game.load.image('rottenlemon', 'assets/rottenlemon.png', 32, 32);

        this.game.load.spritesheet('lemon', 'assets/lemon.png', 32, 32);

        this.game.load.spritesheet('player', 'assets/player.png', 32, 32);
        this.game.load.spritesheet('bob', 'assets/bob.png', 32, 32);
        this.game.load.spritesheet('george', 'assets/george.png', 32, 32);   


    },


    create:  function() {

        //nextLevel = 'levelTwoState';

        //  We're going to be using physics, so enable the Arcade Physics system
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        //  A simple background for our game
        this.game.stage.backgroundColor = '#000000';

        bg = this.game.add.tileSprite(0, 0, 800, 600, 'background');
        bg.fixedToCamera = true;

        //bg1 = this.game.add.tileSprite(0, 300, 1600, 300, 'hills');
        //bg1.fixedToCamera = false;

        //Adding tilemap stuff
        map = this.game.add.tilemap('levelone');
        map.addTilesetImage('tiles01');

        map.setCollision([0,1, 2, 3, 4], true, layer);

        map.addTilesetImage('hills');
        map.addTilesetImage('trees');
        map.addTilesetImage('house');
        map.addTilesetImage('lemonadestand');
        
        layer2 = map.createLayer('layer02');
        layer3 = map.createLayer('layer03');
        layer = map.createLayer('layer01');
        
        layer2.scrollFactorX = .25
        layer3.scrollFactorX = .5

        layer.resizeWorld();

        // Add lemons from map
        lemons = this.game.add.group();
        lemons.enableBody = true;

        //  And now we convert all of the Tiled objects with an ID of 907 into sprites within the maplemons group
        map.createFromObjects('objectlayer', 907, 'lemon', 0, true, false, lemons);
        
        //  Add animations to all of the lemon sprites
        lemons.callAll('animations.add', 'animations', 'spin', [0, 1, 2, 3, 4, 5, 6, 7 ,8, 9, 10, 11], 10, true);
        lemons.callAll('animations.play', 'animations', 'spin');
    
        // Add rotten lemon from map
        rottenlemon = this.game.add.group();
        rottenlemon.enableBody = true;

        // Convert all of the Tiled objects with an ID of 908 into sprites within the rottenlems
        map.createFromObjects('objectlayer', 908, 'rottenlemon', 0, true, false, rottenlemon);

		// Add nextLevelObject from map
        nextLevelObject = this.game.add.group();
        rottenlemon.enableBody = true;

        // nextLevelOjbect
        map.createFromObjects('objectlayer', 9, null, 0, true, false, nextLevelObject);
		
		
        // Add Bob from bob
        bob = this.game.add.sprite(32, 32, 'bob');
        bob.enableBody = true;
        bob.x = 600;
        bob.y = 700;

        //  Walking right.
        bob.animations.add('moving', [0, 1, 2, 3], 10, true);
        bob.anchor.setTo(.5, 1); //so it flips around its middle
        bob.scale.x = 1; //facing default direction

        this.game.physics.enable(bob, Phaser.Physics.ARCADE);

        bob.body.collideWorldBounds = true;
        bob.body.gravity.y = 500;
        
        //  Un-comment this on to see the collision tiles
        // layer.debug = true;

        //this.game.physics.arcade.gravity.y = 250;

        // The player and its settings
        player = this.game.add.sprite(32, 32, 'player');
        player.x = pStartX;
        player.y = pStartY;

        this.game.physics.enable(player, Phaser.Physics.ARCADE);

        player.body.bounce.y = 0.1;
        player.body.collideWorldBounds = true;
        player.body.gravity.y = 500;
        //player.body.setSize(20, 32, 5, 16);

        //  Walking right.
        player.animations.add('moving', [0, 1, 2, 3], 10, true);
        player.anchor.setTo(.5, 1); //so it flips around its middle
        player.scale.x = 1; //facing default direction

        this.game.camera.follow(player);

        cursors = this.game.input.keyboard.createCursorKeys();
        jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
        actionButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        //  HUD
        scoreText = this.game.add.text(764-32, -2, score);
       
        //  Center align
        scoreText.anchor.set(0.0);
        scoreText.align = 'right';

        //  Font style
        scoreText.font = 'Arial Black';
        scoreText.fontSize = 36;
        scoreText.fontWeight = 'bold';

        //  Stroke color and thickness
        scoreText.stroke = '#000000';
        scoreText.strokeThickness = 6;
        scoreText.fill = '#FFFF00';

        scoreText.fixedToCamera = true;

        //lemon
        hudlemon = this.game.add.image(800-36, 6, 'hudlemon');
        hudlemon.fixedToCamera = true;

        var i;

        for(i =0; i < health; i++) {
         
            hudheart = this.game.add.image(4+i*36, 4, 'heart');
            hudheart.fixedToCamera = true;
        }

    
    },

    update: function() {

        //  Collide everything with map layer
        this.game.physics.arcade.collide(lemons, layer);
        this.game.physics.arcade.collide(player, layer);
        this.game.physics.arcade.collide(bob, layer);

        //  Checks to see if the player overlaps with any of the lemons, if he does call the collectLemon function
        this.game.physics.arcade.overlap(player, lemons, updateScore, null, this);
        this.game.physics.arcade.overlap(player, lemons, collectLemon, null, this);

        this.game.physics.arcade.overlap(player, bob, bobAction, null, this);

        this.game.physics.arcade.overlap(player, rottenlemon, collectRottenLemon, null, this);
        this.game.physics.arcade.overlap(player, nextLevelObject, nextLevelStart, null, this);




        player.body.velocity.x = 0;

        if (cursors.left.isDown)
        {
            player.body.velocity.x = -200;

            if (facing != 'left')
            {
                player.animations.play('moving');
                facing = 'left';
                player.scale.x = -1; 
            }
        }
        else if (cursors.right.isDown)
        {
            player.body.velocity.x = 200

            if (facing != 'right')
            {
                player.animations.play('moving');
                facing = 'right';
                player.scale.x = 1; 

            }
        }
    
        else
        {
            if (facing != 'idle')
            {
                player.animations.stop();

                if (facing == 'left')
                {
                    player.frame = 0;
                    player.scale.x = -1; 
                }
                else
                {
                    player.frame = 0;
                    player.scale.x = 1;
                }

                facing = 'idle';
            }
        }

        if (jumpButton.isDown && player.body.onFloor() && this.game.time.now > jumpTimer)
        {
            player.body.velocity.y = -315;
            jumpTimer = this.game.time.now + 750;
        }

        // Update NPC movement
        this.game.time.events.loop(Phaser.Timer.SECOND, updateBob, this);
        scoreText.setText(score);

        // Show dialogue if exists

    }
}


function updateBob() {


    if (randomx > bob.x){
         
            bob.body.velocity.x = 50;
            bob.scale.x = 1;
    }

    if (randomx < bob.x){
         
            bob.body.velocity.x = -50;
            bob.scale.x = -1;
    }

    if (counter > 1000) { 

         randomx = this.game.rnd.integerInRange(0, 1600);
         counter = 0;

    }


    bob.animations.play('moving');
    counter++;

}

function bobAction() {
       
    bobSpeaking = 1;
    textBubble = this.game.add.image(0, 472, 'textbubble');
    textBubble.fixedToCamera = true;
    this.game.paused = true;
	if () {
		
		
	}

}

function resetPlayer() {
    player.x = pStartX;
    player.y = pStartY;
    this.game.time.events.add(500, resetPlayerPos, this);

}

function resetPlayerPos() {
    playerAlive = true;
}


function nextLevelStart(player, tile) {
	resetPlayer();
    this.game.state.start('levelTwoState');
}