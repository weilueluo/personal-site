import { useEffect, useState } from 'react';
import { LoopOnce, LoopRepeat } from 'three';

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

export function useCursorPointerOnHover(hover) {
    useEffect(() => {
        document.body.style.cursor = hover ? 'pointer' : 'auto';
    }, [hover]);
}

export function clamp(num: number, min: number, max: number) {
    return Math.max(Math.min(num, max), min);
}

// https://stackoverflow.com/a/19270021/6880256
export function getRandom(arr: Array<any>, n: number) {
    let result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len)
        throw new RangeError('getRandom: more elements taken than available');
    while (n--) {
        const x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}


export function polar2xyz(theta: number, phi: number, r: number) {
    const x = r * Math.sin(theta) * Math.cos(phi);
    const y = r * Math.sin(theta) * Math.sin(phi);
    const z = r * Math.cos(theta);

    return [x, y, z];
}

export function uniformSphereSample(radius: number) {
    const r1 = Math.random();
    const r2 = Math.random();
    const r3 = Math.random();

    const theta = Math.acos(2.0 * r1 - 1.0);
    const phi = 2 * Math.PI * r2;

    const r = r3 * radius;

    return [theta, phi, r];
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

export function deg2rad(deg) {
    return deg * (Math.PI / 180)
}