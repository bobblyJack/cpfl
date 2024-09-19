import './app.html';
import './styles.css';
import * as errors from './script/errors';
import * as buttons from './script/buttons';

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