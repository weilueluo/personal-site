import Text from "../utils/Text";

export default function WelcomeText(props) {
    return (
        <Text position={[-7, 0, 0]} rotation={[0, -Math.PI / 4, 0]} size={1} height={0.2}>
            Weilue's Place
        </Text>
    )
}