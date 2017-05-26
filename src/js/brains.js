/**
 * Input [ball_x_distance_to_paddle, ball_y_distance_to_paddle, paddle_x, ball_speed]
 * Output [left, right]
 * @type {Architect.Perceptron}
 */
var network = new synaptic.Architect.Perceptron(3, 30, 30, 2);
var learningRate = 0.3;
var lastParams = [0,0,0,0];
var lastRealParams = [0,0,0,0];

function updateGameStatus() {
    var params = [];
    var diff_x = ball.x - paddle.x;
    var diff_y = ball.y - paddle.y;
    var movement = ball.body.velocity.x > 0 ? 1 : 0;

    /**
     * Normalizing the data:
     * Diff X: the horizontal distance from the paddle to the ball
     * Diff Y: the vertical distance from the paddle to the ball
     * Movement: Left or Right, represented by 0, 1
     */
    params.push(diff_x);
    params.push(diff_y);
    params.push(movement);

    var output = network.activate(params);
    if (output[0] > output[1]) {
        if (!moveLeft()) logBoundaries();
        lastParams = params;
    } else if (output[0] < output[1]) {
        if (!moveRight()) logBoundaries();
        lastParams = params;
    }

    lastRealParams = params;

    setTimeout(updateGameStatus, 50);
}

function logError() {
    /**
     * We screwed our calculations, now we need to tell the neural network where we needed to be
     * we will tell the network where we had to be a few frames before
     *
     * @type {number}
     */
    var magicNumber = 50;

    network.activate(lastParams);
    // check if ball was left or right when it died
    if (lastParams[0] > 0) {
        // Ball was to the right, now let's check the ball movement
        if (lastParams[2] > 0) {
            // Ball was moving toward the right
            lastParams[0] -= magicNumber;
            lastParams[1] += magicNumber;
        } else {
            // Ball was moving toward the right
            lastParams[0] += magicNumber;
            lastParams[1] += magicNumber;
        }
        // We should had moved to the right earlier
        network.activate(lastParams);
        network.propagate(learningRate, [0,1]);
    } else {
        // Ball was to the left, now let's check the ball movement
        if (lastParams[2] > 0) {
            // Ball was moving toward the right
            lastParams[0] += magicNumber;
            lastParams[1] += magicNumber;
        } else {
            // Ball was moving toward the right
            lastParams[0] -= magicNumber;
            lastParams[1] += magicNumber;
        }
        // We should had moved to the right earlier
        network.activate(lastParams);
        network.propagate(learningRate, [1,0]);
    }
    console.log(lastParams);
}

function logBoundaries() {

}

function logHit() {
    console.log('Hit!');

    // var result = perceptron.activate(lastParams);
    // perceptron.propagate(learningRate, result);
}
