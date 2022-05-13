import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { extend } from '@react-three/fiber'
import { animated } from '@react-spring/three'
import { Suspense } from 'react'

import fontJson from '/public/fonts/Arial_Bold.json'

export default function Text(props) {
    const font = new FontLoader().parse(fontJson);

    extend({ TextGeometry })  // https://github.com/pmndrs/react-three-fiber/discussions/1742#discussioncomment-2567726

    return (
        <Suspense fallback={null}>
            <animated.mesh {...props} castShadow receiveShadow>
                <textGeometry args={[props.children, { font, size: props.size, height: props.height }]} />
                <meshPhysicalMaterial attach={'material'} color={props.color}/>
            </animated.mesh>
        </Suspense>
    )
}

Text.defaultProps = {
    size: 0.2,
    height: 0.05,
    color: 'gray',
}