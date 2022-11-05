import assert from "assert";
import { useEffect, useState } from "react";
import { clamp } from "./math";
import { getDeviceDependent } from "./misc";



function getDesktopScrollPercent() {
    let h = document.documentElement,
        b = document.body,
        st = 'scrollTop',
        sh = 'scrollHeight';

    const availableScroll = ((h[sh] || b[sh]) - h.clientHeight);
    const scrolled = h[st] || b[st];

    if (availableScroll < 1e-6) {
        return 0; // when there is no scroll available 
    } else {
        return clamp(scrolled / availableScroll * 100, 0, 100);
    }
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
    return getDesktopScrollPercent();
    // if (getDeviceDependent(false, true)) {
    //     return getDesktopScrollPercent();
    // } else {
    //     return getMobileScrollPercent();
    // }
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