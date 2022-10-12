mat3 euler2rotation(vec3 euler)
{
    float c1 = cos(euler.x);
    float c2 = cos(euler.y);
    float c3 = cos(euler.z);

    float s1 = sin(euler.x);
    float s2 = sin(euler.y);
    float s3 = sin(euler.z);

    
    return mat3(c1*c2-c3*s2*s1, c1*s2+c3*c2*s1,  s1*s3,
                -s1*c2-c3*s2*c1, -s1*s2+c3*c2*c1, c1*s3,
                s3*s2,           -s3*c2,  c3);
}


#pragma glslify: export(euler2rotation)