import { LoopOnce, LoopRepeat, Vector2, Vector3 } from "three";
import { useEffect, useState } from "react";

export function playAnimation(action, duration = 1) {
    action.reset()
    action.setDuration(duration)
    action.setLoop(LoopOnce);
    action.clampWhenFinished = true;
    action.play();
}

// https://gist.github.com/rtpHarry/2d41811d04825935039dfc075116d0ad
export function playAnimationReverse(action, duration = 1) {
    action.paused = false;
    action.setDuration(-duration)
    action.setLoop(LoopOnce);
    action.play();
}

export function playAnimationsIndefinitely(actions) {
    for (const action of actions) {
        action.reset()
        action.setLoop(LoopRepeat)
        action.play()
    }
}

export function setCursorPointerOnHover(hover) {
    useEffect(() => {
        document.body.style.cursor = hover ? 'pointer' : 'auto'
    }, [hover])
}

export function clamp(num: number, min: number, max: number) {
    return Math.max(Math.min(num, max), min)
}

// https://stackoverflow.com/a/19270021/6880256
export function getRandom(arr: Array<any>, n: number) {
    let result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len)
        throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
        const x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}

export function shorten(value, limit) {
    // value: 0 - 1
    // limit: 0 > limit < 1
    // output: 0 - limit but normalized to 0 - 1

    return (Math.min(0, value - limit) + limit) / limit
}

export function separateFaces(geometry) {

        var vertices = [];
        var faces = [];
        var uv = [];
    
        for (var i = 0, il = geometry.faces.length; i < il; i++) {
            var n = vertices.length;
    
            var face = geometry.faces[i];
    
            var a = face.a;
            var b = face.b;
            var c = face.c;
    
            var va = geometry.vertices[a];
            var vb = geometry.vertices[b];
            var vc = geometry.vertices[c];
    
            vertices.push(va.clone());
            vertices.push(vb.clone());
            vertices.push(vc.clone());
    
            face.a = n;
            face.b = n + 1;
            face.c = n + 2;
    
            faces.push(face.clone());
    
            // add other faces
            var extraFace1 = new Face3().copy(face)
            extraFace1.a = geometry.faces.length * 3 - 1
            var extraFace2 = new Face3().copy(face)
            extraFace2.b = geometry.faces.length * 3 - 1
            var extraFace3 = new Face3().copy(face)
            extraFace3.c = geometry.faces.length * 3 - 1
    
            faces.push(extraFace1);
            faces.push(extraFace2);
            faces.push(extraFace3);
    
            // adds uvs to avoid uv error
            // I don't really care for my particular example about the uvs, as I'm not using a texture, but I'm pretty sure the code below is not correct...
            var vuv = []
            vuv.push(new Vector2().copy(geometry.faceVertexUvs[0][i][0]));
            vuv.push(new Vector2().copy(geometry.faceVertexUvs[0][i][1]));
            vuv.push(new Vector2().copy(geometry.faceVertexUvs[0][i][2]));
            uv.push(vuv);
    
            // extra uvs per extra face
            uv.push(vuv);
            uv.push(vuv);
            uv.push(vuv);
    
        }
    
        geometry.vertices = vertices;
        geometry.vertices[vertices.length - 1] = new Vector3(0, 0, 0);
        geometry.faces = faces;
        geometry.faceVertexUvs[0] = uv;
}

export function polar2xyz(theta: number, phi: number, r: number) {
    const x = r * Math.sin(theta) * Math.cos(phi)
    const y = r * Math.sin(theta) * Math.sin(phi)
    const z = r * Math.cos(theta)

    return [x, y, z]
}

export function uniformSphereSample(radius: number) {
    const r1 = Math.random()
    const r2 = Math.random()
    const r3 = Math.random()
    
    const theta = Math.acos(2.0 * r1 - 1.0)
    const phi = 2 * Math.PI * r2

    const r = r3 * radius

    return [theta, phi, r]
}

export function useMaxAnimationDuration(animations) {
    const [maxAnimationDuration, setMaxAnimationDuration] = useState(0);
    useEffect(() => {
        for (const animation of animations) {
            setMaxAnimationDuration(
                Math.max(maxAnimationDuration, animation.duration)
            );
        }
    }, [animations]);

    return maxAnimationDuration;
}