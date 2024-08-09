"use client";
import IconedText from "@/components/ui/icon-text";
import Loading from "@/components/ui/loading/spinner";
import Separator from "@/components/ui/separator";
import { useComments } from "@/shared/dynamo";
import { BaseCompProps } from "@/shared/types/comp";
import { useEffect, useRef, useState } from "react";
import { AiFillClockCircle } from "react-icons/ai";
import { FiSend } from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGemoji from "remark-gemoji";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkToc from "remark-toc";

export interface CommentSectionProps {
    filename: string;
}

export default function CommentSection({ filename, messages, locale }: CommentSectionProps & BaseCompProps<"div">) {
    const tableName = process.env.NEXT_PUBLIC_COMMENT_TABLE_NAME ?? "";
    const identityPoolId = process.env.NEXT_PUBLIC_COMMENT_COGNITO_POOL_ID ?? "";
    // console.log("tableName", tableName);
    // console.log("identityPoolId", identityPoolId);
    const { comments, loading, reload, sendComment } = useComments(identityPoolId, tableName, filename);

    const commentTextareaRef = useRef<HTMLTextAreaElement>(null);
    const onSendComment = () => {
        if (commentTextareaRef.current) {
            const comment = commentTextareaRef.current.value;
            if (comment) {
                sendComment(comment);
                commentTextareaRef.current.value = "";
            }
        }
    };

    useEffect(() => {
        reload();
    }, [reload]);

    return (
        <>
            <h1 className="text-center font-bold">Comments (Experimental)</h1>
            <Separator className="mb-4 h-2" />
            <div className="flex w-4/5 flex-col items-center">
                {comments.length > 0 && (
                    <>
                        <ul className="flex w-full flex-col gap-2">
                            {comments.map((comment, i) => (
                                // px-2 border border-black dark:border-white
                                <li key={i}>
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm, remarkMath, remarkToc, remarkGemoji]}
                                        rehypePlugins={[rehypeRaw]}
                                        className="prose-sm mx-auto my-0 max-w-none dark:prose-invert md:prose">
                                        {comment.content}
                                    </ReactMarkdown>
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
                {/* <Separator className="mb-6 mt-6 h-2" /> */}
                <SendComment sendComment={sendComment} />
            </div>
        </>
    );
}

const getRandomSmallMilliseconds = () => {
    return Math.floor(Math.random() * 50);
};

function SendComment({ sendComment }: { sendComment: (comment: string) => void }) {
    const [buttonText, setButtonText] = useState("Add Comment");
    const commentTextareaRef = useRef<HTMLTextAreaElement>(null);
    const onSendComment = () => {
        if (commentTextareaRef.current) {
            const comment = commentTextareaRef.current.value;
            if (comment) {
                sendComment(comment);
                commentTextareaRef.current.value = "";
                initCooldown();
            }
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
                    setButtonText("Add Comment");
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
        <div className="mt-6 flex flex-col gap-2">
            <textarea
                className="std-bg dark:std-bg-dark std-text w-full rounded-md border border-gray-400 p-2"
                placeholder={"Write something..."}
                rows={3}
                cols={60}
                ref={commentTextareaRef}
            />
            <button
                type="submit"
                onClick={onSendComment}
                disabled={cooldown}
                className="flex w-full flex-row  disabled:pointer-events-none disabled:text-gray-600">
                <IconedText className="flex w-full flex-row items-center justify-center">
                    <FiSend /> {buttonText}
                </IconedText>
            </button>
        </div>
    );
}
