/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
author: Antro (https://sketchfab.com/Antro3d)
license: CC-BY-NC-4.0 (http://creativecommons.org/licenses/by-nc/4.0/)
source: https://sketchfab.com/3d-models/uruha-rushia-hololive-vtuber-99edec1aeb67428cb40113646428bf38
title: Uruha Rushia - Hololive Vtuber
*/

import React, { useEffect, useRef } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { playAnimation } from '../utils/utils'

export default function Rushia({ ...props }) {
  const group = useRef()
  const { nodes, materials, animations } = useGLTF('/models/rushia/scene-transformed.glb')
  const { actions } = useAnimations(animations, group)
  console.log(actions);

  return (
    <group position={[5, 0, 0]} scale={0.5} onClick={() => playAnimation(actions.Idle)}
     ref={group} {...props} dispose={null}>
      <group name="Sketchfab_Scene">
        <group name="Sketchfab_model" rotation={[-Math.PI / 2, 0, 0]}>
          <group name="Rushia_sketchfabfbx" rotation={[Math.PI / 2, 0, 0]} scale={0.01}>
            <group name="Object_2">
              <group name="RootNode">
                <group name="Armature" rotation={[-Math.PI / 2, 0, 0]} scale={584.92}>
                  <group name="Object_5">
                    <primitive object={nodes._rootJoint} />
                    <group name="Object_110" rotation={[-Math.PI / 2, 0, 0]} scale={100} />
                    <group name="Object_114" rotation={[-Math.PI / 2, 0, 0]} scale={100} />
                    <group name="Object_118" position={[-1.21, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
                    <group name="Object_121" rotation={[-Math.PI / 2, 0, 0]} scale={100} />
                    <skinnedMesh name="Object_122" geometry={nodes.Object_122.geometry} material={materials.Body} skeleton={nodes.Object_122.skeleton} morphTargetDictionary={nodes.Object_122.morphTargetDictionary} morphTargetInfluences={nodes.Object_122.morphTargetInfluences} />
                    <skinnedMesh name="Object_123" geometry={nodes.Object_123.geometry} material={materials.Face} skeleton={nodes.Object_123.skeleton} morphTargetDictionary={nodes.Object_123.morphTargetDictionary} morphTargetInfluences={nodes.Object_123.morphTargetInfluences} />
                    <skinnedMesh name="Object_124" geometry={nodes.Object_124.geometry} material={materials.Outline_Skin} skeleton={nodes.Object_124.skeleton} morphTargetDictionary={nodes.Object_124.morphTargetDictionary} morphTargetInfluences={nodes.Object_124.morphTargetInfluences} />
                    <skinnedMesh name="Object_111" geometry={nodes.Object_111.geometry} material={materials.Body} skeleton={nodes.Object_111.skeleton} />
                    <skinnedMesh name="Object_112" geometry={nodes.Object_112.geometry} material={materials.Dress} skeleton={nodes.Object_112.skeleton} />
                    <skinnedMesh name="Object_113" geometry={nodes.Object_113.geometry} material={materials.Outline_Skin} skeleton={nodes.Object_113.skeleton} />
                    <skinnedMesh name="Object_115" geometry={nodes.Object_115.geometry} material={materials.Hair} skeleton={nodes.Object_115.skeleton} />
                    <skinnedMesh name="Object_116" geometry={nodes.Object_116.geometry} material={materials.Dress} skeleton={nodes.Object_116.skeleton} />
                    <skinnedMesh name="Object_117" geometry={nodes.Object_117.geometry} material={materials.Outline_Hair} skeleton={nodes.Object_117.skeleton} />
                    <skinnedMesh name="Object_119" geometry={nodes.Object_119.geometry} material={materials.Dress} skeleton={nodes.Object_119.skeleton} />
                    <skinnedMesh name="Object_120" geometry={nodes.Object_120.geometry} material={materials.Outline_Skin} skeleton={nodes.Object_120.skeleton} />
                  </group>
                </group>
                <group name="Body" rotation={[-Math.PI / 2, 0, 0]} scale={100} />
                <group name="Hair" rotation={[-Math.PI / 2, 0, 0]} scale={100} />
                <group name="Dress" position={[-1.21, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={100} />
                <group name="Head" rotation={[-Math.PI / 2, 0, 0]} scale={100} />
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/models/rushia/scene-transformed.glb')
