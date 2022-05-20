
import { useTexture } from "@react-three/drei";
import { extend, useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import { PointLight } from "three";
import { PMREMGenerator } from "three";
import { Color } from "three";
import { Vector3 } from "three";
import { Object3D } from "three";
import { useHover } from "../utils/hooks";
import Sunlight from "./Sunlight";

const tempObject = new Object3D()
const tempColor = new Color()

const position = new Vector3(30, 15, 30)

const radius = 30
const nCubes = 500
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
    const scale = (radius - r) / radius * (0.5 + Math.random())
    const scaleX = scale * (Math.random() * 2 + 1)
    const scaleY = scale * (Math.random() * 2 + 1)
    const scaleZ = scale * (Math.random() * 2 + 1)

    let saturation = (r - innerRadius) / (radius - innerRadius)
    // console.log(saturation);
    saturation = 0.1 * Math.log10(saturation) + 1
    saturation = 100 - Math.floor(saturation * 100)
    dataArray[i] = {
        initPosition: new Vector3(posX, posY, posZ),
        position: new Vector3(posX, posY, posZ),
        scale: new Vector3(scaleX, scaleY, scaleZ),
        color: new Color(`hsl(10, 100%, ${saturation}%)`),
        speed: (Math.random() - 0.5) * 2
    }
    i++
}

export default function Sun() {
    const meshRef = useRef()

    const [hover, overHandler, outHandler] = useHover()

    useFrame(state => {
        meshRef.current.rotation.y = state.clock.elapsedTime * 0.02;
        for (let i = 0; i < nCubes; i++) {
            // tempObject.rotateOnWorldAxis(meshRef.current.position)
            // const m2o = tempObject.position.sub(meshRef.current.position)
            // tempObject.position.set(...meshRef.current.position)
            // tempObject.rotateOnAxis(Object3D.DefaultUp, state.clock.elapsedTime * 0.01)
            tempObject.setRotationFromAxisAngle(Object3D.DefaultUp, state.clock.elapsedTime * dataArray[i].speed)
            
            // rotateAboutPoint(tempObject, meshRef.current.position, Object3D.DefaultUp, state.clock.elapsedTime * dataArray[i].speed, true)
            // tempObject.position.add(m2o)

            if(hover) {
                dataArray[i].position.multiplyScalar(1.01)
            }
            //     const distToCenter = dataArray[i].position.distanceTo(meshRef.current.position)
            //     const initDistToCenter = dataArray[i].initPosition.distanceTo(meshRef.current.position)
            //     if (distToCenter < initDistToCenter) {
            //         dataArray[i].position.multiplyScalar(0.99)
            //     } else {
            //         dataArray[i].position = dataArray[i].initPosition
            //     }
            // }

            tempObject.position.set(...dataArray[i].position)
            tempObject.scale.set(...dataArray[i].scale)
            tempObject.updateMatrix()
            tempColor.set(dataArray[i].color)

            meshRef.current.setMatrixAt(i, tempObject.matrix)
            meshRef.current.geometry.needsUpdate = true
            meshRef.current.setColorAt(i, tempColor)
        }
        meshRef.current.instanceMatrix.needsUpdate = true
    })

    const {
        gl, // WebGL renderer
        scene, // Default scene
        camera, // Default camera
      } = useThree();

    return (
        <group>
            <Sunlight args={['#ffffff']} position={position} onPointerOver={overHandler} onPointerOut={outHandler} />
            <instancedMesh castShadow receiveShadow ref={meshRef} args={[null, null, nCubes]} position={position}>
                <icosahedronBufferGeometry args={[1, 0]} />
                <meshStandardMaterial opacity={0.5} shininess={10} metalness={0}/>
            </instancedMesh>
        </group>

    )
}