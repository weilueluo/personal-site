"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function BlogItem({ filename }: { filename: string }) {
    const pathname = usePathname();

    const displayFilename = filename.replace(/\.md$/, "").replace(/[^A-Za-z0-9]/g, " ");

    return (
        <Link href={`${pathname}/${filename}`}>
            <li className="std-hover std-pad">
                <h2 className="capitalize">{displayFilename}</h2>
            </li>
        </Link>
    );
}
