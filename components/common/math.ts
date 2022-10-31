
export function clamp(num: number, min: number, max: number) {
    return Math.max(Math.min(num, max), min);
}

// https://stackoverflow.com/a/19270021/6880256
export function getRandom(arr: Array<any>, n: number) {
    let result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len)
        throw new RangeError('getRandom: more elements taken than available');
    while (n--) {
        const x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}

export function randomIntRange(from: number, to: number) {
    return Math.floor(Math.random() + from * (to - from + 1))
}


export function polar2xyz(theta: number, phi: number, r: number) {
    const x = r * Math.sin(theta) * Math.cos(phi);
    const y = r * Math.sin(theta) * Math.sin(phi);
    const z = r * Math.cos(theta);

    return [x, y, z];
}

export function uniformSphereSample(radius: number) {
    const r1 = Math.random();
    const r2 = Math.random();
    const r3 = Math.random();

    const theta = Math.acos(2.0 * r1 - 1.0);
    const phi = 2 * Math.PI * r2;

    const r = r3 * radius;

    return [theta, phi, r];
}

export function deg2rad(deg) {
    return deg * (Math.PI / 180)
}