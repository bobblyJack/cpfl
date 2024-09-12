export * as buttons from './buttons';
export * as console from './console';
export * as errors from './errors';

export function getElement(id: string): HTMLElement {
    const element = document.getElementById(id);
    if (!element) {
        throw new Error(`element ${id} missing`);
    }
    return element;
}