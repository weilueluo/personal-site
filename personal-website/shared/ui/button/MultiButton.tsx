import { m } from "@/shared/css";
import styles from "./MultiButton.module.scss";
import React, { ReactNode } from "react";

export interface MultiButtonProps {
    children?: ReactNode;
    width?: string;
    onToggle?: (name: string) => unknown;
}

export default function MultiButton({children, width, onToggle}: MultiButtonProps) {

    return <div className={m(styles.container, width)}>{children}</div>;
}
