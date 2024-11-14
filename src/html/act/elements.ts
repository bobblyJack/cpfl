import { PageHTML } from "..";
import { ActiveMatter } from "./matter";

export default function (this: PageHTML, key: string): HTMLElement {
    switch (key) { // div containers
        case "main-0":
        case "footer-0":
        case "main-1":
        case "footer-1":
            return document.createElement('div');
    }

    let text: string;
    let parent: string | HTMLElement;
    let clicker: (() => any) | null = null;
    switch (key) { // buttons
        case "button-new":
            text = "Create Matter";
            parent = "footer-0";
            break;
        case "button-import":
            text = "Import Matter";
            parent = "footer-0";
            clicker = ActiveMatter.import;
            break;
        case "button-clear":
            text = "Close Matter";
            parent = "footer-id";
            clicker = () => {
                ActiveMatter.current = null;
            }
            break;
        case "button-test": 
            text = "Test Print";
            parent = "main-1";
            clicker = ActiveMatter.printTest;
            break;
        default: throw new Error(`${key} invalid`);
    }

    const button = document.createElement("button");
    button.textContent = text;

    if (clicker) {
        button.onclick = clicker;
    } else {
        button.onclick = () => {console.log('blank clicker')};
    }

    if (typeof parent === 'string') {
        parent = this.get(parent);
    }
    parent.appendChild(button);
    return button;
    
}