import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { fetchBlogCommit, fetchBlogContent, fetchBlogDirectory } from "@/components/blogs/query";
import remarkMath from "remark-math";
import rehypeMathjax from "rehype-mathjax";
import remarkToc from "remark-toc";
import { BsCalendar2DateFill } from "react-icons/bs";
import Separator from "@/components/ui/Separator";
import BackButton from "@/components/ui/back";
import Link from "next/link";
import { FaDownload } from "react-icons/fa";
import { SiGithub } from "react-icons/si";
import { ImStatsBars } from "react-icons/im";

export async function generateStaticParams() {
    const data = await fetchBlogDirectory();
    return data.map((data) => ({ filename: data.name }));
}

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
                <span className="icon-text std-pad">
                    <ImStatsBars /> {blogContent.size} bytes
                </span>
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
