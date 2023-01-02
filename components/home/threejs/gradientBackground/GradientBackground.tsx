import { useFrame } from '@react-three/fiber'
import { Color, ShaderMaterial } from 'three'

import background_fs from './background_fs.glsl'
import background_vs from './background_vs.glsl'
import { getAltScroll } from '../../../common/scroll'

const uniforms = {
    uColorA: { value: new Color(0x1e3966) },
    uColorB: { value: new Color(0x661e49) },
    uScrolledAmount: { value: 0 }
}

const material = new ShaderMaterial({
    uniforms: uniforms,
    vertexShader: background_vs,
    fragmentShader: background_fs,
})

export default function GradientBackground() {

    useFrame(() => {
        const altScroll = getAltScroll();
        material.uniforms.uScrolledAmount.value = altScroll;
    })

    return (
        <mesh material={material}>
            <planeGeometry args={[2, 2, 1, 1]} />
        </mesh>
    )
}