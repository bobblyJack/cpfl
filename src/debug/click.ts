import CPFL from "..";

export default function () { // refreshes current page
    try {
        if (CPFL.debug) {
            console.error('tweet');
            CPFL.app.refresh();
        } else {
            console.log('tweet');
        }
    } catch (err) {
        console.error('ironic.', err);
    }
}