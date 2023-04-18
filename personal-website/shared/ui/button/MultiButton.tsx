import { tm } from "@/shared/utils";
import styles from "./MultiButton.module.scss";
import React, { ReactNode } from "react";

export interface MultiButtonProps {
    children?: ReactNode;
    width?: string;
    onToggle?: (name: string) => unknown;
}

export default function MultiButton({children, width, onToggle}: MultiButtonProps) {

    return <div className={tm(styles.container, width)}>{children}</div>;
}
