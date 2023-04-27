"use client";
import { enableMapSet } from "immer";
import { useEffect } from "react";

// immer
enableMapSet();

function watchForHover() {
    // lastTouchTime is used for ignoring emulated mousemove events
    let lastTouchTime = 0;

    function enableHover() {
        // @ts-ignore
        if (new Date() - lastTouchTime < 500) return;
        document.body.classList.add("hasHover");
    }

    function disableHover() {
        document.body.classList.remove("hasHover");
    }

    function updateLastTouchTime() {
        // @ts-ignore
        lastTouchTime = new Date();
    }

    document.addEventListener("touchstart", updateLastTouchTime, true);
    document.addEventListener("touchstart", disableHover, true);
    document.addEventListener("mousemove", enableHover, true);

    enableHover();
}

export default function Init() {
    useEffect(() => {
        // disable hover for touch devices, because the effect remains after user clicks on it until element loses focus
        // https://stackoverflow.com/questions/23885255/how-to-remove-ignore-hover-css-style-on-touch-devices

        watchForHover();
    }, []);

    return <></>;
}
