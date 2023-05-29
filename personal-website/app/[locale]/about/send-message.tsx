"use client";

import { tm } from "@/shared/utils";
import styles from "./send-message.module.scss";
import pageStyles from "./page.module.scss";

import { BsSendFill } from "react-icons/bs";
import React, { FormEvent, useEffect, useState } from "react";
import { ComponentPropsWithoutRef } from "react";
import { PublishCommandOutput } from "@aws-sdk/client-sns";
import { SEND_AGAIN_DELAY, sendMessage } from "@/components/about/message-handler";
import { IoCheckbox } from "react-icons/io5";
import Loading from "@/components/ui/loading/spinner";

type SendMessageStatus = "sending" | "idle" | "error" | "success";

const getRandomSmallMilliseconds = () => {
    return Math.floor(Math.random() * 50);
};

export default function SendMessage() {
    const [name, setName] = React.useState("");
    const [contact, setContact] = React.useState("");
    const [userMessage, setUserMessage] = React.useState("");

    const [showInfo, setShowInfo] = React.useState(false);

    const [status, setStatus] = useState<SendMessageStatus>("idle");
    const [systemMessage, setSystemMessage] = useState<string>("");

    const [buttonText, setButtonText] = useState<string>("Send");
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

    const onSubmit = (e: FormEvent) => {
        e.preventDefault();
        setStatus("sending");
        setSystemMessage("Sending message...");
        sendMessage({ name, contact, userMessage })
            .then((data: PublishCommandOutput) => {
                setStatus("success");
                setSystemMessage(`Message sent with ID: ${data.MessageId}`);
                setButtonDisableFor(SEND_AGAIN_DELAY);
            })
            .catch((error) => {
                setStatus("error");
                setSystemMessage(error.message);
            });
    };

    return (
        <div className="relative h-fit w-full">
            <div className={tm("h-full w-full", pageStyles.borderT)}>
                <div className={tm("h-full w-full", pageStyles.borderB)}>
                    <form onSubmit={(e) => onSubmit(e)} className="flex h-fit w-full flex-col gap-1">
                        <div className="flex w-full flex-col gap-2 p-4">
                            <Label name={"Name"}>
                                <Input onChange={(e) => setName(e.target.value)} />
                            </Label>
                            <Label name={"Contact"}>
                                <Input onChange={(e) => setContact(e.target.value)} />
                            </Label>
                            <Label name={"Message*"}>
                                <textarea
                                    className={tm(
                                        "h-48 w-full opacity-75 focus:opacity-100 focus:outline-none",
                                        styles.textarea
                                    )}
                                    spellCheck={false}
                                    autoComplete="off"
                                    onChange={(e) => setUserMessage(e.target.value)}
                                />
                            </Label>
                            <button
                                disabled={sendButtonDisabled}
                                className={tm(
                                    "icon-text std-pad std-hover flex flex-row justify-end",
                                    pageStyles.borderA
                                )}
                                type="submit"
                                onClick={(e) => onSubmit(e)}>
                                <BsSendFill /> <span>{buttonText}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            {showInfo && (
                <div className="absolute left-0 top-0 flex h-full w-full flex-col items-center justify-center gap-2 p-2 backdrop-blur-md">
                    <div className="font-semibold uppercase">{status}</div>
                    {status === "sending" ? (
                        <Loading />
                    ) : (
                        <>
                            <div className="text-center">{systemMessage}</div>
                            <button className="std-pad std-hover icon-text" onClick={() => setShowInfo(false)}>
                                <IoCheckbox />
                                <span>OK</span>
                            </button>
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

function Input(props: ComponentPropsWithoutRef<"input">) {
    return (
        <input
            type="text"
            spellCheck={false}
            autoComplete="off"
            className="border-b border-black border-opacity-75 py-1 opacity-75 focus:border-opacity-75 focus:opacity-100 focus:outline-none"
            {...props}
        />
    );
}
