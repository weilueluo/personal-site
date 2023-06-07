"use client";

import * as dropdown from "@/components/ui/dropdown";
import IconedText from "@/components/ui/icon-text";
import { BsShareFill } from "react-icons/bs/index";
import { MdContentPaste } from "react-icons/md/index";

export default function ShareButton() {
    const copylinkOnClick = () => {
        navigator.clipboard.writeText(window.location.href).then(() => {
            alert("Copied to clipboard");
        });
    };

    return (
        <dropdown.Container>
            <IconedText>
                <BsShareFill /> Share
            </IconedText>
            <dropdown.Dropdown variant="glass">
                <IconedText onClick={() => copylinkOnClick()}>
                    <MdContentPaste /> Copy Link
                </IconedText>
            </dropdown.Dropdown>
        </dropdown.Container>
    );
}
