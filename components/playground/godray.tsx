import { useFrame } from "@react-three/fiber";
import { EffectComposer, GodRays } from "@react-three/postprocessing";
import { ForwardedRef, useCallback, useEffect, useRef, useState } from "react";
import { Color, MathUtils, Mesh } from "three";
import { useAltScroll } from "../common/threejs";
import {
    BlendFunction,
    Resizer,
    KernelSize
} from 'postprocessing'
import React from "react";
import { getAltScroll } from "../common/scroll";

const white = new Color(0xffffff);

export function useGodray() {
    // decrease sun size as we scroll
    // const sunRef = useRef()
    // const godrayEffectRef = useRef<any>();

    // useFrame(() => {
    //     if (!sunRef.current) {
    //         return;
    //     }

    //     const scroll = getAltScroll();
    //     const scale = Math.max(MathUtils.lerp(1, -10, scroll), 0.1)
    //     sunRef.current.scale.set(scale, scale, scale);

    //     // if (godrayEffectRef.current) {
    //     //     const godrayEffect = godrayEffectRef.current;
    //     //     // console.log(godrayEffect);
    //     //     godrayEffect.weight = Math.max(MathUtils.lerp(0.6, -10, scroll), 0)
    //     // }
    // })


    // const [godrayEffect, setGodrayEffect] = useState(null);
    // const handleBallCreated = useCallback(sun => {
    //     setGodrayEffect(
            
    //     )
    //     setSun(sun);
    // }, []);


    // const godrayBall = useRef(
        
    // )

    // return (
        
    // )
}

export function useScrollLerp(start: number, end: number) {
    const [state, setState] = useState(start);
    const scroll = useAltScroll();
    useEffect(() => {
        setState(MathUtils.lerp(start, end, scroll));
    }, [scroll, start, end])

    return state;
}