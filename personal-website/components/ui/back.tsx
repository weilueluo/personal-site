"use client";
import { useRouter } from "next/navigation";
import { IoChevronBackCircle } from "react-icons/io5";

export default function BackButton() {
    const router = useRouter();
    return (
        <span className="icon-text std-hover std-pad" onClick={() => router.back()}>
            <IoChevronBackCircle />
            <span>Back</span>
        </span>
    );
}
