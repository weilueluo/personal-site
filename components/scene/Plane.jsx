import React from "react";

import { MeshReflectorMaterial } from "@react-three/drei";

export default function Plane(props) {
    return (
        <mesh rotation={props.rotation} position={props.position} receiveShadow castShadow>
            <planeBufferGeometry attach="geometry" args={props.size} />
            <MeshReflectorMaterial
                blur={[0, 0]} // Blur ground reflections (width, heigt), 0 skips blur
                mixBlur={0.5} // How much blur mixes with surface roughness (default = 1)
                mixStrength={0.25} // Strength of the reflections
                // mixContrast={1} // Contrast of the reflections
                resolution={1024} // Off-buffer resolution, lower=faster, higher=better quality, slower
                mirror={0.9} // Mirror environment, 0 = texture colors, 1 = pick up env colors
                depthScale={50} // Scale the depth factor (0 = no depth, default = 0)
                minDepthThreshold={0.25} // Lower edge for the depthTexture interpolation (default = 0)
                maxDepthThreshold={1} // Upper edge for the depthTexture interpolation (default = 0)
                // depthToBlurRatioBias={0.25} // Adds a bias factor to the depthTexture before calculating the blur amount [blurFactor = blurTexture * (depthTexture + bias)]. It accepts values between 0 and 1, default is 0.25. An amount > 0 of bias makes sure that the blurTexture is not too sharp because of the multiplication with the depthTexture
                // distortion={0} // Amount of distortion based on the distortionMap texture
                // distortionMap={distortionTexture} // The red channel of this texture is used as the distortion map. Default is null
                /*debug={0} /* Depending on the assigned value, one of the following channels is shown:
                  0 = no debug
                  1 = depth channel
                  2 = base channel
                  3 = distortion channel
                  4 = lod channel (based on the roughness)
                */
                args={[20, 20]} // PlaneBufferGeometry arguments
                
            //    reflectorOffset={0.2} // Offsets the virtual camera that projects the reflection. Useful when the reflective surface is some distance from the object's origin (default = 0)
            />
        </mesh>
    );
}

Plane.defaultProps = {
    'rotation': [-Math.PI / 2, 0, 0],
    'position': [0, 0, 0],
    'color': '#bfbfbf',
    'size': [20, 20]
}
