import { Quaternion, BufferGeometry, DoubleSide, Line, LineBasicMaterial, Mesh, MeshStandardMaterial, RepeatWrapping, ShaderChunk, ShaderMaterial, TextureLoader, UniformsLib, UniformsUtils, Vector3, Euler } from "three";

import { extend, ReactThreeFiber, useFrame } from '@react-three/fiber';
import { RootState } from "@react-three/fiber/dist/declarations/src/core/store";
import { useMemo, useRef, useState } from "react";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { LineAnimator } from "../animation/LineAnimator";
import { useAltScroll } from "../common/threejs";
import { getMainBallRadius } from "../home/scene/global";
import fragmentShader from "./playground_ball.fs.glsl";
import vertexShader from "./playground_ball.vs.glsl";

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

function useJSXMeshes(meshNodes, material): Mesh[] {
  const [meshes, setMeshes] = useState<Mesh[]>([]);

  useMemo(() => {
    if (!material) {
      return;
    }
    const new_meshes = meshNodes.map((meshNode, i) => {
      // meshNode.geometry.computeVertexNormals();

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

  // useEffect(() => {
  //   console.log(gltf);
  // }, [gltf])

  const [meshNodes, otherNodes] = useMeshNodes(gltf);

  // const albedoMap = useMemo(() => textureLoader.load('/models/ball/albedo.jpg'), [])
  const normalMap = useMemo(() => textureLoader.load('/models/ball/normal2.jpg'), []);
  normalMap.wrapS = RepeatWrapping;
  normalMap.wrapT = RepeatWrapping;
  normalMap.repeat.set(4, 4);
  // const roughnessMap = useMemo(() => textureLoader.load('/models/ball/roughness.jpg'), [])
  // const aoMap = useMemo(() => textureLoader.load('/models/ball/ao.jpg'), [])
  // const heightMap = useMemo(() => textureLoader.load('/models/ball/height.jpg'), [])


  const material = useMemo(() => {
    const myUniforms = {
      normalMap: {
        type: 't',
        value: normalMap
      },
      uBallCenter: { value: [0, 0, 0] }
    }
    const uniforms = UniformsUtils.merge([UniformsLib.lights, UniformsLib.common, UniformsLib.metalnessmap, UniformsLib.roughnessmap, myUniforms]);
    // console.log(uniforms);

    return new MeshStandardMaterial({
      color: 0x2f2f2f

    })

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
    // console.log('shaderchunk');

    // replace comment with shader chunk actual code
    Object.entries(ShaderChunk).forEach(chunk => {
      const searchString = `//${chunk[0]}`;
      if (shader.fragmentShader.indexOf(searchString) >= 0) {
        console.log(`replacing fragment: ${searchString}`);
        shader.fragmentShader = shader.fragmentShader.replace(searchString, chunk[1]);
      }

      if (shader.vertexShader.indexOf(searchString) >= 0) {
        console.log(`replacing vertex: ${searchString}`);
        shader.vertexShader = shader.vertexShader.replace(searchString, chunk[1]);
      }
    })

    // shader.fragmentShader = shader.fragmentShader.replace('//shaderCommon', ShaderChunk.common);
    // shader.fragmentShader = shader.fragmentShader.replace('//lights_pars_begin', ShaderChunk.light);
    // console.log(shader.fragmentShader);
  }

  const jsxMeshes = useJSXMeshes(meshNodes, material);
  const jsxOthers = useJSXOthers(otherNodes);

  const ballRef = useRef();
  const radius = getMainBallRadius();

  const start = new Vector3(- 10, 0, 0);
  const end = start.clone().add(new Vector3(1, 0, 0).multiplyScalar(10));
  const lineRef = useRef<any>();
  const points = [
    start, end,
    new Vector3(- 10, 0, 0),
    new Vector3(0, 10, 0),
    new Vector3(10, 0, 0),
    new Vector3(- 10, 0, 0)
  ];
  const lineAnimator = new LineAnimator(points, 1);
  useFrame(state => {
    if (lineRef.current) {
      const points = lineAnimator.animateFrame(state);
      lineRef.current.geometry.setFromPoints(points);
    }
  })



  const sceneRef = useRef<any>()
  const ballCenter = new Vector3(0, 0, 0);
  const meshesMovementProps = useMemo(() => {
    const props = {}
    // console.log(jsxMeshes && typeof jsxMeshes[0]);
    
    jsxMeshes.forEach((mesh_: any) => {
      const mesh = mesh_.props;
      props[mesh.name] = {
        startPos: mesh.position.clone(),
        endPos: mesh.position.clone().add(mesh.position.clone().normalize().multiplyScalar(Math.random() * 0.15 * mesh.position.length())),
        random: Math.random(),
        // animateStartPos: undefined,
        animateEndPos: mesh.position.clone().add(mesh.position.clone().normalize().multiplyScalar(Math.random() * 50 * mesh.position.length())),
        animateEndRot: new Quaternion().setFromEuler(new Euler(Math.PI * Math.random(), Math.PI * Math.random(), Math.PI * Math.random()))
      }
    })
    return props
  }, [jsxMeshes])

  const tempVec3 = new Vector3()
  const scroll = useAltScroll();

  useFrame((state: RootState) => {
    
    if (sceneRef.current && meshesMovementProps !== null) {
      // console.log(meshesMovementProps);
      if (scroll > 1e-6) {
        sceneRef.current.children.forEach((mesh: Mesh) => {
        const props = meshesMovementProps[mesh.name];
        if (!props) {
          return
        }
        const position = tempVec3.lerpVectors(props.startPos, props.animateEndPos, scroll);
        mesh.position.copy(position); 
        })
      } else {
        const time = state.clock.getElapsedTime()
        sceneRef.current.children.forEach((mesh: Mesh) => {
          const props = meshesMovementProps[mesh.name];
          if (!props) {
            return
          }
          const position = tempVec3.lerpVectors(props.startPos, props.endPos, (Math.sin(time + props.random * 37) + 1) / 2);
          mesh.position.copy(position);
        })
      }
    }
  })


  // useFrame(state => {
  //   // if (state.clock.getElapsedTime() > 2) {
  //   //   return;
  //   // }

  //   if (sceneRef.current) {
  //     const meshes = sceneRef.current.children as Mesh[];

  //     const transMat = new Matrix4();
  //     const tempVec3 = new Vector3();
  //     const speed = 0.002;
  //     meshes.forEach(mesh => {
  //       const outwards = tempVec3.subVectors(mesh.position, ballCenter).normalize().multiplyScalar(speed);
  //       transMat.makeTranslation(outwards.x, outwards.y, outwards.z);
  //       // mesh.applyMatrix4(transMat);
  //     })
  //   }

  // })

  return (
    <>
      {/* <line_ ref={lineRef} geometry={geometry} material={lineMaterial} /> */}
      {/* <Text text={'Hello Text'} /> */}

      {/* <mesh material={material}>
        <sphereGeometry args={[8, 32, 16]} />
      </mesh> */}

      {/* <mesh position={[5, 5, 5]}>
        <sphereGeometry args={[2, 32, 16]}/>
        <meshStandardMaterial />
      </mesh> */}

      <group ref={ballRef} scale={radius} dispose={null}>
        <group ref={sceneRef} name='Scene'>
          {[...jsxOthers, ...jsxMeshes] as any[]}
        </group>
      </group>
    </>
  )
}