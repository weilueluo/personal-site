import { ReactThreeFiber, RootState, extend, useFrame, useThree } from '@react-three/fiber';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
    AnimationMixer,
    Box3,
    BufferGeometry,
    DoubleSide,
    Group,
    Line,
    LineBasicMaterial,
    LoopPingPong,
    Matrix3,
    Matrix4,
    Mesh,
    Object3D,
    Quaternion,
    ShaderMaterial,
    ShapeGeometry,
    Vector3,
} from 'three';
import { getMainBallRadius } from './global';
import sphere_fs from './shaders/sphere_fs.glsl';
import sphere_vs from './shaders/sphere_vs.glsl';

import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { lightPositionContext } from '../../common/contexts';

import { LineAnimator } from '../../animation/LineAnimator';
import { TextAnimator } from '../../animation/TextAnimation';
import { useMaxAnimationDuration } from '../../common/modelAnimation';
import { getAltScroll, getAltScrollWithDelay } from '../../common/scroll';
import { getMeshCenter, use3DParentHover } from '../../common/threejs';
import { generateTextShape } from './Text';
import ThreeSurroundingText from './ThreeSurroundingText';

const FLOAT_BALL = false;

const ballRotationMat = new Matrix3();
const tempMat4 = new Matrix4();

// gltf loader
const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderConfig({ type: 'js' });
dracoLoader.setDecoderPath(
    'https://www.gstatic.com/draco/versioned/decoders/1.5.3/',
);

function useBallGLTF() {
    const [gltf, setgltf] = useState(null);

    useMemo(() => {
        loader.setDRACOLoader(dracoLoader);
        loader.load(
            // '/models/ball/ball-transformed.glb',
            '/models/ball/sphere.glb',
            function (gltf) {
                setgltf(gltf);
            },
            undefined,
            function (error) {
                console.log('gltf load error');
                console.error(error);
            },
        );
    }, []);

    return gltf;
}

function useMeshNodes(gltf) {
    const [meshes, setMeshes] = useState([]);
    const [others, setOthers] = useState([]);

    useMemo(() => {
        if (!gltf) {
            return;
        }
        const nodes = gltf.scene.children;
        const meshes_ = [];
        const others_ = [];
        nodes.forEach(node => {
            if (node.type == 'Mesh') meshes_.push(node);
            else others_.push(node);
        });
        setMeshes(meshes_);
        setOthers(others_);
    }, [gltf]);

    return [meshes, others];
}

function useAnimations(gltf) {
    const [animations, setAnimations] = useState([]);

    useMemo(() => {
        if (!gltf) {
            return;
        }
        setAnimations(gltf.animations);
    }, [gltf]);

    return animations;
}

function useCenterOffset(gltf) {
    const [centerOffset, setCenterOffset] = useState<Vector3>(
        new Vector3(0, 0, 0),
    );
    useMemo(() => {
        if (!gltf) {
            return;
        }
        const box = new Box3().setFromObject(gltf.scene);
        const center = box.getCenter(new Vector3());
        setCenterOffset(center.multiplyScalar(-1));
    }, [gltf]);

    return centerOffset;
}

function useJSXMeshes(meshNodes, materials) {
    const [meshes, setMeshes] = useState<JSX.Element[]>([]);

    useMemo(() => {
        if (!materials) {
            return;
        }
        const new_meshes = meshNodes.map((meshNode, i) => {
            meshNode.geometry.computeVertexNormals();

            return (
                <mesh
                    key={meshNode.uuid}
                    name={meshNode.name}
                    geometry={meshNode.geometry}
                    material={materials[i]}
                    position={meshNode.position}
                />
            );
        });

        setMeshes(new_meshes);
    }, [meshNodes, materials]);

    return meshes;
}

function useJSXOthers(otherNodes) {
    const [others, setOthers] = useState<JSX.Element[]>([]);

    useMemo(() => {
        const new_others = otherNodes.map(node => (
            <group key={node.name} name={node.name} position={node.position} />
        ));
        setOthers(new_others);
    }, [otherNodes]);

    return others;
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
                        Math.random() * 0.03 * Math.exp((1 / (volume + 1)) * 2),
                    ),
            );
            const expandEndPos = mesh.position.clone().add(
                mesh.position
                    .clone()
                    .normalize()
                    .multiplyScalar(
                        (Math.random() + 0.5) *
                            Math.exp((1 / (volume + 1)) * 2),
                    ),
            );
            // const expandEndRot = new Quaternion().setFromEuler(new Euler(Math.PI * Math.random() * rotFactor, Math.PI * Math.random() * rotFactor, Math.PI * Math.random() * rotFactor));
            const expandEndRot = new Quaternion().random();
            const rotAmount = Math.random() * dist2center * 5;
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

