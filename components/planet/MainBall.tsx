/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import { useAnimations, useGLTF } from '@react-three/drei';
import { Canvas, RootState, useFrame } from "@react-three/fiber";
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ACESFilmicToneMapping, AnimationAction, AnimationMixer, Group, LoopPingPong, ShaderMaterial, SphereBufferGeometry, sRGBEncoding, Vector3 } from "three";
import { getScrollPercent } from "../context/ScrollContext";
import { sphere_fs } from '../shaders/sphere_fs';
import { sphere_vs } from '../shaders/sphere_vs';
import { useAltScroll, useScrollPercent } from '../utils/hooks';
import { clamp } from "../utils/utils";
import { meshNameToPosition } from './meshData';


export default function MainBall({ ...props }) {
      const group = useRef()
      const { nodes, materials, animations } = useGLTF('/models/snowball/snow_02_4k-transformed.glb')
      const { actions } = useAnimations(animations, group)


      const uniforms = {
            uTime: { value: 0.5 },
            uPosition: { value: new Vector3(0, 0, 0) },
            uOffsetAmount: { value: 0.0 },
            uWaveAmount: { value: 0.0 },
            uScrolledAmount: { value: 0.0 },
      }

      const meshSharedMaterial = new ShaderMaterial({
            uniforms: uniforms,
            vertexShader: sphere_vs,
            fragmentShader: sphere_fs,
            transparent: true,
            depthWrite: true,
      });

      const [meshes, meshMaterials] = getMeshes(nodes, meshSharedMaterial)


      let mixer = useRef<AnimationMixer>();
      const [maxAnimationDuration, setMaxAnimationDuration] = useState(0)
      useEffect(() => {
            mixer.current = new AnimationMixer(group.current)
            for (const animation of animations) {
                  setMaxAnimationDuration(Math.max(maxAnimationDuration, animation.duration))
                  const action = mixer.current.clipAction(animation) as AnimationAction
                  action.setLoop(LoopPingPong, Infinity)
                  action.play()
            }
      }, [animations, maxAnimationDuration])

      const altScroll = useAltScroll()

      useFrame(state => {
            const time = state.clock.getElapsedTime()

            if (mixer.current) {
                  mixer.current.setTime(maxAnimationDuration * altScroll)
            }

            meshMaterials.forEach(mat => {
                  mat.uniforms.uTime.value = time;
                  mat.uniforms.uScrolledAmount.value = altScroll;
            })
      })



      const sceneRef = useRef()

      useFrame((state) => {
            const scene = sceneRef.current
            if (scene && getScrollPercent() < 1) {
                  scene.rotateOnAxis(new Vector3(1, 1, 1).normalize(), state.clock.getDelta() * 1.5)
            }
      })


      return (
            <group ref={group} dispose={null} scale={8} {...props} >
                  <group ref={sceneRef} name="Scene">
                        <group name="Sphere_cell003_cell_cell001" position={[-0.96, -0.2, 0.21]} />
                        <group name="Sphere_cell003_cell_cell002" position={[-0.96, -0.19, 0.22]} />
                        <group name="Sphere_cell003_cell_cell003" position={[-0.95, -0.21, 0.2]} />
                        <group name="Sphere_cell016_cell007_cell001" position={[0.89, 0.38, 0.26]} />
                        <group name="Sphere_cell018_cell_cell004" position={[-0.01, -0.99, 0.14]} />
                        <group name="Sphere_cell018_cell_cell005" position={[0, -0.99, 0.12]} />
                        {meshes}
                  </group>
            </group>
      )
}


function getMeshes(nodes, sharedMaterial) {
      const meshNodes = Object.entries(nodes).filter(entry => entry[1].type == 'Mesh' && entry[0] != 'Sphere')
      const meshRefs = meshNodes.map(() => useRef())

      const [meshes, materials] = useMemo(() => {

            const meshes = Array(meshNodes.length)
            const materials = Array(meshNodes.length)

            meshNodes.forEach((entry, i) => {
                  const geometry = nodes[entry[0]].geometry
                  const material: ShaderMaterial = sharedMaterial.clone()
                  const position = meshNameToPosition[entry[0]]

                  if (Math.random() < 0.15) {
                        material.wireframe = true;
                        // material.depthWrite = false;
                  }

                  const distToCenter = new Vector3(...position).clone().length()

                  material.uniforms.uPosition.value = position
                  material.uniforms.uWaveAmount.value = Math.random() * distToCenter * 0.3
                  material.uniforms.uOffsetAmount.value = Math.random() * distToCenter * 0.5

                  materials[i] = material
                  meshes[i] = <mesh ref={meshRefs[i]} key={entry[0]} name={entry[0]} castShadow receiveShadow geometry={geometry} material={material} position={position} />
            })

            return [meshes, materials]
      }, [])

      // meshRefs.forEach((meshRef) => {
      //       useHelper(meshRef, VertexNormalsHelper)
      // })

      return [meshes, materials]
}

useGLTF.preload('/models/snowball/snow_02_4k-transformed.glb')