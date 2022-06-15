import { useFrame } from '@react-three/fiber';
import assert from 'assert';
import { useEffect, useState } from 'react';
import { isMobileOrTablet } from '../scene/global';
import { clamp, playAnimation, playAnimationReverse } from './utils';

export function getScrollPercent() {
    let h = document.documentElement,
        b = document.body,
        st = 'scrollTop',
        sh = 'scrollHeight';
    return clamp((h[st]||b[st]) / ((h[sh]||b[sh]) - h.clientHeight) * 100, 0, 100);
}

export function useHover() {
    const [hover, setHover] = useState(false);
    const pointerOverHandler = () => setHover(true);
    const pointerOutHandler = () => setHover(false);

    return [hover, pointerOverHandler, pointerOutHandler];
}


export function useOddClick() {
    const [oddClick, setOddClick] = useState(false);
    return [() => setOddClick(!oddClick), oddClick];
}

// return a state that takes value from 0-1, for the give from and to percentage of scroll
export function useScrollPercent(from: number, to: number) {
    assert(from < to && from >= 0 && to <= 100);
    const upper = to - from;
    const sp = getScrollPercent();
    let initValue: number;
    if (sp <= from) {
        initValue = 0;
    } else if (sp >= to) {
        initValue = 1.0;
    } else {
        initValue = (sp - from) / upper;
    }

    const [scroll, setScroll] = useState(initValue);
    useEffect(() => {
        window.addEventListener('scroll', (event) => {
            const sp = getScrollPercent();
            if (sp >= from && sp <= to) {
                setScroll((sp - from) / upper);
            }
        });
    }, [from, to, upper]);

    return scroll;
}

export function useAltScroll() {
    const scroll = useScrollPercent(0, 100);
    let altScroll = scroll * 2;
    if (altScroll > 1) {
        altScroll = 2 - altScroll;
    }
    altScroll = clamp(altScroll, 0, 0.99); // avoid flashing animation at 100%

    // make number stay at 0.99 longer
    const stay_duration = 0.15;
    altScroll =
        (Math.min(0.99, altScroll + stay_duration) - stay_duration) /
        (1 - stay_duration);

    return altScroll;
}

export function checkIntersect(object, state) {
    const objectId = object.id;
    const raycaster = state.raycaster;
    raycaster.setFromCamera(state.mouse, state.camera);

    const intersects = raycaster.intersectObject(state.scene, true);
    return intersects.length > 0 && intersects[0].object.id == objectId
}

export function useMouseHover(objectRef) {
    const [hover, setHover] = useState(false);

    useFrame((state) => {
        const object = objectRef.current;
        if (!object) {
            setHover(false);
            return;
        }

        setHover(checkIntersect(object, state));
    });

    return hover;
}

export function getDeviceDependent(mobileValue, DesktopValue) {
    return isMobileOrTablet() ? mobileValue : DesktopValue;
}