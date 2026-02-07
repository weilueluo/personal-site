mat4 make_origin_rotation(vec3 axis, float angle)
{
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    float u = axis.x;
    float v = axis.y;
    float w = axis.z;
    float u2 = u * u;
    float v2 = v * v;
    float w2 = w * w;
    
    return mat4(u2+(1.-u2)*c,  u*v*oc-w*s ,  u*w*oc+v*s ,  0.0,
                u*v*oc+w*s ,  v2+(1.-v2)*c,  v*w*oc-u*s ,  0.0,
                u*w*oc-v*s ,  v*w*oc+u*s ,  w2+(1.-w2)*c,  0.0,
                0.0,          0.0,          0.0,          1.0);
}


#pragma glslify: export(make_origin_rotation)