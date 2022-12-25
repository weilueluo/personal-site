import { BaseProps } from '../../types/react';
import { mergeStyles } from '../styles';
import styles from './ToggleButton.module.sass';

export interface ToggleButtonProps extends BaseProps {
    onName: string;
    offName: string;
    on: boolean;
    toggle?: () => unknown;
}

export default function ToggleButton(props: ToggleButtonProps) {

    return (
        <button
            className={mergeStyles(
                styles.toggleButton,
                !props.on && styles.off,
                props.on && styles.on,
            )}
            onClick={props.toggle}>
            <span className={mergeStyles(styles.text, styles.onSpan)}>
                {props.onName}
            </span>
            <div className={styles.block}></div>
            <span className={mergeStyles(styles.text, styles.offSpan)}>
                {props.offName}
            </span>
        </button>
    );
}
