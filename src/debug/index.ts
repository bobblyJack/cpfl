import clicker from "./toggle";
import dblclicker from "./restart";

// get it? it's a debugger because the bird eats the bugs.
export function initBird(admin: boolean): HTMLButtonElement {
    
    let button = document.getElementById('debug-button') as HTMLButtonElement | undefined;
    if (!button) {
        throw new Error('bird flew away');
    }

    button.style.fontSize = "75%";

    if (admin) {// add click functions
        let clickTimer: NodeJS.Timeout;
        const clickDelay = 256;

        button.onclick = () => {
            clearTimeout(clickTimer);
            clickTimer = setTimeout(() => {
                button.classList.toggle("warn", clicker());
            }, clickDelay);
        }
        button.ondblclick = () => {
            clearTimeout(clickTimer);
            dblclicker();
        }
    }

    return button;

}