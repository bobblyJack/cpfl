import CPFL from "..";
import status from "./status";
import restart from "./restart";

// get it? it's a debugger because the bird eats the bugs.
export function initBird() {

    const admin = CPFL.app.user.admin;
    
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
                button.classList.toggle("warn", status(true));
            }, clickDelay);
        }
        button.ondblclick = () => {
            clearTimeout(clickTimer);
            restart();
        }
    }

}