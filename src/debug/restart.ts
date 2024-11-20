import CPFL from "..";

export default function () { // restarts
    try {
        if (CPFL.debug) {
            CPFL.start().then((app) => {
                console.error('tweet tweet');
                app.iflog('restarted in debug mode');
            });
        } else {
            console.log('tweet tweet');
        }
    } catch (err) {
        console.error('ironic.', err);
    }
}