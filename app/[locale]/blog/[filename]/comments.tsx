"use client";
import IconedText from "@/components/ui/icon-text";
import Loading from "@/components/ui/loading/spinner";
import Separator from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formattedMessage, FormattedMessage } from "@/shared/i18n/translation";
import { Messages } from "@/shared/i18n/type";
import { BaseCompProps } from "@/shared/types/comp";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { AiFillClockCircle } from "react-icons/ai";
import { FiSend } from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGemoji from "remark-gemoji";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkToc from "remark-toc";
import { z } from "zod";

export interface CommentSectionProps {
    filename: string;
}

interface Comment {
    content: string;
    time: number;
}

function useComments(filename: string) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);

    const reload = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/comments?filename=${encodeURIComponent(filename)}`, {
                cache: "no-store",
            });
            const data = await response.json();
            setComments(data.comments || []);
        } catch (error) {
            console.error("Failed to load comments", error);
        } finally {
            setLoading(false);
        }
    }, [filename]);

    const sendComment = useCallback(
        async (content: string) => {
            const response = await fetch("/api/comments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ filename, content }),
            });

            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                throw new Error(data.error || "Failed to send comment");
            }
            await reload();
        },
        [filename, reload]
    );

    useEffect(() => {
        reload();
    }, [reload]);

    return { comments, loading, reload, sendComment };
}

export default function CommentSection({
    filename,
    messages,
    locale: _locale,
}: CommentSectionProps & BaseCompProps<"div">) {
    const { comments, loading, sendComment } = useComments(filename);

    return (
        <>
            <h1 className="text-center font-bold">
                <FormattedMessage messages={messages} id="blog.comments.title" />
            </h1>
            <Separator className="mb-6 h-4" />
            <div className="flex w-full flex-col items-center md:w-4/5">
                {comments.length > 0 && (
                    <>
                        <ul className="flex w-full flex-col gap-4">
                            {comments.map((comment, i) => (
                                // px-2 border border-black dark:border-white
                                <li key={i}>
                                    <div className="prose-sm mx-auto my-0 max-w-none dark:prose-invert md:prose">
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm, remarkMath, remarkToc, remarkGemoji]}
                                            rehypePlugins={[rehypeRaw]}>
                                            {comment.content}
                                        </ReactMarkdown>
                                    </div>
                                    <span className="secondary-text secondary-hover flex flex-row items-center gap-1 text-gray-500 hover:cursor-default">
                                        <AiFillClockCircle className="inline-block" />
                                        <span className="italic ">{new Date(comment.time).toLocaleString()}</span>
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
                {loading && <Loading className="h-24" />}
                <SendComment sendComment={sendComment} messages={messages} />
            </div>
        </>
    );
}

const getRandomSmallMilliseconds = () => {
    return Math.floor(Math.random() * 50);
};

const commentSchema = z.object({
    content: z.string().trim().min(1),
});

type CommentFormValues = z.infer<typeof commentSchema>;

function SendComment({ sendComment, messages }: { sendComment: (comment: string) => Promise<void>; messages: Messages }) {
    const [buttonText, setButtonText] = useState(formattedMessage(messages, "blog.comments.send"));
    const form = useForm<CommentFormValues>({
        resolver: zodResolver(commentSchema),
        defaultValues: { content: "" },
    });

    const onSendComment = async (values: CommentFormValues) => {
        try {
            await sendComment(values.content);
            form.reset();
            initCooldown();
        } catch (error) {
            console.error("Failed to send comment", error);
        }
    };

    const initCooldown = () => {
        setCooldown(true);
        const startTime = Date.now();
        const cooldownMs = 5000;
        const updateCooldown = () => {
            setTimeout(() => {
                const currTime = Date.now();
                const timeLeft = cooldownMs - (currTime - startTime);
                if (timeLeft <= 0) {
                    setButtonText(formattedMessage(messages, "blog.comments.send"));
                    setCooldown(false);
                } else {
                    setButtonText(`${(timeLeft / 1000).toFixed(2)}s`);
                    updateCooldown();
                }
            }, getRandomSmallMilliseconds());
        };
        updateCooldown();
    };

    const [cooldown, setCooldown] = useState(false);

    return (
        <form onSubmit={form.handleSubmit(onSendComment)} className="mt-8 flex max-w-full flex-col gap-3">
            <Textarea
                className="std-bg dark:std-bg-dark std-text max-w-full rounded-md border border-gray-400 p-2"
                placeholder={formattedMessage(messages, "blog.comments.placeholder")}
                rows={3}
                {...form.register("content")}
            />
            <Button
                type="submit"
                disabled={cooldown}
                variant="ghost"
                className="flex w-full flex-row disabled:pointer-events-none disabled:text-gray-600">
                <IconedText className="flex w-full flex-row items-center justify-center">
                    <FiSend /> {buttonText}
                </IconedText>
            </Button>
        </form>
    );
}
