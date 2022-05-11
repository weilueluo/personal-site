

function Building(props) {
    return (
        <mesh key={props.key} position={props.position} scale={props.scale}>
            <boxGeometry args={[1, 1, 1]} />
            <meshPhongMaterial />
        </mesh>
    )
}

export default function Environment() {
    let buildings = [];
    for (let i = 0; i < 200; i++) {
        const posX = Math.random() * 20 - 10;
        const posZ = Math.random() * 20 - 10;
        if (Math.abs(posX) * Math.abs(posZ) < 1) {
            continue;
        }
        buildings.push(Building({
            position: [posX, 0, posZ],
            scale: [0.2, Math.random() + 0.5, 0.2],
            key: i
        }))
    }

    return (
        <group>
            {buildings}
        </group>
    );
}