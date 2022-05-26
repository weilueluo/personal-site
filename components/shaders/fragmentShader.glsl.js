export const fragmentShader = `

#define PI 3.1415926538

precision mediump float;

uniform sampler2D uColorMap;
uniform float uTime;
uniform vec3 uPosition;
uniform float uScrolledAmount;

varying vec3 vNormal;
varying vec2 vUv;


void applyShadow(inout vec3 color) {
    float angle = acos(dot(normalize(uPosition), normalize(vNormal)));
    if (angle > PI / 2.0) {
        color *= 0.8;
    }
    //color /= (PI - angle) / (PI * 0.5);
    // color = vec3(angle / PI, 0.0, 0.0);
}

void main() {
    //gl_FragColor = vec4(texture2D(uColorMap, vUv).xyz, 1.0);

    //vec3 color = vNormal * 0.5 + 0.5;  // diff color for diff normal 
    vec3 color = normalize(uPosition) * 0.5 + 0.5;  // diff color for diff mesh

    //vec3 color = vec3(sin(uTime), 1.0, 0.0);
    // gl_FragColor = vec4(color, (sin(uTime) * 0.5 + 0.5)); // change opacity by time
    
    applyShadow(color);
    gl_FragColor = vec4(color, 1.0);
    //gl_FragColor = vec4(color, 1.0 - uScrolledAmount);

    //gl_FragColor = vec4(vNormal, 1.0);
}

`