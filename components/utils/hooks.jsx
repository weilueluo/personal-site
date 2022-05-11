import { useState, useEffect } from 'react'

export function useHover() {
    const [hover, setHover] = useState(false);
    const pointerOverHandler = () => setHover(true);
    const pointerOutHandler = () => setHover(false);

    return [hover, {
        onPointerOver: pointerOverHandler,
        onPointerOut: pointerOutHandler
    }]
}

export function useUpdateEffect(func, deps) {
    const [firstTime, setFirstTime] = useState(true)

    useEffect(() => {
        if (firstTime) {
            setFirstTime(false)
        } else {
            func()
        }
    }, deps)
}