
precision mediump float;

#define PI 3.1415926538

// uniform sampler2D uColorMap;
uniform float uTime;
uniform vec3 uPosition;
uniform float uScrolledAmount;
uniform vec3 uLightPosition;
uniform mat3 uBallRotation;
uniform bool uHovered;

varying vec3 vNormal;
varying vec2 vUv;

#pragma glslify: euler2rotation = require('./partials/euler2rotation.glsl')


bool isSurface() {
    float angle = acos(dot(normalize(uPosition), normalize(vNormal)));
    return angle < PI / 8.0;
}

vec3 applyShadow(in vec3 color, vec3 lightPosition) {

    float angle = dot(normalize(lightPosition), normalize(-vNormal)); // -normal so that light drop darkness instead of light
    return color * angle;
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


const float n1 = 1.0; //air refractive index
const float n2 = 1.333; //some refractive index
const vec3 FRESNEL_COLOR = vec3(1., 1., 1.);
vec3 applyFresnel(vec3 color) {
    vec3 camNormal = normalize(cameraPosition);
    float cosTheta = dot(camNormal, vNormal);

    // float fresnel = clamp(1.0 - cosTheta, 0.0, 1.0);

    // return color + FRESNEL_COLOR * fresnel;

    float R0 = pow((n1 - n2) / (n1 + n2), 2.0);
    float coef = R0 + (1.0 - R0) * pow(1.0 - cosTheta, 5.0);

    return color + FRESNEL_COLOR * coef;
}

// const vec3 black = vec3(0., 0., 0.);
// const vec3 one = vec3(1., 1., 1.);

void main() {
    //gl_FragColor = vec4(texture2D(uColorMap, vUv).xyz, 1.0);
    //vec3 color = vNormal * 0.5 + 0.5;  // diff color for diff normal 
    
    vec3 color = normalize(uPosition) * 0.5 + 0.5;  // diff color for diff mesh
    color = vec3(color.xz, abs(sin(uTime * 0.5)));
    
    // bool surface = isSurface();

    // vec2 tile_uv = tile(vUv, 10.0);
    // float lines = make_cross(tile_uv,0.03);
    // if (lines > 0.1 && surface) {
    //     color = vec3(1.0,1.0,1.0);
    // }
    // color = applyFresnel(color);

    // the ball is rotating, the rotation is applied on the sphere
    // so each individual piece does not know this
    // so the position of the piece is not updated
    // so we apply the rotate to light as well to get the correct position
    vec3 lightPosition = uLightPosition * uBallRotation;

    color = applyShadow(color, lightPosition);
    color = mix(color, color * .005, clamp(uScrolledAmount * 2.0, 0.0, 1.0));

    color = clamp(color, 0.0, 1.0);

    if (uHovered) {
        color = vec3(0.1, 0.1, 0.1);
    }
    gl_FragColor = vec4(color, 1.);

    //gl_FragColor = vec4(vNormal, 1.0);
}