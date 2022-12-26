import { useCallback } from 'react';
import { BaseProps } from '../../types/react';
import { mergeStyles } from '../styles';
import styles from './ToggleButton.module.sass';

export interface ToggleButtonProps extends BaseProps {
    onName: string;
    offName: string;
    on: boolean;
    toggle?: () => unknown;
    disable?: boolean
}

export default function ToggleButton(props: ToggleButtonProps) {

    const disable = props.disable === undefined ? false : props.disable;
    const onClick = useCallback(() => !disable && props.toggle && props.toggle(), [disable, props]);

    return (
        <button
            className={mergeStyles(
                styles.toggleButton,
                !props.on && styles.off,
                props.on && styles.on,
                disable && styles.disabled
            )}
            onClick={onClick}>
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
