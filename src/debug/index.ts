import clicker from "./click";
import doubleClicker from "./toggle";

// get it? it's a debugger because the bird eats the bugs.
export function getBird(admin: boolean): HTMLElement {
    let container = document.getElementById('debug');

    if (!container) { // set up bird cage.
        container = document.createElement("div");
        container.id = "debug";
    }

    let button = container.querySelector("button");
    if (!button) { // set up bird
        button = document.createElement('button');
        button.innerHTML = '<iconify-icon icon="lucide:bird"></iconify-icon>';
        container.appendChild(button);
    }

    if (admin) {// add click functions
        let clickTimer: NodeJS.Timeout;
        const clickDelay = 256;

        button.onclick = () => {
            clearTimeout(clickTimer);
            clickTimer = setTimeout(clicker, clickDelay);
        }
        button.ondblclick = () => {
            clearTimeout(clickTimer);
            const debug = doubleClicker();
            button.classList.toggle("warn", debug);
        }
    }

    return container;

}