import CPFL from "..";

export function doubleClicker(bird: HTMLButtonElement) {
    try {
        console.log('tweet tweet');

        CPFL.debug = !CPFL.debug;

        bird.classList.toggle("error", CPFL.debug);

    } catch (err) {
        console.error('double ironic.', err);
    }
    
}