import { createContext, useEffect, useState } from 'react';
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
    const [lightMode, lightModeToggle] = useBinaryState(true);
    const [exploreMode, exploreModeToggle] = useBinaryState(false);
    const [postEffectMode, postEffectModeToggle, setPostEffect] =
        useBinaryState(false);
    useEffect(() => {
        setPostEffect(getDeviceDependent(false, true));
    }, [setPostEffect]);

    const lightProp: UIProp & ProviderProp = {
        name: 'Light Mode',
        value: lightMode,
        onName: 'light',
        offName: 'dark',
        toggle: lightModeToggle,
        context: LightModeContext,
    };

    const exploreProp: UIProp & ProviderProp = {
        name: 'Explore Mode',
        value: exploreMode,
        onName: 'ThreeJs',
        offName: 'HTML',
        toggle: exploreModeToggle,
        context: ExploreModeContext,
    };

    const postEffectProp: UIProp & ProviderProp = {
        name: 'Post Effects Mode',
        value: postEffectMode,
        onName: 'effects on',
        offName: 'effects off',
        toggle: postEffectModeToggle,
        context: PostEffectModeContext,
    };

    return (
        <>
            <OptionsProvider
                exploreProp={exploreProp}
                postEffectProp={postEffectProp}
                lightProp={lightProp}>
                <OptionsUI
                    exploreProp={exploreProp}
                    postEffectProp={postEffectProp}
                    lightProp={lightProp}
                />
                {props.children}
            </OptionsProvider>
        </>
    );
}

function useBinaryState(
    initState: boolean,
): [boolean, () => unknown, (state: boolean) => void] {
    const [state, setState] = useState(initState);
    const toggle = () => setState(!state);

    return [state, toggle, setState];
}
