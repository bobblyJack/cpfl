import { refresh } from "./refresh";

export function getElement(id: string) {
    const element = document.getElementById(id);
    if (!element) {
        throw new Error(`element ${id} ungettable`);
    }
    return element;
}

function getApp() {
    return {
        header: getElement('app-header') as HTMLHeadingElement,
        body: getElement('app-body'),
        console: getElement('app-console') as HTMLDivElement
    };
}
export const app = (() => {
    try {
        return getApp();
    } catch {
        refresh();
        return getApp();
    }
})();

// add a callback in here to that uses an object to apply settings to the element before appending it ?
export function addElement<T extends keyof HTMLElementTagNameMap>(type: T, parent?: HTMLElement) {
    const element = document.createElement(type) as HTMLElementTagNameMap[T];
    if (parent) {
        parent.appendChild(element);
    } else {
        app.body.appendChild(element);
    }
    return element;
}