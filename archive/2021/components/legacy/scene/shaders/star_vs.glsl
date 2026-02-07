

varying vec3 vPosition;
varying vec3 vNormal;

void main(){
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * instanceMatrix * vec4(position, 1.0);
  vPosition = (instanceMatrix * vec4(position, 1.0)).xyz;
  vNormal = normal;
}