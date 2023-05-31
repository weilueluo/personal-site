"use client";

import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { BlogDataProvider, useBlogData } from "./data-provider";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

export default function Page({ params }: { params: { id: number } }) {
    return (
        <BlogDataProvider id={params.id}>
            <Content />
        </BlogDataProvider>
    );
}

function Content() {
    const data = useBlogData();

    return (
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
            {data.node.text}
        </ReactMarkdown>
    );
}
