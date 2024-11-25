import status from "./status";

const debug: AppDebug = {
    get status(): boolean {
        return status();
    },
    log: (...args: any[]) => {
        if (debug.status) {
            console.log(...args);
        }
    },
    err: (...args: any[]) => {
        if (debug.status) {
            console.error(...args);
        }
    }
}

export default debug;