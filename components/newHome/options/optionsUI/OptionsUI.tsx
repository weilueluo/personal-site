import ToggleButton from '../../../common/toggleButton/ToggleButton';
import { BaseProps } from '../../../types/react';
import styles from './OptionsUI.module.sass';

export interface UIProp {
    name: string;
    value: boolean;
    onName: string;
    offName: string;
    toggle: () => unknown;
}

export interface UIProps extends BaseProps {
    uiProps: UIProp[];
}

export default function OptionsUI(props: UIProps) {
    return (
        <ul className={styles.optionList}>
            {props.uiProps.map(prop => (
                <li key={prop.name}>
                    <ToggleButton
                        onName={prop.onName}
                        offName={prop.offName}
                        on={prop.value}
                        toggle={prop.toggle}
                    />
                </li>
            ))}
        </ul>
    );
}
