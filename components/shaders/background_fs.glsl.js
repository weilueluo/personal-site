export const background_fs = `

varying vec2 vUv;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform float uScrolledAmount;

void main(){
  vec3 fromColor = uColorA;
  //vec3 toColor = uColorB;
  float dark_len = 2./4.;
  float darkness = (min(1., uScrolledAmount + dark_len) - dark_len) / (1. - dark_len);
  vec3 toColor = mix(uColorB, uColorA, vec3(darkness));

  vec3 color = mix( fromColor, toColor, vec3((vUv.x + vUv.y) / 2.));
  gl_FragColor = vec4(color, 1.0);
}


`