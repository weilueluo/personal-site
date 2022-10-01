
precision mediump float;

#define PI 3.1415926538

uniform float uScrolledAmount;
uniform vec3 uLightPosition;
uniform float uMainBallRadius;
uniform vec3 uMainBallPosition;

varying vec3 vPosition;

const vec3 brightColor = vec3(1., 1., 1.);
const vec3 darkColor = vec3(0., 0., 0.);


float sphere_surface_dist(vec3 pos, vec3 sphere_pos, float sphere_radius) {
    return pow(pos.x - sphere_pos.x, 2.0) + pow(pos.y - sphere_pos.y, 2.0) + pow(pos.z - sphere_pos.z, 2.0) - pow(sphere_radius, 2.0);
}

float near = 15.;

void main() {

    float dist = distance(uLightPosition, vPosition);
    float opacity = 1.0 - clamp(dist / near, 0., 1.);
    // if (dist < near) {
    //     opacity = (clamp(dist, max(near - fade, 0.), near) - (near - fade)) / fade;
    // } else if (dist > far) {
    //     opacity = (clamp(dist, far, far + fade) - far) / fade;
    // }
    // float darkness = abs((1. - uScrolledAmount) - clamp(dist / near, 0., 1.));
    // vec3 color = mix(brightColor, darkColor, darkness);
    // float opacity = (1.0 - darkness * 2.0);

    float dist2surface = sphere_surface_dist(vPosition, uMainBallPosition, uMainBallRadius);
    if (dist2surface < 0.0) {
        opacity = mix(opacity, 0.0, clamp(abs(dist2surface) * 0.1, 0.0, 1.0));
    }

    vec3 color = mix(darkColor, brightColor, uScrolledAmount);

    gl_FragColor = vec4(color, opacity);
}