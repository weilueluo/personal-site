import { useHelper, useTexture } from "@react-three/drei";
import { extend } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { useEffectOnce } from "react-use";
import { PointLightHelper } from "three";
import { Color } from "three";
// import { LensFlare, LensFlareElement } from 'three/examples/jsm/objects/Lensflare.js'
import { Lensflare, LensflareElement } from "./MyLensFlare";
// import { LensFlare } from "three";

// extend({ LensFlare, LensFlareElement })




export default function Sunlight(props) {
    const h = props.args[0]
    const s = props.args[1]
    const l = props.args[2]
    const x = props.args[3]
    const y = props.args[4]
    const z = props.args[5]
    const textureFlare0 = useTexture('/textures/lensflare/lensflare0.png');
    const textureFlare3 = useTexture('/textures/lensflare/lensflare3.png');
    // console.log(`hslxyz=${h} ${s} ${l} ${x} ${y} ${z}`);

    const color = new Color()
    color.setHSL(1, 1, 1)

    const ref = useRef()
    // useHelper(ref, PointLightHelper, 'cyan')
    const lensflare = new Lensflare();
    lensflare.addElement(new LensflareElement(textureFlare0, 500, 0, color));
    lensflare.addElement(new LensflareElement(textureFlare3, 60, 0.6));
    lensflare.addElement(new LensflareElement(textureFlare3, 70, 0.7));
    lensflare.addElement(new LensflareElement(textureFlare3, 120, 0.9));
    lensflare.addElement(new LensflareElement(textureFlare3, 70, 1));
    useEffectOnce(() => {
        ref.current.add(lensflare)
    })

    return (
        <pointLight ref={ref} 
            intensity={10}
            distance={100}
            decay={0.1}
            castShadow={true}
            shadow-bias={-0.00001}
            shadow-camera-near={0.1}
            shadow-mapSize-width={4096}
            shadow-mapSize-height={4096}
            shadow-camera-far={20}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
                {...props}
        >
        </pointLight>
    )
}
