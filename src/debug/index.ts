import { clicker } from "./click";
import { doubleClicker } from "./toggle";

// get it? it's a debugger because the bird eats the bugs.
export function initBird(location: HTMLElement) {

    const icon = location.querySelector('iconify-icon');
    if (!icon) {
        throw new Error('bird has flown away.');
    }

    const button = document.createElement('button');
    icon.replaceWith(button);
    button.appendChild(icon);

    let clickTimer: NodeJS.Timeout;
    const clickDelay = 256;

    button.onclick = () => {
        clearTimeout(clickTimer);
        clickTimer = setTimeout(clicker, clickDelay);
    }
    button.ondblclick = () => {
        clearTimeout(clickTimer);
        doubleClicker(button);
    }   
        
    return button;

}