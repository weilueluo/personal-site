import { useState, useEffect } from 'react'
import { LoopRepeat } from 'three';
import { playAnimationReverse, playAnimation } from './utils';

export function useHover() {
    const [hover, setHover] = useState(false);
    const pointerOverHandler = () => setHover(true);
    const pointerOutHandler = () => setHover(false);

    return [hover, pointerOverHandler, pointerOutHandler]
}

export function useUpdateEffect(func, deps = []) {
    const [firstTime, setFirstTime] = useState(true)

    useEffect(() => {
        if (firstTime) {
            setFirstTime(false)
        } else {
            func()
        }
    }, deps)
}

export function useOddClick() {
    const [oddClick, setOddClick] = useState(false);
    return [() => setOddClick(!oddClick), oddClick]
}

export function playAnimationsOnClick(actions, reverseOnOddClick = true, duration = 1) {
    const [handler, oddClick] = useOddClick()
    useUpdateEffect(() => {
        for (const action of actions) {
            if (reverseOnOddClick) {
                if (oddClick) {
                    playAnimation(action, duration)
                } else {
                    playAnimationReverse(action, duration)
                }
            } else {
                playAnimation(action)
            }
        }
    }, [oddClick])

    return handler
}

export function runOnClick(func, oddClickFunc = null) {
    const [oddClick, setOddClick] = useState(false);
    useUpdateEffect(() => {
        for (const action of actions) {
            if (oddClickFunc && oddClick) {
                oddClickFunc()
            } else {
                func()
            }
               
        }
    }, [oddClick])

    return () => setOddClick(!oddClick)
}