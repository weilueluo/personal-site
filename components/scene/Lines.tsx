import { useEffect, useRef } from 'react';
import { Color, InstancedMesh, Object3D } from 'three';
import { polar2xyz, uniformSphereSample } from '../utils/utils';
import { getVisibleRadius } from './global';

const tempObject = new Object3D();
const tempColor = new Color();
const amount = 25;
const lineRadius = 0.03;

const radius = getVisibleRadius();

const linePositions = new Array(amount * 3);

for (let i = 0; i < linePositions.length; i += 3) {
    const [theta, phi, r] = uniformSphereSample(radius);
    const [x, y, z] = polar2xyz(theta, phi, r);
    linePositions[i] = x;
    linePositions[i + 1] = y;
    linePositions[i + 2] = z;
}

export default function Lines() {
    const meshRef = useRef();

    useEffect(() => {
        const mesh: InstancedMesh = meshRef.current;
        if (mesh == null) {
            return;
        }
        // console.log(mesh);

        for (let i = 0; i < amount; i++) {
            tempObject.position.set(
                linePositions[i * 3],
                linePositions[i * 3 + 1],
                linePositions[i * 3 + 2]
            );

            tempObject.rotateX(Math.random() * Math.PI);
            tempObject.rotateY(Math.random() * Math.PI);
            tempObject.rotateZ(Math.random() * Math.PI);

            tempObject.scale.set(1, radius, 1);

            tempObject.updateMatrix();

            tempColor.setRGB(255, 255, 255);

            mesh.setMatrixAt(i, tempObject.matrix);
            mesh.setColorAt(i, tempColor);
        }
        mesh.instanceMatrix.needsUpdate = true;
        mesh.instanceColor.needsUpdate = true;
    }, []);

    return (
        <instancedMesh ref={meshRef} args={[null, null, amount]}>
            <cylinderBufferGeometry args={[lineRadius, lineRadius, 16, 32]} />
            <meshBasicMaterial />
        </instancedMesh>
    );
}
