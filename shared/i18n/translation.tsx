import MessageFormat from "@messageformat/core";
import { getMessages } from "next-intl/server";
import { Messages } from "./type";

export async function fetchMessages(locale: string): Promise<Messages> {
    if (!locale) {
        throw new Error(`locale is nullish: ${locale}`);
    }

    const messages = (await getMessages({ locale })) as Messages;
    return messages;
}

function resolveMessage(messages: Record<string, unknown>, id: string): string {
    const parts = id.split(".");
    let current: unknown = messages;
    for (const part of parts) {
        if (current && typeof current === "object" && part in current) {
            current = (current as Record<string, unknown>)[part];
        } else {
            throw new Error(`message not found for id: ${id}`);
        }
    }
    if (typeof current !== "string") {
        throw new Error(`message is not a string for id: ${id}`);
    }
    return current;
}

export function formattedMessage(
    messages: Messages,
    id: keyof Messages,
    locale?: string,
    values?: Record<string, unknown> | unknown[]
) {
    // console.log("message", id, messages[id]);

    if ((locale && !values) || (!locale && values)) {
        throw new Error("locale and values must be both nullish or both defined");
    }

    const message = resolveMessage(
        messages as unknown as Record<string, unknown>,
        id as string,
    );

    if (locale && values) {
        const mf = new MessageFormat(locale);
        const msgFunc = mf.compile(message);
        return msgFunc(values);
    } else {
        return message;
    }
}

export function FormattedMessage({
    messages,
    id,
    locale,
    values,
}: {
    messages: Messages;
    id: keyof Messages;
    locale?: string;
    values?: Record<string, unknown> | unknown[];
}) {
    const message = formattedMessage(messages, id, locale, values);

    return <>{message}</>;
}
