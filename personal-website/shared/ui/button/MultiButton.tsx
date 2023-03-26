import { m } from "@/shared/css";
import { BaseProps } from "@/shared/types/react";
import styles from "./TrilateralButton.module.scss";
import React from 'react'

export interface MultiButtonProps extends BaseProps {
    values: string[] | undefined,
    current: string;
    width?: string;
    onToggle?: (name: string) => unknown
}

export default function MultiButton(props: MultiButtonProps) {

    if (!props.values) {
        return null;
    }

    const buttons = props.values?.map((name) => (
        <Button name={name} current={props.current} onClick={() => props.onToggle && props.onToggle(name)}/>
    ));

    return (
        <div className={styles.container}>
            {buttons}
        </div>
    );
}

const Button = (props: { name: string; current: string } & JSX.IntrinsicElements['button']) => {
    const { name, current, ...others } = props;

    return <button className={m(styles.button, name === current && styles.active)} {...others}>{name}</button>;
};
