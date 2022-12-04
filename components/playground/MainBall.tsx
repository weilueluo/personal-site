import { RootState, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import { Box3, Euler, Group, Mesh, MeshStandardMaterial, Object3D, Quaternion, Vector3 } from "three";
import { useBallGLTF, useMeshNodes, useJsx as useJsx } from "../common/model";
import { useAltScroll } from "../common/threejs";



export type MainBallProps = {
    ballRadius: number,
    rotation?: number[],
    delay?: number
}

function useAltScrollWithDelay(delay: number) {
    const scroll = useAltScroll();
    const [scrollWithDelay, setScrollWithDelay] = useState(0);
    const available = 1 - delay;
    useEffect(() => {
        if (scroll < delay) {
            setScrollWithDelay(0)
        } else {
            setScrollWithDelay(scroll * available);
        }
    }, [available, delay, scroll])

    return scrollWithDelay;
}

const tempVec3 = new Vector3();

export default function MainBall(props: MainBallProps) {

    const gltf = useBallGLTF('/models/ball/sphere.glb');

    const material = useRef(new MeshStandardMaterial({ color: 0x2f2f2f }));

    const [meshNodes, otherNodes] = useMeshNodes(gltf);
    const meshJsx = useJsx(meshNodes, otherNodes, material.current);
    const animationProps = useMeshAnimationProps(meshNodes);

    const ballRef = useRef<Group>();
    const sceneRef = useRef<Group>();

    const scroll = useAltScrollWithDelay(props.delay || 0);

    useFrame((state: RootState) => {
        if (sceneRef.current && animationProps !== null) {
            // console.log(meshesMovementProps);
            const time = state.clock.getElapsedTime()
            sceneRef.current.children.forEach((mesh: Mesh) => {
                const props = animationProps[mesh.name];
                if (!props) {
                  return
                }
                const targetPosition = tempVec3.lerpVectors(props.startPos, props.expandEndPos, scroll);
                mesh.position.lerp(targetPosition, 0.075)
                const targetRotation = props.startQuaternion.clone().slerp(props.expandEndRot, scroll * props.expandRotAmount);
                mesh.quaternion.slerp(targetRotation, 0.075);
                if (scroll < 1e-6) {
                    const targetPosition = tempVec3.lerpVectors(props.startPos, props.floatEndPos, (Math.sin(time + props.random * 37) + 1) / 2);
                    mesh.position.lerp(targetPosition, 0.075)
                }
            })
        }
    })

    useEffect(() => {
        if (!ballRef.current) return;
        const rot = props.rotation || [0,0,0];
        ballRef.current.rotation.set(rot[0], rot[1], rot[2])
    }, [props.rotation])

    return (
        <group ref={ballRef} name='Ball' scale={props.ballRadius} dispose={null}>
            <group ref={sceneRef} name='Scene'>
                {meshJsx as any[]}
            </group>
        </group>
    )
    
}
type MeshAnimationProps = {
    [key: string]: MeshAnimationPropValue
}

type MeshAnimationPropValue = {
    startPos: Vector3,
    startQuaternion: Quaternion,
    floatEndPos: Vector3,
    expandEndPos: Vector3,
    expandEndRot: Quaternion,
    expandRotAmount: number,
    random: number,
}

const tempBox3 = new Box3();

function useMeshAnimationProps(meshes: Mesh[]): MeshAnimationProps {
    return useMemo(() => {
        const props = {}
        meshes.forEach(mesh => {
            // assumed ball center is 0,0,0
            const volume = getVolume(mesh);
            // console.log(volume);
            
            const dist2center = mesh.position.length();
            const floatEndPos = mesh.position.clone().add(mesh.position.clone().normalize().multiplyScalar(Math.random() * 0.03 * Math.exp((1/(volume+1)) * 2)));
            const expandEndPos = mesh.position.clone().add(mesh.position.clone().normalize().multiplyScalar((Math.random() + 0.5) * 10 * Math.exp((1/(volume+1)) * 2)));
            // const expandEndRot = new Quaternion().setFromEuler(new Euler(Math.PI * Math.random() * rotFactor, Math.PI * Math.random() * rotFactor, Math.PI * Math.random() * rotFactor));
            const expandEndRot = new Quaternion().random();
            const rotAmount = Math.random() * dist2center * 10;
            props[mesh.name] = {
                startPos: mesh.position.clone(),
                startQuaternion: mesh.quaternion,
                floatEndPos: floatEndPos,
                expandEndPos: expandEndPos,
                expandEndRot: expandEndRot,
                expandRotAmount: rotAmount,
                random: Math.random()
            }
        })
        return props;
    }, [meshes]);
}

function getVolume(object3d: Object3D) {
    tempBox3.setFromObject(object3d);
    tempVec3.subVectors(tempBox3.max, tempBox3.min)
    return Math.abs(tempVec3.x) * Math.abs(tempVec3.y) * Math.abs(tempVec3.z)
}