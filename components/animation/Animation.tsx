import { RootState } from "@react-three/fiber";

export interface Animation {
    onStart: () => unknown;
    onFrame: () => unknown;
    onFinish: () => unknown;

    animateFrame(state: RootState): void;
}
