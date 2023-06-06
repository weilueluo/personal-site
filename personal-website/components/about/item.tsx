"use client";
import { tm } from "@/shared/utils";
import Link from "next/link";
import React from "react";
import { ImNewTab } from "react-icons/im/index";
import styles from "../ui/border.module.scss";

export function Item({
    children,
    className,
    href,
    name,
}: {
    children: React.ReactNode;
    className?: string;
    href: string;
    name?: string;
}) {
    const [hover, setHover] = React.useState(false);

    return (
        <Link
            href={href}
            target="_blank"
            className={tm("std-hover group relative h-24 w-24", className)}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}>
            {hover && <ImNewTab className="pointer-events-none absolute right-0 top-0 z-10" />}
            <div className={tm("h-full w-full", styles.borderT)}>
                <div className={tm("flex h-full w-full flex-col items-center justify-center", styles.borderB)}>
                    {children}
                    {name && (
                        <span className="mt-0 flex h-0 flex-col overflow-hidden font-semibold leading-4 transition-[height,margin] group-hover:mt-2 group-hover:h-8">
                            {name}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
}
