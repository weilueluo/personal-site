import { Canvas, RootState } from '@react-three/fiber';
import { useCallback, useEffect, useState, useContext, useRef } from 'react';
import { Vector3 } from 'three';
import { applyRendererSettings } from './renderer';
import { getDeviceDependent } from '../../common/misc';
import { BaseProps } from '../../types/react';
import { ExploreModeContext } from '../options/OptionsManager';

export interface CustomCanvasProps extends BaseProps {
    cameraPosition?: Vector3;
}

export default function ThreeJsCanvas(props: CustomCanvasProps) {
    const { cameraPosition, children, ...otherProps } = props;
    const resolvedCameraPosition =
        cameraPosition ?? new Vector3(0, 20, 20);

    const stateRef = useRef<RootState | null>(null);

    const [antialias, setAntialias] = useState(false);
    const [physicallyCorrectLights, setPhysicallyCorrectLights] =
        useState(false);

    const applyRenderer = useCallback(
        (state: RootState) => {
            applyRendererSettings(state, {
                dpr: window.devicePixelRatio,
                physicallyCorrectLights,
            });
        },
        [physicallyCorrectLights],
    );

    const onCreated = useCallback(
        (state: RootState) => {
            stateRef.current = state;

            // Dev-only: expose the R3F root state for CDP-driven debugging
            // (e.g. hide/show scene objects to isolate rendering artifacts).
            if (process.env.NODE_ENV === 'development') {
                (window as unknown as { __archive2021_r3f?: RootState }).__archive2021_r3f =
                    state;
            }
            applyRenderer(state);
        },
        [applyRenderer],
    );

    useEffect(() => {
        const turnOn = getDeviceDependent(false, true);
        setAntialias(turnOn);
        setPhysicallyCorrectLights(turnOn);
    }, []);

    useEffect(() => {
        if (stateRef.current) {
            applyRenderer(stateRef.current);
        }
    }, [applyRenderer, physicallyCorrectLights]);

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
                position: resolvedCameraPosition.toArray(),
                fov: 50,
                near: 0.1,
                far: 100,
            }}
            gl={{
                antialias: antialias,
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
