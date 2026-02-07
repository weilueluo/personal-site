"use client";

import { Gltf, Stage } from "@react-three/drei";
import React from "react";
import { useTheme } from "@/shared/theme/themes";

export default function Room(props: React.ComponentPropsWithoutRef<any>) {
    const { resolvedTheme } = useTheme();

    // ContactShadows draws only the shadow texture (the rest is transparent), so the "ground" disappears.
    // Adjust opacity slightly by theme so the shadow reads on both light/dark backgrounds.
    const shadowOpacity = resolvedTheme === "dark" ? 0.65 : 0.35;
    return (
        <Stage
            shadows={{
                type: "contact",
                frames: 1,
                opacity: shadowOpacity,
            }}>
            <Gltf src="/models/room3.glb" castShadow receiveShadow {...props} />
        </Stage>
    );
}
