
uniform sampler2D normalMap;
uniform vec3 uBallCenter;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
varying mat3 vNormalMatrix;


// https://github.com/mrdoob/three.js/blob/a3a4c821229ac554f3ce53cc2b9460cfd205aaaa/src/renderers/shaders/ShaderChunk/lights_pars_begin.glsl.js
struct SpotLight {
    vec3 position;
    vec3 direction;
    vec3 color;
    float distance;
    float decay;
    float coneCos;
    float penumbraCos;
};
uniform SpotLight spotLights[NUM_SPOT_LIGHTS];


// NUM_SPOT_LIGHTS 
// spotLights

// struct IncidentLight {
// 	vec3 color;
// 	vec3 direction;
// 	bool visible;
// };

// struct SpotLight {
//     vec3 position;
//     vec3 direction;
//     vec3 color;
//     float distance;
//     float decay;
//     float coneCos;
//     float penumbraCos;
// };

void main() {
    vec4 texture = texture(normalMap, vUv);
    vec3 surfaceNormal = normalize(texture.xyz);

    // float intensity = dot(surfaceNormal, vNormal);
    // float intensity = texture(normalMap, vUv).z;

    vec3 color = vec3(1., 1., 1.);

    for (int i = 0; i < NUM_SPOT_LIGHTS; i++) {
        SpotLight spotLight = spotLights[i];
        vec3 lightPosition = vNormalMatrix * spotLight.position;
        vec3 lightDirection = normalize(lightPosition - vPosition);
        //IncidentLight outLight;
        //getSpotLightInfo(spotLight, geometry, outLight);
        color *= dot(lightDirection, surfaceNormal);
        // color = lightDir;
    }

    // gl_FragColor = vec4(color * intensity, 1.);
    gl_FragColor = vec4(color, 1.0);
    // gl_FragColor = vec4(vPosition, 1.);
}