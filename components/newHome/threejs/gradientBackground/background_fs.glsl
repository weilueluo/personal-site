
varying vec2 vUv;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform float uScrolledAmount;

const vec3 black = vec3(0., 0., 0.);

void main(){
  // vec3 fromColor = uColorA;
  // vec3 toColor = uColorB;

  // float dark_len = 2./4.;  // portion of uColorB throughout the scroll bar, at the middle
  // float transition = (min(1., uScrolledAmount + dark_len) - dark_len) / (1. - dark_len);

  vec3 fromColor = mix(uColorA, black, vec3(uScrolledAmount));
  vec3 toColor = mix(uColorB, black, vec3(uScrolledAmount));

  vec3 color = mix( fromColor, toColor, vec3((vUv.x + vUv.y) / 2.));
  gl_FragColor = vec4(color, 1.0);
}
