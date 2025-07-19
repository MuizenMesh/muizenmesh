/**
 * @author Timur Kuzhagaliyev <tim.kuzh@gmail.com>
 * @copyright 2017
 * @license GPL-3.0
 */

const Helper = require('./Helper');

/**
 * @abstract
 */
class Visualiser extends Helper {

    /**
     * @param {object} data
     * @param {string} data.code
     * @param {string} data.name
     * @param {int} data.fftSize
     * @param {number} data.smoothingTimeConstant
     */
    constructor(data) {
        super();
        this.code = data.code || 'UV';
        this.name = data.name || 'Untitled Visualiser';
        this.fftSize = data.fftSize || 128;
        this.smoothingTimeConstant = data.smoothingTimeConstant || 0;
        this.initialised = false;
        this.paused = false;
    }

    /**
     * @param {object} data
     * @param {THREE.WebGLRenderer} data.renderer
     * @param {AnalyserNode} data.analyser
     * @param {number} data.height
     * @param {number} data.width
     */
    init(data) {
        this.onInit(data);
        this.initialised = true;
    }

    /**
     * @abstract
     * @param {object} data
     * @param {THREE.WebGLRenderer} data.renderer
     * @param {AnalyserNode} data.analyser
     * @param {number} data.height
     * @param {number} data.width
     */
    // eslint-disable-next-line
    onInit(data) {
        throw new Error(`The 'onInit' method was not defined on ${this.name}!`);
    }

    /**
     * @param {object} data
     * @param {THREE.WebGLRenderer} data.renderer
     * @param {AnalyserNode} data.analyser
     * @param {number} data.height
     * @param {number} data.width
     */
    revive(data) {
        this.onRevive(data);
        this.paused = false;
    }

    /**
     * @abstract
     * @param {object} data
     * @param {THREE.WebGLRenderer} data.renderer
     * @param {AnalyserNode} data.analyser
     * @param {number} data.height
     * @param {number} data.width
     */
    // eslint-disable-next-line
    onRevive(data) {
    }

    /**
     * @param {object} data
     * @param {THREE.WebGLRenderer} data.renderer
     * @param {AnalyserNode} data.analyser
     * @param {Float32Array} data.frequencyData
     * @param {Float32Array} data.timeDomainData
     */
    update(data) {
        this.onUpdate(data);
    }

    /**
     * @abstract
     * @param {object} data
     * @param {THREE.WebGLRenderer} data.renderer
     * @param {AnalyserNode} data.analyser
     * @param {Float32Array} data.frequencyData
     * @param {Float32Array} data.timeDomainData
     */
    // eslint-disable-next-line
    onUpdate(data) {
        throw new Error(`The 'onUpdate' method was not defined on ${this.name}!`);
    }

    /**
     * @param {THREE.WebGLRenderer} data.renderer
     * @param {AnalyserNode} data.analyser
     * @param {number} data.height
     * @param {number} data.width
     */
    resize(data) {
        this.onResize(data);
    }

    /**
     * @abstract
     * @param {THREE.WebGLRenderer} data.renderer
     * @param {AnalyserNode} data.analyser
     * @param {number} data.height
     * @param {number} data.width
     */
    // eslint-disable-next-line
    onResize(data) {
    }

    pause() {
        this.onPause();
        this.paused = true;
    }

    /**
     * @abstract
     */
    onPause() {
    }

    destroy() {
        this.onDestroy();
    }

    /**
     * @abstract
     */
    onDestroy() {
        throw new Error(`The 'onDestroy' method was not defined on ${this.name}!`);
    }

    error(message) {
        // TODO: Draw error message on canvas
        throw new Error(message);
    }

    isInitialised() {
        return this.initialised;
    }

    isPaused() {
        return this.paused;
    }

}

module.exports = Visualiser;
