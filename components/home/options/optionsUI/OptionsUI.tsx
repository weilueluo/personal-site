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
    lightProp: UIProp;
    exploreProp: UIProp;
    postEffectProp: UIProp;
}

export default function OptionsUI(props: UIProps) {
    const postEffectsOn = useContext(PostEffectModeContext);
    
    return (
        <ul className={styles.optionList}>
            {/* explore button */}
            <li key={props.exploreProp.name}>
                <ToggleButton
                    onName={props.exploreProp.onName}
                    offName={props.exploreProp.offName}
                    on={props.exploreProp.value}
                    toggle={props.exploreProp.toggle}
                    disabled={false}
                />
            </li>
            {/* post effect button */}
            <li key={props.postEffectProp.name}>
                <ToggleButton
                    onName={props.postEffectProp.onName}
                    offName={props.postEffectProp.offName}
                    on={props.postEffectProp.value}
                    toggle={props.postEffectProp.toggle}
                    disabled={false}
                />
            </li>
            {/* light/dark button */}
            <li key={props.lightProp.name}>
                <ToggleButton
                    onName={props.lightProp.onName}
                    offName={props.lightProp.offName}
                    on={props.lightProp.value}
                    toggle={props.lightProp.toggle}
                    disabled={!postEffectsOn}
                />
            </li>
        </ul>
    );
}
