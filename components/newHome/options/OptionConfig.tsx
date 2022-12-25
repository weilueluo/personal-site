import { createContext } from 'react';

export const LightMode = createContext<boolean>(false);
export const PostEffectsMode = createContext<boolean>(false);

export interface BinaryOptionConfig {
    onName: string;
    offName: string;
}

export const LightModeConfig: BinaryOptionConfig = {
    onName: 'light',
    offName: 'dark',
};

export const ExploreModeConfig: BinaryOptionConfig = {
    onName: 'explore',
    offName: 'default',
};

export const PostEffectsModeConfig: BinaryOptionConfig = {
    onName: 'effects on',
    offName: 'effects off',
};
