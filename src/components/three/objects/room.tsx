"use client";

import { Gltf, Stage } from "@react-three/drei";
import React from "react";

export default function Room(props: React.ComponentPropsWithoutRef<any>) {
    return (
        <Stage shadows={"accumulative"}>
            <Gltf src="/models/room3.glb" castShadow receiveShadow {...props} />
        </Stage>
    );
}
