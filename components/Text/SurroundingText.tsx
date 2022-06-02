import { useEffect, useState } from 'react';
import {
    Box3,
    Group,
    Matrix4,
    Mesh,
    MeshStandardMaterial,
    Vector3,
} from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import Character from './Character';

function polar2xyz(r, phi, theta) {
    const x = r * Math.cos(phi) * Math.sin(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(theta);

    return new Vector3(x, y, z);
}

export default function SurroundingText(props) {
    const characters = props.text.split('');
    console.log(characters);

    const fontSize = 1;
    const fontHeight = 0.2;
    const center = new Vector3(0, 0, 0);
    const charSpacingAngle = Math.PI / 96;
    const spaceWidth = 0.5;

    const loader = new FontLoader();

    let [fontMesh, setFontMesh] = useState(null);

    useEffect(() => {
        loader.load('/fonts/Montserrat Medium_Regular.json', (font) => {
            let phi = 0;
            let theta = 0;
            let r = 8.5; // 8 is main ball radius
            const characterMeshes = [];
            for (const [i, char] of characters.entries()) {
                const geometry = new TextGeometry(char, {
                    font: font,
                    size: fontSize,
                    height: fontHeight,
                });

                geometry.computeBoundingBox();
                const charPosition = polar2xyz(r, phi, theta);

                const centerOffset = isFinite(geometry.boundingBox.max.x) // space character
                    ? geometry.boundingBox.max.x - geometry.boundingBox.min.x
                    : spaceWidth;


                const translateMat = new Matrix4().makeTranslation(
                    charPosition.x,
                    charPosition.y,
                    charPosition.z
                );
                const rotationMat = new Matrix4().makeRotationY(theta);

                // geometry.center();
                geometry.applyMatrix4(rotationMat);
                geometry.applyMatrix4(translateMat);

                const material = new MeshStandardMaterial({
                    color: 0xffffff,
                });

                const charMesh = (
                    <mesh
                        key={i}
                        // position={charPosition.toArray()}
                        geometry={geometry}
                        material={material}
                    />
                );
                characterMeshes.push(charMesh);

                theta += Math.atan2(centerOffset, r) + charSpacingAngle;
            }

            // const g = <group>
            //             {characterMeshes}
            //         </group>
            // console.log(g);

            setFontMesh(<group>{characterMeshes}</group>);
        });
    }, []);

    return fontMesh;
}
