"use client";

// https://xxx.com => https://${domain}.xxx.com
export function getDomainedOrigin(domain: string) {
    const domainedOrigin = `${window.location.protocol}//${domain}.${window.location.host}`;

    console.log(`domained origin: ${domainedOrigin}`);

    return domainedOrigin;
}

export function isVerticalScreen() {
    return screen.orientation.type.startsWith("portrait");
}
