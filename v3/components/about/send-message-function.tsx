"use client";
import { sendMessage } from "@/shared/send-message/message-handler";
import { useEffect } from "react";
import { SendMessageFunctionProps } from "./send-message";

export default function SendMessageFunction({ params }: SendMessageFunctionProps) {
    // console.log(`SendMessageFunction render`);

    useEffect(() => {
        if (params) {
            const { name, contact, userMessage, onSendMessageSuccess, onSendMessageError } = params;
            sendMessage({ name, contact, userMessage })
                .then(data => onSendMessageSuccess(data))
                .catch(error => onSendMessageError(error));
        }
    }, [params]);

    return <></>;
}
