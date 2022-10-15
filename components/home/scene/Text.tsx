import { useEffect, useMemo, useState } from "react"
import { DoubleSide, LineBasicMaterial, MeshBasicMaterial, ShapeGeometry, Vector3 } from "three";
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';


export function useTextShape(text: string, size: number) {
    const [textShape, setTextShape] = useState([]);

    const fontLoader = useMemo(() => new FontLoader(), []);

    useEffect(() => {
        fontLoader.load('/fonts/Fira Mono_Regular.json', font => {
            setTextShape(font.generateShapes(text, size));
        })
    }, [fontLoader])

    return textShape;
}

export default function Text(props) {
    //https://github.com/mrdoob/three.js/blob/master/examples/webgl_geometry_text_shapes.html

    
    const [text, setText] = useState(<></>)

    const textShape = useTextShape(props.text, props.size);

    const matDark = new LineBasicMaterial({
        color: 0x006699,
        side: DoubleSide
    });

    useEffect(() => {
        const geometry = new ShapeGeometry(textShape);
        setText(<mesh geometry={geometry} material={matDark} />)
    }, [textShape])


    // center
    // geometry.computeBoundingBox();
    // const xMid = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
    // geometry.translate( xMid, 0, 0 );


    return text
}

Text.defaultProps = {
    text: 'Sample Text',
    size: 1
}