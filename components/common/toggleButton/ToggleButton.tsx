import { useCallback } from 'react';
import { BaseProps } from '../../types/react';
import { mergeStyles } from '../styles';
import styles from './ToggleButton.module.sass';

export interface ToggleButtonProps extends BaseProps {
    onName: string;
    offName: string;
    on: boolean;
    toggle?: () => unknown;
    disabled?: boolean;
}

export default function ToggleButton(props: ToggleButtonProps) {
    const onClick = useCallback(
        () => !props.disabled && props.toggle && props.toggle(),
        [props],
    );
    
    const buttonStyles = mergeStyles(
        styles.toggleButton,
        props.on ? styles.on : styles.off,
        props.disabled && styles.disabled,
    );

    return (
        <button className={buttonStyles} onClick={onClick}>
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
