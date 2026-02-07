import { ACESFilmicToneMapping, SRGBColorSpace } from 'three';

export type RendererSettingsOptions = {
    dpr: number;
    physicallyCorrectLights: boolean;
};

export type RendererLike = {
    // `three`'s renderer types vary a bit across versions (string literal vs string union).
    // Keep this intentionally wide so `RootState` can be passed in directly.
    outputColorSpace?: string;
    toneMapping?: number;
    physicallyCorrectLights?: boolean;
    useLegacyLights?: boolean;
};

export type RendererStateLike = {
    gl: RendererLike;
    setDpr: (value: number) => void;
};

export function applyRendererSettings(
    state: RendererStateLike,
    options: RendererSettingsOptions,
) {
    state.setDpr(options.dpr);
    const gl = state.gl;

    if ('outputColorSpace' in gl) {
        gl.outputColorSpace = SRGBColorSpace;
    }
    gl.toneMapping = ACESFilmicToneMapping;

    if ('physicallyCorrectLights' in gl) {
        gl.physicallyCorrectLights = options.physicallyCorrectLights;
    }
    if ('useLegacyLights' in gl) {
        gl.useLegacyLights = !options.physicallyCorrectLights;
    }
}
