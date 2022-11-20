import { Box3, BufferGeometry, DoubleSide, Line, LineBasicMaterial, MeshPhongMaterial, MeshStandardMaterial, RepeatWrapping, Shader, ShaderMaterial, TextureLoader, UniformsLib, UniformsUtils, Vector2, Vector3 } from "three";

import { extend, ReactThreeFiber, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from "react";
import { LineAnimator } from "../animation/LineAnimator";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { getMainBallRadius } from "../home/scene/global";
import vertexShader from "./playground_ball.vs.glsl";
import fragmentShader from "./playground_ball.fs.glsl";

// https://github.com/pmndrs/react-three-fiber/discussions/1387
extend({ Line_: Line })
declare global {
  namespace JSX {
    interface IntrinsicElements {
      line_: ReactThreeFiber.Object3DNode<Line, typeof Line>
    }
  }
}

// gltf loader
const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
const textureLoader = new TextureLoader()
dracoLoader.setDecoderConfig({ type: 'js' });
dracoLoader.setDecoderPath(
    'https://www.gstatic.com/draco/versioned/decoders/1.5.3/'
);

function useBallGLTF() {
  const [gltf, setgltf] = useState(null);

  useMemo(() => {
      loader.setDRACOLoader(dracoLoader);
      loader.load(
          '/models/ball/ball-no-animation.glb',
          // '/models/ball/sphere.glb',
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

function useJSXMeshes(meshNodes, material) {
  const [meshes, setMeshes] = useState<JSX.Element[]>([]);

  useMemo(() => {
      if (!material) {
          return;
      }
      const new_meshes = meshNodes.map((meshNode, i) => {
          meshNode.geometry.computeVertexNormals();

          return (
              <mesh
                  key={meshNode.uuid}
                  name={meshNode.name}
                  geometry={meshNode.geometry}
                  material={material}
                  position={meshNode.position}
              />
          );
      });

      setMeshes(new_meshes);

  }, [meshNodes, material]);

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


export default function ExperimentalContent() {

  // destinations.push(new Vector3(10, 0, 0));
  // destinations.push(new Vector3(- 10, 0, 0));

  const geometry = new BufferGeometry();
  const lineMaterial = new LineBasicMaterial({
    color: 0xfffffff
  });

  const gltf = useBallGLTF();
  
  useEffect(() => {
    console.log(gltf);
  }, [gltf])

  const [meshNodes, otherNodes] = useMeshNodes(gltf);

  // const albedoMap = useMemo(() => textureLoader.load('/models/ball/albedo.jpg'), [])
  const normalMap = useMemo(() => textureLoader.load('/models/ball/normal2.jpg'), []);
  normalMap.wrapS = RepeatWrapping;
  normalMap.wrapT = RepeatWrapping;
  normalMap.repeat.set( 4, 4 );
  // const roughnessMap = useMemo(() => textureLoader.load('/models/ball/roughness.jpg'), [])
  const aoMap = useMemo(() => textureLoader.load('/models/ball/ao.jpg'), [])
  // const heightMap = useMemo(() => textureLoader.load('/models/ball/height.jpg'), [])


  const material = useMemo(() => {
    const myUniforms = {
      normalMap: {
        type: 't',
        value: normalMap
      },
      uBallCenter: { value: [0,0,0] }
    }
    const uniforms = UniformsUtils.merge([UniformsLib.lights, myUniforms]);
    console.log(uniforms);
    
    return new ShaderMaterial({
      side: DoubleSide,
      lights: true,
      uniforms: uniforms,
      fragmentShader: fragmentShader,
      vertexShader: vertexShader
    })

    // const material = new MeshStandardMaterial({
    //   color: 0x1f1f1f,
    //   normalMap: normalMap
    // })

    // return material
  }, [normalMap])

  material.onBeforeCompile = (shader, renderer) => {
    console.log(shader.fragmentShader);
  }

  const jsxMeshes = useJSXMeshes(meshNodes, material);
  const jsxOthers = useJSXOthers(otherNodes);

  const ballRef = useRef();
  const radius = getMainBallRadius();

  const start = new Vector3(- 10, 0, 0);
  const end = start.clone().add(new Vector3(1, 0, 0).multiplyScalar(10));
  const lineRef = useRef<any>();
  const points = [
    start, end
    // new Vector3(- 10, 0, 0), 
    // new Vector3(0, 10, 0), 
    // new Vector3(10, 0, 0), 
    // new Vector3(- 10, 0, 0)
  ];
  const lineAnimator = new LineAnimator(points, 1);
  useFrame(state => {
    if (lineRef.current) {
      const points = lineAnimator.animateFrame(state);
      lineRef.current.geometry.setFromPoints(points);
    }
  })

  return (
    <>
      {/* <line_ ref={lineRef} geometry={geometry} material={lineMaterial} /> */}
      {/* <Text text={'Hello Text'} /> */}

      {/* <mesh material={material}>
        <sphereGeometry args={[8, 32, 16]} />
      </mesh> */}

      <group ref={ballRef} scale={radius} dispose={null}>
          <group name='Scene'>
              {jsxOthers}
              {jsxMeshes}
          </group>
      </group>
    </>
  )
}