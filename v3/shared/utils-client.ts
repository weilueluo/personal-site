"use client";

// https://xxx.com => https://${domain}xxx.com
export function getDomainedOrigin(domain: string) {
    return `${window.location.protocol}//${domain}.${window.location.host}`;
}
