
import { useFrame } from '@react-three/fiber';
import { forwardRef, useContext, useRef } from 'react';
import { Matrix3, ShaderMaterial } from 'three';
import { getAltScroll } from '../common/scroll';
import moon_fs from '../home/scene/shaders/moon_fs.glsl';
import moon_vs from '../home/scene/shaders/moon_vs.glsl';

const tempMat3 = new Matrix3()

export const NewMoon = forwardRef((props, ref: any) => {
    const uniforms = {
        uRotation: { value: tempMat3 },
        uScrollAmount: { value: 0.0 }
    }

    const material = new ShaderMaterial({
        uniforms: uniforms,
        vertexShader: moon_vs,
        fragmentShader: moon_fs,
    })

    useFrame(() => {
        uniforms.uScrollAmount.value = getAltScroll();
    })

    return (
        <>
            {/* <ThreeSurroundingText 
                position={lightPosition}
                radius={0.6}
                text='Sun'
                rotationZ={0}
                fontSize={0.3}
                expandOnScrollSpeed={0}
            /> */}

            <mesh
                ref={ref}
                castShadow
                receiveShadow
                // rotation={[Math.PI / 4, 0, 0]}
                material={material}
            >
                <sphereGeometry args={[0.5, 16, 16]} />
            </mesh>
        </>
    )
})

NewMoon.displayName = "Moon"