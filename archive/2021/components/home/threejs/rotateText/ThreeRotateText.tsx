import RotateText, { type RotateTextProps } from './RotateText';

type ThreeRotateTextProps = Partial<
    Omit<RotateTextProps, 'initPhi' | 'initTheta'>
> & {
    rotationZ?: number;
    initOffset?: number;
};

export default function ThreeRotateText(props: ThreeRotateTextProps) {
    const rotationZ = props.rotationZ ?? Math.PI;
    const initOffset = props.initOffset ?? Math.PI;
    return (
        <>
            <RotateText
                {...props}
                initPhi={rotationZ}
                initTheta={initOffset}
            />
            <RotateText
                {...props}
                initPhi={rotationZ + Math.PI / 4}
                initTheta={initOffset + Math.PI}
            />
            <RotateText
                {...props}
                initPhi={rotationZ + -Math.PI / 4}
                initTheta={initOffset + Math.PI / 2}
            />
        </>
    );
}

ThreeRotateText.defaultProps = {
    rotationZ: Math.PI,
    initOffset: Math.PI,
};
