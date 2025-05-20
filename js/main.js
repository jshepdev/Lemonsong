var SideScroller = SideScroller || {};

var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 960,
    height: 600,
    scene:  {
        preload: function(){},
        create: function(){},
        update: function(){}
    },
    fps: {
        min: 10,       // Minimum acceptable FPS
        target: 60,    // Target FPS
        forceSetTimeOut: true // Optional: Force the use of setTimeout for timing
    },
    physics: {
        default: 'arcade', // Or 'matter', 'impact' depending on your needs
        arcade: {
            gravity: { y: 0 }, // Adjust gravity as needed
            debug: false       // Set to true for debugging physics bodies
        }

    }    
};

SideScroller.game = new Phaser.Game(config);

SideScroller.game.scene.add('Boot', SideScroller.Boot);
SideScroller.game.scene.add('Preload', SideScroller.Preload);
SideScroller.game.scene.add('LevelOne', SideScroller.LevelOne);
SideScroller.game.scene.start('Boot');
