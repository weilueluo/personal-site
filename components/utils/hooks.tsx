import { useFrame } from '@react-three/fiber';
import assert from 'assert';
import { useEffect, useState } from 'react';
import { isMobileOrTablet } from '../scene/global';
import { clamp, playAnimation, playAnimationReverse } from './utils';

function getDesktopScrollPercent() {
    let h = document.documentElement,
        b = document.body,
        st = 'scrollTop',
        sh = 'scrollHeight';

    return clamp(
        ((h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight)) * 100,
        0,
        100
    );
}

let consistentRealTarget = null;
function getMobileOffset(e) {
    let touch = e.touches[0] || e.changedTouches[0];
    let realTarget = document.elementFromPoint(touch.clientX, touch.clientY);

    if (realTarget) {
        consistentRealTarget = realTarget;
    }

    let offsetX =
        touch.clientX - consistentRealTarget.getBoundingClientRect().x;
    let offsetY =
        touch.clientY - consistentRealTarget.getBoundingClientRect().y;

    return [offsetX, offsetY];
}

let mobileScrolled = 0;
let persistentScrolledAmount = 0;
let scrollEventStartOffsetY = 0;
const mobileScrollSpeed = 1.0

export function initMobileScroll() {
    window.addEventListener('touchstart', (e) => {
        const [_, offsetY] = getMobileOffset(e);
        scrollEventStartOffsetY = offsetY;
    });

    ['touchend', 'touchcancel'].forEach((eventName) => {
        window.addEventListener(eventName, (e) => {
            const [_, offsetY] = getMobileOffset(e);
            persistentScrolledAmount += -(offsetY - scrollEventStartOffsetY);
            mobileScrolled = persistentScrolledAmount;
        });
    });

    window.addEventListener('touchmove', (e) => {
        const [_, offsetY] = getMobileOffset(e);
        mobileScrolled =
            persistentScrolledAmount + -(offsetY - scrollEventStartOffsetY);
    });
}

function getMobileScrollPercent() {
    let h = document.documentElement,
        b = document.body,
        sh = 'scrollHeight';

    return clamp(
        (mobileScrolled / ((h[sh] || b[sh]) - h.clientHeight)) * 100 * mobileScrollSpeed,
        0,
        100
    );
}

export function getScrollPercent() {
    if (getDeviceDependent(false, true)) {
        return getDesktopScrollPercent();
    } else {
        return getMobileScrollPercent();
    }
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
        ['scroll', 'touchmove'].forEach((eventName) => {
            window.addEventListener(eventName, () => {
                const sp = getScrollPercent();
                if (sp >= from && sp <= to) {
                    setScroll((sp - from) / upper);
                }
            });
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

export function checkIntersect(object, scene, raycaster, mouse, camera) {
    const objectId = object.id;
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObject(scene, true);
    return intersects.length > 0 && intersects[0].object.id == objectId;
}

export function useMouseHover(objectRef) {
    const [hover, setHover] = useState(false);

    useFrame((state) => {
        const object = objectRef.current;
        if (!object) {
            setHover(false);
            return;
        }

        setHover(checkIntersect(object, state.scene, state.raycaster, state.mouse, state.camera));
    });

    return hover;
}

export function getDeviceDependent(mobileValue, DesktopValue) {
    return isMobileOrTablet() ? mobileValue : DesktopValue;
}
