import SurroundingText from './SurroundingText';

export default function ThreeSurroundingText(props) {
    return (
        <>
            <SurroundingText
                {...props}
                rotationZ={props.rotationZ}
                initOffset={props.initOffset}
            />
            <SurroundingText
                {...props}
                rotationZ={props.rotationZ + Math.PI / 4}
                initOffset={props.initOffset + Math.PI}
            />
            <SurroundingText
                {...props}
                rotationZ={props.rotationZ + -Math.PI / 4}
                initOffset={props.initOffset + Math.PI / 2}
            />
        </>
    );
}

ThreeSurroundingText.defaultProps = {
    rotationZ: Math.PI,
    initOffset: Math.PI,
};
