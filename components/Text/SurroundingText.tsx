import { useFrame } from '@react-three/fiber';
import { useContext, useEffect, useState } from 'react';
import { DoubleSide, ShaderMaterial, Vector3 } from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { getDeviceDependent, useAltScroll } from '../utils/hooks';

import text_fs from '../shaders/text_fs.glsl';
import text_vs from '../shaders/text_vs.glsl';
import { lightPositionContext } from '../utils/context';


const tempVector = new Vector3(0, 0, 0)

export default function SurroundingText(props) {
    const altScroll = useAltScroll();

    const [meshes, setMeshes] = useState([])
    const [meshMaterials, setMeshMaterials] = useState([])
    const [offsets, setOffsets] = useState([])

    const lightPosition = useContext(lightPositionContext)

    const fontLoader = new FontLoader();
    useEffect(() => {
        fontLoader.load('/fonts/Roboto_Bold.json', font => {
            const [meshes_, meshMaterals_, offsets_] = computeMeshAndMaterial(
                characters,
                font,
                fontSize,
                lightPosition,
                props
            )
            setMeshes(meshes_)
            setMeshMaterials(meshMaterals_)
            setOffsets(offsets_)
        })
    }, [])

    const characters = props.text.split('');

    const fontSize = getDeviceDependent(props.fontSize * 0.6, props.fontSize)

    const scrollAmount = useAltScroll()

    useFrame((state) => {
        const radius = props.radius + props.expandOnScrollSpeed * altScroll;
        // const opacity = 1 - (props.expandOnScrollSpeed == 0 ? 0 : altScroll);
        const time = state.clock.getElapsedTime();

        let phi = 0;
        let theta = props.initOffset;
        const charSpacingAngle = 0.02;
        // console.log(meshMaterials);
        // console.log(offsets);
        
        for (let i = 0; i < meshMaterials.length; i++) {
            const mat = meshMaterials[i];
            const offset = offsets[i];
            const geometry = meshes[i].props.geometry;

            mat.uniforms.uTime.value = time;
            mat.uniforms.uRadius.value = radius;
            mat.uniforms.uPhi.value = phi;
            mat.uniforms.uTheta.value = theta;
            mat.uniforms.uCenterOffset.value = offset;
            mat.uniforms.uScrollAmount.value = scrollAmount;
            mat.uniforms.uPosition.value = geometry.boundingBox.getCenter(tempVector)

            theta += Math.atan2(offset, mat.uniforms.uRadius.value) + charSpacingAngle;
        }
    });

    return <group position={props.position}>{meshes}</group>;
}

function computeMeshAndMaterial(characters, font, fontSize, lightPosition, props) {

    const spaceWidth = 0.5;

    const charMeshes = new Array(characters.length);
    const meshMaterials = new Array(characters.length);
    const offsets = new Array(characters.length);

    const uniforms = {
        uTime: { value: 1.0 },
        uRadius: { value: 0.0 },
        uCenterOffset: { value: 0.0 },
        uPhi: { value: 0.0 },
        uTheta: { value: 0.0 },
        uScrollAmount: { value: 0.0 },
        uFadeInOnScrollSpeed: { value: props.fadeInOnScrollSpeed },
        uLightPosition: { value: lightPosition },
        uPosition: { value: tempVector}
    };

    const sharedMaterial = new ShaderMaterial({
        uniforms: uniforms,
        vertexShader: text_vs,
        fragmentShader: text_fs,
        transparent: true,
        side: DoubleSide,
    });

    for (const [i, char] of characters.entries()) {
        const geometry = new TextGeometry(char, {
            font: font,
            size: fontSize,
            height: 0.1,
        });

        geometry.computeBoundingBox();

        offsets[i] = isFinite(geometry.boundingBox.max.x) // check if space character
            ? geometry.boundingBox.max.x - geometry.boundingBox.min.x
            : spaceWidth;

        meshMaterials[i] = sharedMaterial.clone();
        meshMaterials[i].transparent = true;

        charMeshes[i] = (
            <mesh
                key={i}
                geometry={geometry}
                material={meshMaterials[i]}
                rotation-z={props.rotationZ}
            />
        );
    }

    return [charMeshes, meshMaterials, offsets];
}

SurroundingText.defaultProps = {
    radius: 8.5,
    expandOnScrollSpeed: 30,
    rotationZ: 0,
    initOffset: 0,
    fadeInOnScrollSpeed: 0,
    position: new Vector3(0,0,0),
    fontSize: 1.0
};
