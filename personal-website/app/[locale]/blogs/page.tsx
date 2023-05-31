"use client";

import { GithubBlogEntry } from "@/components/blogs/graphql";
import Separator from "@/components/ui/Separator";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useBlogsMetadata } from "./metadata-context";

export default function Page() {
    return <Content />;
}

function Content() {
    const data = useBlogsMetadata();

    return (
        <div className="flex flex-col items-center justify-center gap-4 text-xl">
            <h1 className="font-bold">Blogs</h1>
            <Separator className="mb-2 h-0" />
            <ul className="flex flex-col gap-2">
                {data.repository.object.entries
                    .filter((entry) => entry.name.endsWith(".md"))
                    .map((entry) => (
                        <Entry data={entry} key={entry.name} />
                    ))}
            </ul>
        </div>
    );
}

function Entry({ data }: { data: GithubBlogEntry }) {
    const pathname = usePathname();

    return (
        <Link href={`${pathname}/${data.object.id}`}>
            <li className="std-hover std-pad">
                <h2>{data.name}</h2>
                {/* <span>{data.object.oid}</span> */}
            </li>
        </Link>
    );
}
