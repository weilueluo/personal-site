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
import sphere_fs from '../shaders/sphere_fs.glsl';
import sphere_vs from '../shaders/sphere_vs.glsl';
import { useAltScroll, use3MouseHover } from '../utils/hooks';
import { useMaxAnimationDuration } from '../utils/utils';
import { getMainBallRadius } from './global';

import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { lightPositionContext } from '../utils/context';

import Moon from '../scene/Moon';
import ThreeSurroundingText from '../Text/ThreeSurroundingText';


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
                // console.log('loaded gltf');
                // console.log(gltf);
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

function useMeshes(gltf) {
    const [meshes, setMeshes] = useState<Array<Mesh>>([]);
    const [meshMaterials, setMeshMaterials] = useState<Array<Material>>([]);
    const [otherNodes, setOtherNodes] = useState<Array<JSX.Element>>([]);
    const [animations, setAnimations] = useState<any>([]);
    const [centerOffset, setCenterOffset] = useState<Vector3>(new Vector3(0, 0, 0));

    const lightPosition = useContext(lightPositionContext)

    useEffect(() => {
        if (gltf) {
            const [meshes_, meshMaterials_, otherNodes_] = useComputeMeshes(
                gltf.scene.children,
                lightPosition
            );
            setMeshes(meshes_);
            setMeshMaterials(meshMaterials_);
            setOtherNodes(
                otherNodes_.map((node) => (
                    <group
                        key={node.name}
                        name={node.name}
                        position={node.position}
                    />
                ))
            );
            setAnimations(gltf.animations);

            // set the center offset vector
            // this ensure the ball is at the center
            const box = new Box3().setFromObject(gltf.scene);
            const center = box.getCenter(new Vector3());
            setCenterOffset(center.multiplyScalar(-1));
        }
    }, [gltf])

    return [meshes, meshMaterials, otherNodes, animations, centerOffset]
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
    }, [gltf, maxAnimationDuration]);

    useFrame(() => {
        // set animation state
        if (mixer.current) {
            mixer.current.setTime(maxAnimationDuration * altScroll);
        }
    })

    return 
}

export default function Ball({ ...props }: JSX.IntrinsicElements['group']) {
    

    const gltf = useGLTF('/models/ball/ball-transformed.glb')

    const [meshes, meshMaterials, otherNodes, animations, centerOffset] = useMeshes(gltf)

    const ballRef = useRef();
    useAnimationOnScroll(gltf, ballRef, animations)

    const altScroll = useAltScroll();

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        const scrolled = altScroll > 0.15;

        // set ball rotate state
        const scene = ballRef.current as Group;
        if (scene) {
            scene.rotation.z += (scrolled ? 0.0 : 0.002);
            scene.rotation.y += (scrolled ? 0.0 : 0.001);
            scene.rotation.x += (scrolled ? 0.0 : 0.003);
        }
        tempMat3.setFromMatrix4(tempMat4.makeRotationFromEuler(scene.rotation))
        
        meshMaterials.forEach((mat) => {
            mat.uniforms.uTime.value = time;
            mat.uniforms.uScrolledAmount.value = altScroll;
            mat.uniforms.uDoWave.value = !scrolled; // do not wave if scrolled
            mat.uniforms.uBallRotation.value = tempMat3;
        });
    });

    const radius = getMainBallRadius();
    const textRadius = getMainBallRadius() + 0.1;
    return (
        <>
        
            <group ref={ballRef} scale={radius} dispose={null} {...props}>
                <group name='Scene' position={centerOffset}>
                    {otherNodes}
                    {meshes}
                </group>
            </group>

            <ThreeSurroundingText
                text={'Weilue\' Place'}
                radius={textRadius}
                rotationZ={0}
                // initOffset={Math.PI}
                fadeInOnScrollSpeed={-1}
            />
        </>
    );
}

function useComputeMeshes(nodes: any[], lightPosition: Vector3) {
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
    };

    const sharedMaterial = new ShaderMaterial({
        uniforms: uniforms,
        vertexShader: sphere_vs,
        fragmentShader: sphere_fs,
        transparent: true,
        depthWrite: true,
    });

    const meshNodes: Mesh[] = [];
    const otherNodes: Object3D[] = [];

    nodes.forEach((node) => {
        if (node.type == 'Mesh') meshNodes.push(node);
        else otherNodes.push(node);
    });

    const meshes = Array(meshNodes.length);
    const materials = Array(meshNodes.length);
    meshNodes.forEach((mesh, i) => {
        const geometry = mesh.geometry;
        const material = sharedMaterial.clone();
        const position = mesh.position; //meshNameToPosition[mesh.name];

        if (Math.random() < 0.15) {
            material.wireframe = true;
            // material.depthWrite = false;
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

        materials[i] = material;
        geometry.computeVertexNormals();

        // const meshRef = useRef()

        // const hovered = use3MouseHover(meshRef)
        // useEffect(() => {
        //     if (hovered) {
        //         console.log(`mesh: ${mesh.uuid} hovered`);
                
        //     }
        // }, [hovered])

        meshes[i] = (
            <mesh
                // ref={meshRef}
                key={mesh.uuid}
                name={mesh.name}
                castShadow
                receiveShadow
                geometry={geometry}
                material={material}
                position={position}
            />
        );

        
    });

    // meshRefs.forEach((meshRef) => {
    //       useHelper(meshRef, VertexNormalsHelper)
    // })

    return [meshes, materials, otherNodes];
}
