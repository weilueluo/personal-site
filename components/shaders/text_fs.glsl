
precision mediump float;

#define PI 3.1415926538

uniform float uFadeInOnScrollSpeed;
uniform float uScrollAmount;
uniform vec3 uLightPosition;

varying vec3 vNormal;

vec3 applyShadow(vec3 color) {
    float angle = dot(normalize(vNormal), normalize(uLightPosition));

    return angle * color;
}

void main() {
    float opacity = 1.0;

    if (uFadeInOnScrollSpeed > 0.1) {
        opacity = uScrollAmount;
    } else if (uFadeInOnScrollSpeed < 0.1) {
        opacity = 1. - uScrollAmount;
    }

    vec3 color = vec3(1., 1., 1.);

    color = applyShadow(color);

    gl_FragColor = vec4(color, opacity);
}