import { ThreeElements } from "@react-three/fiber";
import { useState, useMemo } from "react";
import { Box3, Group, Mesh, Vector3 } from "three";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";


// gltf loader
const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderConfig({ type: 'js' });
dracoLoader.setDecoderPath(
  'https://www.gstatic.com/draco/versioned/decoders/1.5.3/'
);

export function useBallGLTF(modelPath: string) {
  const [gltf, setgltf] = useState(null);

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
      }
    );
  }, [modelPath]);

  return gltf
}

export function useMeshNodes(gltf) {
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

export function useJsx(meshNodes, otherNodes, materials): ThreeElements[] {
  const [jsx, setJsx] = useState<ThreeElements[]>([]);

  useMemo(() => {
    if (!materials || !meshNodes || !otherNodes) {
      return;
    }
    const newJsx = []

    meshNodes.forEach((meshNode, i) => {
      newJsx.push(
        <mesh
          key={meshNode.uuid}
          name={meshNode.name}
          geometry={meshNode.geometry}
          material={materials[i]}
          position={meshNode.position}
        />
      );
    });

    otherNodes.forEach(otherNode => {
      newJsx.push(
        <group
          key={otherNode.name}
          name={otherNode.name}
          position={otherNode.position}
        />
      )
    });

    setJsx(newJsx);

  }, [meshNodes, otherNodes, materials]);

  return jsx;
}
export function useCenterOffset(gltf) {
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