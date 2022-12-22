import { RootState } from "@react-three/fiber";
import assert from "assert";
import { Vector3 } from "three";
import { clamp } from "../common/math";
import { Animation } from "./Animation";

export class LineAnimator {
  private prevPoints: Vector3[];
  private nextPoints: Vector3[];

  private durations: number[];
  private lengths: number[];

  private currentAnimation: SingleLineAnimation;
  private finished: boolean;

  onStart: () => unknown;
  onFrame: () => unknown;
  onFinished: () => unknown;

  constructor(points: Vector3[], duration: number) {
    assert(points.length >= 2);
    this.finished = false;

    this.prevPoints = [];
    this.nextPoints = points.slice();

    this.lengths = new Array(points.length - 1);
    this.durations = new Array(points.length - 1);

    // set individual length
    let totalLength = 0;
    for (let i = 0; i < points.length - 1; i++) {
      const currentLength = points[i].distanceTo(points[i + 1]);
      totalLength += currentLength;
      this.lengths[i] = currentLength;
    }

    // set individual duration
    for (let i = 0; i < this.lengths.length; i++) {
      this.durations[i] = this.lengths[i] / totalLength * duration;
    }

    this.currentAnimation = null;
  }

  animateFrame(state: RootState) {
    if (this.finished) {
      return this.prevPoints;
    }
    if (this.currentAnimation == null) {
      this.onStart && this.onStart();
    }
    if (this.currentAnimation == null || this.currentAnimation.finished) {
      this.prevPoints.push(this.nextPoints.shift());  // prepare for next animation
      if (this.nextPoints.length == 0) {
        this.finished = true;
        this.onFinished && this.onFinished();
        return this.prevPoints;
      }
      this.currentAnimation = new SingleLineAnimation(this.prevPoints, this.nextPoints[0], this.durations.shift());
    }

    this.onFrame && this.onFrame();
    return this.currentAnimation.animateFrame(state);
  }

}

class SingleLineAnimation implements Animation {
  private prevPoints: Vector3[];
  private destination: Vector3;

  private duration: number;  // seconds

  private animateTime: number;  // current animation time
  private animateVector: Vector3;  // the current end position
  finished: boolean;  // whether this animation has finished

  constructor(prevPoints: Vector3[], destination: Vector3, duration: number) {
    assert(prevPoints.length >= 1);
    this.prevPoints = prevPoints;
    this.destination = destination;
    this.duration = duration;

    this.animateTime = 0;
    this.finished = false;
    this.animateVector = new Vector3();
  }

  onStart: () => unknown;
  onFrame: () => unknown;
  onFinish: () => unknown;

  reset() {
    this.animateTime = 0;
    this.finished = false;
  }

  animateFrame(state: RootState) {

    // do not use getDelta, https://github.com/mrdoob/three.js/issues/5696
    // this.animateTime += state.clock.getDelta();

    // do nothing if finished
    if (this.finished) {
      return this.prevPoints;
    }

    // init if first frame
    if (this.animateTime <= 0) {
      // init last animation time
      this.onStart && this.onStart();
      this.animateTime = state.clock.getElapsedTime();
      return this.prevPoints;
    }

    // do animation
    const timeElapsed = state.clock.getElapsedTime() - this.animateTime;

    this.onFrame && this.onFrame();

    this.animateVector.lerpVectors(this.prevPoints.at(-1), this.destination, clamp(timeElapsed / this.duration, 0, 1));

    // check finished
    if (timeElapsed >= this.duration) {
      this.finished = true;
      this.onFinish && this.onFinish();
    }

    return [...this.prevPoints, this.animateVector];
  }
}