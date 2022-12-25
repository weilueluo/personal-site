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
import { useCallback, useRef, useState } from 'react';
import { Color, MathUtils } from 'three';
import { getAltScroll } from '../../common/scroll';

const white = new Color(0xffffff);
const black = new Color(0x000000);
const tempColor = new Color();

export function ThreeJsPostEffects() {
    const sunRef = useRef<any>(null);
    const godrayRef = useRef<any>(null);
    const bloomRef = useRef<any>(null);
    const matRef = useRef<any>();
    const [godray, setGodray] = useState(null);

    const handleGodray = godray => {
        godrayRef.current = godray;
        if (!godray) {
            return;
        }
        godray.godRaysPass.fullscreenMaterial.onBeforeCompile = shader => {
            shader.fragmentShader = shader.fragmentShader.replace(
                '#include <dithering_fragment>',
                `
                //#include <dithering_fragment>
                gl_FragColor = gl_FragColor * -50.;
            `,
            );
            // .replace('texel=texture2D(inputBuffer,coord);', `
            // texel=vec4(0.0);
            // `)
        };
    };

    const handleSun = useCallback(sun => {
        sunRef.current = sun;
        setGodray(
            <GodRays
                ref={handleGodray}
                sun={sunRef.current}
                blendFunction={BlendFunction.SCREEN}
                samples={60}
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
    }, []);

    useFrame(state => {
        const scroll = getAltScroll();
        const a = 0.1;
        const alpha = MathUtils.clamp(a * (scroll * scroll), 0, 1);
        if (sunRef.current) {
            // const scale = Math.max(MathUtils.lerp(1, -10, scroll), 0.1);
            const scale = Math.max(MathUtils.lerp(1, -5, scroll), 0.1);
            sunRef.current.scale.set(scale, scale, scale);
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
            uniforms.clampMax.value = Math.max(
                MathUtils.lerp(1, 0, scroll),
                0,
            );
        }

        if (bloomRef.current) {
            // console.log(bloomRef.current);
            bloomRef.current.uniforms.get('intensity').value = Math.max(
                MathUtils.lerp(1, 0, alpha),
                0,
            );
        }

        if (matRef.current) {
            // console.log(matRef.current);
            matRef.current.color.set(tempColor.lerpColors(white, black, alpha));
            matRef.current.emissive.set(
                tempColor.lerpColors(white, black, alpha),
            );
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
                    intensity={0.1}
                    luminanceThreshold={0}
                    luminanceSmoothing={0.75}
                    height={500}
                />
                <Noise opacity={0.05} />
                <Vignette eskil={false} offset={0.1} darkness={1.1} />
                {godray}
            </EffectComposer>
            <mesh ref={handleSun}>
                <sphereGeometry args={[5.5, 32, 16]} />
                <meshStandardMaterial
                    ref={matRef}
                    emissive={black}
                    opacity={0.01}
                />
            </mesh>
        </>
    );
}
