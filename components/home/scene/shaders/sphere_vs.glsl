
precision mediump float;

#define PI 3.1415926538

uniform float uTime;
uniform vec3 uPosition;
uniform float uWaveAmount;
uniform float uOffsetAmount;
uniform float uScrolledAmount;
uniform float uWaveSpeed;
uniform bool uDoWave;
// uniform vec3 uBallRotation;

varying vec3 vNormal;
varying vec2 vUv;

// #pragma glslify: perlin4d = require('./partials/perlin4d.glsl')
// #pragma glslify: perlin3d = require('./partials/perlin3d.glsl')

#pragma glslify: make_local_rotation = require('./partials/local_rotation.glsl')
#pragma glslify: make_origin_rotation = require('./partials/origin_rotation.glsl')
#pragma glslify: make_translation = require('./partials/translation.glsl')

mat4 rotateX(float theta) {
    float c = cos(theta);
    float s = sin(theta);
    return mat4(
        vec4(1, 0, 0, 0), 
        vec4(0, c, -s, 0),
        vec4(0, s, c, 0),
        0., 0., 0.,     1.
    );
}

void main() {
    
    vec3 newPosition = position;

    if (uDoWave) {
        vec3 direction = normalize(uPosition);
        vec3 wave = direction * (sin(uTime * uWaveSpeed) + 1.0) * uWaveAmount;
        vec3 offset = direction * uOffsetAmount * 0.1;
        newPosition += offset + wave;
    }

    // mat4 trans1_mat = make_translation(-uPosition);
    // mat4 rotation_mat = rotateX(uRotateTheta); //make_local_rotation(vec3(1., 0., 0.), uRotateTheta);
    // mat4 trans2_mat = make_translation(uPosition);


    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    vNormal = normal;
    vUv = uv;
}