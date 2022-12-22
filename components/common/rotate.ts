import { polar2xyz } from "./math";



export class Rotator3D {
    public phi: number;
    public theta: number;
    public radius: number;
    public defaultSpeed: number;
    constructor(initPhi = 0, initTheta = 0, radius = 6, defaultSpeed = 0.01) {
        this.phi = initPhi;
        this.theta = initTheta;
        this.radius = radius;
        this.defaultSpeed = defaultSpeed;
    }

    public get position() {
        return polar2xyz(this.theta, this.phi, this.radius);
    }

    public next(phiIncrease: number = this.defaultSpeed, ThetaIncrease: number = this.defaultSpeed) {
        this.phi += phiIncrease;
        this.theta += ThetaIncrease;
        return this.position;
    }
}