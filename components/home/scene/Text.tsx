import { useEffect, useState } from "react";
import { ShapeGeometry } from "three";
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';

const fontLoader = new FontLoader();
let font = null;
fontLoader.load('/fonts/Fira Mono_Regular.json', f => font = f)

export function useTextShape(text: string, size: number) {
    const [textShape, setTextShape] = useState([]);

    useEffect(() => {
        if (font && text && size) {
            setTextShape(font.generateShapes(text, size));
        }
    }, [text, size])

    return [textShape, setTextShape];
}

export function generateTextShape(text: string, size: number) {
    if (font && text && size) {
        return font.generateShapes(text, size);
    }
    return []
}

export function useTextGeometry(textShape) {

    const [textGeometry, setTextGeometry] = useState(null);

    useEffect(() => {
        if (textShape) {
            setTextGeometry(new ShapeGeometry(textShape));
        }
    }, [textShape])

    return [textGeometry, setTextGeometry];
}