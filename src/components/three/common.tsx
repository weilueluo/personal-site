/* eslint-disable react/no-unknown-property */
"use client";

import { CycleRaycast, PerspectiveCamera, useHelper } from "@react-three/drei";
import { useControls } from "leva";
import { Suspense, useRef } from "react";
import { Color, PointLight, PointLightHelper, SpotLight, SpotLightHelper, Vector3 } from "three";

const Common = ({ color }: { color?: Color }) => {
    // const lightRef1 = useRef<PointLight>(null!);
    // const lightRef2 = useRef<PointLight>(null!);
    const lightRef3 = useRef<SpotLight>(null!);
    // useHelper(lightRef1, PointLightHelper)
    // useHelper(lightRef2, PointLightHelper)
    useHelper(lightRef3, SpotLightHelper);

    const { x, angle, pos } = useControls({
        x: { value: 1, min: -10, max: 10 },
        angle: { value: Math.PI / 8, min: -Math.PI, max: Math.PI, step: 0.05 },
        pos: {
            value: { x: 1, y: 1, z: 1 },
            x: { min: -10, max: 10 },
            y: { min: -10, max: 10 },
            z: { min: -10, max: 10 },
        },
    });

    return (
        <Suspense fallback={null}>
            {/* {color && <color attach="background" args={[color]} />} */}
            {/* <ambientLight intensity={1} /> */}
            {/* <pointLight position={[20, 30, 10]} intensity={1} />
        <pointLight position={[1, 1, 1]} color="blue" distance={x} /> */}
            {/* <spotLight ref={lightRef3} position={[pos.x, pos.y, pos.z]} color="ref" angle={angle} castShadow /> */}
            {/* <PerspectiveCamera makeDefault fov={55} position={[0, 0, 6]} /> */}
        </Suspense>
    );
};

Common.displayName = "Common";

export default Common;
