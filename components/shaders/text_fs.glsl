
precision mediump float;

#define PI 3.1415926538

uniform float uOpacity;

void main() {
    gl_FragColor = vec4(1, 1, 1, uOpacity);
}