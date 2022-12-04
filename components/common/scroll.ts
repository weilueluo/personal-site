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

export function getScrollPercent() {
    return getDesktopScrollPercent();
    // if (getDeviceDependent(false, true)) {
    //     return getDesktopScrollPercent();
    // } else {
    //     return getMobileScrollPercent();
    // }
}




export function getAltScroll() {
    const scroll = getScrollPercent() / 100

    let altScroll = scroll * 2;
    if (altScroll > 1) {
        altScroll = 2 - altScroll;
    }
    const maxScroll = 0.9999 // avoid flashing animation at 100%
    altScroll = clamp(altScroll, 0, maxScroll);

    // make number stay at 0.9999 longer
    const stay_duration = 0.15;
    altScroll =
        (Math.min(maxScroll, altScroll + stay_duration) - stay_duration) /
        (1 - stay_duration);

    return altScroll;
}