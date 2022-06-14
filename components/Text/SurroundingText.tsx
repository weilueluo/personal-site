import { useFrame, useLoader } from '@react-three/fiber';
import { useEffect, useMemo, useState } from 'react';
import {
    Box3,
    DoubleSide,
    Group,
    Matrix4,
    Mesh,
    MeshBasicMaterial,
    MeshStandardMaterial,
    ShaderMaterial,
    Vector3,
} from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { useAltScroll } from '../utils/hooks';
import { shorten } from '../utils/utils';

import text_fs from '../shaders/text_fs.glsl';
import text_vs from '../shaders/text_vs.glsl';

function polar2xyz(r, phi, theta) {
    const x = r * Math.cos(phi) * Math.sin(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(theta);

    return new Vector3(x, y, z);
}

export default function SurroundingText(props) {
    const altScroll = useAltScroll();

    const font = useLoader(FontLoader, '/fonts/Montserrat Medium_Regular.json');

    let [fontMesh, setFontMesh] = useState(null);

    const uniforms = {
        uOpacity: { value: 1.0 },
        uTime: { value: 1.0 },
        uRadius: { value: 0.0 },
        uCenterOffset: { value: 0.0 },
        uPhi: { value: 0.0 },
        uTheta: { value: 0.0 },
    };

    const sharedMaterial = new ShaderMaterial({
        uniforms: uniforms,
        vertexShader: text_vs,
        fragmentShader: text_fs,
        transparent: true,
        side: DoubleSide,
    });

    const characters = props.text.split('')

    const geometries = useMemo(() => {
        const _geometries = Array(characters.length)
        for (const [i, char] of characters.entries()) {
            _geometries[i] = new TextGeometry(char, {
                font: font,
                size: 1,
                height: 0.1,
            });
        }
        return _geometries;
    }, [])

    useFrame((state) => {
        const v = shorten(altScroll, 0.3);
        sharedMaterial.uniforms.uTime.value = state.clock.getElapsedTime();
        sharedMaterial.uniforms.uRadius.value =  props.radius + props.expandOnScrollSpeed * v;
        sharedMaterial.uniforms.uOpacity.value = 1 - (props.expandOnScrollSpeed == 0 ? 0 : v);

        setFontMesh(reComputeMeshes(geometries, sharedMaterial, props.rotationZ, props.initOffset));
    });

    return fontMesh;
}

function reComputeMeshes(geometries, sharedMaterial, rotationZ, initOffset) {

    const charSpacingAngle = Math.PI / 96;
    const spaceWidth = 0.5;

    let phi = 0;
    let theta = initOffset;
    const charMeshes = [];

    for (const [i, geometry] of geometries.entries()) {

        geometry.computeBoundingBox();
        // const charPosition = polar2xyz(r, phi, theta);

        const centerOffset = isFinite(geometry.boundingBox.max.x) // space character
            ? geometry.boundingBox.max.x - geometry.boundingBox.min.x
            : spaceWidth;

        const material = sharedMaterial.clone();
        material.uniforms.uPhi.value = phi;
        material.uniforms.uTheta.value = theta;
        material.uniforms.uCenterOffset.value = theta;
        // material.uniforms.uPosition.value = charPosition;

        // const translateMat = new Matrix4().makeTranslation(
        //     charPosition.x,
        //     charPosition.y,
        //     charPosition.z
        // );
        // const rotationMat = new Matrix4().makeRotationY(theta);
        // geometry.applyMatrix4(rotationMat);
        // geometry.applyMatrix4(translateMat);

        charMeshes.push(<mesh
            key={i}
            // position={charPosition.toArray()}
            geometry={geometry}
            material={material}
            rotation-z={rotationZ}
        />);

        theta += Math.atan2(centerOffset, sharedMaterial.uniforms.uRadius.value) + charSpacingAngle;
    }

    return <group>{charMeshes}</group>
}



SurroundingText.defaultProps = {
    radius: 8.5,
    expandOnScrollSpeed: 8,
    rotationZ: 0,
    initOffset: 0
}