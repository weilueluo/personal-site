import React, { useEffect, useRef, useState } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, useHelper } from "@react-three/drei";
import MyCanvas from "./MyCanvas";
import { DirectionalLightHelper, SphereBufferGeometry, TextureLoader } from "three";


export default function WavePlanet() {
    return (
        <MyCanvas>
            <color attach={"background"} args={[0x3c3c3c]}/>
            <MyLights/>
            <MySphere/>
        </MyCanvas>
    )
}

function MySphere() {
    const [
        waterBaseColor,
        waterNormalMap,
        waterHeightMap,
        waterRoughness,
        waterAmbientOcclusion
    ] = useLoader(TextureLoader, [
        "../textures/water/Water_002_COLOR.jpg",
        "../textures/water/Water_002_NORM.jpg",
        "../textures/water/Water_002_DISP.png",
        "../textures/water/Water_002_ROUGH.jpg",
        "../textures/water/Water_002_OCC.jpg"
    ])

    const geoRef = useRef<SphereBufferGeometry>()
    const damping = 0.2
    const [count, setCount] = useState(-1)
    const [positionClone, setPositionClone] = useState([])
    const [normalsClone, setNormalsClone] = useState([])
    useEffect(() => {
        const geometry = geoRef.current
        if (geometry) {
            setCount(geometry.attributes.position.count)
            setPositionClone(JSON.parse(JSON.stringify(geometry.attributes.position.array)))
            setNormalsClone(JSON.parse(JSON.stringify(geometry.attributes.normal.array)))
        }
    }, [])

    useFrame(() => {
        const now = Date.now() / 200;
        const geometry = geoRef.current
        if (!geometry) {
            return
        }
        // iterate all vertices
        for (let i = 0; i < count; i++) {
            // indices
            const ix = i * 3
            const iy = i * 3 + 1
            const iz = i * 3 + 2

            // use uvs to calculate wave
            const uX = geometry.attributes.uv.getX(i) * Math.PI * 16
            const uY = geometry.attributes.uv.getY(i) * Math.PI * 16

            // calculate current vertex wave height
            const xangle = (uX + now)
            const xsin = Math.sin(xangle) * damping
            const yangle = (uY + now)
            const ycos = Math.cos(yangle) * damping

            // set new position
            geometry.attributes.position.setX(i, positionClone[ix] + normalsClone[ix] * (xsin + ycos))
            geometry.attributes.position.setY(i, positionClone[iy] + normalsClone[iy] * (xsin + ycos))
            geometry.attributes.position.setZ(i, positionClone[iz] + normalsClone[iz] * (xsin + ycos))
        }
        geometry.computeVertexNormals();
        geometry.attributes.position.needsUpdate = true;
    })

    return (
        <mesh>
            <sphereBufferGeometry
                ref={geoRef}
                args={[6, 128, 128]}
            />
            <meshStandardMaterial
                map={waterBaseColor}
                normalMap={waterNormalMap}
                displacementMap={waterHeightMap}
                displacementScale={0.01}
                roughnessMap={waterRoughness}
                roughness={0}
                aoMap={waterAmbientOcclusion}
            />
        </mesh>
    )
}

function MyLights() {
    const dlRef = useRef()
    useHelper(dlRef, DirectionalLightHelper)
    return (
        <>
            <ambientLight
                color={0xffffff}
                intensity={0.5}
            />
            <OrbitControls/>
            <directionalLight
                ref={dlRef}
                position={[20, 20, 20]}
                castShadow
                shadow-mapSize-width={4096}
                shadow-mapSize-height={4096}
                shadow-camera-far={50}
                shadow-camera-left={-10}
                shadow-camera-right={10}
                shadow-camera-top={10}
                shadow-camera-bottom={-10}
            />
        </>
    )
}

