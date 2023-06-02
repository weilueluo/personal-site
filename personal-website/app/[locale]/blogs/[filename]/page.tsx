import { fetchBlogCommit, fetchBlogContent } from "@/components/blogs/query";
import Separator from "@/components/ui/Separator";
import BackButton from "@/components/ui/back";
import Link from "next/link";
import { BsCalendar2DateFill } from "react-icons/bs";
import { FaDownload } from "react-icons/fa";
import { SiGithub } from "react-icons/si";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import rehypeMathjax from "rehype-mathjax";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkToc from "remark-toc";
import ShareButton from "./share";

export default async function Page({ params }: { params: { filename: string } }) {
    const blogContentPromise = fetchBlogContent(params.filename);
    const blogCommitPromise = fetchBlogCommit(params.filename);

    const [blogContent, blogCommit] = await Promise.all([blogContentPromise, blogCommitPromise]);

    // console.log("blogContent", blogContent);
    // console.log("blogCommit", blogCommit);

    const blogText = Buffer.from(blogContent.content, "base64").toString("utf-8");
    // console.log("blogText", blogText);

    const date = new Date(blogCommit[0].commit.author.date).toLocaleString();

    return (
        <div>
            <div className="flex flex-row flex-wrap items-center justify-around gap-2 md:justify-between">
                <BackButton />
                <Link href={blogContent.html_url} target="_blank">
                    <span className="icon-text std-hover std-pad">
                        <SiGithub /> View on GitHub
                    </span>
                </Link>
                <Link href={blogContent.download_url} target="_blank" download={true}>
                    <span className="icon-text std-hover std-pad">
                        <FaDownload /> Download
                    </span>
                </Link>
                <ShareButton />
                <span className="icon-text std-pad">
                    <BsCalendar2DateFill /> {date}
                </span>
            </div>
            <Separator className="mb-2 h-2" />
            <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath, remarkToc]}
                rehypePlugins={[rehypeRaw, rehypeMathjax]}
                className="prose-sm max-w-none md:prose">
                {blogText}
            </ReactMarkdown>
        </div>
    );
}
