import { RootState, useFrame } from '@react-three/fiber';
import { ReactNode, useEffect, useMemo, useRef } from 'react';
import {
    Box3,
    Group,
    Mesh,
    MeshStandardMaterial,
    Object3D,
    Quaternion,
    UniformsUtils,
    Vector3,
} from 'three';
import {
    useBallGLTF,
    useCenterOffset,
    useJsx,
    useMeshNodes,
} from '../../../common/model';
import { getAltScrollWithDelay } from '../../../common/scroll';
import { lights_fragment_begin as customLightsFragBegin } from './lights_fragment_begin.glsl';

function computeMaterial(
    sharedMat: MeshStandardMaterial,
    uniforms: { [key: string]: { value: unknown } },
) {
    const mat = sharedMat.clone();
    // if (Math.random() < 0.15) {
    //     mat.wireframe = true;
    // }

    mat.onBeforeCompile = shader => {
        // console.log(shader);
        shader.uniforms = UniformsUtils.merge([shader.uniforms, uniforms]);

        // shader.fragmentShader = shader.fragmentShader.replace('#include <lights_fragment_begin>', customLightsFragBegin)

        shader.vertexShader = shader.vertexShader.replace(
            'void main() {',
            `
        void main() {
        `,
        );

        shader.fragmentShader = shader.fragmentShader.replace(
            'void main() {',
            `uniform vec3 meshPosition;
        uniform float specularFactor;
        uniform float colorFactor;
        void main() {`,
        );

        shader.fragmentShader = shader.fragmentShader.replace(
            'vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;',
            `vec3 outgoingLight = totalDiffuse + totalSpecular * specularFactor + totalEmissiveRadiance;
        outgoingLight = mix(outgoingLight, meshPosition, colorFactor);
        //outgoingLight = mix(outgoingLight, vec3(0.8), 0.3);
        //diffuseColor.a = 0.9;
        `,
        );

        // console.log(shader.fragmentShader);

        shader.fragmentShader = shader.fragmentShader.replace(
            'vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;',
            `vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
        `,
        );
    };

    return mat;
}

function computeMaterials(meshNodes) {
    const sharedMat = new MeshStandardMaterial({
        color: 0x4278f5,
        // transparent: true,
        // roughness: 1,
        // metalness: 1,n
        depthWrite: true,
        depthTest: true,
    });
    return meshNodes.map(node => {
        return computeMaterial(sharedMat, {
            meshPosition: { value: node.position },
            specularFactor: { value: 1 },
            colorFactor: { value: 0.2 },
        });
    });
}

export type MainBallProps = {
    ballRadius: number;
    rotation?: number[];
    delay?: number;
    float?: boolean;
};

const tempVec3 = new Vector3();

export default function MainBall(props: MainBallProps) {
    const gltf = useBallGLTF('/models/ball/sphere.glb');
    // const gltf = useBallGLTF('/models/ball/ball-transformed.glb')

    // const material = useRef(new MeshStandardMaterial({ color: 0x2f2f2f }))

    const [meshNodes, otherNodes] = useMeshNodes(gltf);
    const materials = useMemo(() => computeMaterials(meshNodes), [meshNodes]);
    const meshJsx = useJsx(meshNodes, otherNodes, materials);
    const animationProps = useMeshAnimationProps(meshNodes);

    const ballRef = useRef<Group>();
    const sceneRef = useRef<Group>();

    useFrame((state: RootState) => {
        if (sceneRef.current && animationProps !== null) {
            const scroll = getAltScrollWithDelay(props.delay || 0);
            // console.log(meshesMovementProps);
            const time = state.clock.getElapsedTime();
            sceneRef.current.children.forEach((mesh: Mesh) => {
                const aniProps = animationProps[mesh.name];
                if (!aniProps) {
                    return;
                }
                const targetPosition = tempVec3.lerpVectors(
                    aniProps.startPos,
                    aniProps.expandEndPos,
                    scroll,
                );
                mesh.position.lerp(targetPosition, 0.075);
                const targetRotation = aniProps.startQuaternion
                    .clone()
                    .slerp(
                        aniProps.expandEndRot,
                        scroll * aniProps.expandRotAmount,
                    );
                mesh.quaternion.slerp(targetRotation, 0.075);
                if (scroll < 1e-6 && props.float) {
                    const targetPosition = tempVec3.lerpVectors(
                        aniProps.startPos,
                        aniProps.floatEndPos,
                        (Math.sin(time + aniProps.random * 37) + 1) / 2,
                    );
                    mesh.position.lerp(targetPosition, 0.075);
                }
            });
        }
    });

    useEffect(() => {
        if (!ballRef.current) return;
        const rot = props.rotation || [0, 0, 0];
        ballRef.current.rotation.set(rot[0], rot[1], rot[2]);
    }, [props.rotation]);

    const handleBallRef = (ball: Group) => {
        ballRef.current = ball;
    };

    const centerOffset = useCenterOffset(gltf);

    return (
        <group
            ref={handleBallRef}
            name="Ball"
            scale={props.ballRadius}
            dispose={null}>
            <group ref={sceneRef} name="Scene" position={centerOffset}>
                {meshJsx as unknown[] as ReactNode[]}
            </group>
        </group>
    );
}
type MeshAnimationProps = {
    [key: string]: MeshAnimationPropValue;
};

type MeshAnimationPropValue = {
    startPos: Vector3;
    startQuaternion: Quaternion;
    floatEndPos: Vector3;
    expandEndPos: Vector3;
    expandEndRot: Quaternion;
    expandRotAmount: number;
    random: number;
};

const tempBox3 = new Box3();

function useMeshAnimationProps(meshes: Mesh[]): MeshAnimationProps {
    return useMemo(() => {
        const props = {};
        meshes.forEach(mesh => {
            // assumed ball center is 0,0,0
            const volume = getVolume(mesh);
            // console.log(volume);

            const dist2center = mesh.position.length();
            const floatEndPos = mesh.position.clone().add(
                mesh.position
                    .clone()
                    .normalize()
                    .multiplyScalar(
                        Math.random() * 0.05 * Math.exp((1 / (volume + 1)) * 2),
                    ),
            );
            const expandEndPos = mesh.position.clone().add(
                mesh.position
                    .clone()
                    .normalize()
                    .multiplyScalar(
                        (Math.random() + 0.5) *
                            5 *
                            Math.exp((1 / (volume + 1)) * 2),
                    ),
            );
            // const expandEndRot = new Quaternion().setFromEuler(new Euler(Math.PI * Math.random() * rotFactor, Math.PI * Math.random() * rotFactor, Math.PI * Math.random() * rotFactor));
            const expandEndRot = new Quaternion().random();
            const rotAmount = Math.random() * dist2center * 8;
            props[mesh.name] = {
                startPos: mesh.position.clone(),
                startQuaternion: mesh.quaternion,
                floatEndPos: floatEndPos,
                expandEndPos: expandEndPos,
                expandEndRot: expandEndRot,
                expandRotAmount: rotAmount,
                random: Math.random(),
            };
        });
        return props;
    }, [meshes]);
}

function getVolume(object3d: Object3D) {
    tempBox3.setFromObject(object3d);
    tempVec3.subVectors(tempBox3.max, tempBox3.min);
    return Math.abs(tempVec3.x) * Math.abs(tempVec3.y) * Math.abs(tempVec3.z);
}
