import { LoopOnce, LoopRepeat } from "three";
import { useEffect } from "react";

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

export function playAnimationsIndefinitely(actions) {
    for (const action of actions) {
        action.reset()
        action.setLoop(LoopRepeat)
        action.play()
    }
}

export function setCursorPointerOnHover(hover) {
    useEffect(() => {
        document.body.style.cursor = hover ? 'pointer' : 'auto'
    }, [hover])
}

export function clamp(num: number, min: number, max: number) {
    return Math.max(Math.min(num, max), min)
}

// https://stackoverflow.com/a/19270021/6880256
export function getRandom(arr: Array<any>, n: number) {
    let result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len)
        throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
        const x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}