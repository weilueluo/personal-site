import { RefObject, useCallback, useEffect, useReducer, useRef, useState } from "react";
import { Vector3 } from "three";
import { Rotator3D } from './rotate'
import { useFrame } from "@react-three/fiber";

export function useArrayRefs<T>(total: number): [RefObject<Array<T>>, boolean, (i: number, item: T) => void] {
    // Ref callbacks can fire more than once per element (StrictMode, remounts, etc).
    // Track indices we've seen so "ready" is robust and does not depend on exact call counts.
    const arrRef = useRef<Array<T>>(new Array(total));
    const seenRef = useRef<boolean[]>(new Array(total).fill(false));
    const [allAdded, setAllAdded] = useState(total === 0);
    const countRef = useRef(0);

    useEffect(() => {
        arrRef.current = new Array(total);
        seenRef.current = new Array(total).fill(false);
        countRef.current = 0;
        setAllAdded(total === 0);
    }, [total]);

    const handleNewItem = useCallback(
        (index: number, item: T) => {
            if (index < 0 || index >= total) return;
            if (seenRef.current[index]) return;

            seenRef.current[index] = true;
            arrRef.current[index] = item;
            countRef.current += 1;
            if (countRef.current >= total) {
                setAllAdded(true);
            }
        },
        [total],
    );

    return [arrRef as RefObject<Array<T>>, allAdded, handleNewItem]
}
