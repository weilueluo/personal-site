import { RootState } from "@react-three/fiber";

export interface Animation {
    onStart: Function;
    onFrame: Function;
    onFinish: Function;
    
    animateFrame(state: RootState): void;
}
