export function addElement(name: string, type: keyof HTMLElementTagNameMap) {
    const element = document.createElement(type);
    element.id = name;
    document.body.appendChild(element);
    return element;
}