import { getDeviceDependent } from "../../common/misc";


export function getMainBallRadius() {
    return getDeviceDependent(5.0, 8.0)
}

export function getVisibleRadius() {
    return 50.0;
}

export function getNScrollPages() {
    return getDeviceDependent(2.0, 4.0);
}


