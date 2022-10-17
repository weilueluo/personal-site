import { extend, ReactThreeFiber, useFrame, useThree } from '@react-three/fiber';
import { RefObject, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
    AnimationMixer,
    Box3,
    BufferGeometry,
    DoubleSide,
    Group,
    Line,
    LineBasicMaterial,
    LoopPingPong, Matrix3,
    Matrix4,
    Mesh, ShaderMaterial,
    ShapeGeometry,
    Vector3
} from 'three';
import { use3DParentHover, useAltScroll } from '../../utils/hooks';
import { getMeshCenter, useMaxAnimationDuration } from '../../utils/utils';
import { getMainBallRadius } from './global';
import sphere_fs from './shaders/sphere_fs.glsl';
import sphere_vs from './shaders/sphere_vs.glsl';

import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { lightPositionContext } from '../../utils/context';

import ThreeSurroundingText from './ThreeSurroundingText';
import { LineAnimator } from '../../animation/LineAnimator';
import Text, { generateTextShape, useTextGeometry, useTextShape } from './Text';
import { TextAnimator } from '../../animation/TextAnimation';


const FLOAT_BALL = false;

const ballRotationMat = new Matrix3();
const tempMat4 = new Matrix4();

// gltf loader
const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderConfig({ type: 'js' });
dracoLoader.setDecoderPath(
    'https://www.gstatic.com/draco/versioned/decoders/1.5.3/'
);

function useGLTF(loadUrl) {
    const [gltf, setgltf] = useState(null);

    useMemo(() => {
        loader.setDRACOLoader(dracoLoader);
        loader.load(
            loadUrl,
            function (gltf) {
                setgltf(gltf);
            },
            undefined,
            function (error) {
                console.log('gltf load error');
                console.error(error);
            }
        );
    }, []);

    return gltf
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
        nodes.forEach((node) => {
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

    return animations
}

function useCenterOffset(gltf) {
    const [centerOffset, setCenterOffset] = useState<Vector3>(new Vector3(0, 0, 0));
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
        const new_others = otherNodes.map((node) => (
            <group
                key={node.name}
                name={node.name}
                position={node.position}
            />
        ));
        setOthers(new_others);
    }, [otherNodes]);

    return others;
}

extend({ Line_: Line })
declare global {
  namespace JSX {
    interface IntrinsicElements {
      line_: ReactThreeFiber.Object3DNode<Line, typeof Line>
    }
  }
}

const tempVec3 = new Vector3();

