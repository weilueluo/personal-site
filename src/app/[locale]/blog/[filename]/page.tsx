import ShareButton from "@/components/blogs/filename/share";
import { fetchBlogCommit, fetchBlogContent } from "@/components/blogs/query";
import BackButton from "@/components/ui/back";
import IconedText from "@/components/ui/icon-text";
import Separator from "@/components/ui/separator";
import { fetchMessages, FormattedMessage } from "@/shared/i18n/translation";
import { BasePageProps } from "@/shared/types/comp";
import Link from "next/link";
import { BsCalendar2DateFill } from "react-icons/bs";
import { FaDownload } from "react-icons/fa";
import { SiGithub } from "react-icons/si";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import rehypeMathjax from "rehype-mathjax";
import rehypeRaw from "rehype-raw";
import remarkGemoji from "remark-gemoji";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkToc from "remark-toc";
import CommentSection from "./comments";

export default async function Page({ params }: { params: { filename: string } } & BasePageProps) {
    const blogContentPromise = fetchBlogContent(params.filename);
    const blogCommitPromise = fetchBlogCommit(params.filename);
    const messagesPromise = fetchMessages(params.locale);

    const [blogContent, blogCommit, messages] = await Promise.all([
        blogContentPromise,
        blogCommitPromise,
        messagesPromise,
    ]);

    const blogText = Buffer.from(blogContent.content, "base64").toString("utf-8");

    const date = new Date(blogCommit[0].commit.author.date).toLocaleString();

    return (
        <div className="flex flex-col items-center">
            <div className="flex flex-row flex-wrap items-center justify-around gap-2 md:justify-between">
                <BackButton messages={messages} locale={params.locale} />
                <Link href={blogContent.html_url} target="_blank">
                    <IconedText>
                        <SiGithub /> <FormattedMessage messages={messages} id="blog.view_in_github" />
                    </IconedText>
                </Link>
                <Link href={blogContent.download_url} target="_blank" download={true}>
                    <IconedText>
                        <FaDownload /> <FormattedMessage messages={messages} id="blog.download" />
                    </IconedText>
                </Link>
                <ShareButton messages={messages} />
                <IconedText hover={false}>
                    <BsCalendar2DateFill /> {date}
                </IconedText>
            </div>
            <Separator className="mb-2 h-2" />
            <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath, remarkToc, remarkGemoji]}
                rehypePlugins={[rehypeRaw, rehypeMathjax]}
                className="prose-sm mx-auto my-0 max-w-none dark:prose-invert md:prose">
                {blogText}
            </ReactMarkdown>
            <Separator className="mb-2 mt-12 h-2" />
            <CommentSection messages={messages} locale={params.locale} filename={params.filename} />
        </div>
    );
}
