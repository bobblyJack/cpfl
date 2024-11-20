import CPFL from "..";

export default function () { // switches debug mode on
    console.log('tweet');
    CPFL.debug = !CPFL.debug;
    return CPFL.debug;
}