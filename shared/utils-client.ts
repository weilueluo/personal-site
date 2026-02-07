"use client";

// https://xxx.com => https://${domain}.xxx.com
export function getDomainedOrigin(domain: string) {
    if (typeof window === "undefined") {
        // server hydration
        return "";
    }

    const safeDomain = domain.trim();
    if (!safeDomain) return window.location.origin;

    return `${window.location.protocol}//${safeDomain}.${window.location.host}`;
}

export function isVerticalScreen() {
    if (typeof screen === "undefined") return true; // server-side or unsupported environment

    const type = screen.orientation?.type;
    return type ? type.startsWith("portrait") : true; // e.g. embedded browsers without orientation API
}
