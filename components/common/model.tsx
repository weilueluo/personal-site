import { ThreeElements } from "@react-three/fiber";
import { useState, useMemo } from "react";
import { Group, Mesh } from "three";
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

export function useJsx(meshNodes, otherNodes, material): ThreeElements[] {
  const [jsx, setJsx] = useState<ThreeElements[]>([]);

  useMemo(() => {
    if (!material || !meshNodes || !otherNodes) {
      return;
    }
    const newJsx = []

    meshNodes.forEach(meshNode => {
      newJsx.push(
        <mesh
          key={meshNode.uuid}
          name={meshNode.name}
          geometry={meshNode.geometry}
          material={material}
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

  }, [meshNodes, otherNodes, material]);

  return jsx;
}