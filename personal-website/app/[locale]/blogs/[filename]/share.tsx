"use client";

import dropdown from "@/components/ui/dropdown";
import { BsShareFill } from "react-icons/bs";
import { MdContentPaste } from "react-icons/md";

export default function ShareButton() {
    const copylinkOnClick = () => {
        navigator.clipboard.writeText(window.location.href).then(() => {
            console.log("Copied to clipboard");
            alert("Copied to clipboard");
        });
    };

    return (
        <dropdown.Container>
            <span className="icon-text std-pad std-hover">
                <BsShareFill /> Share
            </span>
            <dropdown.Dropdown variant="glass">
                <div>
                    <span className="std-hover icon-text std-pad" onClick={() => copylinkOnClick()}>
                        <MdContentPaste /> Copy Link
                    </span>
                </div>
            </dropdown.Dropdown>
        </dropdown.Container>
    );
}
