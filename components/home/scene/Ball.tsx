import { useFrame } from '@react-three/fiber';
import { useContext, useEffect, useRef, useState } from 'react';
import {
    AnimationMixer,
    Box3,
    Group,
    LoopPingPong,
    Material,
    Matrix3,
    Matrix4,
    Mesh,
    Object3D,
    ShaderMaterial,
    Vector3
} from 'three';
import { use3DHover, useAltScroll, useCurrent3DHover } from '../../utils/hooks';
import { useMaxAnimationDuration } from '../../utils/utils';
import { getMainBallRadius } from './global';
import sphere_fs from './shaders/sphere_fs.glsl';
import sphere_vs from './shaders/sphere_vs.glsl';

import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { lightPositionContext } from '../../utils/context';

import ThreeSurroundingText from './ThreeSurroundingText';


const FLOAT_BALL = false;

const rotateVector = new Vector3(1, 1, 1).normalize();
const tempMat3 = new Matrix3();
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

    useEffect(() => {
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
    }, [loadUrl]);

    return gltf
}

function useMeshNodes(gltf) {
    const [meshes, setMeshes] = useState([]);
    const [others, setOthers] = useState([]);

    useEffect(() => {
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

    useEffect(() => {
        if (!gltf) {
            return;
        }
        setAnimations(gltf.animations);
    }, [gltf]);

    return animations
}

function useCenterOffset(gltf) {
    const [centerOffset, setCenterOffset] = useState<Vector3>(new Vector3(0, 0, 0));
    useEffect(() => {
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
    
    useEffect(() => {
        const new_meshes = meshNodes.map((meshNode, i) => {
            const geometry = meshNode.geometry;
            geometry.computeVertexNormals();

            return (
                <mesh
                    // ref={meshRef}
                    key={meshNode.uuid}
                    name={meshNode.name}
                    castShadow
                    receiveShadow
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
    
    useEffect(() => {
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

    // update
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
        if (scene) {
            scene.rotation.z += (scrolled ? 0.0 : 0.002);
            scene.rotation.y += (scrolled ? 0.0 : 0.001);
            scene.rotation.x += (scrolled ? 0.0 : 0.003);
        }
        tempMat3.setFromMatrix4(tempMat4.makeRotationFromEuler(scene.rotation))
        
        materials.forEach((mat) => {
            mat.uniforms.uTime.value = time;
            mat.uniforms.uScrolledAmount.value = altScroll;
            mat.uniforms.uDoWave.value = !scrolled; // do not wave if scrolled
            mat.uniforms.uBallRotation.value = tempMat3;
            mat.uniforms.uLightPosition.value = lightPosition;
        });
    });
    
    useAnimationOnScroll(gltf, ballRef, animations)
    const radius = getMainBallRadius();

    const [hovered, hoveredObject] = use3DHover(ballRef);
    // const currentHovered = useCurrent3DHover();
    // const [meshIDs, setMeshIDs] = useState(new Set());
    // const [meshID2ObjectMap, setMeshID2ObjectMap] = useState(new Map());
    // useEffect(() => {
    //     const newMeshIDs = new Set<Number>();
    //     const newMeshID2ObjectMap = new Map<Number, Object3D>();

    //     meshNodes.forEach(node => {
    //         newMeshIDs.add(node.id);
    //         newMeshID2ObjectMap[node.id] = node;
    //     })

    //     setMeshIDs(newMeshIDs);
    //     setMeshID2ObjectMap(newMeshID2ObjectMap);
    // }, [meshNodes])
    useEffect(() => {
        // console.log(`ball hovered: ${ballHovered}`);
        // console.log(hoveredObject);
        // console.log(currentHovered);
        if (hovered && hoveredObject.isMesh) {
            const hoveredMesh = hoveredObject as Mesh;
            const material = hoveredMesh.material as ShaderMaterial;
            material.uniforms.uHovered.value = true;
            return () => { material.uniforms.uHovered.value = false };
        }
        
        // if (currentHovered && currentHovered.isMesh) {
            // console.log(currentHovered);
            // console.log(`mesh hovered`);
            
            // if (meshIDs.has(currentHovered.id)) {
            //     //  hovered mesh is ball's mesh
            //     console.log(`ball mesh hovered`);
            //     const hoveredMesh = meshID2ObjectMap[currentHovered.id] as Mesh;
            //     const material = hoveredMesh.material as ShaderMaterial;
            //     material.uniforms.uHovered.value = true;
            //     return () => { material.uniforms.uHovered.value = false };
            // }
        // }
        
    })

    return (
        <group ref={ballRef} scale={radius} dispose={null}>
            <group name='Scene' position={centerOffset}>
                {jsxOthers}
                {jsxMeshes}
            </group>
        </group>
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
        uBallRotation: { value: tempMat3 },
        uHovered: { value: false }
    };

    const sharedMaterial = new ShaderMaterial({
        uniforms: uniforms,
        vertexShader: sphere_vs,
        fragmentShader: sphere_fs,
    });

    const [materials, setMaterials] = useState([]);

    useEffect(() => {
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
    
            // const meshRef = useRef()
    
            // const hovered = use3MouseHover(meshRef)
            // useEffect(() => {
            //     if (hovered) {
            //         console.log(`mesh: ${mesh.uuid} hovered`);
            //     }
            // }, [hovered])
    
            // meshes[i] = (
            //     <mesh
            //         // ref={meshRef}
            //         key={mesh.uuid}
            //         name={mesh.name}
            //         castShadow
            //         receiveShadow
            //         geometry={geometry}
            //         material={material}
            //         position={position}
            //     />
            // );
    
            
        });

        setMaterials(new_materials);
    }, [meshNodes, sharedMaterial])

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
