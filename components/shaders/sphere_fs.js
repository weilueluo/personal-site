export const sphere_fs = `

#define PI 3.1415926538

precision mediump float;

// uniform sampler2D uColorMap;
uniform float uTime;
uniform vec3 uPosition;
uniform float uScrolledAmount;

varying vec3 vNormal;
varying vec2 vUv;


bool isSurface() {
    float angle = acos(dot(normalize(uPosition), normalize(vNormal)));
    return angle < PI / 8.0;
}

vec3 applyShadow(in vec3 color) {
    float angle = acos(dot(normalize(uPosition), normalize(vNormal)));
    for (int i = 1; i <= 8; i++) {
        if (angle < PI / float(i)) {
            color *= 0.8;
        }
    }

    return color;
}

vec2 tile(vec2 uv, float _zoom){
    uv *= _zoom;
    uv.x += uTime * 0.1;
    uv.y += uTime * 0.1 * 2.0;
    return fract(uv);
}

float make_cross(vec2 uv, float width) {
    float line1 = smoothstep(uv.x-width, uv.x, uv.y);
    line1 -= smoothstep(uv.x, uv.x+width, uv.y);
    float line2 = smoothstep(uv.x-width, uv.x, 1.0-uv.y);
    line2 -= smoothstep(uv.x, uv.x+width, 1.0-uv.y);

    return line1;
}

void main() {
    //gl_FragColor = vec4(texture2D(uColorMap, vUv).xyz, 1.0);
    //vec3 color = vNormal * 0.5 + 0.5;  // diff color for diff normal 
    
    vec3 color = normalize(uPosition) * 0.5 + 0.5;  // diff color for diff mesh
    color = vec3(color.xy, abs(sin(uTime * 0.2)));
    
    bool surface = isSurface();

    vec2 tile_uv = tile(vUv, 10.0);
    float lines = make_cross(tile_uv,0.03);
    if (lines > 0.1 && surface) {
        color = vec3(1.0,1.0,1.0);
    }

    color = applyShadow(color);
    //gl_FragColor = vec4(color, 0.9);

    //float opacity = max(0.0, 0.9 - uScrolledAmount);
    float opacity = 0.95;
    gl_FragColor = vec4(color, opacity);

    //gl_FragColor = vec4(vNormal, 1.0);
}
`