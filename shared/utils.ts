import { MutableRefObject } from "react";
import { twMerge } from "tailwind-merge";

export function cookieToObj(cookie: string | undefined): Record<string, string> {
    if (!cookie) return {};

    return cookie.split(";").reduce((obj: Record<string, string>, part) => {
        const trimmed = part.trim();
        if (!trimmed) return obj;

        const eqIndex = trimmed.indexOf("=");
        if (eqIndex === -1) {
            obj[trimmed] = "";
            return obj;
        }

        const key = trimmed.slice(0, eqIndex);
        const value = trimmed.slice(eqIndex + 1);
        obj[key] = value;
        return obj;
    }, {});
}

export function objToCookie(obj: Record<string, string>) {
    return Object.entries(obj)
        .map(([k, v]) => k + "=" + v)
        .join("; ");
}

export const tm = (...classNames: (string | undefined | false | null | 0)[]): string => {
    return twMerge(...classNames);
};

export function timeSinceSeconds(seconds: number) {
    const s = Math.max(0, Math.floor(seconds));

    const units: Array<{ label: string; seconds: number }> = [
        { label: "year", seconds: 31_536_000 },
        { label: "month", seconds: 2_592_000 },
        { label: "day", seconds: 86_400 },
        { label: "hour", seconds: 3_600 },
        { label: "minute", seconds: 60 },
        { label: "second", seconds: 1 },
    ];

    for (const unit of units) {
        const n = Math.floor(s / unit.seconds);
        if (n >= 1 || unit.label === "second") {
            return `${n} ${unit.label}${n === 1 ? "" : "s"}`;
        }
    }

    return "0 seconds";
}

export function timeSince(from: Date, date: Date) {
    const seconds = Math.floor((from.getTime() - date.getTime()) / 1000);

    return timeSinceSeconds(seconds);
}

export function isDevEnv() {
    return typeof process !== "undefined" && process.env.NODE_ENV === "development";
}

export function reTriggerAnimateFunction(element: MutableRefObject<HTMLElement | null>, className: string) {
    return function (_e: MouseEvent) {
        const el = element.current;
        if (!el) return;

        // -> removing the class
        el.classList.remove(className);

        // -> triggering reflow /* The actual magic */
        // without this it wouldn't work. Try uncommenting the line and the transition won't be retriggered.
        // This was, from the original tutorial, will no work in strict mode. Thanks Felis Phasma! The next uncommented line is the fix.
        // element.offsetWidth = element.offsetWidth;

        void el.offsetWidth;

        // -> and re-adding the class
        el.classList.add(className);
    };
}

// https://stackoverflow.com/a/52171480
export const stringHash = (str: string, seed = 42) => {
    let h1 = 0xdeadbeef ^ seed,
        h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
    h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
    h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);

    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};

// https://stackoverflow.com/questions/10687099/how-to-test-if-a-url-string-is-absolute-or-relative
const isAbsolutePath = new RegExp("^(?:[a-z+]+:)?//", "i");

export function isAbsoluteUrl(url: string | undefined | null) {
    if (!url) {
        return false;
    }
    return isAbsolutePath.test(url);
}

export function readDefaultRevalidate() {
    const raw = typeof process !== "undefined" ? process.env.DEFAULT_REVALIDATE : undefined;
    if (raw || raw === "0") {
        const n = Number(raw);
        return Number.isFinite(n) ? n : false;
    }
    return false;
}
