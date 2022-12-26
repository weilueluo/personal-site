import { Context, ReactNode } from 'react';
import { BaseProps } from '../../../types/react';

export interface ProviderProp {
    context: Context<unknown>;
    value: boolean;
}

export interface ProviderProps extends BaseProps {
    providerProps: ProviderProp[];
    lightProp: ProviderProp;
}

export default function OptionsProvider(props: ProviderProps) {
    let node: ReactNode = <>{props.children}</>;
    for (const prop of props.providerProps) {
        node = (
            <prop.context.Provider value={prop.value}>
                {node}
            </prop.context.Provider>
        );
    }

    return (
        <props.lightProp.context.Provider value={props.lightProp.value}>
            {node}
        </props.lightProp.context.Provider>
    );
}
