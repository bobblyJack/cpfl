import { initBird } from "./init";

let debugMode: boolean;

export default function (toggle: boolean = false) {

    if (debugMode === undefined) {
        debugMode = false;
        initBird();
    }

    if (toggle) {
        debugMode = !debugMode;
    }

    return debugMode;

}