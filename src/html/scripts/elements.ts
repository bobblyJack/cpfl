export function addElement(type: keyof HTMLElementTagNameMap, parent?: HTMLElement) {
    const element = document.createElement(type);
    if (parent) {
        parent.appendChild(element);
    } else {
        document.body.appendChild(element);
    }
    return element;
}