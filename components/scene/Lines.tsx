import { useFrame } from '@react-three/fiber';
import { useContext, useEffect, useRef } from 'react';
import { Color, InstancedMesh, Material, Object3D, ShaderMaterial } from 'three';
import { useAltScroll } from '../utils/hooks';
import { polar2xyz, uniformSphereSample } from '../utils/utils';
import { getVisibleRadius } from './global';
import line_fs from '../shaders/line_fs.glsl'
import line_vs from '../shaders/line_vs.glsl'
import { lightPositionContext } from '../utils/context';

const tempObject = new Object3D();
const tempColor = new Color();
const amount = 45;
const aroundLightAmount = 20;
const lineRadius = 0.03;

const radius = getVisibleRadius();
const aroundLightRadius = 1;

const linePositions = new Array(amount * 3);

for (let i = 0; i < linePositions.length; i += 3) {
    let [theta, phi, r] = [0, 0, 0];
    if (i < aroundLightAmount) {
        [theta, phi, r] = uniformSphereSample(aroundLightRadius)
    } else {
        [theta, phi, r] = uniformSphereSample(radius);
    }
    
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
        
        // console.log(mesh);

        for (let i = 0; i < amount; i++) {

            let x = linePositions[i * 3];
            let y = linePositions[i * 3 + 1];
            let z = linePositions[i * 3 + 2];
            if (i < aroundLightAmount) {
                 x += lightPosition.x;
                 y += lightPosition.y;
                 z += lightPosition.z;
            }

            tempObject.position.set(x, y, z);

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


   

    // shaders
    const uniforms = {
        uScrolledAmount: { value: 0 },
        uLightPosition: { value: lightPosition },
    }
    const material = new ShaderMaterial({
        uniforms: uniforms,
        vertexShader: line_vs,
        fragmentShader: line_fs
    })

    const scrollAmount = useAltScroll();
    useFrame(() => {
        material.uniforms.uScrolledAmount.value = scrollAmount;
    })

    return (
        <instancedMesh ref={meshRef} args={[null, null, amount]} material={material}>
            <cylinderBufferGeometry args={[lineRadius, lineRadius, 16, 32]} />
        </instancedMesh>
    );
}
