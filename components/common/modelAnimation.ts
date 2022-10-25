import { useEffect, useState } from "react";
import { LoopOnce, LoopRepeat } from "three";

export function playAnimation(action, duration = 1) {
    action.reset();
    action.setDuration(duration);
    action.setLoop(LoopOnce);
    action.clampWhenFinished = true;
    action.play();
}

// https://gist.github.com/rtpHarry/2d41811d04825935039dfc075116d0ad
export function playAnimationReverse(action, duration = 1) {
    action.paused = false;
    action.setDuration(-duration);
    action.setLoop(LoopOnce);
    action.play();
}

export function playAnimationsIndefinitely(actions) {
    for (const action of actions) {
        action.reset();
        action.setLoop(LoopRepeat);
        action.play();
    }
}


export function useMaxAnimationDuration(animations) {
    const [maxAnimationDuration, setMaxAnimationDuration] = useState(0);
    useEffect(() => {
        for (const animation of animations) {
            setMaxAnimationDuration(
                Math.max(maxAnimationDuration, animation.duration)
            );
        }
    }, [animations, maxAnimationDuration]);

    return maxAnimationDuration;
}
