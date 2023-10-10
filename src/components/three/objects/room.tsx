"use client";

import { Gltf } from "@react-three/drei";
import React from "react";

export default function Room(props: React.ComponentPropsWithoutRef<any>) {
    // const gltfRef = useRef<Object3D>(null!);
    // const axis = new Vector3(0, -1, 0);

    // const [speed, setSpeed] = useState(0.1);
    // const [hover, setHover] = useState(false);

    // useFrame(() => {
    //     if (gltfRef.current) {
    //         // gltfRef.current.quaternion.copy(q)

    //         if (!hover) {
    //             gltfRef.current.rotateOnWorldAxis(axis, speed);
    //             setSpeed(Math.max(speed * 0.99, 0.005));
    //         }
    //     }

    // });

    return (
        <>
            <group>
                {/* <SpotLight
            ref={lightRef}
                distance={5}
                angle={0.4}
                attenuation={2.4}
                anglePower={5} // Diffuse-cone anglePower (default: 5)
                position={[-1.7, 1.1, 0.9]}
                target={target}
                /> */}
                {/* <Stage adjustCamera={false} preset="rembrandt" intensity={1} environment={"city"}> */}
                <Gltf
                    // ref={gltfRef}
                    // onPointerEnter={() => setHover(true)}
                    // onPointerOut={() => setHover(false)}
                    src="/models/room3.glb"
                    receiveShadow
                    castShadow
                    {...props}
                />
                {/* </Stage> */}
            </group>
            {/* <Cloud seed={1} scale={2} volume={5} color="hotpink" fade={100} /> */}
            {/* <Sparkles
                count={50}
                speed={1}
                opacity={1}
                scale={5}
            /> */}
        </>
    );
    // eslint-disable-next-line react/no-unknown-property
    // return <primitive object={scene} {...props} />;
}
