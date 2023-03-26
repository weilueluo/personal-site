"use client";

import { ThemeProvider } from "next-themes";
import React from "react";

export default function Theme({ children }: { children: React.ReactNode }) {
    return <ThemeProvider attribute="data-mode">{children}</ThemeProvider>;
}
