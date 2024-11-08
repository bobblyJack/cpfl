import { clicker } from "./click";
import { doubleClicker } from "./toggle";

// get it? it's a debugger because the bird eats the bugs.
export async function createBird() {

    const bird = document.createElement('button');
    bird.innerHTML = '<iconify-icon icon="lucide:bird"></iconify-icon>';

    let clickTimer: NodeJS.Timeout;
    const clickDelay = 256;

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