const tempBox3 = new Box3();

function getVolume(object3d: Object3D) {
    tempBox3.setFromObject(object3d);
    tempVec3.subVectors(tempBox3.max, tempBox3.min);
    return Math.abs(tempVec3.x) * Math.abs(tempVec3.y) * Math.abs(tempVec3.z);
}

const tempVec3 = new Vector3();

// https://github.com/pmndrs/react-three-fiber/discussions/1387
extend({ Line_: Line })
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      line_: ReactThreeFiber.Object3DNode<Line, typeof Line>
    }
  }
}

function MainBall(props) {
    const gltf = props.gltf;

    const lightPosition = useContext(lightPositionContext);

    const [meshNodes, otherNodes] = useMeshNodes(gltf);

    const materials = useMaterials(meshNodes, lightPosition);
    const animations = useAnimations(gltf);
    const centerOffset = useCenterOffset(gltf);

    const jsxMeshes = useJSXMeshes(meshNodes, materials);
    const jsxOthers = useJSXOthers(otherNodes);

    const sceneRef = useRef<Group>();
    const ballRef = useRef();

    const state = useThree();

    // update ball rotation
    let lastTime = 0;
    useFrame(state => {
        const altScroll = getAltScroll();
        const scrolled = altScroll > 0.15;

        let time: number;
        if (scrolled) {
            time = state.clock.getElapsedTime();
            lastTime = time;
        } else {
            // freeze time (i.e. freeze color changes) if scrolled
            // because color changes in darkness looks weird
            time = lastTime;
        }

        // set ball rotate state
        const scene = ballRef.current as Group;
        if (scene && !hovered) {
            scene.rotation.z += scrolled ? 0.0 : 0.002;
            scene.rotation.y += scrolled ? 0.0 : 0.001;
            scene.rotation.x += scrolled ? 0.0 : 0.003;
        }
        ballRotationMat.setFromMatrix4(
            tempMat4.makeRotationFromEuler(scene.rotation),
        );

        materials.forEach(mat => {
            mat.uniforms.uTime.value = time;
            mat.uniforms.uScrolledAmount.value = altScroll;
            mat.uniforms.uDoWave.value = !scrolled; // do not wave if scrolled
            mat.uniforms.uBallRotation.value = ballRotationMat;
            mat.uniforms.uLightPosition.value = lightPosition;
        });
    });

    const animationProps = useMeshAnimationProps(meshNodes);

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

    useAnimationOnScroll(gltf, ballRef, animations);
    const radius = getMainBallRadius();

    const [hovered, hoveredObject] = use3DParentHover(ballRef);

    const [lineAnimator, setLineAnimator] = useState<LineAnimator>(null);
    const [textAnimator, setTextAnimator] = useState<TextAnimator>(null);

    const [textConfig, setTextConfig] = useState<{
        text?: string;
        position?: Vector3;
    }>({});
    const [displayLeft, setDisplayLeft] = useState(false);

    useEffect(() => {
        if (hovered && hoveredObject.isMesh) {
            const hoveredMesh = hoveredObject as Mesh;
            const material = hoveredMesh.material as ShaderMaterial;
            material.uniforms.uHovered.value = true;

            // line animation
            const meshCenter = getMeshCenter(hoveredMesh);
            const direction = meshCenter.clone().normalize();
            const to = meshCenter.clone().add(direction.multiplyScalar(3));
            setLineAnimator(new LineAnimator([meshCenter, to], 0.3));

            // text display side
            const pt2cam = state.camera.position.clone().sub(to).normalize();
            const camDir = state.camera.getWorldDirection(tempVec3);
            setDisplayLeft(camDir.cross(pt2cam).y < 0);

            // text
            setTextConfig({
                text: `Fragment ${hoveredMesh.id}`,
                position: to,
            });

            return () => {
                material.uniforms.uHovered.value = false;
            };
        } else {
            setTextConfig({});
            setLineAnimator(null);
        }
    }, [hovered, hoveredObject, state.camera]);

    // line mesh
    const lineRef = useRef<any>();
    const lineGeometry = new BufferGeometry();
    const lineMaterial = new LineBasicMaterial({
        color: 0xfffffff,
    });
    useFrame(state => {
        const line = lineRef.current as Line;
        if (line && lineAnimator) {
            const points = lineAnimator.animateFrame(state);
            line.geometry.setFromPoints(points);
        } else if (line) {
            line.geometry.setFromPoints([]);
        }
    });

    // text mesh
    const textRef = useRef<Mesh>(null);
    const [textGeometry, setTextGeometry] = useState(new ShapeGeometry([]));

    useEffect(() => {
        setTextAnimator(
            new TextAnimator(textConfig.text || '', 0.5, displayLeft, 0.3),
        );
    }, [textConfig, displayLeft]);
    useFrame(state => {
        if (textAnimator) {
            if (textAnimator.finished) {
                return;
            }
            const text = textAnimator.animateFrame(state);
            const shape = generateTextShape(text, 0.3);
            setTextGeometry(new ShapeGeometry(shape));
        }
    });
    const textMaterial = new LineBasicMaterial({
        color: 0xffffff,
        side: DoubleSide,
    });
    useEffect(() => {
        const text = textRef.current;
        if (text) {
            text.lookAt(state.camera.position);
            if (displayLeft) {
                // try not to display text into the ball
                text.geometry.computeBoundingBox();
                const width = text.geometry.boundingBox.max.x;
                text.geometry.applyMatrix4(
                    tempMat4.makeTranslation(-width, 0, 0),
                );
            }
        }
    }, [textGeometry, displayLeft, state.camera.position]);

    return (
        <>
            <line_
                ref={lineRef}
                geometry={lineGeometry}
                material={lineMaterial}
            />
            <mesh
                ref={textRef}
                geometry={textGeometry}
                material={textMaterial}
                position={textConfig.position}
            />
            <group ref={ballRef} scale={radius} dispose={null}>
                <group
                    ref={sceneRef}
                    name="Scene"
                    position={centerOffset}
                    scale={[0.75, 0.75, 0.75]}>
                    {jsxOthers}
                    {jsxMeshes}
                </group>
            </group>
        </>
    );
}

