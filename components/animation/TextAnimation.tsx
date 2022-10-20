
import { RootState } from "@react-three/fiber";
import { Animation } from "./Animation";

export class TextAnimator implements Animation {
    onStart: Function;
    onFrame: Function;
    onFinish: Function;

    private text: string;
    private duration: number
    private reversed: boolean;
    private delay: number;

    private startTime: number;

    finished: boolean;

    constructor(text: string, duration: number, reversed: boolean = false, delay: number = 0) {
        this.text = text;
        this.duration = duration;
        this.startTime = null;
        this.finished = false;
        this.reversed = reversed;
        this.delay = delay;
    }

    animateFrame(state: RootState): string {
        
        if (this.finished) {
            return this.text;
        }

        if (this.startTime == null) {
            this.startTime = state.clock.getElapsedTime();
            this.onStart && this.onStart();
            return '';
        }

        const timeElapsed = Math.max(state.clock.getElapsedTime() - this.startTime - this.delay, 0);

        const endIndex = Math.min(Math.ceil(timeElapsed / this.duration * this.text.length), this.text.length);
        const currString = this.reversed ? this.text.slice(this.text.length-endIndex, this.text.length) : this.text.slice(0, endIndex);
        this.onFrame && this.onFrame();

        if (timeElapsed >= this.duration) {
            this.finished = true;
        }

        return currString;
    }
}