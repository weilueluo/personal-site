"use client";

// https://xxx.com => https://${domain}.xxx.com
export function getDomainedOrigin(domain: string) {
    if (typeof window === "undefined") {
        // server hydration
        return "";
    }
    const domainedOrigin = `${window.location.protocol}//${domain}.${window.location.host}`;

    console.log(`domained origin: ${domainedOrigin}`);

    return domainedOrigin;
}

export function isVerticalScreen() {
    if (screen && screen.orientation && screen.orientation.type) {
        return screen.orientation.type.startsWith("portrait");
    } else {
        return true; // probably in wechat app browser , or server side hydration
    }
}
