import { describe, expect, it } from "vitest";
import {
    removeClientSideCookieTheme,
    resolve,
    setClientSideCookieTheme,
    THEME_KEY,
} from "../shared/theme/theme-utils";

function installDocumentCookieJar() {
    const jar: string[] = [];
    const doc = {
        get cookie() {
            return jar.join("; ");
        },
        set cookie(value: string) {
            jar.push(value);
        },
    };

    const prev = (globalThis as unknown as { document?: unknown }).document;
    Object.defineProperty(globalThis, "document", {
        value: doc,
        configurable: true,
    });

    return {
        jar,
        restore: () => {
            if (typeof prev === "undefined") {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                delete (globalThis as any).document;
            } else {
                Object.defineProperty(globalThis, "document", {
                    value: prev,
                    configurable: true,
                });
            }
        },
    };
}

function extractExpires(cookie: string): Date | null {
    const expires = cookie
        .split(";")
        .map(s => s.trim())
        .find(s => s.toLowerCase().startsWith("expires="));
    if (!expires) return null;
    return new Date(expires.slice("Expires=".length));
}

describe("shared/theme/theme-utils", () => {
    it("resolve returns a resolved theme", () => {
        expect(resolve("system", "dark")).toBe("dark");
        expect(resolve("light", "dark")).toBe("light");
        expect(resolve(undefined, "dark")).toBe("dark");
        expect(resolve(null, "dark")).toBe("dark");
    });

    it("setClientSideCookieTheme writes a session cookie by default", () => {
        const { jar, restore } = installDocumentCookieJar();
        try {
            setClientSideCookieTheme("dark");

            const last = jar[jar.length - 1] || "";
            expect(last).toContain(`${THEME_KEY}=dark`);
            expect(last).toContain("Path=/");
            expect(last).toContain("SameSite=Lax");
            expect(last).not.toContain("Expires=");
        } finally {
            restore();
        }
    });

    it("setClientSideCookieTheme writes an expiring cookie when days > 0", () => {
        const { jar, restore } = installDocumentCookieJar();
        try {
            setClientSideCookieTheme("light", 7);

            const last = jar[jar.length - 1] || "";
            expect(last).toContain(`${THEME_KEY}=light`);
            const expires = extractExpires(last);
            expect(expires).not.toBeNull();
            expect(expires!.getTime()).toBeGreaterThan(Date.now());
        } finally {
            restore();
        }
    });

    it("removeClientSideCookieTheme expires the cookie in the past", () => {
        const { jar, restore } = installDocumentCookieJar();
        try {
            removeClientSideCookieTheme();

            const last = jar[jar.length - 1] || "";
            expect(last).toContain(`${THEME_KEY}=`);
            const expires = extractExpires(last);
            expect(expires).not.toBeNull();
            expect(expires!.getTime()).toBeLessThan(Date.now());
        } finally {
            restore();
        }
    });
});
