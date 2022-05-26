export const atmosphereFragmentShader = `

uniform sampler2D colorMap;

varying vec3 v_Normal;
varying vec2 vUv;

void main() {
    //gl_FragColor = vec4(texture2D(colorMap, vUv).xyz, 1.0);
    
    gl_FragColor = vec4(v_Normal, 1.0);
}

`