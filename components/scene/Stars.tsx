import { useEffect, useRef } from 'react';
import {
    Color,
    InstancedMesh,
    MeshStandardMaterial,
    Object3D,
    SphereBufferGeometry,
    TetrahedronGeometry,
} from 'three';
import { polar2xyz, uniformSphereSample } from '../utils/utils';
import { useMainBallRadius, useVisibleRadius } from './global';

const tempObject = new Object3D();
const tempColor = new Color();
const amount = 500;
const size = 0.1;

const radius = useVisibleRadius();

const mainBallRadius = useMainBallRadius()

const positions = Array(amount * 3)

for (let i = 0; i < amount * 3; i+=3) {
    const [theta, phi, r] = uniformSphereSample(1)
    // ensure it does not land in the ball
    const [x, y, z] = polar2xyz(theta, phi, mainBallRadius + r * (radius - mainBallRadius))
    positions[i] = x
    positions[i+1] = y
    positions[i+2] = z
}

export default function Stars() {
    const meshRef = useRef();

    useEffect(() => {
        const mesh: InstancedMesh = meshRef.current;
        if (mesh == null) {
            return;
        }
        // console.log(mesh);

        for (let i = 0; i < amount; i++) {

            tempObject.position.set(
                positions[i*3],
                positions[i*3+1],
                positions[i*3+2]
            );

            tempObject.updateMatrix();

            tempColor.setRGB(
                Math.random(),
                Math.random(),
                Math.random()
            )

            mesh.setMatrixAt(i, tempObject.matrix);
            mesh.setColorAt(i, tempColor)
        }
        mesh.instanceMatrix.needsUpdate = true;
        mesh.instanceColor.needsUpdate = true
    }, [meshRef.current]);

    return (
        <instancedMesh ref={meshRef} args={[null, null, amount]}>
            <octahedronBufferGeometry args={[size, 0]} />
            <meshStandardMaterial
                color={0x4287f5}
                emissive={0xffffff}
                emissiveIntensity={1}
            />
        </instancedMesh>
    );
}
