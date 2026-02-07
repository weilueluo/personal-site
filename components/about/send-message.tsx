"use client";

import { tm } from "@/shared/utils";
import "../ui/border.scss";
import "./send-message.scss";

import Loading from "@/components/ui/loading/spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormattedMessage, formattedMessage } from "@/shared/i18n/translation";
import { BaseCompProps } from "@/shared/types/comp";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { FieldErrors, useForm } from "react-hook-form";
import { BsSendFill } from "react-icons/bs";
import { IoCheckbox } from "react-icons/io5";
import { z } from "zod";
import IconedText from "../ui/icon-text";

export interface SendMessageOutput {
    MessageId?: string;
}

export const SEND_AGAIN_DELAY = 5; // in seconds

export type SendMessageStatus = "sending" | "idle" | "error" | "success";

const getRandomSmallMilliseconds = () => {
    return Math.floor(Math.random() * 50);
};

const sendMessageSchema = z.object({
    message: z.string().trim().min(1, "Message is empty"),
    name: z.string().trim().optional(),
    contact: z.string().trim().optional(),
});

type SendMessageValues = z.infer<typeof sendMessageSchema>;

export default function SendMessage({ messages, locale, className, ...rest }: BaseCompProps<"div">) {
    const form = useForm<SendMessageValues>({
        resolver: zodResolver(sendMessageSchema),
        defaultValues: {
            message: "",
            name: "",
            contact: "",
        },
    });

    const [showInfo, setShowInfo] = useState(false);

    const [status, setStatus] = useState<SendMessageStatus>("idle");
    const [systemMessage, setSystemMessage] = useState<string>("");

    const [buttonText, setButtonText] = useState<string>(formattedMessage(messages, "about.sendMessage.send"));
    const [sendButtonDisabled, setSendButtonDisabled] = useState<boolean>(false);
    const setButtonDisableFor = (seconds: number) => {
        setSendButtonDisabled(true);
        setButtonText(`${seconds}`);
        const startTime = Date.now();
        const countDown = () =>
            setTimeout(() => {
                const timeElasped = Date.now() - startTime;
                const timeLeft = seconds * 1000 - timeElasped;
                if (timeLeft <= 0) {
                    setSendButtonDisabled(false);
                    setButtonText(formattedMessage(messages, "about.sendMessage.send"));
                } else {
                    setButtonText(`${(timeLeft / 1000).toFixed(2)}`);
                    countDown();
                }
            }, getRandomSmallMilliseconds());
        countDown();
    };

    useEffect(() => {
        if (status !== "idle") {
            setShowInfo(true);
        }
    }, [status]);

    const onSendMessageSuccess = (data: SendMessageOutput) => {
        setStatus("success");
        setSystemMessage(
            formattedMessage(messages, "about.sendMessage.success", locale, {
                id: data.MessageId,
            })
        );
        setButtonDisableFor(SEND_AGAIN_DELAY);
    };
    const onSendMessageError = (error: Error) => {
        setStatus("error");
        setSystemMessage(error.message);
    };

    const onInvalid = (errors: FieldErrors<SendMessageValues>) => {
        const messageError = errors.message?.message || "Invalid message";
        setStatus("error");
        setSystemMessage(messageError as string);
    };

    const onSubmit = async (values: SendMessageValues) => {
        setStatus("sending");
        setSystemMessage(formattedMessage(messages, "about.sendMessage.sending"));
        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: values.name,
                    contact: values.contact,
                    message: values.message,
                }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || "Failed to send message");
            }
            onSendMessageSuccess({ MessageId: data.id });
            form.reset();
        } catch (error) {
            onSendMessageError(error instanceof Error ? error : new Error("Failed to send message"));
        }
    };

    return (
        <div className={tm("relative h-fit w-full", className)} {...rest}>
            <div className={tm("borderT h-full w-full")}>
                <div className={tm("borderB h-full w-full")}>
                    <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="flex h-fit w-full flex-col gap-1">
                        <div className="flex w-full flex-col gap-2 p-4">
                            <Label name={formattedMessage(messages, "about.sendMessage.label.message")}>
                                <Textarea
                                    className={tm(
                                        "h-36 w-full rounded-none border-0 bg-transparent opacity-75 focus:opacity-100 focus:outline-none"
                                    )}
                                    spellCheck={false}
                                    autoComplete="off"
                                    {...form.register("message")}
                                />
                            </Label>
                            <Label name={formattedMessage(messages, "about.sendMessage.label.name")}>
                                <Input
                                    className="rounded-none border-b border-black border-opacity-75 bg-transparent py-1 opacity-75 focus:border-opacity-75 focus:opacity-100 focus:outline-none dark:border-std-light"
                                    {...form.register("name")}
                                />
                            </Label>
                            <Label name={formattedMessage(messages, "about.sendMessage.label.contact")}>
                                <Input
                                    className="rounded-none border-b border-black border-opacity-75 bg-transparent py-1 opacity-75 focus:border-opacity-75 focus:opacity-100 focus:outline-none dark:border-std-light"
                                    {...form.register("contact")}
                                />
                            </Label>
                            <Button
                                disabled={sendButtonDisabled}
                                type="submit"
                                variant="ghost"
                                className="disabled:pointer-events-none disabled:text-gray-500">
                                <IconedText className="justify-end">
                                    <BsSendFill /> {buttonText}
                                </IconedText>
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
            {showInfo && (
                <div className="absolute left-0 top-0 flex h-full w-full flex-col items-center justify-center gap-2 p-2 backdrop-blur-md">
                    <div className="font-semibold uppercase">{status}</div>
                    {status === "sending" ? (
                        <Loading className="h-fit w-fit" />
                    ) : (
                        <>
                            <div className="text-center">{systemMessage}</div>
                            <IconedText onClick={() => setShowInfo(false)}>
                                <IoCheckbox />
                                <FormattedMessage id="about.sendMessage.label.confirm" messages={messages} />
                            </IconedText>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

function Label({ children, name }: { children: React.ReactNode; name: string }) {
    return (
        <label className="flex flex-col">
            <span className="font-semibold">{name}</span>
            {children}
        </label>
    );
}

