import React from 'react'
import { useAltScroll } from '../utils/hooks'
import { useFrame } from '@react-three/fiber'
import { ShaderMaterial, Color } from 'three'

import background_vs from '../shaders/background_vs.glsl'
import background_fs from '../shaders/background_fs.glsl'

export default function GradientBackground() {
    const altScroll = useAltScroll()

    const uniforms = {
        uColorA: { value: new Color(0x1e3966) },
        uColorB: { value: new Color(0x661e49) },
        uScrolledAmount: { value: scroll }
    }

    const material = new ShaderMaterial({
        uniforms: uniforms,
        vertexShader: background_vs,
        fragmentShader: background_fs
    })

    useFrame(() => {
        material.uniforms.uScrolledAmount.value = altScroll;
    })

    return ( 
        <mesh material={material}>
            <planeGeometry args={[2, 2, 1, 1] }/>
        </mesh>
    )
}