import { useFrame } from "@react-three/fiber";
import { useContext } from "react";
import { Group, Matrix3, Matrix4, Mesh, ShaderMaterial, Vector3 } from "three";
import { lightPositionContext } from "../utils/context";
import inner_ball_vs from '../shaders/inner_ball_vs.glsl'
import inner_ball_fs from '../shaders/inner_ball_fs.glsl'

const tempVector = new Vector3(0, 0, 0);
const tempMat3 = new Matrix3()
const tempMat4 = new Matrix4()

export function useInnerBallMaterial(groupRef, meshRef, color) {
    const lightPosition = useContext(lightPositionContext)
    const uniforms = {
        uColor: { value: color },
        uLightPosition: { value: lightPosition },
        uPosition: { value: tempVector },
        uRotation: { value: tempMat3 },
    }
    const material = new ShaderMaterial({
        uniforms: uniforms,
        fragmentShader: inner_ball_fs,
        vertexShader: inner_ball_vs
    })
    useFrame(state => {
        const group = groupRef.current as Group;
        if (!group) return
        const mesh = meshRef.current as Mesh
        if (!mesh) return
        
        tempMat3.setFromMatrix4(tempMat4.makeRotationFromEuler(mesh.rotation))
        uniforms.uRotation.value = tempMat3;
        uniforms.uPosition.value = group.position;
    })

    return material
}