"use client"

import { Preload } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import tunnel from 'tunnel-rat'

export const r3f = tunnel()

export default function Scene({ ...props }) {
    // Everything defined in here will persist between route changes, only children are swapped
    return (
        <Canvas {...props}>
            {/* @ts-ignore */}
            <r3f.Out />
            <Preload all />
        </Canvas>
    );
}
