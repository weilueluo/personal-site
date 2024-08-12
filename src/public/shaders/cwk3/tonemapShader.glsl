precision highp float;

uniform sampler2D radianceTexture;
uniform int sampleCount;
uniform ivec2 resolution;

vec3 tonemap(vec3 color, float maxLuminance, float gamma) {
	float luminance = length(color);
	//float scale =  luminance /  maxLuminance;
	float scale =  luminance / (maxLuminance * luminance + 0.0000001);
  	return max(vec3(0.0), pow(scale * color, vec3(1.0 / gamma)));
}

void main(void) {
  vec3 texel = texture2D(radianceTexture, gl_FragCoord.xy / vec2(resolution)).rgb;
  vec3 radiance = texel / float(sampleCount);
  gl_FragColor.rgb = tonemap(radiance, 1.0, 1.6);
//   gl_FragColor.rgb = radiance;
  gl_FragColor.a = 1.0;
}