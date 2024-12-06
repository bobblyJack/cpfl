import { BaseHTML } from './base';
import iicon from '../icons';

export class NavControl {
    target: BaseHTML;
    button: HTMLButtonElement;
    iicon: HTMLIconifyElement;
    constructor(target: BaseHTML) {
        this.target = target;
        this.button = document.createElement('button');
        this.button.className = this.target.key;
        this.button.onclick = this.target.render;
        this.iicon = iicon(this.target.key);
        this.button.appendChild(this.iicon);
    }
}