
precision mediump float;

#define PI 3.1415926538

uniform float uScrollAmount;

vec3 brightColor = vec3(1., 1., 1.);
vec3 darkColor = vec3(0., 0., 0.);

void main() {
    vec3 color = mix(darkColor, brightColor, uScrollAmount);
    gl_FragColor = vec4(color, 1.0);
}