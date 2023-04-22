import { useGLTF } from "@react-three/drei";
import React from "react";

export default function Dog(props: React.ComponentPropsWithoutRef<any>) {
    const { scene } = useGLTF("/dog.glb");
    return <primitive object={scene} {...props} />;
}
