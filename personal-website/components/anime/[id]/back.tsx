"use client";
import { useRouter } from "next/navigation";

export default function BackButton() {
    const router = useRouter();
    return (
        <span
            className=" rounded-md bg-stone-400 px-2 py-1 hover:cursor-pointer hover:underline"
            onClick={() => router.back()}>
            Back
        </span>
    );
}
