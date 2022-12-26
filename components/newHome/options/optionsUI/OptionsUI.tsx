import { useContext } from 'react';
import ToggleButton from '../../../common/toggleButton/ToggleButton';
import { BaseProps } from '../../../types/react';
import styles from './OptionsUI.module.sass';
import { PostEffectModeContext } from '../OptionsManager';

export interface UIProp {
    name: string;
    value: boolean;
    onName: string;
    offName: string;
    toggle: () => unknown;
}

export interface UIProps extends BaseProps {
    uiProps: UIProp[];
    lightProp: UIProp;
}

export default function OptionsUI(props: UIProps) {

    const postEffectsOn = useContext(PostEffectModeContext);

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
            <li key={props.lightProp.name}>
                <ToggleButton
                    onName={props.lightProp.onName}
                    offName={props.lightProp.offName}
                    on={props.lightProp.value}
                    toggle={props.lightProp.toggle}
                    disable={!postEffectsOn}
                />
            </li>
        </ul>
    );
}
