import * as THREE from "../js/three/build/three.module.js"
import {OrbitControls} from "./three/examples/jsm/controls/OrbitControls.js";
import {FlakesTexture} from "../textures/FlakesTexture.js";
import {RGBELoader} from "./three/examples/jsm/loaders/RGBELoader.js";


let scene, renderer, camera, controls, pointlight

function init() {
    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer({alpha:true,antialias:true});
    renderer.setSize(window.innerWidth,window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    document.body.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(50,window.innerWidth/window.innerHeight,1,1000);
    camera.position.set(0,0,500);
    controls = new OrbitControls(camera, renderer.domElement);

    pointlight = new THREE.PointLight(0xffffff,1);
    pointlight.position.set(200,200,200);
    scene.add(pointlight);

    /*Texture*/
    let texture = new THREE.CanvasTexture(new FlakesTexture());
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    //repeat the wrapping 10 (x) and 6 (y) times
    texture.repeat.x = 10;
    texture.repeat.y = 6;

    /*Environment map*/
    let envmaploader = new THREE.PMREMGenerator(renderer);

    new RGBELoader().setPath('../textures/environment/').load('brown_photostudio_02_4k.hdr', function(hdrMap) {

        let envmap = envmaploader.fromCubemap(hdrMap);
        scene.background = envmap.texture
        const ballMaterial = {
            clearcoat: 1.0,
            clearcoatRoughness:0.1,
            metalness: 0.9,
            roughness:0.5,
            color: 0x8418ca,
            normalMap: texture,
            normalScale: new THREE.Vector2(0.15,0.15),
            envMap: envmap.texture
        };

        let ballGeo = new THREE.SphereGeometry(100,64,64);
        let ballMat = new THREE.MeshPhysicalMaterial(ballMaterial);
        let ballMesh = new THREE.Mesh(ballGeo,ballMat);
        scene.add(ballMesh);

        animate(); // rendering loop
    });




}

function animate() {
    // controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
init();