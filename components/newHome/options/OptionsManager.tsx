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
    const [lightMode, lightModeToggle] = useBinaryReducer(true);
    const [exploreMode, exploreModeToggle] = useBinaryReducer(false);
    const [postEffectMode, postEffectModeToggle] = useBinaryReducer(
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
            toggle: postEffectModeToggle,
            context: PostEffectModeContext,
        },
    ];

    const lightProp: UIProp & ProviderProp = {
        name: 'Light Mode',
        value: lightMode,
        onName: 'light',
        offName: 'dark',
        toggle: lightModeToggle,
        context: LightModeContext,
    };

    return (
        <>
            <OptionsProvider providerProps={optionProps} lightProp={lightProp}>
                <OptionsUI uiProps={optionProps} lightProp={lightProp} />
                {props.children}
            </OptionsProvider>
        </>
    );
}

function useBinaryReducer(initState) {
    return useReducer(
        state => !state,
        initState,
        state => state,
    );
}
