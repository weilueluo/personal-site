import { useFrame } from '@react-three/fiber';
import { type ReactElement, useContext, useEffect, useRef, useState } from 'react';
import { MathUtils, Mesh, ShaderMaterial, Vector3 } from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { FontLoader, type Font } from 'three/examples/jsm/loaders/FontLoader.js';

import { lightPositionContext } from '../../../common/contexts';
import { useArrayRefs } from '../../../common/hooks';
import { polar2xyz } from '../../../common/math';
import { getDeviceDependent } from '../../../common/misc';
import { getAltScroll } from '../../../common/scroll';
import { BaseProps } from '../../../types/react';
import text_fs from './text_fs.glsl';
import text_vs from './text_vs.glsl';

const tempVec3 = new Vector3(0, 0, 0);
const defaultPosition = new Vector3(0, 0, 0);
const fontLoader = new FontLoader();

export interface RotateTextProps extends BaseProps {
    radius: number;
    initPhi: number;
    initTheta: number;
    fadeInOnScrollSpeed: number;
    expandOnScrollSpeed: number;
    position: Vector3;
    fontSize: number;
    text: string;
}

export default function RotateText(props: RotateTextProps) {
    // React 19 no longer applies `defaultProps` for function components.
    // Resolve runtime defaults here so we don't accidentally feed `undefined`
    // into three.js constructors (e.g. TextGeometry size defaults to 100).
    const resolvedText = props.text ?? 'hello world!';
    const resolvedRadius = props.radius ?? 8.5;
    const resolvedExpandOnScrollSpeed = props.expandOnScrollSpeed ?? 100;
    const resolvedFadeInOnScrollSpeed = props.fadeInOnScrollSpeed ?? 0;
    const resolvedPosition = props.position ?? defaultPosition;
    const resolvedFontSize = props.fontSize ?? 1.0;

    const [meshes, setMeshes] = useState<ReactElement[]>([]);
    const [meshMaterials, setMeshMaterials] = useState<ShaderMaterial[]>([]);
    const [offsets, setOffsets] = useState<number[]>([]);

    const lightPosition = useContext(lightPositionContext);
    const fontSize = getDeviceDependent(
        resolvedFontSize * 0.6,
        resolvedFontSize,
    );

    const characters = useRef(resolvedText.split(''));
    const [arrRef, arrReady, onArrItem] = useArrayRefs<Mesh>(
        characters.current.length,
    );

    useEffect(() => {
        fontLoader.load('/fonts/Roboto_Bold.json', font => {
            const [meshes_, meshMaterals_, offsets_] = computeMeshAndMaterial(
                characters.current,
                font,
                fontSize,
                onArrItem,
            );
            setMeshes(meshes_);
            setMeshMaterials(meshMaterals_);
            setOffsets(offsets_);
        });
    }, [fontSize, onArrItem]);

    let currRadius = resolvedRadius;

    useFrame(state => {
        const altScroll = getAltScroll();

        const targetRadius =
            resolvedRadius + resolvedExpandOnScrollSpeed * altScroll;
        currRadius = MathUtils.lerp(currRadius, targetRadius, 0.02);
        // const opacity = 1 - (props.expandOnScrollSpeed == 0 ? 0 : altScroll);
        const time = state.clock.getElapsedTime();

        const phi = props.initPhi;
        let theta = props.initTheta + time;
        const charSpacingAngle = 0.02;

        for (let i = 0; i < meshMaterials.length; i++) {
            const mat = meshMaterials[i];
            const offset = offsets[i];
            const meshElement =
                meshes[i] as ReactElement<{ geometry: TextGeometry }>;
            const geometry = meshElement.props.geometry;

            mat.uniforms.uScrollAmount.value = altScroll;
            mat.uniforms.uPosition.value.copy(
                geometry.boundingBox!.getCenter(tempVec3),
            );
            mat.uniforms.uLightPosition.value = lightPosition;
            mat.uniforms.uFadeInOnScrollSpeed.value =
                resolvedFadeInOnScrollSpeed;

            if (arrReady) {
                const mesh = arrRef.current[i];
                const oldPosition = mesh.position.clone();

                mesh.position.set(...polar2xyz(theta, phi, currRadius));
                const newPosition = mesh.position.clone();

                // calculate the up vector using cross product, assume we take small steps to find the right vectors for cross product
                const toRight = newPosition.clone().sub(oldPosition);
                const toFar = newPosition.negate();
                const upVec = tempVec3.crossVectors(toRight, toFar).normalize();
                mesh.up.set(upVec.x, upVec.y, upVec.z);

                mesh.lookAt(
                    // look at somewhere in front so that the character face outwards
                    tempVec3.addVectors(
                        mesh.position,
                        mesh.position.clone().normalize(),
                    ),
                );
            }

            theta += Math.atan2(offset, currRadius) + charSpacingAngle;
        }
    });

    return <group position={resolvedPosition}>{meshes}</group>;
}

const uniforms = {
    // uTime: { value: 1.0 },
    // uRadius: { value: 0.0 },
    // uCenterOffset: { value: 0.0 },
    // uPhi: { value: 0.0 },
    // uTheta: { value: 0.0 },
    uScrollAmount: { value: 0.0 },
    uFadeInOnScrollSpeed: { value: 0.0 },
    uLightPosition: { value: [0, 0, 0] },
    uPosition: { value: tempVec3 },
    uColor: { value: [10,10,10] }
};

const sharedMaterial = new ShaderMaterial({
    uniforms: uniforms,
    vertexShader: text_vs,
    fragmentShader: text_fs,
    transparent: true,
    depthWrite: true,
});

function computeMeshAndMaterial(
    characters: string[],
    font: Font,
    fontSize: number,
    handleMesh: (index: number, mesh: Mesh) => void,
): [ReactElement[], ShaderMaterial[], number[]] {
    const spaceWidth = 0.5;

    const charMeshes = new Array(characters.length);
    const meshMaterials = new Array(characters.length);
    const offsets = new Array(characters.length);

    for (const [i, char] of characters.entries()) {
        const geometry = new TextGeometry(char, {
            font: font,
            size: fontSize,
            depth: 0.1,
        });

        geometry.computeBoundingBox();

        offsets[i] = isFinite(geometry.boundingBox!.max.x) // check if space character
            ? geometry.boundingBox!.max.x - geometry.boundingBox!.min.x
            : spaceWidth;

        meshMaterials[i] = sharedMaterial.clone();

        charMeshes[i] = (
            <mesh
                ref={mesh => {
                    if (mesh) {
                        handleMesh(i, mesh);
                    }
                }}
                key={i}
                name={`RotateTextChar_${i}`}
                geometry={geometry}
                material={meshMaterials[i]}
                castShadow
                receiveShadow
            />
        );
    }

    return [charMeshes, meshMaterials, offsets];
}

RotateText.defaultProps = {
    radius: 8.5,
    expandOnScrollSpeed: 100,
    initOffset: 0,
    fadeInOnScrollSpeed: 0,
    position: new Vector3(0, 0, 0),
    fontSize: 1.0,
    text: 'hello world!',
    initPhi: 0,
    initTheta: 0,
} as RotateTextProps;
