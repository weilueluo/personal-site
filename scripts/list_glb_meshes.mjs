import fs from "node:fs/promises";
import path from "node:path";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const glbPath = path.resolve("public/models/ball/sphere.glb");
const buf = await fs.readFile(glbPath);
const loader = new GLTFLoader();
const gltf = await new Promise((resolve, reject) => {
  loader.parse(
    buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength),
    path.dirname(glbPath) + "/",
    resolve,
    reject,
  );
});

const names = [];
gltf.scene.traverse(o => {
  if (o && o.isMesh) names.push(o.name);
});

console.log("mesh count", names.length);
console.log("first 30", names.slice(0, 30));
const prefixes = [...new Set(names.map(n => n.split("_")[0]))];
console.log("unique prefixes", prefixes);
const nonSphere = names.filter(n => !n.startsWith("Sphere"));
console.log("non Sphere names", nonSphere);