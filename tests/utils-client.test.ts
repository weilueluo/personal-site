import { afterEach, describe, expect, it, vi } from "vitest";
import { getDomainedOrigin, isVerticalScreen } from "../shared/utils-client";

describe("shared/utils-client", () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("getDomainedOrigin returns empty string during SSR", () => {
        expect(getDomainedOrigin("api")).toBe("");
    });

    it("getDomainedOrigin builds a subdomain origin in the browser", () => {
        vi.stubGlobal("window", {
            location: {
                protocol: "https:",
                host: "example.com",
                origin: "https://example.com",
            },
        });

        expect(getDomainedOrigin("api")).toBe("https://api.example.com");
        expect(getDomainedOrigin(" api ")).toBe("https://api.example.com");
        expect(getDomainedOrigin("")).toBe("https://example.com");
    });

    it("isVerticalScreen defaults to true when screen.orientation is not available", () => {
        expect(isVerticalScreen()).toBe(true);
    });

    it("isVerticalScreen detects portrait vs landscape", () => {
        vi.stubGlobal("screen", { orientation: { type: "portrait-primary" } });
        expect(isVerticalScreen()).toBe(true);

        vi.stubGlobal("screen", { orientation: { type: "landscape-primary" } });
        expect(isVerticalScreen()).toBe(false);
    });
});

