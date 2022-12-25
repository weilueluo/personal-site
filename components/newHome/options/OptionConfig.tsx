import { createContext } from 'react';

export const LightMode = createContext<boolean>(false);
export const ExploreMode = createContext<boolean>(false);
export const PostEffectsMode = createContext<boolean>(false);

export interface BinaryOptionConfig {
    onName: string;
    offName: string;
    initState: boolean;
}

export const LightModeConfig: BinaryOptionConfig = {
    onName: 'light',
    offName: 'dark',
    initState: false,
};

export const ExploreModeConfig: BinaryOptionConfig = {
    onName: 'explore',
    offName: 'default',
    initState: false,
};

export const PostEffectsModeConfig: BinaryOptionConfig = {
    onName: 'effects on',
    offName: 'offects off',
    initState: false,
};
