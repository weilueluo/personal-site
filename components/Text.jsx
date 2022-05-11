import { extend, useLoader } from '@react-three/fiber'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import fontJson from '../public/fonts/Arial_Bold.json'
import { animated } from '@react-spring/three'

extend({ TextGeometry })
export default function Text(props) {
    const font = new FontLoader().parse(fontJson);
    console.log(props);
    return (
        <animated.mesh {...props}>
            <textGeometry args={[props.children, { font, size: 0.2, height: 0.05 }]} />
            <meshPhysicalMaterial attach={'material'} color={'white'} />
        </animated.mesh>
    )
}