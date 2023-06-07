"use client";
import { FormattedMessage } from "@/shared/i18n/translation";
import { BaseCompProps } from "@/shared/types/comp";
import { useRouter } from "next/navigation";
import { IoChevronBackCircle } from "react-icons/io5/index";
import IconedText from "./icon-text";

export default function BackButton({ messages, ...rest }: BaseCompProps<"span">) {
    const router = useRouter();
    return (
        <IconedText onClick={() => router.back()} {...rest}>
            <IoChevronBackCircle />
            <FormattedMessage messages={messages} id="comp.ui.back" />
        </IconedText>
    );
}
