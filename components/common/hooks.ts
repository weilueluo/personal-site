import { RefObject, useCallback, useEffect, useReducer, useRef, useState } from "react";

export function useArrayRefs<T>(total: number): [RefObject<Array<T>>, boolean, (i: number, item: T) => void] {
    const arrRef = useRef(new Array(total));
    const [allAdded, setAllAdded] = useState(false)
    const [count, increment] = useReducer(count => count+1, 0);
    useEffect(() => {
        if (count === total) {
            setAllAdded(true);
        }
    }, [count, total]);
    const handleNewItem = useCallback((index, item) => {
        arrRef.current[index] = item;
        increment();
    }, [])
    return [arrRef, allAdded, handleNewItem]
}