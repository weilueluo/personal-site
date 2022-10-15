import { useEffect, useMemo, useState } from "react"
import { DoubleSide, LineBasicMaterial, MeshBasicMaterial, ShapeGeometry } from "three";
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';

export default function Text() {
    //https://github.com/mrdoob/three.js/blob/master/examples/webgl_geometry_text_shapes.html

    const fontLoader = useMemo(() => new FontLoader(), []);
    const [matDark, setMatDark] = useState(null);
    const [matLite, setMatLite] = useState(null);

    const [text, setText] = useState(null)

    useEffect(() => {
        

        setMatLite(matLite);
        setMatDark(matDark);

    }, [])

    useEffect(() => {
        fontLoader.load('/fonts/Fira Mono_Regular.json', (font) => {
            console.log(font);

            const color = 0x006699;

            const matDark = new LineBasicMaterial( {
                color: color,
                side: DoubleSide
            } );

            const matLite = new MeshBasicMaterial( {
                color: color,
                transparent: true,
                opacity: 0.4,
                side: DoubleSide
            } );
            
            const message = '   Three.js\nSimple text.';
            const shapes = font.generateShapes(message, 1);
            const geometry = new ShapeGeometry(shapes);
            console.log(geometry);
            
            geometry.computeBoundingBox();
            const xMid = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
            geometry.translate( xMid, 0, 0 );

            setText(<mesh geometry={geometry} material={matDark} />)

        });
    }, [fontLoader]);

    return (
        <>
            {text}
        </>
    )
}