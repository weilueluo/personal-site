import { useFrame, useThree } from "@react-three/fiber"
import { Vector3 } from "three"
import { getAltScroll } from "../../../common/scroll"


const startPos = new Vector3(20, 20, 0)
const endPos = new Vector3(-30, 30, -10)
const targetPos = startPos.clone()

export default function CameraMovement() {

    const { camera } = useThree()

    let lastScroll = 0.0
    useFrame(() => {

        const thisScroll = getAltScroll();
        if (Math.abs(thisScroll - lastScroll) > 1e-6) {
            targetPos.lerpVectors(startPos, endPos, getAltScroll())
            camera.position.lerp(targetPos, 0.01)
            lastScroll = thisScroll;
        }
    })

    return <></>
}