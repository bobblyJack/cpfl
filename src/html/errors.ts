import { getElement } from "./elements";

const stdout = getElement('stdout');
const stderr = getElement('stderr');

export function toggle() {
    [stdout, stderr].forEach(element => {
        element.classList.toggle('hidden');
    });
}

