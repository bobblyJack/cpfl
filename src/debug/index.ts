import { clicker } from "./click";
import { doubleClicker } from "./toggle";

// get it? it's a debugger because the bird eats the bugs.
export async function initBird() {

    const bird = document.getElementById('debug-button') as HTMLButtonElement;

    let clickTimer: NodeJS.Timeout;
    const clickDelay = 200;

    bird.onclick = () => {
        clearTimeout(clickTimer);
        clickTimer = setTimeout(clicker, clickDelay);
    }
    bird.ondblclick = () => {
        clearTimeout(clickTimer);
        doubleClicker(bird);
    }

    return bird;

}