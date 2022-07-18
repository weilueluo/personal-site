import { useFrame } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import {
    AnimationMixer,
    Box3,
    Group,
    LoopPingPong,
    Mesh,
    Object3D,
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
const centerOffsetVector = new Vector3(0, 0, 0)

// gltf loader
const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderConfig({ type: 'js' });
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.3/');
dracoLoader.preload()

export default function Ball({ ...props }: JSX.IntrinsicElements['group']) {
    const [gltf, setgltf] = useState(null);

    useEffect(() => {
        loader.setDRACOLoader(dracoLoader);
        loader.load(
            '/models/ball/ball-transformed.glb',
            function (gltf) {
                // console.log('loaded gltf');
                // console.log(gltf);
                setgltf(gltf)
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
    const [otherNodes, setOtherNodes] = useState([]);
    const [animations, setAnimations] = useState([])
    const [centerOffset, setCenterOffset] = useState(new Vector3(0,0,0))

    useEffect(() => {
        if( gltf) {
            const [meshes_, meshMaterials_, otherNodes_] = computeMeshes(gltf.scene.children);
            setMeshes(meshes_);
            setMeshMaterials(meshMaterials_);
            setOtherNodes(otherNodes_.map(node => <group key={node.name} name={node.name} position={node.position}/>))
            setAnimations(gltf.animations)
            
            // set the center offset vector
            // this ensure the ball is at the center
            const box = new Box3().setFromObject( gltf.scene );
            const center = box.getCenter( new Vector3() );
            setCenterOffset(center.multiplyScalar(-1))
        }
    }, [gltf]);

    const maxAnimationDuration = useMaxAnimationDuration(animations);

    let mixer = useRef(null);
    useEffect(() => {
        mixer.current = new AnimationMixer(ballRef.current);
        for (const animation of animations) {
            const action = mixer.current.clipAction(animation);
            action.setLoop(LoopPingPong, Infinity);
            action.play();
        }
    }, [gltf, maxAnimationDuration]);

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
            <group name='Scene' position={centerOffset}>
                {otherNodes}
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

    const meshNodes: Mesh[] = []
    const otherNodes: Object3D[] = []
    
    nodes.forEach(node => {
        if (node.type == 'Mesh') meshNodes.push(node)
        else otherNodes.push(node)
    })
        
        
    const meshes = Array(meshNodes.length);
    const materials = Array(meshNodes.length);
    meshNodes.forEach((mesh, i) => {
        const geometry = mesh.geometry;
        const material = sharedMaterial.clone();
        const position = mesh.position //meshNameToPosition[mesh.name];

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

    return [meshes, materials, otherNodes];
}
