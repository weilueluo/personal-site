
varying vec2 vUv;
varying vec3 vPosition;


varying mat3 vNormalMatrix;

//common
//normal_pars_vertex
//shadowmap_pars_vertex
varying vec3 vViewPosition;

void main() {
    // gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
    vUv = uv;
    vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    // vNormal = normal;
    vNormalMatrix = normalMatrix;

    //beginnormal_vertex
    //begin_vertex
    //defaultnormal_vertex
    //normal_vertex
    //worldpos_vertex
    //project_vertex

    //shadowmap_vertex

    vViewPosition = - mvPosition.xyz;
}