"use client"

import { m } from "@/shared/css";
import { BaseProps } from "@/shared/types/react";
import { MouseEventHandler, SyntheticEvent } from "react";
import styles from './toggle.module.scss';


export interface ToggleButtonProps extends BaseProps {
    onName: string;
    offName: string;
    toggle?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => unknown;
    on?: boolean;
    disabled?: boolean;
    width?: string
}


export default function ToggleButton(props: ToggleButtonProps) {

    const disabled = props.disabled ?? false;
    const buttonWidth = props.width ?? 'w-8'

    const onClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => !disabled && props.toggle && props.toggle(event);

    return (
        <button className={m(styles.button, props.on ? styles.on : styles.off, disabled && styles.disabled)} onClick={(e) => onClick(e)}>
            <span className={m(styles.name, styles.onName, buttonWidth)}>
                {props.onName}
            </span>
            <div className={styles.block}></div>
            <span className={m(styles.name, styles.offName, buttonWidth)}>
                {props.offName}
            </span>
        </button>
    );
}