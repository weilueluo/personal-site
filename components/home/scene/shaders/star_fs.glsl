uniform vec3 uLightPosition;
uniform float uScrolledAmount;
uniform vec3 uColor;

varying vec3 vPosition;
varying vec3 vNormal;


const vec3 brightColor = vec3(1., 1., 1.);
const vec3 darkColor = vec3(0., 0., 0.);

void main() {

    // float angle = dot(normalize(uLightPosition - vPosition), normalize(vNormal));
    float near = mix(45., 15., uScrolledAmount);
    float dist = distance(uLightPosition, vPosition);
    float nearWeight = clamp(dist / near, 0., 1.);
    vec3 fromColor = mix(darkColor, brightColor, uScrolledAmount);
    vec3 toColor = mix(brightColor, darkColor, uScrolledAmount);
    vec3 color = mix(fromColor, toColor, nearWeight);

    gl_FragColor = vec4(color, 1.);
}