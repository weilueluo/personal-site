import { createContext } from "react";
import { Vector3 } from "three";


export const lightPositionContext = createContext(new Vector3(10, 10, 0))