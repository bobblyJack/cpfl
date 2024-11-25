import CPFL from "..";
import debug from "./";

export default function () { // restarts
    try {
        if (debug.status) {
            debug.err('restarting');
            CPFL.start();
        } else {
            console.log('tweet tweet');
        }
    } catch (err) {
        console.error('ironic.', err);
    }
}