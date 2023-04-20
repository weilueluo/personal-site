export default class Sizes {


    constructor() {
        this.width = window.innerWidth;;
        this.height = window.innerHeight;
        this.aspectRatio = this.width / this.height;
        this.devicePixelRatio = Math.min(window.devicePixelRatio, 2);

        window.addEventListener('resize', () => {
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            this.aspectRatio = this.width / this.height;
            this.devicePixelRatio = Math.min(window.devicePixelRatio, 2);
        });
    }
}