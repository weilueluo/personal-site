
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
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
    vec3 totalEmissiveRadiance = emissive;
	vec3 outgoingLight = totalDiffuse  + totalEmissiveRadiance;


    vec4 texture = texture(normalMap, vUv);
    vec3 surfaceNormal = normalize(texture.xyz);

    //output_fragment
}