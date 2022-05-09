import React from "react";

import { Reflector } from "@react-three/drei"; 

export default function Plane(props) {
    return (
        // <mesh rotation={props.rotation} position={props.position} receiveShadow castShadow>
        //     <planeBufferGeometry attach="geometry" args={props.size} />
        //     <shadowMaterial attach="material" opacity={0.2} />
        // </mesh>
        <Reflector
            blur={[512, 512]} // Blur ground reflections (width, heigt), 0 skips blur
            mixBlur={0.75} // How much blur mixes with surface roughness
            mixStrength={0.25} // Strength of the reflections
            resolution={1024} // Off-buffer resolution, lower=faster, higher=better quality
            args={[20, 20]} // PlaneBufferGeometry arguments
            rotation={[-Math.PI * 0.5, 0, 0]}
            mirror={0.9} // Mirror environment, 0 = texture colors, 1 = pick up env colors
            minDepthThreshold={0.25}
            maxDepthThreshold={1}
            depthScale={50}
        >
            {(Material, props) => (
            <Material metalness={1} roughness={1} {...props} />
            )}
        </Reflector>
    );
}

Plane.defaultProps = {
    'rotation': [-Math.PI / 2, 0, 0],
    'position': [0, 0, 0],
    'color': '#bfbfbf',
    'size': [20, 20]
}
