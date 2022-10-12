import { BufferGeometry, Line, LineBasicMaterial, Vector3 } from "three";

import { ReactThreeFiber, extend } from '@react-three/fiber'


// https://github.com/pmndrs/react-three-fiber/discussions/1387
extend({ Line_: Line })
declare global {
  namespace JSX {
    interface IntrinsicElements {
      line_: ReactThreeFiber.Object3DNode<THREE.Line, typeof Line>
    }
  }
}


export default function ExperimentalContent() {

    const points = [];
    points.push(new Vector3(- 10, 0, 0));
    points.push(new Vector3(0, 10, 0));
    points.push(new Vector3(10, 0, 0));
    points.push(new Vector3(- 10, 0, 0));

    const geometry = new BufferGeometry().setFromPoints(points);
    const material = new LineBasicMaterial({
        color: 0x0000ff
    })

    return (
        <>
            <line_ geometry={geometry} material={material} />
        </>
    )
}