

uniform vec3 uColor;
uniform vec3 uLightPosition;
uniform vec3 uPosition;

varying vec3 vNormal;

vec3 applyShadow(vec3 color) {
    float angle = dot(normalize(vNormal), normalize(uLightPosition - uPosition));
    return color * angle;
}

void main() {

    vec3 color = uColor;
    color = applyShadow(color);
    gl_FragColor = vec4(color, 1.0);
}