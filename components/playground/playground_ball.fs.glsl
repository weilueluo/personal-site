
uniform sampler2D normalMap;
uniform vec3 uBallCenter;

varying vec2 vUv;
varying vec3 vPosition;
// varying vec3 vNormal;
varying mat3 vNormalMatrix;

uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;

//common
//packing
//bsdfs
//lights_pars_begin
//lights_physical_pars_fragment
//normal_pars_fragment
//shadowmap_pars_fragment


varying vec3 vViewPosition;


void main() {
    vec4 diffuseColor = vec4( diffuse, opacity );
    ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );

    //roughnessmap_fragment
    //metalnessmap_fragment
    //normal_fragment_begin
    //lights_physical_fragment
    //lights_fragment_begin
    //lights_fragment_end

    vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	// vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
    vec3 totalEmissiveRadiance = emissive;
	vec3 outgoingLight = totalDiffuse  + totalEmissiveRadiance;


    vec4 texture = texture(normalMap, vUv);
    vec3 surfaceNormal = normalize(texture.xyz);

    // float intensity = dot(surfaceNormal, vNormal);
    // float intensity = texture(normalMap, vUv).z;


    // vec3 color = vec3(1., 1., 1.);

    for (int i = 0; i < NUM_SPOT_LIGHTS; i++) {
        SpotLight spotLight = spotLights[i];
        // vec3 lightPosition = vNormalMatrix * spotLight.position;
        // vec3 lightDirection = normalize(lightPosition - vPosition);
        vec3 lightDirection = spotLight.direction;
        //IncidentLight outLight;
        //getSpotLightInfo(spotLight, geometry, outLight);
        outgoingLight *= dot(lightDirection, surfaceNormal);
        // color = lightDirection;
    }


    //output_fragment


    // gl_FragColor = vec4(color * intensity, 1.);
    // gl_FragColor = vec4(color, 1.0);
    // gl_FragColor = vec4(vPosition, 1.);
}