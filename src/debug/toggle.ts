import CPFL from "..";

export default function (bird: HTMLButtonElement) {
    try {
        console.log('tweet tweet');

        CPFL.debug = !CPFL.debug;

        bird.classList.toggle("warn", CPFL.debug);

    } catch (err) {
        console.error('double ironic.', err);
    }
    
}