function MainBall(props) {
    const gltf = props.gltf;

    const lightPosition = useContext(lightPositionContext);

    const [meshNodes, otherNodes] = useMeshNodes(gltf);

    const materials = useMaterials(meshNodes, lightPosition);
    const animations = useAnimations(gltf);
    const centerOffset = useCenterOffset(gltf);

    const jsxMeshes = useJSXMeshes(meshNodes, materials);
    const jsxOthers = useJSXOthers(otherNodes);

    const altScroll = useAltScroll();

    const ballRef = useRef();

    const state = useThree();

    // update ball rotation
    let lastTime = 0;
    useFrame((state) => {
        const scrolled = altScroll > 0.15;

        let time: number;
        if (scrolled) {
            time = state.clock.getElapsedTime()
            lastTime = time;
        } else {
            // freeze time (i.e. freeze color changes) if scrolled
            // because color changes in darkness looks weird
            time = lastTime;
        }

        // set ball rotate state
        const scene = ballRef.current as Group;
        if (scene && !hovered) {
            scene.rotation.z += (scrolled ? 0.0 : 0.002);
            scene.rotation.y += (scrolled ? 0.0 : 0.001);
            scene.rotation.x += (scrolled ? 0.0 : 0.003);
        }
        ballRotationMat.setFromMatrix4(tempMat4.makeRotationFromEuler(scene.rotation))
        
        materials.forEach((mat) => {
            mat.uniforms.uTime.value = time;
            mat.uniforms.uScrolledAmount.value = altScroll;
            mat.uniforms.uDoWave.value = !scrolled; // do not wave if scrolled
            mat.uniforms.uBallRotation.value = ballRotationMat;
            mat.uniforms.uLightPosition.value = lightPosition;
        });
    });
    
    useAnimationOnScroll(gltf, ballRef, animations)
    const radius = getMainBallRadius();

    const [hovered, hoveredObject] = use3DParentHover(ballRef);
    
    const [lineAnimator, setLineAnimator] = useState<LineAnimator>(null);
    const [textAnimator, setTextAnimator] = useState<TextAnimator>(null);

    const [textConfig, setTextConfig] = useState<{text?: string, position?: Vector3}>({});
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
                position: to
            })

            return () => { material.uniforms.uHovered.value = false };
        } else {
            setTextConfig({})
        }
    }, [hovered, hoveredObject])


    // line mesh
    const lineRef = useRef<any>();
    const lineGeometry = new BufferGeometry();
    const lineMaterial = new LineBasicMaterial({
        color: 0xfffffff
    });
    useFrame(state => {
        const line = lineRef.current as Line;
        if (line && lineAnimator) {
            const points = lineAnimator.animateFrame(state);
            line.geometry.setFromPoints(points);
        }
    })

    // text mesh
    const textRef = useRef<any>(null)
    const [textGeometry, setTextGeometry] = useState(new ShapeGeometry([]));
    
    useEffect(() => {
        setTextAnimator(new TextAnimator(textConfig.text || '', 0.5, displayLeft, 0.3));
    }, [textConfig]);
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
        side: DoubleSide
    });
    useEffect(() => {
        const text = textRef.current;
        if (text) {
            text.lookAt(state.camera.position);
            if (displayLeft) {  // try not to display text into the ball
                text.geometry.computeBoundingBox();
                const width = text.geometry.boundingBox.max.x
                text.geometry.applyMatrix4(tempMat4.makeTranslation(-width, 0, 0));
            }
        }
    }, [textGeometry])
    

    return (
        <>
            <line_ ref={lineRef} geometry={lineGeometry} material={lineMaterial} />
            <mesh ref={textRef}  geometry={textGeometry} material={textMaterial} position={textConfig.position}/>
            <group ref={ballRef} scale={radius} dispose={null}>
            <group name='Scene' position={centerOffset}>
                {jsxOthers}
                {jsxMeshes}
            </group>
        </group>
        </>
        
    )
}

function useMaterials(meshNodes, lightPosition) {

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
        uHovered: { value: false }
    };

    const [materials, setMaterials] = useState([]);

    useMemo(() => {

        const sharedMaterial = new ShaderMaterial({
            uniforms: uniforms,
            vertexShader: sphere_vs,
            fragmentShader: sphere_fs
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
                    material.uniforms.uOffsetAmount.value = Math.random() * 0.05;
                    material.uniforms.uWaveSpeed.value = Math.random() * 0.2 + 1;
                }
            }

            new_materials[i] = material;
    
        });

        setMaterials(new_materials);
    }, [meshNodes])

    return materials;
}

function useAnimationOnScroll(gltf, ballRef, animations) {
    const maxAnimationDuration = useMaxAnimationDuration(animations);

    let mixer = useRef(null);
    const altScroll = useAltScroll();

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
            mixer.current.setTime(maxAnimationDuration * altScroll);
        }
    })

    return 
}

export default function Ball() {
    
    const gltf = useGLTF('/models/ball/ball-transformed.glb');

    const textRadius = getMainBallRadius() + 0.1;
    return (
        <>
            <MainBall gltf={gltf} />

            <ThreeSurroundingText
                text={'Weilue\'s Place'}
                radius={textRadius}
                rotationZ={0}
                // initOffset={Math.PI}
                fadeInOnScrollSpeed={-1}
            />
        </>
    );
}
