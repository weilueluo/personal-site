import { describe, expect, it, vi } from "vitest";
import {
    cookieToObj,
    isAbsoluteUrl,
    isDevEnv,
    objToCookie,
    readDefaultRevalidate,
    reTriggerAnimateFunction,
    stringHash,
    timeSince,
    timeSinceSeconds,
} from "../shared/utils";

describe("shared/utils", () => {
    it("cookieToObj parses cookie header strings", () => {
        expect(cookieToObj(undefined)).toEqual({});
        expect(cookieToObj("")).toEqual({});
        expect(cookieToObj("a=b; c=d")).toEqual({ a: "b", c: "d" });
        expect(cookieToObj("token=a=b=c; x=y")).toEqual({ token: "a=b=c", x: "y" });
        expect(cookieToObj("flag; a=b")).toEqual({ flag: "", a: "b" });
    });

    it("objToCookie serializes objects into cookie header strings", () => {
        expect(objToCookie({ a: "b", c: "d" })).toBe("a=b; c=d");
    });

    it("timeSinceSeconds formats values with correct units and pluralization", () => {
        expect(timeSinceSeconds(0)).toBe("0 seconds");
        expect(timeSinceSeconds(1)).toBe("1 second");
        expect(timeSinceSeconds(59)).toBe("59 seconds");
        expect(timeSinceSeconds(60)).toBe("1 minute");
        expect(timeSinceSeconds(61)).toBe("1 minute");
        expect(timeSinceSeconds(120)).toBe("2 minutes");
        expect(timeSinceSeconds(3_600)).toBe("1 hour");
        expect(timeSinceSeconds(86_400)).toBe("1 day");
        expect(timeSinceSeconds(31_536_000)).toBe("1 year");
    });

    it("timeSince clamps negative deltas to 0 seconds", () => {
        const earlier = new Date("2020-01-01T00:00:00.000Z");
        const later = new Date("2020-01-02T00:00:00.000Z");
        expect(timeSince(earlier, later)).toBe("0 seconds");
    });

    it("isDevEnv reflects NODE_ENV", () => {
        const prev = process.env.NODE_ENV;
        process.env.NODE_ENV = "development";
        expect(isDevEnv()).toBe(true);
        process.env.NODE_ENV = "production";
        expect(isDevEnv()).toBe(false);
        process.env.NODE_ENV = prev;
    });

    it("reTriggerAnimateFunction retriggers CSS animation class", () => {
        const remove = vi.fn();
        const add = vi.fn();
        let offsetReads = 0;

        const el = {
            classList: { remove, add },
            get offsetWidth() {
                offsetReads += 1;
                return 0;
            },
        } as unknown as HTMLElement;

        const ref = { current: el };
        const handler = reTriggerAnimateFunction(ref, "shake");

        handler({} as unknown as MouseEvent);

        expect(remove).toHaveBeenCalledWith("shake");
        expect(offsetReads).toBe(1);
        expect(add).toHaveBeenCalledWith("shake");
    });

    it("reTriggerAnimateFunction is a no-op when the ref is null", () => {
        const ref = { current: null } as { current: HTMLElement | null };
        const handler = reTriggerAnimateFunction(ref, "shake");
        expect(() => handler({} as unknown as MouseEvent)).not.toThrow();
    });

    it("stringHash is deterministic", () => {
        expect(stringHash("abc")).toBe(stringHash("abc"));
        expect(stringHash("abc", 1)).not.toBe(stringHash("abc", 2));
    });

    it("isAbsoluteUrl detects absolute URLs", () => {
        expect(isAbsoluteUrl(null)).toBe(false);
        expect(isAbsoluteUrl("")).toBe(false);
        expect(isAbsoluteUrl("/relative/path")).toBe(false);
        expect(isAbsoluteUrl("https://example.com")).toBe(true);
        expect(isAbsoluteUrl("//cdn.example.com/lib.js")).toBe(true);
    });

    it("readDefaultRevalidate returns a finite number or false", () => {
        const prev = process.env.DEFAULT_REVALIDATE;

        delete process.env.DEFAULT_REVALIDATE;
        expect(readDefaultRevalidate()).toBe(false);

        process.env.DEFAULT_REVALIDATE = "0";
        expect(readDefaultRevalidate()).toBe(0);

        process.env.DEFAULT_REVALIDATE = "15";
        expect(readDefaultRevalidate()).toBe(15);

        process.env.DEFAULT_REVALIDATE = "nope";
        expect(readDefaultRevalidate()).toBe(false);

        if (typeof prev === "string") {
            process.env.DEFAULT_REVALIDATE = prev;
        } else {
            delete process.env.DEFAULT_REVALIDATE;
        }
    });
});
