
precision mediump float;

#define PI 3.1415926538

uniform float uScrollAmount;
uniform vec3 uLightPosition;

varying vec3 vPosition;

const vec3 brightColor = vec3(1., 1., 1.);
const vec3 darkColor = vec3(0., 0., 0.);

void main() {

    float dist = distance(uLightPosition, vPosition);
    vec3 color = mix(brightColor, darkColor, dist / 25.);

    gl_FragColor = vec4(color, 1.0 - uScrollAmount);
}