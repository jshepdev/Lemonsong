var SideScroller = SideScroller || {};

//loading the game assets
SideScroller.Preload = function(){};

SideScroller.Preload.prototype = {
  preload: function() {
    //show loading screen
    this.preloadBar = this.add.sprite(this.scale.width / 2, this.scale.height / 2, 'preloadbar');
    this.preloadBar.setOrigin(0.5);
    this.preloadBar.setScale(3);
	this.preloadBar.scaleX = 0;

	this.load.on('progress', (value) => { 
		this.preloadBar.scaleX = value;
	});

	//load game assets
	this.load.tilemapTiledJSON('levelone', 'assets/tilemaps/levelone.json');
	this.load.image('tiles01', 'assets/images/tiles01.png');
	this.load.image('background', 'assets/images/sky.png');

	this.load.image('hills', 'assets/images/hills.png');
	this.load.image('trees', 'assets/images/trees.png');
	this.load.image('heart', 'assets/images/heart.png');
	this.load.image('hudLemon', 'assets/images/hudlemon.png');
	this.load.image('house', 'assets/images/house.png');
	this.load.image('lemonadestand', 'assets/images/lemonadestand.png');
	this.load.image('rottenLemon', 'assets/images/rottenlemon.png', 32, 32);

	this.load.spritesheet('lemon', 'assets/images/lemon.png', {
		frameWidth: 32,
		frameHeight: 32
	});
	
	this.load.spritesheet('player', 'assets/images/player.png', {
		frameWidth: 32,
		frameHeight: 32
	});
	this.load.spritesheet('bob', 'assets/images/bob.png', {
		frameWidth: 32,
		frameHeight: 32
	});
	this.load.spritesheet('george', 'assets/images/george.png', {
		frameWidth: 32,
		frameHeight: 32
	});
    
    this.load.audio('coin', ['assets/audio/coin.ogg', 'assets/audio/coin.mp3']);
	
  },
  create: function() {
    this.scene.start('LevelOne');
  }
};