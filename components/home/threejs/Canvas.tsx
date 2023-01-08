import { Canvas, RootState } from '@react-three/fiber';
import { useCallback, useEffect, useState, useContext } from 'react';
import { ACESFilmicToneMapping, Vector3, sRGBEncoding } from 'three';
import { getDeviceDependent } from '../../common/misc';
import { BaseProps } from '../../types/react';
import { ExploreModeContext } from '../options/OptionsManager';

export interface CustomCanvasProps extends BaseProps {
    cameraPosition?: Vector3;
}

export default function ThreeJsCanvas(props: CustomCanvasProps) {
    const { cameraPosition, children, ...otherProps } = props;

    const onCreated = useCallback((state: RootState) => {
        state.setDpr(window.devicePixelRatio);
    }, []);

    const [antialias, setAntialias] = useState(false);
    const [physicallyCorrectLights, setPhysicallyCorrectLights] =
        useState(false);

    useEffect(() => {
        const turnOn = getDeviceDependent(false, true);
        setAntialias(turnOn);
        setPhysicallyCorrectLights(turnOn);
    }, []);

    // move canvas up in 3D mode so that user can move around in threejs canvas
    const zIndex = useContext(ExploreModeContext) ? 1 : -1

    return (
        <Canvas
            style={{
                height: '100%',
                width: '100%',
                position: 'fixed',
                top: 0,
                left: 0,
                zIndex: zIndex
            }}
            camera={{
                position: cameraPosition.toArray(),
                fov: 50,
                near: 0.1,
                far: 100,
            }}
            gl={{
                antialias: antialias,
                outputEncoding: sRGBEncoding,
                toneMapping: ACESFilmicToneMapping,
                physicallyCorrectLights: physicallyCorrectLights,
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
