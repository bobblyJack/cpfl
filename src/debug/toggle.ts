import CPFL from "..";

export function doubleClicker(bird: HTMLButtonElement) {
    
    console.log('tweet tweet');

    CPFL.debug = !CPFL.debug;

    bird.classList.toggle("error", CPFL.debug);
    
}