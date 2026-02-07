import { type ReactElement, useMemo, useState } from 'react';
import { Box3, type Material, Mesh, Object3D, Vector3 } from 'three';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { GLTFLoader, type GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';

// gltf loader
const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderConfig({ type: 'js' });
dracoLoader.setDecoderPath(
    'https://www.gstatic.com/draco/versioned/decoders/1.5.3/',
);

export function useBallGLTF(modelPath: string) {
    const [gltf, setgltf] = useState<GLTF | null>(null);

    useMemo(() => {
        loader.setDRACOLoader(dracoLoader);
        loader.load(
            modelPath, // '/models/ball/sphere.glb'
            function (gltf) {
                setgltf(gltf);
            },
            undefined,
            function (error) {
                console.log('gltf load error');
                console.error(error);
            },
        );
    }, [modelPath]);

    return gltf;
}

export function useMeshNodes(gltf: GLTF | null): [Mesh[], Object3D[]] {
    const [meshes, setMeshes] = useState<Mesh[]>([]);
    const [others, setOthers] = useState<Object3D[]>([]);

    useMemo(() => {
        if (!gltf) {
            return;
        }
        const nodes = gltf.scene.children;
        const meshes_: Mesh[] = [];
        const others_: Object3D[] = [];
        nodes.forEach(node => {
            if ((node as Mesh).isMesh) {
                meshes_.push(node as Mesh);
            } else {
                others_.push(node);
            }
        });
        setMeshes(meshes_);
        setOthers(others_);
    }, [gltf]);

    return [meshes, others];
}

export function useJsx(
    meshNodes: Mesh[],
    otherNodes: Object3D[],
    materials?: Material[],
): ReactElement[] {
    const [jsx, setJsx] = useState<ReactElement[]>([]);

    useMemo(() => {
        if (!materials || !meshNodes || !otherNodes) {
            return;
        }
        const newJsx: ReactElement[] = [];

        meshNodes.forEach((meshNode, i) => {
            newJsx.push(
                <mesh
                    key={meshNode.uuid}
                    name={meshNode.name}
                    geometry={meshNode.geometry}
                    material={materials[i]}
                    position={meshNode.position}
                    castShadow
                    receiveShadow
                />,
            );
        });

        otherNodes.forEach(otherNode => {
            newJsx.push(
                <group
                    key={otherNode.name}
                    name={otherNode.name}
                    position={otherNode.position}
                />,
            );
        });

        setJsx(newJsx);
    }, [meshNodes, otherNodes, materials]);

    return jsx;
}
export function useCenterOffset(gltf: GLTF | null) {
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
