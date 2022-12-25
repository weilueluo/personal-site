import { createContext, useReducer } from 'react';
import { BaseProps } from '../../types/react';
import {
    ExploreModeConfig,
    LightModeConfig,
    PostEffectsModeConfig,
} from './OptionConfig';
import OptionsProvider, { ProviderProp } from './optionsProvider/OptionsProvider';
import OptionsUI, { UIProp } from './optionsUI/OptionsUI';

export const LightModeContext = createContext<boolean>(false);
export const ExploreModeContext = createContext<boolean>(false);
export const PostEffectModeContext = createContext<boolean>(false);

export default function OptionsManager(props: BaseProps) {
    const [lightMode, lightModeToggle] = useReducer(
        state => !state,
        LightModeConfig.initState,
    );
    const [exploreMode, exploreModeToggle] = useReducer(
        state => !state,
        ExploreModeConfig.initState,
    );
    const [postEffectMode, postEfftecModeToggle] = useReducer(
        state => !state,
        PostEffectsModeConfig.initState,
    );

    const optionProps: (UIProp & ProviderProp)[] = [
        // TODO: support light mode
        // {
        //     name: 'Light Mode',
        //     value: lightMode,
        //     onName: 'light',
        //     offName: 'dark',
        //     toggle: lightModeToggle,
        //     context: LightModeContext,
        // },
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
        },
    ];

    return (
        <>
            <OptionsProvider providerProps={optionProps}>{props.children}</OptionsProvider>
            <OptionsUI uiProps={optionProps} />
        </>
    );
}