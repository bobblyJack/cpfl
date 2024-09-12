import { getElement } from "./elements";
let display = false;

const header = getElement('console-header');
const message = getElement('console-log');

export function log(msg: string) {
    if (!display) {
        header.textContent = "Console Log"
        display = true;
    }
    message.textContent = msg;
}