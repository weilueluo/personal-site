import { GUI } from 'dat.gui'


export interface IDebugGui {
    gui: GUI
}


type AddArg = 
    [Object, string, number?, number?, number?] |
    [Object, string, boolean] |
    [Object, string, string[]] |
    [Object, string, number[]] |
    [Object, string, Object];

export class DebugGui implements IDebugGui {
    gui: GUI

    constructor() {
        this.gui = new GUI()
    }

    addFolder(folder: string): GUI {
        return this.gui.addFolder(folder);
    }
    add(...args: AddArg) {
        return this.gui.add(...args);
    }

}

