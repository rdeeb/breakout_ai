export default class Model {
    constructor() {
        this.iteration = 1;
        this.stateVector = [0,0,0,0,0];
        this.training = {
            inputs: [],
            labels: []
        }
        this.createModel();
    }

    createModel = () => {
        this.model = tf.sequential();
        this.model.add(tf.layers.dense({
            inputShape: 4, // Ball X, Y, Speed, Paddle X
            activation: 'sigmoid',
            units: 8
        }));

        this.model.add(tf.layers.dense({
            inputShape: 8,
            activation: "sigmoid",
            units: 2 // SHall we move left? or right?
        }));

        this.model.compile({
            loss:'meanSquaredError',
            optimizer : tf.train.adam(0.1)
        })
    };

    train = () => {
        this.iteration++;
        console.info("Training iteration", this.iteration)
        tf.tidy(() => {
            this.model.fit(tf.tensor2d(this.training.inputs), tf.tensor2d(this.training.labels))
        });
    };

    predict = (ball, paddle) => {
        const stateVector = this.convertStateToVector(ball, paddle);
        this.lastVector = stateVector;

        return this.model.predict(tf.tensor2d([stateVector]));
    };

    handleLostGame = (ball, paddle) => {
        let label = (ball.x < paddle.x) ? [1, 0] : [0, 1];
        this.training.inputs.push(this.lastVector);
        this.training.labels.push(label);
        console.info(this.lastVector, label);
    };

    convertStateToVector(ball, paddle) {
        return [
            ball.x || 0,
            ball.y || 0,
            ball.velocity || 0,
            paddle.x || 0
        ];
    }

    getIteration = () => {
        return this.iteration;
    }
}
