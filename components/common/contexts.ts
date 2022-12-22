import { createContext } from "react";
import { Vector3 } from "three";


export const lightPositionContext = createContext(new Vector3(12, 12, 0))