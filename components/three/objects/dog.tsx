"use client";

import { useGLTF } from "@react-three/drei";
import React from "react";

export default function Dog(props: React.ComponentPropsWithoutRef<any>) {
    const { scene } = useGLTF("/dog.glb");
    // eslint-disable-next-line react/no-unknown-property
    return <primitive object={scene} {...props} />;
}
