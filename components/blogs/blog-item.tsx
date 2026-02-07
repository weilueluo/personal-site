"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BlogMetadata } from "./graphql";

export function BlogItem({ data }: { data: BlogMetadata }) {
    const pathname = usePathname();

    const displayFilename = data.name.replace(/\.md$/, "").replace(/[^A-Za-z0-9]/g, " ");

    return (
        <Link href={`${pathname}/${data.name}`}>
            <li className="std-hover std-pad flex flex-row flex-wrap justify-between">
                <h2 className="capitalize">{displayFilename}</h2>
                <span className="secondary-text self-center text-gray-600 dark:text-gray-500">
                    {Math.round(data.size / 4)} words
                </span>
            </li>
        </Link>
    );
}
