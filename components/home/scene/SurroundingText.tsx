import { useFrame } from '@react-three/fiber';
import { useContext, useEffect, useMemo, useState } from 'react';
import { ShaderMaterial, Vector3 } from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';

import { lightPositionContext } from '../../common/contexts';
import { getDeviceDependent } from '../../common/misc';
import { useAltScroll } from '../../common/threejs';
import text_fs from './shaders/text_fs.glsl';
import text_vs from './shaders/text_vs.glsl';


const tempVector = new Vector3(0, 0, 0)

export default function SurroundingText(props) {
    const altScroll = useAltScroll();

    const [meshes, setMeshes] = useState([])
    const [meshMaterials, setMeshMaterials] = useState([])
    const [offsets, setOffsets] = useState([])
    const [characters, setCharacters] = useState([])

    useEffect(() => {
        setCharacters(props.text.split(''));
    }, [props.text])

    const lightPosition = useContext(lightPositionContext)

    const fontLoader = useMemo(() => new FontLoader(), []);
    const fontSize = getDeviceDependent(props.fontSize * 0.6, props.fontSize)

    useEffect(() => {
        fontLoader.load('/fonts/Roboto_Bold.json', font => {
            const [meshes_, meshMaterals_, offsets_] = computeMeshAndMaterial(
                characters,
                font,
                fontSize,
                lightPosition,
                props.fadeInOnScrollSpeed,
                props.rotationZ
            )
            setMeshes(meshes_)
            setMeshMaterials(meshMaterals_)
            setOffsets(offsets_)
        })
    }, [characters, fontLoader, fontSize, lightPosition, props.fadeInOnScrollSpeed, props.rotationZ])

    const scrollAmount = useAltScroll()

    useFrame((state) => {
        const radius = props.radius + props.expandOnScrollSpeed * altScroll;
        // const opacity = 1 - (props.expandOnScrollSpeed == 0 ? 0 : altScroll);
        const time = state.clock.getElapsedTime();

        let phi = 0;
        let theta = props.initOffset;
        const charSpacingAngle = 0.02;

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
            mat.uniforms.uLightPosition.value = lightPosition;

            theta += Math.atan2(offset, mat.uniforms.uRadius.value) + charSpacingAngle;
        }
    });

    return <group position={props.position}>{meshes}</group>;
}

function computeMeshAndMaterial(characters, font, fontSize, lightPosition, fadeInOnScrollSpeed, rotationZ) {

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
        uFadeInOnScrollSpeed: { value: fadeInOnScrollSpeed },
        uLightPosition: { value: lightPosition },
        uPosition: { value: tempVector }
    };

    const sharedMaterial = new ShaderMaterial({
        uniforms: uniforms,
        vertexShader: text_vs,
        fragmentShader: text_fs,
        transparent: true,
        depthWrite: false
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

        charMeshes[i] = (
            <mesh
                key={i}
                geometry={geometry}
                material={meshMaterials[i]}
                rotation-z={rotationZ}
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
    position: new Vector3(0, 0, 0),
    fontSize: 1.0
};
