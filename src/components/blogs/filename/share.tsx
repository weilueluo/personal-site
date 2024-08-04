"use client";

import * as dropdown from "@/components/ui/dropdown";
import IconedText from "@/components/ui/icon-text";
import { FormattedMessage } from "@/shared/i18n/translation";
import { Messages } from "@/shared/i18n/type";
import { BsShareFill } from "react-icons/bs/index";
import { MdContentPaste } from "react-icons/md/index";

export default function ShareButton({ messages }: { messages: Messages }) {
    const copylinkOnClick = () => {
        navigator.clipboard.writeText(window.location.href).then(() => {
            alert("Copied to clipboard");
        });
    };

    return (
        <dropdown.Container>
            <IconedText>
                <BsShareFill /> <FormattedMessage messages={messages} id="blog.share" />
            </IconedText>
            <dropdown.Dropdown variant="glass">
                <IconedText onClick={() => copylinkOnClick()}>
                    <MdContentPaste /> <FormattedMessage messages={messages} id="blog.copy_link" />
                </IconedText>
            </dropdown.Dropdown>
        </dropdown.Container>
    );
}
