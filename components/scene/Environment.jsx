import { useContext } from "react";
import { ConfigContext } from "../context/ConfigContext";


function Building(props) {
    return (
        <mesh key={props.key} position={props.position} scale={props.scale}>
            <boxGeometry args={[1, 1, 1]} />
            <meshPhongMaterial color={'gray'}/>
        </mesh>
    )
}

export default function Environment() {
    const config = useContext(ConfigContext)
    const mapSize = config['mapSize']

    let buildings = [];
    for (let i = 0; i < mapSize * 4; i++) {
        const posX = Math.random() * mapSize - mapSize/2;
        const posZ = Math.random() * mapSize - mapSize/2;
        if (Math.abs(posX) * Math.abs(posZ) < 50) {
            continue;
        }
        buildings.push(Building({
            position: [posX, 0, posZ],
            scale: [0.5, Math.random() * 5 + 2, 0.5],
            key: i
        }))
    }

    return (
        <group>
            {buildings}
        </group>
    );
}