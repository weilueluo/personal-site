import { fetchBlogCommit, fetchBlogContent, getDiscussion } from "@/components/blogs/query";
import BackButton from "@/components/ui/back";
import IconedText from "@/components/ui/icon-text";
import Separator from "@/components/ui/separator";
import { fetchMessages, FormattedMessage } from "@/shared/i18n/translation";
import { BasePageProps } from "@/shared/types/comp";
import Link from "next/link";
import { BsCalendar2DateFill } from "react-icons/bs/index";
import { FaDownload, FaLink } from "react-icons/fa/index";
import { SiGithub } from "react-icons/si/index";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import rehypeMathjax from "rehype-mathjax";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkToc from "remark-toc";
import ShareButton from "../../../../components/blogs/filename/share";
import remarkGemoji from "remark-gemoji";
import { AiFillClockCircle } from "react-icons/ai";

export default async function Page({ params }: { params: { filename: string } } & BasePageProps) {
    const blogContentPromise = fetchBlogContent(params.filename);
    const blogCommitPromise = fetchBlogCommit(params.filename);
    const messagesPromise = fetchMessages(params.locale);
    const discussionPromise = getDiscussion(params.filename, 10, "");

    const [blogContent, blogCommit, messages, discussion] = await Promise.all([
        blogContentPromise,
        blogCommitPromise,
        messagesPromise,
        discussionPromise,
    ]);

    const blogText = Buffer.from(blogContent.content, "base64").toString("utf-8");

    const date = new Date(blogCommit[0].commit.author.date).toLocaleString();

    const hasDiscussion = discussion.search.nodes.length > 0;
    // console.log("discussion.search", discussion.search);
    // console.log("discussion.search.nodes[0].comments", discussion.search.nodes[0].comments);

    return (
        <div>
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
            {hasDiscussion && (
                <>
                    <Separator className="mb-2 h-2" />
                    <h1 className="text-center font-bold">Comments (Experimental)</h1>

                    <Separator className="mb-4 h-2" />
                    <ul className="flex w-full flex-col items-center gap-2">
                        {discussion.search.nodes[0].comments.nodes.map((comment, i) => (
                            // px-2 border border-black dark:border-white
                            <li key={i} className="w-[80%] ">
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm, remarkMath, remarkToc, remarkGemoji]}
                                    rehypePlugins={[rehypeRaw, rehypeMathjax]}
                                    className="prose-sm mx-auto my-0 max-w-none dark:prose-invert md:prose">
                                    {comment.body}
                                </ReactMarkdown>
                                <span className="secondary-text secondary-hover flex flex-row items-center gap-1 text-gray-500 hover:cursor-default">
                                    <AiFillClockCircle className="inline-block" />
                                    <span className="italic ">{new Date(comment.createdAt).toLocaleString()}</span>
                                </span>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-4 flex flex-row justify-end">
                        <Link
                            href={`https://github.com/weilueluo/blogs/discussions/${discussion.search.nodes[0].number}`}
                            target="_blank">
                            <IconedText>
                                <FaLink /> {"Open in GitHub"}
                            </IconedText>
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
}
