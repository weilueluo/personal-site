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
            color *= 0.9;
        }
        if (angle < PI / (float(i)+0.5)) {
            color *= 0.9;
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

float random (in vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

// Based on Morgan McGuire @morgan3d
// https://www.shadertoy.com/view/4dS3Wd
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

#define NUM_OCTAVES 5
float fbm ( in vec2 _st) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    // Rotate to reduce axial bias
    mat2 rot = mat2(cos(0.5), sin(0.5),
                    -sin(0.5), cos(0.50));
    for (int i = 0; i < NUM_OCTAVES; ++i) {
        v += a * noise(_st);
        _st = rot * _st * 2.0 + shift;
        a *= 0.5;
    }
    return v;
}

float dw_fbm(in vec2 st) {
    return fbm(st + fbm(st + fbm(st)));
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
    //gl_FragColor = vec4(color, 1.);

    //float opacity = max(0.0, 0.9 - uScrolledAmount);
    float opacity = 1.;
    gl_FragColor = vec4(color, opacity);

    //gl_FragColor = vec4(vNormal, 1.0);
}
`