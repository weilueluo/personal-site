import { useFrame } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import {
    AnimationMixer,
    Group,
    LoopPingPong,
    Mesh,
    ShaderMaterial,
    Vector3
} from 'three';
import sphere_fs from '../shaders/sphere_fs.glsl';
import sphere_vs from '../shaders/sphere_vs.glsl';
import { useAltScroll } from '../utils/hooks';
import { useMaxAnimationDuration } from '../utils/utils';
import { meshNameToPosition } from './ballMeshData';
import { getMainBallRadius } from './global';

import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const rotateVector = new Vector3(1, 1, 1).normalize();

// gltf loader
const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderConfig({ type: 'js' });
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
dracoLoader.preload()

export default function Ball({ ...props }: JSX.IntrinsicElements['group']) {
    const [nodes, setNodes] = useState([]);
    const [animations, setAnimations] = useState([]);

    useEffect(() => {
        loader.setDRACOLoader(dracoLoader);
        loader.load(
            '/models/ball/ball-transformed.glb',
            function (gltf) {
                // console.log('loaded gltf');
                // console.log(gltf);
                
                setNodes(gltf.scene.children);
                setAnimations(gltf.animations);
            },
            undefined,
            function (error) {
                console.log('gltf load error');
                console.error(error);
            }
        );
    }, []);

    ///////////////////

    const ballRef = useRef();

    const radius = getMainBallRadius();

    const [meshes, setMeshes] = useState([]);
    const [meshMaterials, setMeshMaterials] = useState([]);

    useEffect(() => {
        const [meshes_, meshMaterials_] = computeMeshes(nodes);
        setMeshes(meshes_);
        setMeshMaterials(meshMaterials_);
    }, [nodes]);

    const maxAnimationDuration = useMaxAnimationDuration(animations);

    let mixer = useRef(null);
    useEffect(() => {
        mixer.current = new AnimationMixer(ballRef.current);
        for (const animation of animations) {
            const action = mixer.current.clipAction(animation);
            action.setLoop(LoopPingPong, Infinity);
            action.play();
        }
    }, [animations, maxAnimationDuration]);

    const altScroll = useAltScroll();

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        const scrolled = altScroll > 0.15;

        if (mixer.current) {
            mixer.current.setTime(maxAnimationDuration * altScroll);
        }
        // console.log(`scrolled: ${scrolled}`);

        meshMaterials.forEach((mat) => {
            mat.uniforms.uTime.value = time;
            mat.uniforms.uScrolledAmount.value = altScroll;
            mat.uniforms.uDoWave.value = !scrolled; // do not wave if scrolled
        });
    });

    useFrame((state) => {
        const scene = ballRef.current as Group;
        const scrolled = altScroll > 0.1;
        if (scene) {
            scene.rotateOnAxis(
                rotateVector,
                state.clock.getDelta() * (scrolled ? 0.0 : 1.5) // do not rotate if scrolled
            );
        }
    });

    return (
        <group ref={ballRef} scale={radius} dispose={null} {...props}>
            <group name='Scene'>
                <group
                    name='Ball_cell198_cell006'
                    position={[-0.27, -0.81, -0.02]}
                />
                <group
                    name='Ball_cell196_cell001'
                    position={[0.32, -0.75, -0.27]}
                />
                <group
                    name='Ball_cell186_cell005'
                    position={[-0.7, -0.34, 0.36]}
                />
                {meshes}
            </group>
        </group>
    );
}

function computeMeshes(nodes: any[]) {
    const uniforms = {
        uTime: { value: 0.5 },
        uPosition: { value: new Vector3(0, 0, 0) },
        uOffsetAmount: { value: 0.0 },
        uWaveAmount: { value: 0.0 },
        uWaveSpeed: { value: 0.0 },
        uScrolledAmount: { value: 0.0 },
        uDoWave: { value: true },
    };

    const sharedMaterial = new ShaderMaterial({
        uniforms: uniforms,
        vertexShader: sphere_vs,
        fragmentShader: sphere_fs,
        transparent: true,
        depthWrite: true,
    });

    const meshNodes = nodes.filter(
        (node) => node.type == 'Mesh'
    ) as unknown as Mesh[];

    const meshes = Array(meshNodes.length);
    const materials = Array(meshNodes.length);
    meshNodes.forEach((mesh, i) => {
        const geometry = mesh.geometry;
        const material = sharedMaterial.clone();
        const position = meshNameToPosition[mesh.name];

        if (Math.random() < 0.15) {
            material.wireframe = true;
            // material.depthWrite = false;
        }

        // const distToCenter = new Vector3(...position).clone().length();

        material.uniforms.uPosition.value = position;

        // if (distToCenter > 0.8 && Math.random() < 0.15) {
        //     material.uniforms.uWaveAmount.value = Math.random() * 0.1;
        //     material.uniforms.uOffsetAmount.value = Math.random() * 0.1;
        //     material.uniforms.uWaveSpeed.value = Math.random() * 0.2 + 1;
        // }

        materials[i] = material;
        geometry.computeVertexNormals();
        meshes[i] = (
            <mesh
                // ref={meshRefs[i]}
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

    return [meshes, materials];
}
