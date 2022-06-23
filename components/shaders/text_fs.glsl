
precision mediump float;

#define PI 3.1415926538

uniform float uFadeInOnScrollSpeed;
uniform float uScrollAmount;

void main() {
    float opacity = 1.0;

    if (uFadeInOnScrollSpeed > 0.1) {
        opacity = uScrollAmount;
    } else if (uFadeInOnScrollSpeed < 0.1) {
        opacity = 1. - uScrollAmount;
    }

    gl_FragColor = vec4(1., 1., 1., opacity);
}