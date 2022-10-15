
precision mediump float;

#define PI 3.1415926538

uniform float uFadeInOnScrollSpeed;
uniform float uScrollAmount;
uniform vec3 uLightPosition;
uniform vec3 uPosition;

varying vec3 vNormal;
varying vec3 vvNormal;


// float quantize(float value) {
//     float start = 0.0;
//     float end = 1.0;
//     float stepSize = .1;

//     float threshold = start;
//     float next = threshold + stepSize;
//     while (threshold < end) {
//         if (next > value) {
//             return threshold + stepSize / 2.;
//         }
//         threshold = next;
//         next += stepSize;
//     }
//     return end - stepSize / 2.;
// }

// vec3 quantize(vec3 values) {
//     return vec3(quantize(values.x), quantize(values.y), quantize(values.z));
// }

const float MAX_OPACITY = 0.55;

void main() {
    float opacity = 1.0;

    if (uFadeInOnScrollSpeed > 0.1) {
        opacity = uScrollAmount;
    } else if (uFadeInOnScrollSpeed < 0.1) {
        opacity = 1. - uScrollAmount;
    }

    opacity *= MAX_OPACITY;

    vec3 color = vec3(.5, .5, .5);// normalize(vvNormal * 0.5 + 0.5);

    // shadow 
    float angle = dot(normalize(vNormal), normalize(uLightPosition - uPosition));
    color = color * (mix(2. * angle, 1., 1. - uScrollAmount) - angle);

    gl_FragColor = vec4(color, opacity);
}