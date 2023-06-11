"use client";

import { tm } from "@/shared/utils";
import "../ui/border.scss";
import "./send-message.scss";

import Loading from "@/components/ui/loading/spinner";
import { FormattedMessage, formattedMessage } from "@/shared/i18n/translation";
import { BaseCompProps } from "@/shared/types/comp";
import dynamic from "next/dynamic";
import React, { ComponentPropsWithoutRef, FormEvent, useEffect, useState } from "react";
import { BsSendFill } from "react-icons/bs/index";
import { IoCheckbox } from "react-icons/io5/index";
import IconedText from "../ui/icon-text";

export interface SendMessageOutput {
    MessageId?: string;
}

export interface SendMessageFunctionProps extends BaseCompProps<any> {
    params?: {
        name?: string;
        contact?: string;
        userMessage: string;
        onSendMessageSuccess: (data: SendMessageOutput) => void;
        onSendMessageError: (error: Error) => void;
    };
}

export const SEND_AGAIN_DELAY = 5; // in seconds

const SendMessageFunction = dynamic(() => import("./send-message-function"), { ssr: false, loading: () => <></> });

export type SendMessageStatus = "sending" | "idle" | "error" | "success";

const getRandomSmallMilliseconds = () => {
    return Math.floor(Math.random() * 50);
};

export default function SendMessage({ messages, locale, className, ...rest }: BaseCompProps<"div">) {
    const [name, setName] = React.useState("");
    const [contact, setContact] = React.useState("");
    const [userMessage, setUserMessage] = React.useState("");

    const [showInfo, setShowInfo] = React.useState(false);

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
                    setButtonText("Send");
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

    const onSendMessageSuccess = (
        data: SendMessageOutput /* should be PublishCommandOutput but I do not want to import it */
    ) => {
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
    const [sendMessageFunctionProps, setSendMessageFunctionProps] = useState<SendMessageFunctionProps["params"]>();
    const triggerSendMessage = () => {
        setSendMessageFunctionProps({
            name,
            contact,
            userMessage,
            onSendMessageSuccess,
            onSendMessageError,
        });
    };

    const onSubmit = (e: FormEvent) => {
        e.preventDefault();
        setStatus("sending");
        setSystemMessage(formattedMessage(messages, "about.sendMessage.sending"));
        triggerSendMessage();
    };

    return (
        <div className={tm("relative h-fit w-full", className)} {...rest}>
            <div className={tm("borderT h-full w-full")}>
                <div className={tm("borderB h-full w-full")}>
                    <form onSubmit={e => onSubmit(e)} className="flex h-fit w-full flex-col gap-1">
                        <div className="flex w-full flex-col gap-2 p-4">
                            <Label name={messages["about.sendMessage.label.message"]}>
                                <textarea
                                    className={tm("h-36 w-full opacity-75 focus:opacity-100 focus:outline-none")}
                                    spellCheck={false}
                                    autoComplete="off"
                                    onChange={e => setUserMessage(e.target.value)}
                                />
                            </Label>
                            <Label name={formattedMessage(messages, "about.sendMessage.label.name")}>
                                <Input onChange={e => setName(e.target.value)} />
                            </Label>
                            <Label name={formattedMessage(messages, "about.sendMessage.label.contact")}>
                                <Input onChange={e => setContact(e.target.value)} />
                            </Label>
                            <button disabled={sendButtonDisabled} type="submit" onClick={e => onSubmit(e)}>
                                <IconedText className="justify-end">
                                    <BsSendFill /> {buttonText}
                                </IconedText>
                            </button>
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
            <SendMessageFunction params={sendMessageFunctionProps} />
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

function Input(props: ComponentPropsWithoutRef<"input">) {
    return (
        <input
            type="text"
            spellCheck={false}
            autoComplete="off"
            className="border-b border-black border-opacity-75 py-1 opacity-75 focus:border-opacity-75 focus:opacity-100 focus:outline-none dark:border-std-light dark:bg-std-dark"
            {...props}
        />
    );
}
