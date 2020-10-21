import TweenBase from '../../../utils/tween/TweenBase.js';

const GetValue = Phaser.Utils.Objects.GetValue;
const GetAdvancedValue = Phaser.Utils.Objects.GetAdvancedValue;

class Flip extends TweenBase {
    constructor(gameObject, config) {
        super(gameObject, { eventEmitter: true });
        this.gameObject = gameObject;

        this.resetFromJSON(config);
    }

    resetFromJSON(o) {
        this.setDelay(GetAdvancedValue(o, 'delay', 0));
        this.setDuration(GetAdvancedValue(o, 'duration', 1000));
        this.setEase(GetValue(o, 'ease', 'Cubic'));
        this.setFrontToBackDirection(GetValue(o, 'frontToBack', 0));
        this.setBackToFrontDirection(GetValue(o, 'backToFront', 1));
        return this;
    }

    shutdown() {
        super.shutdown();
        this.gameObject = undefined;
        return this;
    }

    setDelay(time) {
        this.delay = time;
        return this;
    }

    setDuration(time) {
        this.duration = time;
        return this;
    }

    setEase(ease) {
        if (ease === undefined) {
            ease = 'Linear';
        }
        this.ease = ease;
        return this;
    }

    setFrontToBackDirection(direction) {
        if (typeof(direction)==='string') {
            direction = DIRMODE[direction];
        }
        this.endAngleFB = (direction === 0) ? -180 : 180;
        return this;
    }

    setBackToFrontDirection(direction) {
        if (typeof(direction)==='string') {
            direction = DIRMODE[direction];
        }
        this.endAngleBF = (direction === 0) ? 180 : -180;
        return this;
    }

    start() {
        if (this.isRunning) {
            return this;
        }

        var config = {
            targets: this.gameObject,
            delay: this.delay,
            duration: this.duration,
            ease: this.ease,
            repeat: 0
        }

        var propKey = (this.gameObject.orientation === 0) ? 'angleY' : 'angleX';
        var isFrontToBack = (this.gameObject.face === 0);
        config[propKey] = {
            start: (isFrontToBack) ? 0 : this.endAngleFB,
            to: (isFrontToBack) ? this.endAngleBF : 0
        };

        super.start(config);
        this.gameObject.toggleFace();
        return this;
    }

    flip(duration) {
        if (this.isRunning) {
            return this;
        }
        if (duration !== undefined) {
            this.setDuration(duration);
        }
        this.start();
        return this;
    }
}

const DIRMODE = {
    'right': 0,
    'left-to-right': 0,
    'left': 1,
    'right-to-left': 1
}

export default Flip;