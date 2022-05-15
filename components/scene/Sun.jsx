
import { useTexture } from "@react-three/drei";
import { extend, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { PointLight } from "three";
import { Color } from "three";
import { Vector3 } from "three";
import { Object3D } from "three";
import Sunlight from "./Sunlight";

const tempObject = new Object3D()
const tempColor = new Color()

const position = new Vector3(30, 15, 30)

const radius = 15
const nCubes = 1000
const dataArray = Array(nCubes)
const innerRadius = 5
let i = 0
while (i < dataArray.length) {
    const r = Math.random() * radius

    if (r < innerRadius) {
        continue
    }

    const theta = Math.acos(2.0 * Math.random() - 1.0)
    const phi = 2 * Math.PI * Math.random()

    const posX = r * Math.cos(phi) * Math.sin(theta)
    const posY = r * Math.sin(phi) * Math.sin(theta)
    const posZ = r * Math.cos(theta)
    const scale = (radius - r) / radius
    const scaleX = scale
    const scaleY = scale
    const scaleZ = scale

    dataArray[i] = {
        position: new Vector3(posX, posY, posZ),
        scale: new Vector3(scaleX, scaleY, scaleZ),
        color: new Color('black')
    }
    i++
}

export default function Sun() {
    const meshRef = useRef()

    useFrame(state => {
        for (let i = 0; i < nCubes; i++) {
            tempObject.position.set(...dataArray[i].position)
            tempObject.scale.set(...dataArray[i].scale)
            tempObject.updateMatrix()
            tempColor.set(dataArray[i].color)

            meshRef.current.setMatrixAt(i, tempObject.matrix)
            meshRef.current.setColorAt(i, tempColor)
        }
    })

    return (
        <>
            <Sunlight args={[1, 1, 1, ...position]} />
            <instancedMesh castShadow receiveShadow ref={meshRef} args={[null, null, nCubes]} position={position}>
                <boxGeometry args={[1, 1, 1]} />
                <meshBasicMaterial opacity={0.5} />
            </instancedMesh>
        </>

    )
}