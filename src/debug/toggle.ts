import CPFL from "..";

export default function () { // switches debug mode on
    try {
        console.log('tweet tweet');
        CPFL.debug = !CPFL.debug;
    } catch (err) {
        console.error('double ironic.', err);
    }
    return CPFL.debug;
}