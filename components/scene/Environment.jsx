import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { ConfigContext } from "../context/ConfigContext";
import { useUpdate } from "react-use";
import { Vector3 } from "three";
import { Euler } from "three";
import { Quaternion } from "three";
import { Matrix4 } from "three";
import { getSortedRoutes } from "next/dist/shared/lib/router/utils";
import { useFrame } from "@react-three/fiber";
import { Object3D } from "three";
import { VertexColors } from "three";
import { Color } from "three";
import { MathUtils } from "three";


// https://codesandbox.io/s/instanced-vertex-colors-forked-lyv95m
const tempObject = new Object3D()
const tempColor = new Color()
const dataArray = Array(2048)
const gridOuterRadius = 128
const gridInnerRadius = 10
const innerArea = gridInnerRadius ** 2 * Math.PI

// const colors = [0x34131a, 0x431c22, 0x52242a, 0x612d32, 0x6f353a, 0x7e3e42, 0x8c464a, 0x9b4f52, 0xa95759, 0xb86061, 0xc66868].reverse()
const colors = [0x828282, 0x787878, 0x6e6e6e, 0x646464, 0x5a5a5a, 0x505050, 0x464646, 0x3c3c3c, 0x313131, 0x272727, 0x1c1c1c]
// const colorLength = (gridOuterRadius - gridInnerRadius) / colors.length
// const colorAreas = Array(colors.length)
// for (let i = 0, currLength = gridInnerRadius; i < colorAreas.length; i++, currLength += colorLength) {
//     colorAreas[i] = Math.PI * (currLength ** 2)
// }

// console.log(colorAreas);

let i = 0
while (i < dataArray.length) {
    const posX = Math.random() * gridOuterRadius - gridOuterRadius / 2
    const posZ = Math.random() * gridOuterRadius - gridOuterRadius / 2
    const radius = Math.sqrt(posX ** 2 + posZ ** 2)
    const area = Math.PI * (radius ** 2)
    if (area < innerArea) {
        continue;
    }
    // let colorIndex = 0
    // while (area > colorAreas[colorIndex]) {
    //     colorIndex += 1
    // }
    dataArray[i] = {
        position: new Vector3(posX, 0, posZ),
        scale: new Vector3(0.5, Math.random() * 5 + 2, 0.5),
        color: colors[Math.floor(Math.random() * colors.length)]
    }
    i++
}

function Boxes() {
    const [hovered, set] = useState()
    const meshRef = useRef()
    const prevRef = useRef()
    useEffect(() => void (prevRef.current = hovered), [hovered])
    useFrame((state) => {
        const time = state.clock.getElapsedTime()
        // meshRef.current.rotation.x = Math.sin(time / 4)
        // meshRef.current.rotation.y = Math.sin(time / 2)
        for (let i = 0; i < dataArray.length; i++) {
            tempObject.position.set(...dataArray[i].position)
            // tempObject.rotation.y = time
            // tempObject.rotation.z = tempObject.rotation.y * 2
            
            
            // const scale = (dataArray[i].scale = )
            // tempObject.scale.setScalar(scale)
            tempObject.updateMatrix()
            meshRef.current.setMatrixAt(i, tempObject.matrix)
            tempObject.scale.set(...dataArray[i].scale)

            if (i == hovered) {
                tempColor.set('black')
                meshRef.current.instanceColor.needsUpdate = true
            } else {
                tempColor.set(dataArray[i].color)
            }
            
            meshRef.current.setColorAt(i, tempColor)
        }

        meshRef.current.instanceMatrix.needsUpdate = true
    })
    return (
        <instancedMesh castShadow receiveShadow ref={meshRef} args={[null, null, 1000]} onPointerMove={(e) => set(e.instanceId)} onPointerOut={(e) => set(null)}>
            <boxGeometry args={[0.6, 0.6, 0.6]}>
                {/* <instancedBufferAttribute attachObject={['attributes', 'color']} args={[colorArray, 3]} /> */}
            </boxGeometry>
            <meshBasicMaterial opacity={0.5}/>
        </instancedMesh>
    )
}

export default function Environment() {

    // const config = useContext(ConfigContext)
    // const mapSize = config['mapSize']
    const buildings = Boxes(dataArray)

    return (
        <group>
            {buildings}
        </group>
    );
}