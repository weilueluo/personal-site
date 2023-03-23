"use client"

import { BaseProps } from "@/shared/types/react";
import { ThemeProvider } from "next-themes";

export default function Theme({ children }: BaseProps) {
    return (
        <ThemeProvider attribute="data-mode">{children}</ThemeProvider>
    )
}