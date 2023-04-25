"use client"

import { PerspectiveCamera } from "@react-three/drei";
import { Suspense } from "react";
import { Color } from "three";

const Common = ({ color }: { color?: Color }) => (
    <Suspense fallback={null}>
        {color && <color attach="background" args={[color]} />}
        <ambientLight intensity={0.5} />
        <pointLight position={[20, 30, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} color="blue" />
        <PerspectiveCamera makeDefault fov={55} position={[0, 0, 6]} />
    </Suspense>
);

Common.displayName = "Common";

export default Common;
