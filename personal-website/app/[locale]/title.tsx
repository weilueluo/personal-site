"use client";

import { useMessages } from "../context";

export default function Title() {
    const messages: any = useMessages();

    return <h3>{messages["index"]["title"]}</h3>;
}
