"use client";
import { FormattedMessage } from "@/shared/i18n/translation";
import { BaseCompProps } from "@/shared/types/comp";
import { tm } from "@/shared/utils";
import { useRouter } from "next/navigation";
import { IoChevronBackCircle } from "react-icons/io5";

export default function BackButton({ messages, className, ...rest }: BaseCompProps<"span">) {
    const router = useRouter();
    return (
        <span className={tm("icon-text std-hover std-pad", className)} onClick={() => router.back()} {...rest}>
            <IoChevronBackCircle />
            <span>
                <FormattedMessage messages={messages} id="comp.ui.back" />
            </span>
        </span>
    );
}
