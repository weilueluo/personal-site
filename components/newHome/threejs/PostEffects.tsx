import {
    EffectComposer,
    DepthOfField,
    Bloom,
    Noise,
    Vignette,
    GodRays,
} from '@react-three/postprocessing';
import { useState, useCallback, useRef } from 'react';
import { BlendFunction, Resizer, KernelSize } from 'postprocessing';
import { Color, MathUtils } from 'three';
import { useFrame } from '@react-three/fiber';
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
        godray.godRaysPass.fullscreenMaterial.onBeforeCompile = (shader, renderer) => {
            shader.fragmentShader = shader.fragmentShader.replace(
                '#include <dithering_fragment>',
                `
                //#include <dithering_fragment>
                gl_FragColor = gl_FragColor * -100.;
            `)
            // .replace('texel=texture2D(inputBuffer,coord);', `
            // texel=vec4(0.0);
            // `)

            console.log(shader.fragmentShader);

        };

        console.log(godrayRef.current);
        
    }

    const handleSun = useCallback(sun => {
        sunRef.current = sun;
        setGodray(
            <GodRays
                ref={handleGodray}
                sun={sunRef.current}
                blendFunction={BlendFunction.SCREEN}
                samples={50}
                density={0.97}
                decay={0.85}
                weight={0.6}
                exposure={1}
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
        if (sunRef.current) {
            const scale = Math.max(MathUtils.lerp(1, -10, scroll), 0.1);
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
                MathUtils.lerp(1, -7, scroll),
                0,
            );
        }

        if (bloomRef.current) {
            // console.log(bloomRef.current);
            bloomRef.current.uniforms.get('intensity').value = Math.max(
                MathUtils.lerp(1, 0, Math.max(-1 / (scroll + 1e-6) + 9, 0)),
                0,
            );
        }

        if (matRef.current) {
            // console.log(matRef.current);
            matRef.current.color.set(
                tempColor.lerpColors(
                    white,
                    black,
                    MathUtils.clamp(-1 / (scroll + 1e-6) + 9, 0, 1),
                ),
            );
            matRef.current.emissive.set(
                tempColor.lerpColors(
                    white,
                    black,
                    MathUtils.clamp(-1 / (scroll + 1e-6) + 9, 0, 1),
                ),
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
                    height={200}
                />
                <Noise opacity={0.05} />
                <Vignette eskil={false} offset={0.1} darkness={1.1} />
                {godray}
            </EffectComposer>
            <mesh ref={handleSun}>
                <sphereGeometry args={[5, 32, 16]} />
                <meshStandardMaterial ref={matRef} emissive={black} opacity={0.01}/>
            </mesh>
        </>
    );
}
