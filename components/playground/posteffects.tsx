import { useFrame, useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import { BloomPass } from 'three/examples/jsm/postprocessing/BloomPass';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';

export function usePostEffects() {
    const { gl, scene, camera } = useThree();

    const composer = new EffectComposer(gl);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);
    const bloomPass = new BloomPass(1, 25, 4);
    composer.addPass(bloomPass);

    useFrame(() => {
        composer.render();
    });

    useEffect(() => () => composer.dispose());
}
