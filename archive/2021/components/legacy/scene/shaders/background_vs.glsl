varying vec2 vUv;

void main(){
  vUv = uv;
  float depth = 1.;
  gl_Position = vec4(position.xy, depth, 1.);
}