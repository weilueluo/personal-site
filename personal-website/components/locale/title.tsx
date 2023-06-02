"use client";

import { useMessages } from "../../shared/contexts/translation";

export default function Title() {
    const messages: any = useMessages();

    return <h3>{messages["index"]["title"]}</h3>;
}
