"use client"

import { m } from "@/shared/css";
import { BaseProps } from "@/shared/types/react";
import styles from './Toggle.module.scss';


export interface ToggleButtonProps extends BaseProps {
    onName: string;
    offName: string;
    toggle?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => unknown;
    on?: boolean;
    disabled?: boolean;
    width?: string,
    block?: React.ReactNode
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
            <div className={styles.block}>{props.block}</div>
            <span className={m(styles.name, styles.offName, buttonWidth)}>
                {props.offName}
            </span>
        </button>
    );
}