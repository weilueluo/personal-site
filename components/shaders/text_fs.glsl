
precision mediump float;

#define PI 3.1415926538

uniform float uFadeInOnScrollSpeed;
uniform float uScrollAmount;
uniform vec3 uLightPosition;
uniform vec3 uPosition;

varying vec3 vNormal;



void main() {
    float opacity = 1.0;

    if (uFadeInOnScrollSpeed > 0.1) {
        opacity = uScrollAmount;
    } else if (uFadeInOnScrollSpeed < 0.1) {
        opacity = 1. - uScrollAmount;
    }

    vec3 color = vec3(1., 1., 1.);

    // shadow 
    float angle = dot(normalize(vNormal), normalize(uLightPosition - uPosition));
    color = color * angle;

    gl_FragColor = vec4(color, opacity);
}