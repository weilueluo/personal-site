import { useFrame } from '@react-three/fiber';
import { useContext, useEffect, useMemo, useRef } from 'react';
import {
    InstancedMesh,
    Object3D,
    ShaderMaterial,
    Vector3
} from 'three';
import { lightPositionContext } from '../../common/contexts';
import { uniformSphereSample, polar2xyz } from '../../common/math';
import { getAltScroll } from '../../common/scroll';
import { getMainBallRadius, getVisibleRadius } from './global';

import star_fs from './shaders/star_fs.glsl';
import star_vs from './shaders/star_vs.glsl';

const tempObject = new Object3D();
const amount = 1000;

function getRandomPositions() {

    const radius = getVisibleRadius();

    const mainBallRadius = getMainBallRadius()

    const positions = Array(amount * 3)

    for (let i = 0; i < amount * 3; i += 3) {
        const [theta, phi, r] = uniformSphereSample(1)
        // ensure it does not land in the ball
        const [x, y, z] = polar2xyz(theta, phi, mainBallRadius + r * (radius - mainBallRadius))
        positions[i] = x
        positions[i + 1] = y
        positions[i + 2] = z
    }

    return positions;
}


const whiteColor = new Vector3(255, 255, 255);
const tempVector3 = new Vector3(0, 0, 0);

export default function Stars() {
    const meshRef = useRef();

    const positions = useMemo(() => getRandomPositions(), [])

    useEffect(() => {
        const mesh: InstancedMesh = meshRef.current;
        if (mesh == null) {
            return;
        }

        for (let i = 0; i < amount; i++) {

            tempObject.position.set(
                positions[i * 3],
                positions[i * 3 + 1],
                positions[i * 3 + 2]
            );

            tempObject.updateMatrix();

            mesh.setMatrixAt(i, tempObject.matrix);
        }
        mesh.instanceMatrix.needsUpdate = true;
    }, [positions]);

    // shader
    const lightPosition = useContext(lightPositionContext);
    const uniforms = {
        uLightPosition: { value: tempVector3 },
        uScrolledAmount: { value: 0 },
        uColor: { value: whiteColor },
    }
    const material = new ShaderMaterial({
        uniforms: uniforms,
        vertexShader: star_vs,
        fragmentShader: star_fs,
        transparent: true,
        depthWrite: true
    })

    useFrame(() => {
        const scrolledAmount = getAltScroll();
        material.uniforms.uLightPosition.value = lightPosition;
        material.uniforms.uScrolledAmount.value = scrolledAmount;
    })

    return (
        <instancedMesh ref={meshRef} args={[null, null, amount]} material={material}>
            <sphereGeometry args={[0.05, 12, 12]} />
            {/* <octahedronBufferGeometry args={[size, 0]} /> */}
            {/* <meshStandardMaterial
                color={0x4287f5}
                emissive={0xffffff}
                emissiveIntensity={1}
            /> */}
        </instancedMesh>
    );
}
