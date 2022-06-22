import { useGLTF } from '@react-three/drei';
import { useEffect, useMemo, useRef } from 'react';
import {
    AnimationMixer,
    Group,
    LoopPingPong,
    ShaderMaterial,
    Vector3,
} from 'three';
import type { GLTFResult, Nodes } from '../types/ball';
import { meshNameToPosition } from './ballMeshData';
import sphere_fs from '../shaders/sphere_fs.glsl';
import sphere_vs from '../shaders/sphere_vs.glsl';
import { useAltScroll } from '../utils/hooks';
import { useMaxAnimationDuration } from '../utils/utils';
import { useFrame } from '@react-three/fiber';
import { getMainBallRadius } from './global';

export default function Ball({ ...props }: JSX.IntrinsicElements['group']) {
    const ballRef = useRef();
    const { nodes, animations } = useGLTF(
        '/models/ball/ball-transformed.glb'
    ) as GLTFResult;

    const radius = getMainBallRadius();

    const [meshes, meshMaterials] = useMeshes(nodes);

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
            mat.uniforms.uDoWave.value = !scrolled  // do not wave if scrolled
        });
    });

    useFrame((state) => {
        const scene = ballRef.current as Group;
        const scrolled = altScroll > 0.1;
        if (scene) {
            scene.rotateOnAxis(
                new Vector3(1, 1, 1).normalize(),
                state.clock.getDelta() * (scrolled ? 0.0 : 1.5)  // do not rotate if scrolled
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

function useMeshes(nodes: Nodes) {
    const [meshes, materials] = useMemo(() => {
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

        const meshNodes = Object.entries(nodes).filter(
            (entry) => entry[1].type == 'Mesh'
        );

        const meshes = Array(meshNodes.length);
        const materials = Array(meshNodes.length);
        meshNodes.forEach((entry, i) => {
            const geometry = nodes[entry[0]].geometry;
            const material = sharedMaterial.clone();
            const position = meshNameToPosition[entry[0]];

            if (Math.random() < 0.15) {
                material.wireframe = true;
                // material.depthWrite = false;
            }

            const distToCenter = new Vector3(...position).clone().length();

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
                    key={entry[0]}
                    name={entry[0]}
                    castShadow
                    receiveShadow
                    geometry={geometry}
                    material={material}
                    position={position}
                />
            );
        });

        return [meshes, materials];
    }, []);

    // meshRefs.forEach((meshRef) => {
    //       useHelper(meshRef, VertexNormalsHelper)
    // })

    return [meshes, materials];
}

useGLTF.preload('/models/ball/ball-transformed.glb');
