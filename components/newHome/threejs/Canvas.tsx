import { Canvas, RootState } from '@react-three/fiber';
import { useCallback } from 'react';
import { ACESFilmicToneMapping, Vector3, sRGBEncoding } from 'three';
import { BaseProps } from '../../types/react';

export interface CustomCanvasProps extends BaseProps {
    cameraPosition?: Vector3;
}

export default function ThreeJsCanvas(props: CustomCanvasProps) {
    const { cameraPosition, children, ...otherProps } = props;

    const onCreated = useCallback((state: RootState) => {
        state.setDpr(window.devicePixelRatio);
    }, []);

    return (
        <Canvas
            style={{
                height: '100%',
                width: '100%',
                position: 'fixed',
                top: 0,
                left: 0,
                zIndex: -99
            }}
            camera={{
                position: cameraPosition.toArray(),
                fov: 50,
                near: 0.1,
                far: 100,
            }}
            gl={{
                antialias: true,
                outputEncoding: sRGBEncoding,
                toneMapping: ACESFilmicToneMapping,
                physicallyCorrectLights: true,
            }}
            raycaster={{}}
            shadows={true}
            onCreated={onCreated}
            {...otherProps}>
            {children}
        </Canvas>
    );
}

ThreeJsCanvas.defaultProps = {
    cameraPosition: new Vector3(0, 20, 20),
};
