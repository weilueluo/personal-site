import { createContext, useReducer } from 'react';
import { getDeviceDependent } from '../../common/misc';
import { BaseProps } from '../../types/react';
import OptionsProvider, {
    ProviderProp,
} from './optionsProvider/OptionsProvider';
import OptionsUI, { UIProp } from './optionsUI/OptionsUI';

export const LightModeContext = createContext<boolean>(true);
export const ExploreModeContext = createContext<boolean>(false);
export const PostEffectModeContext = createContext<boolean>(false);

export default function OptionsManager(props: BaseProps) {
    const [lightMode, lightModeToggle] = useReducer(state => {console.log('toggle'); return !state}, false);
    const [exploreMode, exploreModeToggle] = useReducer(state => !state, false);
    const [postEffectMode, postEfftecModeToggle] = useReducer(
        state => !state,
        getDeviceDependent(false, true),
    );

    const optionProps: (UIProp & ProviderProp)[] = [
        {
            name: 'Explore Mode',
            value: exploreMode,
            onName: 'ThreeJs',
            offName: 'HTML',
            toggle: exploreModeToggle,
            context: ExploreModeContext,
        },
        {
            name: 'Post Effects Mode',
            value: postEffectMode,
            onName: 'effects on',
            offName: 'effects off',
            toggle: postEfftecModeToggle,
            context: PostEffectModeContext,
        }
    ];

    const lightProp: (UIProp & ProviderProp) = {
        name: 'Light Mode',
        value: lightMode,
        onName: 'light',
        offName: 'dark',
        toggle: lightModeToggle,
        context: LightModeContext,
    }

    return (
        <>
            <OptionsProvider providerProps={optionProps} lightProp={lightProp}>
                <OptionsUI uiProps={optionProps} lightProp={lightProp} />
                {props.children}
            </OptionsProvider>
        </>
    );
}
