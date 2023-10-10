import MessageFormat from "@messageformat/core";
import { Messages } from "./type";
import { readDefaultRevalidate } from "../utils";

export async function fetchMessages(locale: string): Promise<Messages> {
    if (!locale) {
        throw new Error(`locale is nullish: ${locale}`);
    }
    const messages = await fetch(`http://127.0.0.1:3000/api/i18n/${locale}`, {
        next: {
            revalidate: readDefaultRevalidate(),
        },
    }).then(res => res.json());

    return messages;
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

    if (locale && values) {
        const mf = new MessageFormat(locale);
        const msgFunc = mf.compile(messages[id]);
        return msgFunc(values);
    } else {
        return messages[id];
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
