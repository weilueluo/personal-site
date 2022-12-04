import { useFrame, useThree } from "@react-three/fiber";
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { BloomPass } from 'three/examples/jsm/postprocessing/BloomPass';
import { Scene, WebGLRenderTarget } from "three";
import { useEffect } from "react";



export function usePostEffects() {
    const { gl, scene, camera } = useThree();
    
    const composer = new EffectComposer(gl);
    const renderPass = new RenderPass( scene, camera );
    composer.addPass( renderPass );
    const bloomPass = new BloomPass(1, 25, 4);
    composer.addPass( bloomPass )

    useFrame(() => {
        composer.render();
    })

    useEffect(() => () => composer.dispose())
}