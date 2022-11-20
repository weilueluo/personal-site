
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

varying mat3 vNormalMatrix;

void main() {
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
    vUv = uv;
    vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    vNormal = normal;
    vNormalMatrix = normalMatrix;
}