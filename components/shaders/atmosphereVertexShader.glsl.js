export const atmosphereVertexShader = `

varying vec3 v_Normal;

varying vec2 vUv;

void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    v_Normal = normal;
    vUv = uv;
}

`