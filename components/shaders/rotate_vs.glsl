

precision mediump float;

#define PI 3.1415926538

uniform float uTime;
uniform float uRadius;
uniform float uPhi;
uniform float uTheta;

#pragma glslify: make_translation = require('./partials/translation.glsl')
#pragma glslify: make_local_rotation = require('./partials/local_rotation.glsl')

vec3 polar2xyz(float r, float phi, float theta) {
    float x = r * cos(phi) * sin(theta);
    float y = r * sin(phi) * sin(theta);
    float z = r * cos(theta);

    return vec3(x, y, z);
}


void main() {
    float phi = uPhi; // + PI / 4.;
    float theta = uTheta + uTime; 

    vec3 offset = polar2xyz(uRadius, phi, theta);
    mat4 translate_mat = make_translation(offset);
    mat4 rotation_mat = make_local_rotation(vec3(0, 1, 0), -theta);

    gl_Position = projectionMatrix * modelViewMatrix * translate_mat * rotation_mat * vec4(position, 1.0);
}