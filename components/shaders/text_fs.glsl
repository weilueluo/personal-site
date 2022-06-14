
precision mediump float;

#define PI 3.1415926538

uniform float uOpacity;

void main() {
    gl_FragColor = vec4(0, 0, 0, uOpacity);
}