import { BaseHTML } from './base';
import iicon from '../icons';

export class NavControl {
    target: BaseHTML;
    button: HTMLButtonElement;
    iicon: HTMLIconifyElement;
    label: HTMLLabelElement;
    constructor(target: BaseHTML) {
        this.target = target;
        this.button = document.createElement('button');
        this.button.className = this.target.key;
        this.button.onclick = this.target.render;
        this.iicon = iicon.create(this.target.key);
        this.button.appendChild(this.iicon);
        this.label = document.createElement('label');
        this.label.textContent = this.target.label;
        this.button.appendChild(this.label);
    }
}