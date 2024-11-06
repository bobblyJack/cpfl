import CPFL from "..";

export function clicker() {
    if (CPFL.debug) {
        console.error('tweet');
    } else {
        console.log('tweet');
    }
}