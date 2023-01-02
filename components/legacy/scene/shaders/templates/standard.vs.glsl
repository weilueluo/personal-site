
varying mat3 vNormalMatrix;

//common
//normal_pars_vertex
//shadowmap_pars_vertex
varying vec3 vViewPosition;

void main() {
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