import { m } from "@/shared/css";
import { BaseProps } from "@/shared/types/react";

import styles from './Switch.module.scss';

export interface SwitchProps extends BaseProps {
    on?: boolean;
}


export default function Switch(props: SwitchProps) {

    return (
        <div className={m(styles.switch, props.on ? styles.on : styles.off)}>
            {props.children}
        </div>
    )
}