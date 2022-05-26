export const vertexShader = `

precision mediump float;

uniform float uTime;
uniform vec3 uPosition;
uniform float uWaveAmount;
uniform float uOffsetAmount;
uniform float uScrolledAmount;

varying vec3 vNormal;
varying vec2 vUv;

mat4 getRotationMatrix(vec3 axis, float angle)
{
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    
    return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                0.0,                                0.0,                                0.0,                                1.0);
}

void main() {

    vec3 direction = normalize(uPosition);
    vec3 wave = direction * sin(uTime + uOffsetAmount * 33.0) * uWaveAmount * 0.1;
    vec3 offset = direction * uOffsetAmount * 0.1;
    vec3 pos = position + offset + wave;

    vNormal = normal;
    vUv = uv;

    //mat4 rotationMatrix = getRotationMatrix(vec3(0, 1, 0), uTime);
    //vec4 p = rotationMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    //gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}

`