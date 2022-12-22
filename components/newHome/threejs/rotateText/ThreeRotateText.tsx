import RotateText from './RotateText';

export default function ThreeRotateText(props) {
    return (
        <>
            <RotateText
                {...props}
                initPhi={props.rotationZ}
                initTheta={props.initOffset}
            />
            <RotateText
                {...props}
                initPhi={props.rotationZ + Math.PI / 4}
                initTheta={props.initOffset + Math.PI}
            />
            <RotateText
                {...props}
                initPhi={props.rotationZ + -Math.PI / 4}
                initTheta={props.initOffset + Math.PI / 2}
            />
        </>
    );
}

ThreeRotateText.defaultProps = {
    rotationZ: Math.PI,
    initOffset: Math.PI,
};
