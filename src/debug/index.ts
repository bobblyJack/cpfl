import { initBird } from "./init";

let debugMode: boolean;

const debug = {
    get status(): boolean {
        if (debugMode === undefined) {
            debugMode = false;
            initBird();
        }
        return debugMode;
    },
    flip: () => debugMode = !debug.status,
    log: (...args: any[]) => {
        if (debug.status) {
            console.log(...args);
        }
    }
}

export default debug;