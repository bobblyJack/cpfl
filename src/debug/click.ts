import CPFL from "..";

export default function () {
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