function useMaterials(meshNodes, lightPosition) {
    const [materials, setMaterials] = useState([]);

    useMemo(() => {
        const uniforms = {
            uTime: { value: 0.5 },
            uPosition: { value: new Vector3(0, 0, 0) },
            uOffsetAmount: { value: 0.0 },
            uWaveAmount: { value: 0.0 },
            uWaveSpeed: { value: 0.0 },
            uScrolledAmount: { value: 0.0 },
            uDoWave: { value: true },
            uLightPosition: { value: lightPosition },
            uBallRotation: { value: ballRotationMat },
            uHovered: { value: false },
        };

        const sharedMaterial = new ShaderMaterial({
            uniforms: uniforms,
            vertexShader: sphere_vs,
            fragmentShader: sphere_fs,
        });

        const new_materials = Array(meshNodes.length);
        meshNodes.forEach((mesh, i) => {
            const material = sharedMaterial.clone();
            const position = mesh.position;

            if (Math.random() < 0.15) {
                material.wireframe = true;
            }

            material.uniforms.uPosition.value = position;

            if (FLOAT_BALL) {
                const distToCenter = position.clone().length();
                if (distToCenter > 0.8 && Math.random() < 0.15) {
                    material.uniforms.uWaveAmount.value = Math.random() * 0.05;
                    material.uniforms.uOffsetAmount.value =
                        Math.random() * 0.05;
                    material.uniforms.uWaveSpeed.value =
                        Math.random() * 0.2 + 1;
                }
            }

            new_materials[i] = material;
        });

        setMaterials(new_materials);
    }, [meshNodes, lightPosition]);

    return materials;
}

function useAnimationOnScroll(gltf, ballRef, animations) {
    const maxAnimationDuration = useMaxAnimationDuration(animations);

    const mixer = useRef<AnimationMixer>(null);

    useEffect(() => {
        mixer.current = new AnimationMixer(ballRef.current);
        for (const animation of animations) {
            const action = mixer.current.clipAction(animation);
            action.setLoop(LoopPingPong, Infinity);
            action.play();
        }
    }, [gltf, maxAnimationDuration, animations, ballRef]);

    useFrame(() => {
        // set animation state
        if (mixer.current) {
            const altScroll = getAltScroll();
            mixer.current.setTime(maxAnimationDuration * altScroll);
        }
    });

    return;
}

export default function Ball() {
    const gltf = useBallGLTF();

    const textRadius = getMainBallRadius() + 0.1;
    return (
        <>
            <MainBall gltf={gltf} />

            <ThreeSurroundingText
                text={"Weilue's Place"}
                radius={textRadius}
                rotationZ={0}
                // initOffset={Math.PI}
                fadeInOnScrollSpeed={-1}
            />
        </>
    );
}
