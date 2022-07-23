
import { useContext } from 'react';
import { lightPositionContext } from '../utils/context'
import moon_fs from '../shaders/moon_fs.glsl'
import moon_vs from '../shaders/moon_vs.glsl'

export default function Moon(props) {

    const position = useContext(lightPositionContext)

    const uniforms = {

    }

    const material = new ShaderMaterial({
        uniforms: uniforms,
        vertexShader: moon_vs,
        vertexShader: moon_fs,
    })

    return (
        <mesh
            castShadow
            receiveShadow
            // rotation={[Math.PI / 4, 0, 0]}
            position={position}
        >
            <sphereBufferGeometry args={[1, 16, 16]} />
            <meshStandardMaterial
                color={0x34d3eb}
                emissive={0x0d2f5c}
                emissiveIntensity={1}
                transparent={true}
                opacity={1}
            />
        </mesh>
    )
}