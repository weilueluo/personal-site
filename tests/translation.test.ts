import { describe, expect, it } from "vitest";
import { formattedMessage } from "../shared/i18n/translation";

describe("shared/i18n/translation", () => {
    it("returns the raw message when locale/values are omitted", () => {
        const messages = { about: { email: "Email" } } as any;
        expect(formattedMessage(messages, "about.email" as any)).toBe("Email");
    });

    it("formats ICU messages when locale and values are provided", () => {
        const messages = { about: { sendMessage: { success: "Sent. ID: {id}" } } } as any;
        expect(formattedMessage(messages, "about.sendMessage.success" as any, "en", { id: 123 })).toBe("Sent. ID: 123");
    });

    it("throws when locale and values are not both provided", () => {
        const messages = { about: { email: "Email" } } as any;
        expect(() => formattedMessage(messages, "about.email" as any, "en")).toThrow();
        expect(() => formattedMessage(messages, "about.email" as any, undefined, { a: 1 })).toThrow();
    });

    it("throws when a message id is missing", () => {
        const messages = { about: { email: "Email" } } as any;
        expect(() => formattedMessage(messages, "about.missing" as any)).toThrow(/message not found/i);
    });
});

