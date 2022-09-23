
precision mediump float;

#define PI 3.1415926538

uniform float uScrolledAmount;
uniform vec3 uLightPosition;

varying vec3 vPosition;

const vec3 brightColor = vec3(1., 1., 1.);
const vec3 darkColor = vec3(0., 0., 0.);

void main() {

    float dist = distance(uLightPosition, vPosition);
    float darkness = abs((1. - uScrolledAmount) - dist / 15.);
    vec3 color = mix(brightColor, darkColor, darkness);
    // color = mix(color, darkColor, (uScrolledAmount));
    gl_FragColor = vec4(color, 1.0);
}