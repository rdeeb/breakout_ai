var game = new Phaser.Game(480, 320, Phaser.AUTO, null, {
    preload: preload,
    create: create,
    update: update
});

var ball;
var paddle;
var bricks;
var iteration = 0;
var iterationText;
var maxVelocity = 250;

function preload() {
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.stage.backgroundColor = '#EEE';

    //Load the Assets
    game.load.image('ball', 'public/images/ball.png');
    game.load.image('paddle', 'public/images/paddle.png');
    game.load.image('brick', 'public/images/brick.png');

}

function create() {
    // World
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.checkCollision.down = false;

    // Ball
    ball = game.add.sprite(game.world.width*getRandomArbitrary(-1.5,1.5), game.world.height-25, 'ball');
    game.physics.enable(ball, Phaser.Physics.ARCADE);
    ball.body.velocity.set(150, -150);
    ball.body.collideWorldBounds = true;
    ball.anchor.set(0.5);
    ball.body.bounce.set(1);
    ball.checkWorldBounds = true;
    ball.events.onOutOfBounds.add(handleGameover, this);

    // Paddle
    paddle = game.add.sprite(game.world.width*0.5, game.world.height - 5, 'paddle');
    paddle.anchor.set(0.5, 1);
    game.physics.enable(paddle, Phaser.Physics.ARCADE);
    paddle.checkWorldBounds = true;
    paddle.body.bounce.set(0);
    paddle.body.immovable = true;

    // Bricks
    createBrickGrid();

    // Scores
    iterationText = game.add.text(5, 5, 'Iteration: '+iteration, { font: '18px Arial', fill: '#0095DD' });

    // Brains!
    updateGameStatus();
}

function update() {
    game.physics.arcade.collide(ball, paddle, logHit);
    game.physics.arcade.collide(ball, bricks, whenBrickIsHit);
    // paddle.x = game.input.x || game.world.width*0.5;
}

function createBrickGrid() {
    var brickInfo = {
        width: 50,
        height: 20,
        count: {
            row: 7,
            col: 3
        },
        offset: {
            top: 50,
            left: 60
        },
        padding: 10
    };
    bricks = game.add.group();
    for (var c=0; c<brickInfo.count.col; c++) {
        for (var r=0; r<brickInfo.count.row; r++) {
            var brickX = (r*(brickInfo.width+brickInfo.padding))+brickInfo.offset.left;
            var brickY = (c*(brickInfo.height+brickInfo.padding))+brickInfo.offset.top;
            var newBrick = game.add.sprite(brickX, brickY, 'brick');
            game.physics.enable(newBrick);
            newBrick.body.immovable = true;
            newBrick.anchor.set(0.5);
            bricks.add(newBrick);
        }
    }
}

function whenBrickIsHit(ball, brick) {
    brick.kill();
    var alive = 0;
    for (var i=0; i < bricks.children.length; i++) {
        if (bricks.children[i].alive === true) {
            alive++;
        }
    }
    if (alive === 0) {
        handleFinished();
    }
}

function handleGameover() {
    // alert('Game over!');
    console.log('Game Over! ball went thru');
    logError();
    // Restart our game
    restartGame();
}

function handleFinished() {
    alert('You did it!');
    restartGame();
}

function moveLeft() {
    paddle.body.velocity.x -= 2;
    if (Math.abs(paddle.body.velocity.x) > maxVelocity) {
        paddle.body.velocity.x = -1 * maxVelocity;
    }
    if (paddle.x < game.world.bounds.x) {
        paddle.body.velocity.x = 0;
        return false;
    }
    console.log('←');
    return true;
}

function moveRight() {
    paddle.body.velocity.x += 2;
    if (Math.abs(paddle.body.velocity.x) > maxVelocity) {
        paddle.body.velocity.x = maxVelocity;
    }
    if (paddle.x > game.world.bounds.width) {
        paddle.body.velocity.x = 0;
        return false;
    }
    console.log('→');
    return true;
}

function restartGame() {
    iteration++;
    game.state.restart();
}

function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}