

precision mediump float;

#define PI 3.1415926538

uniform float uOpacity;
uniform float uTime;
uniform float uRadius;
uniform float uCenterOffset;
uniform float uPhi;
uniform float uTheta;

varying vec3 vNormal;
varying vec3 vvNormal;

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

    vec3 newPosition = (translate_mat * rotation_mat * vec4(position, 1.0)).xyz;

    vNormal = (translate_mat * rotation_mat * vec4(normal, 1.0)).xyz;
    vvNormal = normal;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}