import * as errors from './errors';
import * as buttons from './buttons';

export function getElement(id: string) {
    const element = document.getElementById(id);
    if (!element) {
        throw new Error(`element ${id} missing`);
    }
    return element;
}

export default {
    errors,
    buttons
}