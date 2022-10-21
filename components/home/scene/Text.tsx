import { useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react"
import { DoubleSide, LineBasicMaterial, Matrix4, Mesh, MeshBasicMaterial, ShapeGeometry, Vector3 } from "three";
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { useRawFeed2FlatFeed } from "../../rss/hooks";
import { deg2rad } from "../../utils/utils";

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