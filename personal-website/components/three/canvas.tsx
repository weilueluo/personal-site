import { Preload } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { canvasTunnel } from "./utils";

export default function Scene({ ...props }) {
    // Everything defined in here will persist between route changes, only children are swapped
    return (
        <Canvas {...props}>
            <canvasTunnel.Out />
            <Preload all />
        </Canvas>
    );
}
