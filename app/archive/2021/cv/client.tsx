"use client";

import CV from "@/archive/2021/components/cv/CV";

export default function Archive2021CVClient({ cvContent }: { cvContent: string }) {
    return <CV cvContent={cvContent} />;
}
