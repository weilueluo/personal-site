import { fetchBlogCommit, fetchBlogContent } from "@/components/blogs/query";
import BackButton from "@/components/ui/back";
import Separator from "@/components/ui/separator";
import Link from "next/link";
import { BsCalendar2DateFill } from "react-icons/bs/index";
import { FaDownload } from "react-icons/fa/index";
import { SiGithub } from "react-icons/si/index";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import rehypeMathjax from "rehype-mathjax";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkToc from "remark-toc";
import ShareButton from "../../../../components/blogs/filename/share";
import { BasePageProps } from "@/shared/types/comp";
import { fetchMessages } from "@/shared/i18n/translation";
import IconedText from "@/components/ui/icon-text";

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
        <div>
            <div className="flex flex-row flex-wrap items-center justify-around gap-2 md:justify-between">
                <BackButton messages={messages} locale={params.locale} />
                <Link href={blogContent.html_url} target="_blank">
                    <IconedText>
                        <SiGithub /> View on GitHub
                    </IconedText>
                </Link>
                <Link href={blogContent.download_url} target="_blank" download={true}>
                    <IconedText>
                        <FaDownload /> Download
                    </IconedText>
                </Link>
                <ShareButton />
                <IconedText hover={false}>
                    <BsCalendar2DateFill /> {date}
                </IconedText>
            </div>
            <Separator className="mb-2 h-2" />
            <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath, remarkToc]}
                rehypePlugins={[rehypeRaw, rehypeMathjax]}
                className="prose-sm mx-auto my-0 max-w-none dark:prose-invert md:prose">
                {blogText}
            </ReactMarkdown>
        </div>
    );
}
