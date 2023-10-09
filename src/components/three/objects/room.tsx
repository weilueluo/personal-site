"use client";

import { useGLTF } from "@react-three/drei";
import React from "react";
import { useEffectOnce } from "react-use";
import { Object3D } from "three";

const setShadow = (mesh: Object3D) => {
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    if (mesh.children) {
        mesh.children.forEach(mesh => setShadow(mesh));
    }
};

export default function Room(props: React.ComponentPropsWithoutRef<any>) {
    const { scene } = useGLTF("/models/room3.glb");
    useEffectOnce(() => {
        setShadow(scene);
    });
    // eslint-disable-next-line react/no-unknown-property
    return <primitive object={scene} {...props} />;
}
