import './nav.css';
import * as buttons from './buttons';

for (const button of Object.values(buttons)) {
    signal(button, "broken");
}

export async function signal(button: HTMLButtonElement, code: "ready" | "empty" | "broken") {
    button.classList.value = code;
}

