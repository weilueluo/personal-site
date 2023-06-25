"use client";

import { useGLTF } from "@react-three/drei";
import React from "react";
import { useEffectOnce } from "react-use";

export default function Room(props: React.ComponentPropsWithoutRef<any>) {
    const { scene } = useGLTF("/models/room.glb");
    useEffectOnce(() => {
        scene.receiveShadow = true;
        scene.castShadow = true;
        scene.children.forEach(mesh => {
            mesh.castShadow = true;
            mesh.receiveShadow = true;
        });
    });
    // eslint-disable-next-line react/no-unknown-property
    return <primitive object={scene} {...props} />;
}
