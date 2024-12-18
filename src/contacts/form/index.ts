import base from './base.html';

export function contactForm(side: number, type: ContactType, iteration: number = 0): HTMLFormElement {
    if (iteration > 999 || side > 9) {
        throw new Error('contact limits exceeded');
    }
    side = side * 1000;
    const id = type + String(side) + String(iteration);
    const element = document.getElementById(id);
    if (element) {
        console.log('returning existing form', id);
        return element as HTMLFormElement;
    }
    const form = document.createElement('form');
    form.id = id;
    form.innerHTML = base;
    return form;
}