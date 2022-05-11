import { LoopOnce } from "three";


export function playAnimation(action, duration = 1) {
    action.reset()
    action.setDuration(duration)
    action.setLoop(LoopOnce);
    action.clampWhenFinished = true;
    action.play();
}

// https://gist.github.com/rtpHarry/2d41811d04825935039dfc075116d0ad
export function playAnimationReverse(action, duration = 1) {
    action.paused = false;
    action.setDuration(-duration)
    action.setLoop(LoopOnce);
    action.play();
}