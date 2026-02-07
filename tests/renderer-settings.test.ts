import { describe, expect, it, vi } from 'vitest';
import { ACESFilmicToneMapping, SRGBColorSpace } from 'three';
import { applyRendererSettings } from '../archive/2021/components/home/threejs/renderer';

describe('applyRendererSettings', () => {
    it('sets color space, tone mapping, and lighting flags', () => {
        const gl = {
            outputColorSpace: undefined,
            physicallyCorrectLights: undefined,
            useLegacyLights: undefined,
        } as any;
        const state = {
            gl,
            setDpr: vi.fn(),
        };

        applyRendererSettings(state, { dpr: 2, physicallyCorrectLights: true });

        expect(state.setDpr).toHaveBeenCalledWith(2);
        expect(gl.outputColorSpace).toBe(SRGBColorSpace);
        expect(gl.toneMapping).toBe(ACESFilmicToneMapping);
        expect(gl.physicallyCorrectLights).toBe(true);
        expect(gl.useLegacyLights).toBe(false);
    });

    it('enables legacy lights when physically correct lights are off', () => {
        const gl = { useLegacyLights: undefined } as any;
        const state = { gl, setDpr: vi.fn() };

        applyRendererSettings(state, { dpr: 1, physicallyCorrectLights: false });

        expect(gl.useLegacyLights).toBe(true);
    });
});
