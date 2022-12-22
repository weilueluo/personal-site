import { useFrame } from '@react-three/fiber';
import { useContext, useEffect, useRef } from 'react';
import { InstancedMesh, Object3D, ShaderMaterial, Vector3 } from 'three';
import line_fs from './line_fs.glsl';
import line_vs from './line_vs.glsl';
import { lightPositionContext } from '../../../common/contexts';
import { polar2xyz, uniformSphereSample } from '../../../common/math';
import { getAltScroll } from '../../../common/scroll';
import { getVisibleRadius, getMainBallRadius } from '../../../home/scene/global';

const ballPosition = new Vector3(0, 0, 0);
const tempObject = new Object3D();

const radius = getVisibleRadius();
const lineRadius = 0.03;

// around light lines init
const aroundLightTransforms: Array<[Vector3, Vector3, number]> = [
    // --- UNCOMMENT TO USE ---
    // [zVector, upVector, Math.PI / 3],
    // [zVector, upVector, Math.PI / 3 * 2],
    // [zVector, downVector, Math.PI / 3],
    // [zVector, downVector, Math.PI / 3 * 2],
    // [xVector, upVector, Math.PI / 3],
    // [xVector, upVector, Math.PI / 3 * 2],
    // [xVector, downVector, Math.PI / 3],
    // [xVector, downVector, Math.PI / 3 * 2]
];
const aroundLightAmount = aroundLightTransforms.length;

const aroundLightPositions = new Array(aroundLightAmount * 3);
for (let i = 0; i < aroundLightPositions.length; i += 3) {
    const [theta, phi, r] = [0, 0, 0];
    const [x, y, z] = polar2xyz(theta, phi, r);
    aroundLightPositions[i] = x;
    aroundLightPositions[i + 1] = y;
    aroundLightPositions[i + 2] = z;
}

// random world lines init
const amount = 120;
const linePositions = new Array(amount * 3);
const lineRotations = new Array(amount * 3);

for (let i = 0; i < linePositions.length; i += 3) {
    const [theta, phi, r] = uniformSphereSample(radius);
    const [x, y, z] = polar2xyz(theta, phi, r);
    linePositions[i] = x;
    linePositions[i + 1] = y;
    linePositions[i + 2] = z;

    // rotation for x, y, z
    lineRotations[i] = Math.random() * Math.PI;
    lineRotations[i + 1] = Math.random() * Math.PI;
    lineRotations[i + 2] = Math.random() * Math.PI;
}

export default function Lines() {
    const meshRef = useRef();

    const lightPosition = useContext(lightPositionContext);
    useEffect(() => {
        const mesh: InstancedMesh = meshRef.current;
        if (mesh == null) {
            return;
        }

        for (let i = 0; i < amount; i++) {
            const x = linePositions[i * 3];
            const y = linePositions[i * 3 + 1];
            const z = linePositions[i * 3 + 2];

            tempObject.position.set(x, y, z);
            tempObject.rotation.set(0, 0, 0);

            tempObject.rotateX(lineRotations[i]);
            tempObject.rotateY(lineRotations[i * 3 + 1]);
            tempObject.rotateZ(lineRotations[i * 3 + 2]);

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
        uMainBallPosition: { value: ballPosition },
    };
    const material = new ShaderMaterial({
        uniforms: uniforms,
        vertexShader: line_vs,
        fragmentShader: line_fs,
        transparent: true,
        depthWrite: false,
    });

    useFrame(() => {
        material.uniforms.uScrolledAmount.value = getAltScroll();
        material.uniforms.uLightPosition.value = lightPosition;
    });

    return (
        <instancedMesh
            ref={meshRef}
            args={[null, null, amount + aroundLightAmount]}
            material={material}>
            <cylinderGeometry args={[lineRadius, lineRadius, 16, 32]} />
        </instancedMesh>
    );
}
