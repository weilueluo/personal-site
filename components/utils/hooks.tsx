import assert from 'assert';
import { useState, useEffect } from 'react'
import { LoopRepeat } from 'three';
import { getScrollPercent } from '../context/ScrollContext';
import { playAnimationReverse, playAnimation, clamp } from './utils';

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

// return a state that takes value from 0-1, for the give from and to percentage of scroll
export function useScrollPercent(from: number, to: number) {
    assert(from < to && from >= 0 && to <= 100)
    const upper = to - from
    const sp = getScrollPercent();
    let initValue: number
    if (sp <= from) {
        initValue = 0
    } else if (sp >= to) {
        initValue = 1.0
    } else {
        initValue = (sp - from) / upper
    }
    
    const [scroll, setScroll] = useState(initValue)
    useEffect(() => {
        window.addEventListener('scroll', event => {
            const sp = getScrollPercent();
            if (sp >= from && sp <= to) {
                setScroll((sp - from) / upper)
            }
        })
    }, []) 

    return scroll;
}

export function useAltScroll() {
    const scroll = useScrollPercent(0, 100);
    let altScroll = scroll * 2
    if (altScroll > 1) {
        altScroll = 2 - altScroll
    }
    altScroll = clamp(altScroll, 0, 0.99)  // avoid flashing animation at 100%
    return altScroll
}