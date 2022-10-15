import { BufferGeometry, Line, LineBasicMaterial, Vector3 } from "three";

import { ReactThreeFiber, extend, useFrame, RootState } from '@react-three/fiber'
import { Ref, RefObject, useRef } from "react";
import { clamp } from "../utils/utils";
import { assert } from "console";
import { LineAnimator } from "../animation/LineAnimator";
import Text from "../home/scene/Text";


// https://github.com/pmndrs/react-three-fiber/discussions/1387
extend({ Line_: Line })
declare global {
  namespace JSX {
    interface IntrinsicElements {
      line_: ReactThreeFiber.Object3DNode<Line, typeof Line>
    }
  }
}


export default function ExperimentalContent() {

  // destinations.push(new Vector3(10, 0, 0));
  // destinations.push(new Vector3(- 10, 0, 0));

  const geometry = new BufferGeometry();
  const material = new LineBasicMaterial({
    color: 0xfffffff
  });

  const lineRef = useRef<any>();
  const points = [
    new Vector3(- 10, 0, 0), 
    new Vector3(0, 10, 0), 
    new Vector3(10, 0, 0), 
    new Vector3(- 10, 0, 0)
  ];
  const lineAnimator = new LineAnimator(points, 1);
  useFrame(state => {
    if (lineRef.current) {
      const points = lineAnimator.animateFrame(state);
      lineRef.current.geometry.setFromPoints(points);
    }
    
  })

  return (
    <>
      <line_ ref={lineRef} geometry={geometry} material={material} />
      <Text text={'Hello Text'} />
    </>
  )
}