uniform vec3 uLightPosition;
uniform float uScrolledAmount;
uniform vec3 uColor;

varying vec3 vPosition;
varying vec3 vNormal;

float near = 15.;
const vec3 brightColor = vec3(1., 1., 1.);
const vec3 darkColor = vec3(0., 0., 0.);

void main() {

    // float angle = dot(normalize(uLightPosition - vPosition), normalize(vNormal));
    float dist = distance(uLightPosition, vPosition);
    float opacity = 1. - clamp(dist / near, 0., 1.);
    vec3 color = mix(darkColor, brightColor, uScrolledAmount);

    gl_FragColor = vec4(color, opacity);
}