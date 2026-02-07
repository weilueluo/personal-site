import { useFrame } from '@react-three/fiber';
import {
    DepthOfField,
    EffectComposer,
    GodRays,
    Noise,
    Vignette,
} from '@react-three/postprocessing';
import { BlendFunction, BloomEffect, KernelSize } from 'postprocessing';
import { useCallback, useContext, useEffect, useMemo, useRef } from 'react';
import { MathUtils, Mesh, MeshBasicMaterial, SphereGeometry } from 'three';
import { getAltScroll } from '../../common/scroll';
import { getDeviceDependent } from '../../common/misc';
import { BaseProps } from '../../types/react';
import { LightModeContext } from '../options/OptionsManager';

export interface ThreeJsPostEffectsProps extends BaseProps {
    godRayRadius: number;
}

export function ThreeJsPostEffects(props: ThreeJsPostEffectsProps) {
    const godrayRef = useRef<any>(null);

    const lightMode = useContext(LightModeContext);

    // A dedicated light source mesh that is *not* part of the main scene render.
    // It exists solely so GodRays can use it as a light source without rendering a visible "sun sphere".
    const sunRadius = Math.max(props.godRayRadius, 0.75);
    const sunGeometry = useMemo(
        () => new SphereGeometry(sunRadius, 32, 16),
        [sunRadius],
    );
    const sunMaterial = useMemo(
        () =>
            new MeshBasicMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 1,
            }),
        [],
    );
    const sunMesh = useMemo(
        () => new Mesh(sunGeometry, sunMaterial),
        [sunGeometry, sunMaterial],
    );

    useEffect(() => {
        return () => {
            sunGeometry.dispose();
            sunMaterial.dispose();
        };
    }, [sunGeometry, sunMaterial]);

    const bloomEffect = useMemo(
        () =>
            new BloomEffect({
                // Keep bloom subtle so the core doesn't wash out the entire sphere.
                // We'll still animate the intensity in `useFrame`.
                intensity: 0.18,
                luminanceThreshold: 0.6,
                luminanceSmoothing: 0.25,
                height: 500,
            }),
        [],
    );

    const handleGodray = useCallback(
        (godray: any) => {
            godrayRef.current = godray;
            if (!godray) {
                return;
            }
            const mat = godray.godRaysPass.fullscreenMaterial;

            mat.onBeforeCompile = (shader: any) => {
                shader.fragmentShader = shader.fragmentShader.replace(
                    'void main()',
                    `
                uniform float colorFactor;
                void main()
            `,
                );

                shader.fragmentShader = shader.fragmentShader.replace(
                    '#include <dithering_fragment>',
                    `
                #include <dithering_fragment>
                gl_FragColor = gl_FragColor * colorFactor;
            `,
                );
                mat.uniforms.colorFactor = { value: lightMode ? 1.0 : -50.0 };
            };
        },
        [lightMode],
    );

    const samples = getDeviceDependent(30, 60);

    const startOpacity = lightMode ? 1 : 0.01;

    useEffect(() => {
        const mat = godrayRef.current?.godRaysPass?.fullscreenMaterial;
        const colorFactor = mat?.uniforms?.colorFactor;
        if (colorFactor) {
            colorFactor.value = lightMode ? 1.0 : -50.0;
        }
    }, [lightMode]);

    useFrame(state => {
        const scroll = getAltScroll();
        const a = 0.1;
        const alpha = MathUtils.clamp(a * (scroll * scroll), 0, 1);

        // Keep the sun mesh transform matrix up to date even though it's not in the main scene.
        // GodRaysEffect temporarily disables matrixAutoUpdate when it renders the light source.
        const scale = Math.max(MathUtils.lerp(1, -5, scroll), 0.1);
        sunMesh.scale.set(scale, scale, scale);
        sunMaterial.opacity = MathUtils.lerp(startOpacity, 0, scroll);
        sunMesh.updateMatrix();
        sunMesh.updateMatrixWorld(true);

        if (godrayRef.current) {
            // clampMax
            // decay
            // density
            // exposure
            // inputBuffer
            // lightPosition
            // weight
            const uniforms = godrayRef.current.godRaysMaterial.uniforms;
            uniforms.clampMax.value = Math.max(MathUtils.lerp(0.75, 0, scroll), 0);
        }

        // Don't start at full bloom intensity: it overexposes the entire scene in modern three/postprocessing.
        bloomEffect.intensity = Math.max(MathUtils.lerp(0.5, 0, alpha), 0);
    });

    return (
        <>
            <EffectComposer
                // GodRaysEffect relies on depth being preserved between its internal passes.
                // If autoClear is true, three.js may clear the depth buffer right before the light mask render,
                // causing the sun disk to show through the ball instead of being occluded.
                autoClear={false}
                depthBuffer
                multisampling={0}
            >
                <DepthOfField
                    // These values are extremely sensitive. We previously used a very large `focalLength`
                    // which effectively blurred the whole scene once we started preserving depth for GodRays.
                    // Keep this subtle and focused around the main ball (camera distance ~28 on the default rig).
                    focusDistance={0.28}
                    focalLength={0.02}
                    bokehScale={1.5}
                    height={480}
                />
                <primitive object={bloomEffect} dispose={null} />
                <Noise opacity={0.05} />
                <Vignette eskil={false} offset={0.1} darkness={1} />
                <GodRays
                    ref={handleGodray}
                    sun={sunMesh}
                    blendFunction={BlendFunction.SCREEN}
                    samples={samples}
                    density={0.9}
                    decay={0.94}
                    weight={0.25}
                    exposure={0.75}
                    clampMax={1}
                    // width={Resizer.AUTO_SIZE}
                    // height={Resizer.AUTO_SIZE}
                    kernelSize={KernelSize.LARGE}
                    blur={true}
                />
            </EffectComposer>
        </>
    );
}
