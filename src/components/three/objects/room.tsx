"use client";

import { Gltf, Sparkles, Stage } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useRef, useState } from "react";
import { Mesh, Vector3 } from "three";

export default function Room(props: React.ComponentPropsWithoutRef<any>) {
    // const { attenuation, angle, pos } = useControls({
    //     attenuation: { value: 5, min: -10, max: 10 },
    //     angle: { value: 0.15, min: -Math.PI, max: Math.PI, step: 0.05 },
    //     pos: {
    //         value: { x: -1.6, y: 1.5, z: 1 },
    //         x: { min: -10, max: 10 },
    //         y: { min: -10, max: 10 },
    //         z: { min: -10, max: 10 },
    //     },
    // });

    const gltfRef = useRef<Mesh>();
    // const lightRef = useRef<Object3D>()
    // const groupRef = useRef<Group>()
    // const stageRef = useRef<typeof Stage>()
    const axis = new Vector3(0, -1, 0);

    // const q = new Quaternion().setFromAxisAngle(axis, 0)

    const [speed, setSpeed] = useState(0.1);
    const [hover, setHover] = useState(false);
    // const [scale, setScale] = useState(0.1)

    // const firstQuaternion = new Quaternion()

    useFrame(() => {
        if (gltfRef.current) {
            // gltfRef.current.quaternion.copy(q)

            if (!hover) {
                gltfRef.current.rotateOnWorldAxis(axis, speed);
                setSpeed(Math.max(speed * 0.99, 0.005));
            }
            // setScale(Math.min(1, scale * 1.01))
            // groupRef.current.rotateOnWorldAxis(axis, speed)

            // if (speed <= 0.006) {
            //     gltfRef.current.quaternion.slerpQuaternions(gltfRef.current.quaternion, new Quaternion(0,0,0,0), 0.005)
            //     // gltfRef.current.rotation.set(gltfRef.current.rotation.)
            //     console.log(gltfRef.current.quaternion)
            //     }
            // } else {

            // }
        }

        // groupRef.current.scale.lerp(new Vector3(0.1, 0.1, 0.1), 0.001)
    });
    // if (lightRef.current) {
    //     lightRef.current.target.updateMatrixWorld()
    // }

    // const target = new Object3D()
    // target.position.set(4,-5,0)

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
                <Stage adjustCamera={false} preset="rembrandt" intensity={1} environment={"city"}>
                    <Gltf
                        ref={gltfRef}
                        onPointerEnter={() => setHover(true)}
                        onPointerOut={() => setHover(false)}
                        src="/models/room3.glb"
                        receiveShadow
                        castShadow
                        {...props}
                    />
                </Stage>
            </group>
            {/* <Cloud seed={1} scale={2} volume={5} color="hotpink" fade={100} /> */}
            <Sparkles
                /** Number of particles (default: 100) */
                count={50}
                /** Speed of particles (default: 1) */
                speed={1}
                /** Opacity of particles (default: 1) */
                opacity={1}
                /** Color of particles (default: 100) */
                //   color?
                /** Size of particles (default: randomized between 0 and 1) */
                //   size?: number | Float32Array
                /** The space the particles occupy (default: 1) */
                //   scale?: number | [number, number, number] | THREE.Vector3
                scale={5}
                /** Movement factor (default: 1) */
                //   noise?: number | [number, number, number] | THREE.Vector3 | Float32Array
            />
        </>
    );
    // eslint-disable-next-line react/no-unknown-property
    // return <primitive object={scene} {...props} />;
}
