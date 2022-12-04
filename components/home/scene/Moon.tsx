
import { useFrame } from '@react-three/fiber';
import { useContext, useRef } from 'react';
import { Matrix3, ShaderMaterial } from 'three';
import { lightPositionContext } from '../../common/contexts';
import { getAltScroll } from '../../common/scroll';
import moon_fs from './shaders/moon_fs.glsl';
import moon_vs from './shaders/moon_vs.glsl';

const tempMat3 = new Matrix3()

export default function Moon() {

    const lightPosition = useContext(lightPositionContext)

    const uniforms = {
        uRotation: { value: tempMat3 },
        uScrollAmount: { value: 0.0 }
    }

    const material = new ShaderMaterial({
        uniforms: uniforms,
        vertexShader: moon_vs,
        fragmentShader: moon_fs,
    })

    const meshRef = useRef(null);

    useFrame(() => {
        uniforms.uScrollAmount.value = getAltScroll();
    })

    useFrame(() => {
        if (meshRef.current) {
            meshRef.current.position.copy(lightPosition);
        }
    })

    // useFrame((state) => {
    //     if (meshRef.current) {
    //         const mesh = meshRef.current;

    //         const axis = tempVector.set(1,0,0)
    //         const radians = 0.01

    // tempMat4.makeRotationAxis(axis, radians);
    // mesh.matrix.multiplyMatrices(tempMat4, mesh.matrix); // r56
    // tempMat4.extractRotation(mesh.matrix);
    // mesh.rotation.setFromRotationMatrix(tempMat4, mesh.rotation.order ); 
    // console.log(state.clock.elapsedTime);

    // save current position

    // if(state.clock.elapsedTime > 0.01) { // not sure why
    //     mesh.position.setFromMatrixPosition( mesh.matrix );
    // }
    //     }
    // })
    // useEffect(() => {
    //     if(meshRef.current) {
    //         console.log(meshRef.current.position);

    //     }
    // })

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
                ref={meshRef}
                castShadow
                receiveShadow
                // rotation={[Math.PI / 4, 0, 0]}
                position={lightPosition}
                material={material}
            >
                <sphereGeometry args={[0.5, 16, 16]} />
            </mesh>
        </>
    )
}