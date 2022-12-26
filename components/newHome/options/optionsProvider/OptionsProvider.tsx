import { Context } from 'react';
import { BaseProps } from '../../../types/react';

export interface ProviderProp {
    context: Context<unknown>;
    value: boolean;
}

export interface ProviderProps extends BaseProps {
    lightProp: ProviderProp;
    exploreProp: ProviderProp;
    postEffectProp: ProviderProp;
}

export default function OptionsProvider(props: ProviderProps) {
    return (
        <props.postEffectProp.context.Provider value={props.postEffectProp.value}>
            <props.exploreProp.context.Provider value={props.exploreProp.value}>
                <props.lightProp.context.Provider value={props.lightProp.value}>
                    {props.children}
                </props.lightProp.context.Provider>
            </props.exploreProp.context.Provider>
        </props.postEffectProp.context.Provider>
    );
}
