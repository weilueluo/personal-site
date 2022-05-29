/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import React, { forwardRef, useEffect, useMemo, useRef, useState } from 'react'
import { useGLTF, useAnimations, useTexture, useHelper } from '@react-three/drei'
import { AnimationAction, AnimationMixer, Group, LoopOnce, LoopPingPong, Mesh, RepeatWrapping, ShaderMaterial, SphereBufferGeometry, Vector2 } from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { getScrollPercent } from "../context/ScrollContext";
import { clamp, getRandom } from "../utils/utils";
import { Vector3 } from 'three';
import { useScrollPercent } from '../utils/hooks';

import { sphere_fs } from '../shaders/sphere_fs'
import { sphere_vs } from '../shaders/sphere_vs'

import { atmosphereFragmentShader } from '../shaders/atmosphereFragmentShader.glsl'
import { atmosphereVertexShader } from '../shaders/atmosphereVertexShader.glsl'

import { VertexNormalsHelper } from 'three/examples/jsm/helpers/VertexNormalsHelper.js'


export default function Model({ ...props }) {
      const group = useRef()
      const { nodes, materials, animations } = useGLTF('/models/snowball/snow_02_4k-transformed.glb')
      const { actions } = useAnimations(animations, group)
      

      const uniforms = {
            // uColorMap: { value: colorMap },
            uTime: { value: 0.5 },
            uPosition: { value: new Vector3(0, 0, 0) },
            uOffsetAmount: { value: 0.0 },
            uWaveAmount: { value: 0.0 },
            uScrolledAmount: {value: 0.0 },
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

      const scroll = useScrollPercent(0, 100)

      useFrame(state => {
            let altScroll = scroll * 2
            if (altScroll > 1) {
                  altScroll = 2 - altScroll
            }
            altScroll = clamp(altScroll, 0, 0.99)  // avoid flashing at 100% animation
            
            const time = state.clock.getElapsedTime()

            if (mixer.current) {
                  mixer.current.setTime(maxAnimationDuration * altScroll)
            }

            meshMaterials.forEach(mat => {
                  mat.uniforms.uTime.value = time;
                  mat.uniforms.uScrolledAmount.value = altScroll;
            })
      })



      const sceneRef = useRef<Group>()
      // const meshes = useMemo(() => {
      //       const scene = sceneRef.current
      //       if (scene) {
      //             const meshes = scene.children.filter(child => child.type == 'Mesh')
      //             return meshes
      //       } else {
      //             return []
      //       }
      // }, [sceneRef.current]) as Array<Mesh>

      // const colorMap = useTexture('/textures/snowball/snow_02_diff_4k.jpg')
      // colorMap.wrapS = colorMap.wrapT = RepeatWrapping
      



      useFrame((state) => {
            const scene = sceneRef.current
            if (scene && getScrollPercent() < 1) {
                  scene.rotateOnAxis(new Vector3(1,1,1).normalize(), state.clock.getDelta() * 1.5)
            }
      })


      const atmosphere = useMemo(() => getAtmosphere(), [])

      return (
            <group ref={group} {...props} dispose={null} scale={8}>
                  <group ref={sceneRef} name="Scene">

                        <group name="Sphere_cell003_cell_cell001" position={[-0.96, -0.2, 0.21]} />
                        <group name="Sphere_cell003_cell_cell002" position={[-0.96, -0.19, 0.22]} />
                        <group name="Sphere_cell003_cell_cell003" position={[-0.95, -0.21, 0.2]} />
                        <group name="Sphere_cell016_cell007_cell001" position={[0.89, 0.38, 0.26]} />
                        <group name="Sphere_cell018_cell_cell004" position={[-0.01, -0.99, 0.14]} />
                        <group name="Sphere_cell018_cell_cell005" position={[0, -0.99, 0.12]} />
                        {meshes}
                        {atmosphere}
                  </group>
            </group>
      )
}


function getAtmosphere() {

      const geometry = new SphereBufferGeometry(5, 32, 32)
      const material = new ShaderMaterial({
            uniforms: {},
            vertexShader: atmosphereVertexShader,
            fragmentShader: atmosphereFragmentShader
      })

      return (
            <mesh position={[0, 0, 0]} geometry={geometry} material={material} />
      )

}


import { meshNameToPosition } from './meshData'

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
