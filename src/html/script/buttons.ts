import { getElement } from "..";

class Button {
    constructor(id: string) {
        this.button = getElement(id);
    }
    button: HTMLElement;
    onClick<T>(listener: () => T) {
        return this.button.addEventListener("click", listener);
    }
}

export const run = new Button('run-button');