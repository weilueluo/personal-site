import { RootState, useFrame } from '@react-three/fiber';
import { ReactNode, useContext, useEffect, useMemo, useRef } from 'react';
import {
    Box3,
    Group,
    Matrix3,
    Matrix4,
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
import { getAltScroll, getAltScrollWithDelay } from '../../../common/scroll';
import { lightPositionContext } from '../../../common/contexts';

const ballRotMat3 = new Matrix3();
const tempMat4 = new Matrix4()

function computeMaterial(
    sharedMat: MeshStandardMaterial,
    uniforms: { [key: string]: { value: unknown } },
) {
    const mat = sharedMat.clone();
    // if (Math.random() < 0.15) {
    //     mat.wireframe = true;
    // }

    mat.onBeforeCompile = shader => {
        shader.uniforms = UniformsUtils.merge([shader.uniforms, uniforms]);

        // shader.vertexShader = shader.vertexShader.replace('void main() {',
        //     `
        //     varying vec3 vvNormal;

        //     void main() {
        //         vvNormal = normal;
        //     `
        // )

        shader.fragmentShader = shader.fragmentShader.replace(
            'void main() {',
            `uniform vec3 meshPosition;
        uniform float specularFactor;
        uniform float colorFactor;
        uniform float scrollAmount;
        uniform vec3 lightPosition;
        uniform mat3 ballRotation;

        vec3 applyShadow(vec3 color, vec3 lightPos) {
            float angle = dot(normalize(lightPos), normalize(-vNormal)); // -normal so that light drop darkness instead of light
            return color * angle;
        }
        void main() {`,
        );

        shader.fragmentShader = shader.fragmentShader.replace(
            'vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;',
            `vec3 outgoingLight = totalDiffuse + totalSpecular * specularFactor + totalEmissiveRadiance;
        outgoingLight = mix(outgoingLight, meshPosition, colorFactor);
        //outgoingLight = meshPosition;// * colorFactor;
        // outgoingLight = applyShadow(outgoingLight, lightPosition);
        //outgoingLight = lightPosition * 0.005;
        diffuseColor.a = 1.0 - max(scrollAmount * 2.0 - 0.5, 0.0);
        
        // vec3 color = applyShadow(meshPosition, lightPosition);
        // float opacity = 1.0 - max(scrollAmount * 2.0 - 0.5, 0.0);
        // gl_FragColor = vec4(color, opacity);
        `,
        );

        // shader.fragmentShader = shader.fragmentShader.replace(
        //     '#include <output_fragment>',
        //     ``,
        // );

        mat.userData.shader = shader;
        // console.log(shader.fragmentShader);
    };

    return mat;
}

function computeMaterials(meshNodes, lightPosition: Vector3) {
    const sharedMat = new MeshStandardMaterial({
        color: 0x4278f5,
        // transparent: true,
        // roughness: 1,
        // metalness: 1,n
        depthWrite: true,
        depthTest: true,
        transparent: true
    });
    return meshNodes.map(node => {
        return computeMaterial(sharedMat, {
            meshPosition: { value: node.position },
            specularFactor: { value: 1 },
            colorFactor: { value: 0.1 },
            scrollAmount: { value: 0.0 },
            lightPosition: { value: lightPosition },
            ballRotation: { value: ballRotMat3 },
        });
    });
}

export type MainBallProps = {
    ballRadius: number;
    rotation?: number[];
    delay?: number;
    float?: boolean;
    rotate?: boolean;
    rotateSpeed?: number;
};

const tempVec3 = new Vector3();

export default function MainBall(props: MainBallProps) {
    const gltf = useBallGLTF('/models/ball/sphere.glb');
    // const gltf = useBallGLTF('/models/ball/ball-transformed.glb')

    // const material = useRef(new MeshStandardMaterial({ color: 0x2f2f2f }))

    const lightPosition = useContext(lightPositionContext)
    const [meshNodes, otherNodes] = useMeshNodes(gltf);
    const materials = useMemo(() => computeMaterials(meshNodes, lightPosition), [meshNodes, lightPosition]);
    const meshJsx = useJsx(meshNodes, otherNodes, materials);
    const animationProps = useMeshAnimationProps(meshNodes);

    const ballRef = useRef<Group>();
    const sceneRef = useRef<Group>();

    // scroll animations
    useFrame((state: RootState) => {
        if (sceneRef.current && animationProps !== null) {
            const scroll = getAltScrollWithDelay(props.delay || 0);
            const time = state.clock.getElapsedTime();
            
            if (ballRef.current) {
                ballRotMat3.setFromMatrix4(tempMat4.makeRotationFromEuler(ballRef.current.rotation))
            }

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

                if (
                    !Array.isArray(mesh.material) &&
                    mesh.material.userData.shader
                ) {
                    const shader = mesh.material.userData.shader;
                    shader.uniforms.scrollAmount.value = scroll;

                    shader.uniforms.ballRotation.value = ballRotMat3;
                    shader.uniforms.lightPosition.value.set(lightPosition.x, lightPosition.y, lightPosition.z);

                    
                }
            });
        }
    });

    // set rotation
    useEffect(() => {
        if (!ballRef.current) return;
        const rot = props.rotation || [0, 0, 0];
        ballRef.current.rotation.set(rot[0], rot[1], rot[2]);
    }, [props.rotation]);

    const handleBallRef = (ball: Group) => {
        ballRef.current = ball;
    };

    const rotateSpeed = props.rotateSpeed || 1

    // self rotation
    useFrame(() => {
        if (props.rotate && ballRef.current && getAltScroll() < 0.15) {
            const ball = ballRef.current;
            ball.rotation.x += 0.0005 * rotateSpeed;
            ball.rotation.y += 0.00025 * rotateSpeed;
            ball.rotation.z += 0.0001 * rotateSpeed;
        }
    })

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
