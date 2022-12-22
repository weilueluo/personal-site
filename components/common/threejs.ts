import { useFrame } from '@react-three/fiber';
import { useEffect, useState } from 'react';
import { Mesh, Object3D, Vector3 } from 'three';

export function useCursorPointerOnHover(hover) {
    useEffect(() => {
        document.body.style.cursor = hover ? 'pointer' : 'auto';
    }, [hover]);
}

export function getMeshCenter(mesh: Mesh) {
    const middle = new Vector3();
    const geometry = mesh.geometry;

    geometry.computeBoundingBox();

    middle.x = (geometry.boundingBox.max.x + geometry.boundingBox.min.x) / 2;
    middle.y = (geometry.boundingBox.max.y + geometry.boundingBox.min.y) / 2;
    middle.z = (geometry.boundingBox.max.z + geometry.boundingBox.min.z) / 2;

    mesh.localToWorld(middle);
    return middle;
}

export function useHover() {
    const [hover, setHover] = useState(false);
    const pointerOverHandler = () => setHover(true);
    const pointerOutHandler = () => setHover(false);

    return [hover, pointerOverHandler, pointerOutHandler];
}

export function useOddClick() {
    const [oddClick, setOddClick] = useState(false);
    return [() => setOddClick(!oddClick), oddClick];
}

const intersectResult = [];

export function useCurrent3DHover(): Object3D {
    const [intersect, setIntersect] = useState(null);

    useFrame(state => {
        if (!intersect && state.mouse.x == 0 && state.mouse.y == 0) {
            // when user mouse is not in webpage when page loaded
            // the mouse xy will default to (0,0) which is the center of the page
            // but user mouse is not actually at the center of the page
            // so we do not do any detection here
            // NOTE: this can be problematic when user actually place its mouse at the center
            // but thats... relatively minor issue
            return;
        }

        const raycaster = state.raycaster;

        raycaster.setFromCamera(state.mouse, state.camera);

        intersectResult.length = 0;
        raycaster.intersectObject(state.scene, true, intersectResult);

        if (intersectResult.length == 0) {
            setIntersect(null);
        } else {
            setIntersect(intersectResult[0].object);
        }
    });

    return intersect;
}

export function use3DHover(objectRef: { current: null | Object3D }) {
    const [hover, setHover] = useState(false);
    const intersectedObject = useCurrent3DHover();

    useFrame(() => {
        const objectToCheck = objectRef.current;
        setHover(
            objectToCheck &&
                intersectedObject &&
                objectToCheck.id == intersectedObject.id,
        );
    });

    return hover;
}

export function use3DParentHover(objectRef: { current: null | Object3D }) {
    const [hover, setHover] = useState(false);
    const [object, setObject] = useState(null);
    const intersectedObject = useCurrent3DHover();

    useFrame(() => {
        const objectToCheck = objectRef.current;

        if (intersectedObject && objectToCheck) {
            // recursively check parent as well
            let parent = intersectedObject;
            while (parent) {
                if (objectToCheck.id == parent.id) {
                    setHover(true);
                    setObject(intersectedObject);
                    return;
                }
                parent = parent.parent;
            }
        }

        setHover(false);
        setObject(null);
    });

    return [hover, object];
}
