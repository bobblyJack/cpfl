import CPFL from "..";

export function clicker() {
    try {
        if (CPFL.debug) {
            console.error('tweet');
        } else {
            console.log('tweet');
        }
    } catch (err) {
        console.error('ironic.', err);
    }
}