"use client";

import { useMessages } from "@/shared/translation";

export default function Title() {
    const messages: any = useMessages();

    return <h3>{messages["Index"]["title"]}</h3>;
}
