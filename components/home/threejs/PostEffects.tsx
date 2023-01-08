import { useFrame } from '@react-three/fiber';
import {
    Bloom,
    DepthOfField,
    EffectComposer,
    GodRays,
    Noise,
    Vignette,
} from '@react-three/postprocessing';
import { BlendFunction, KernelSize } from 'postprocessing';
import { useCallback, useContext, useRef, useState } from 'react';
import { Color, MathUtils } from 'three';
import { getAltScroll } from '../../common/scroll';
import { getDeviceDependent } from '../../common/misc';
import { BaseProps } from '../../types/react';
import { LightModeContext } from '../options/OptionsManager';
import { lerp } from 'three/src/math/MathUtils';

const white = new Color(0xffffff);

export interface ThreeJsPostEffectsProps extends BaseProps {
    godRayRadius: number;
}

export function ThreeJsPostEffects(props: ThreeJsPostEffectsProps) {
    const sunRef = useRef<any>(null);
    const godrayRef = useRef<any>(null);
    const bloomRef = useRef<any>(null);
    const matRef = useRef<any>();
    const [godray, setGodray] = useState(null);

    const lightMode = useContext(LightModeContext);

    const handleGodray = useCallback(
        godray => {
            godrayRef.current = godray;
            if (!godray) {
                return;
            }
            const mat = godray.godRaysPass.fullscreenMaterial;

            mat.onBeforeCompile = shader => {
                console.log('before compile');
                
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
                mat.customProgramCacheKey = () => (lightMode ? '1.0' : '-50.0');
            };
        },
        [lightMode],
    );

    const handleSun = useCallback(
        sun => {
            sunRef.current = sun;
            const samples = getDeviceDependent(30, 60);
            setGodray(
                <GodRays
                    ref={handleGodray}
                    sun={sunRef.current}
                    blendFunction={BlendFunction.SCREEN}
                    samples={samples}
                    density={0.9}
                    decay={0.94}
                    weight={0.2}
                    exposure={0.9}
                    clampMax={1}
                    // width={Resizer.AUTO_SIZE}
                    // height={Resizer.AUTO_SIZE}
                    kernelSize={KernelSize.LARGE}
                    blur={1}
                />,
            );
        },
        [handleGodray],
    );

    const startOpacity = lightMode ? 1 : 0.01;

    useFrame(state => {
        const scroll = getAltScroll();
        const a = 0.1;
        const alpha = MathUtils.clamp(a * (scroll * scroll), 0, 1);
        if (sunRef.current) {
            // const scale = Math.max(MathUtils.lerp(1, -10, scroll), 0.1);
            const scale = Math.max(MathUtils.lerp(1, -5, scroll), 0.1);
            sunRef.current.scale.set(scale, scale, scale);
            sunRef.current.material.opacity = MathUtils.lerp(startOpacity, 0, scroll);
        }
        if (godrayRef.current) {
            // clampMax
            // decay
            // density
            // exposure
            // inputBuffer
            // lightPosition
            // weight
            const uniforms = godrayRef.current.godRaysMaterial.uniforms;
            uniforms.clampMax.value = Math.max(MathUtils.lerp(1, 0, scroll), 0);
        }

        if (bloomRef.current) {
            // console.log(bloomRef.current);
            bloomRef.current.uniforms.get('intensity').value = Math.max(
                MathUtils.lerp(1, 0, alpha),
                0,
            );
        }

        if (godrayRef) {
            // console.log(godrayRef);
        }
    });

    return (
        <>
            <EffectComposer>
                <DepthOfField
                    focusDistance={0.5}
                    focalLength={5}
                    bokehScale={5}
                    height={480}
                />
                <Bloom
                    ref={bloomRef}
                    intensity={0.05}
                    luminanceThreshold={0}
                    luminanceSmoothing={0.75}
                    height={500}
                />
                <Noise opacity={0.05} />
                <Vignette eskil={false} offset={0.1} darkness={1} />
                {godray}
            </EffectComposer>
            <mesh ref={handleSun}>
                <sphereGeometry args={[props.godRayRadius, 32, 16]} />
                <meshStandardMaterial
                    ref={matRef}
                    emissive={white}
                    opacity={startOpacity}
                />
            </mesh>
        </>
    );
}
