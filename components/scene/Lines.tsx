import { useFrame } from '@react-three/fiber';
import { useContext, useEffect, useRef } from 'react';
import { Color, InstancedMesh, Material, Matrix4, Object3D, ShaderMaterial, Vector3 } from 'three';
import { useAltScroll } from '../utils/hooks';
import { polar2xyz, uniformSphereSample } from '../utils/utils';
import { getMainBallRadius, getVisibleRadius } from './global';
import line_fs from '../shaders/line_fs.glsl'
import line_vs from '../shaders/line_vs.glsl'
import { lightPositionContext } from '../utils/context';

const zVector = new Vector3(0, 0, 1);
const yVector = new Vector3(0, 1, 0);
const xVector = new Vector3(1, 0, 0);
const upVector = new Vector3(0, 1, 0);
const downVector = new Vector3(0, -1, 0);
const tempMat4 = new Matrix4();
const tempObject = new Object3D();
const tempColor = new Color();
const lineRadius = 0.03;
const ballPosition = new Vector3(0,0,0);

const radius = getVisibleRadius();

// around light lines init
const aroundLightTransforms: Array<[Vector3, Vector3, number]> = [
    [zVector, upVector, Math.PI / 3],
    [zVector, upVector, Math.PI / 3 * 2],

    [zVector, downVector, Math.PI / 3],
    [zVector, downVector, Math.PI / 3 * 2],

    [xVector, upVector, Math.PI / 3],
    [xVector, upVector, Math.PI / 3 * 2],

    [xVector, downVector, Math.PI / 3],
    [xVector, downVector, Math.PI / 3 * 2]
]
const aroundLightAmount = aroundLightTransforms.length;

const aroundLightPositions = new Array(aroundLightAmount * 3)
for (let i = 0; i < aroundLightPositions.length; i += 3) {
    let [theta, phi, r] = [0, 0, 0];
    const [x, y, z] = polar2xyz(theta, phi, r);
    aroundLightPositions[i] = x;
    aroundLightPositions[i + 1] = y;
    aroundLightPositions[i + 2] = z;
}

// random world lines init
const amount = 25;
const linePositions = new Array(amount * 3);

for (let i = 0; i < linePositions.length; i += 3) {
    let [theta, phi, r] = uniformSphereSample(radius);
    const [x, y, z] = polar2xyz(theta, phi, r);
    linePositions[i] = x;
    linePositions[i + 1] = y;
    linePositions[i + 2] = z;
}

export default function Lines() {
    const meshRef = useRef();

    const lightPosition = useContext(lightPositionContext);
    useEffect(() => {
        const mesh: InstancedMesh = meshRef.current;
        if (mesh == null) {
            return;
        }
        
        for (let i = 0; i < aroundLightAmount; i++) {

            let x = aroundLightPositions[i * 3] + lightPosition.x;
            let y = aroundLightPositions[i * 3 + 1] + lightPosition.y;
            let z = aroundLightPositions[i * 3 + 2] + lightPosition.z;

            tempObject.position.set(x, y, z);
            tempObject.rotation.set(0, 0, 0);

            const [rotateVector, translateVector, rotateDeg] = aroundLightTransforms[i]

            tempMat4.makeRotationAxis(rotateVector, rotateDeg);
            tempObject.setRotationFromMatrix(tempMat4);

            tempMat4.makeTranslation(translateVector.x, translateVector.y, translateVector.z);
            tempObject.applyMatrix4(tempMat4);

            tempObject.scale.set(1, radius, 1);
            tempObject.updateMatrix();
            mesh.setMatrixAt(i, tempObject.matrix);
        }

        for (let i = 0; i < amount; i++) {

            let x = linePositions[i * 3];
            let y = linePositions[i * 3 + 1];
            let z = linePositions[i * 3 + 2];
            
            tempObject.position.set(x, y, z);
            tempObject.rotation.set(0, 0, 0);

            tempObject.rotateX(Math.random() * Math.PI);
            tempObject.rotateY(Math.random() * Math.PI);
            tempObject.rotateZ(Math.random() * Math.PI);

            tempObject.scale.set(1, radius, 1);
            tempObject.updateMatrix();
            mesh.setMatrixAt(i + aroundLightAmount, tempObject.matrix);
        }
        
        mesh.instanceMatrix.needsUpdate = true;
    }, []);


    // shaders
    const uniforms = {
        uScrolledAmount: { value: 0 },
        uLightPosition: { value: lightPosition },
        uMainBallRadius: { value: getMainBallRadius() },
        uMainBallPosition: { value: ballPosition }
    }
    const material = new ShaderMaterial({
        uniforms: uniforms,
        vertexShader: line_vs,
        fragmentShader: line_fs,
        transparent: true
    })

    const scrollAmount = useAltScroll();
    useFrame(() => {
        material.uniforms.uScrolledAmount.value = scrollAmount;
    })

    return (
        <instancedMesh ref={meshRef} args={[null, null, amount + aroundLightAmount]} material={material}>
            <cylinderBufferGeometry args={[lineRadius, lineRadius, 16, 32]} />
        </instancedMesh>
    );
}
