export default function fetchElement<T extends HTMLElement>(id: string) {
    const element = document.getElementById(id);
    if (!element) {
        throw new Error(`null element ${id}`);
    }
    return element as T;
}