

export default class Experience {
    static instance;
    constructor(canvas) {
        if (instance) {
            return instance;
        }
        instance = this;
        instance.canvas = canvas;
        instance.scene = new THREE.Scene();
        instance.sizes = new Sizes();
        instance.camera = new Camera();
    }
}