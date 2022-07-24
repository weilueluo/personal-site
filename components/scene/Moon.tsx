
import { useContext, useEffect, useRef } from 'react';
import { lightPositionContext } from '../utils/context'
import moon_fs from '../shaders/moon_fs.glsl'
import moon_vs from '../shaders/moon_vs.glsl'
import { ShaderMaterial, Vector3, Matrix3 , Matrix4 } from 'three'
import { useFrame } from '@react-three/fiber'

const tempVector = new Vector3()
const tempMat3 = new Matrix3()
const tempMat4 = new Matrix4()

export default function Moon() {

    const position = useContext(lightPositionContext)

    const uniforms = {
        uRotation: { value: tempMat3 }
    }

    const material = new ShaderMaterial({
        uniforms: uniforms,
        vertexShader: moon_vs,
        fragmentShader: moon_fs,
    })

    const meshRef = useRef(null);

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
        <mesh
            ref={meshRef}
            castShadow
            receiveShadow
            // rotation={[Math.PI / 4, 0, 0]}
            position={position}
            material={material}
        >
            <sphereBufferGeometry args={[1, 16, 16]} />
            {/* <meshStandardMaterial
                color={0x34d3eb}
                emissive={0x0d2f5c}
                emissiveIntensity={1}
                transparent={true}
                opacity={1}
            /> */}
        </mesh>
    )
}