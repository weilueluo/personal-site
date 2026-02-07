import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Box3, Vector3 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const glbPath = process.argv[2] || path.resolve(__dirname, '../public/models/ball/sphere.glb');

const buf = await fs.readFile(glbPath);
const loader = new GLTFLoader();

const gltf = await new Promise((resolve, reject) => {
  loader.parse(
    buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength),
    path.dirname(glbPath) + '/',
    resolve,
    reject,
  );
});

const meshes = [];
const box = new Box3();
const size = new Vector3();

// Ensure world matrices are correct before Box3.setFromObject.
gltf.scene.updateMatrixWorld(true);

let meshCount = 0;
gltf.scene.traverse(obj => {
  if (!obj.isMesh) return;
  meshCount += 1;
  box.setFromObject(obj);
  box.getSize(size);
  const dims = { x: size.x, y: size.y, z: size.z };
  const maxDim = Math.max(dims.x, dims.y, dims.z);
  const minDim = Math.min(dims.x, dims.y, dims.z);
  const thinness = maxDim === 0 ? 1 : (minDim / maxDim);

  const geom = obj.geometry;
  const pos = geom?.attributes?.position;
  const triCount = geom?.index ? geom.index.count / 3 : (pos ? pos.count / 3 : 0);

  meshes.push({
    name: obj.name,
    maxDim,
    minDim,
    thinness,
    dims,
    triCount,
  });
});

meshes.sort((a, b) => {
  // Prioritize large AND thin.
  const scoreA = (a.maxDim || 0) * (1 / Math.max(a.thinness, 1e-9));
  const scoreB = (b.maxDim || 0) * (1 / Math.max(b.thinness, 1e-9));
  return scoreB - scoreA;
});

console.log('GLB:', glbPath);
console.log('meshCount:', meshCount);
console.log('Top 30 large+thin meshes (likely planes/shards):');
for (const m of meshes.slice(0, 30)) {
  console.log(
    [
      m.name.padEnd(32),
      `max=${m.maxDim.toFixed(5)}`.padEnd(12),
      `min=${m.minDim.toFixed(7)}`.padEnd(14),
      `thin=${m.thinness.toExponential(2)}`.padEnd(12),
      `dims=(${m.dims.x.toFixed(5)},${m.dims.y.toFixed(5)},${m.dims.z.toFixed(5)})`.padEnd(38),
      `tris=${Math.round(m.triCount)}`,
    ].join(' '),
  );
}