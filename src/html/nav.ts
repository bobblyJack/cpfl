import { BaseHTML } from './base';
import { HeadPage } from './main';
import { FootPage } from './section';
import iicon from '../icons';

export class NavControl {
    target: BaseHTML;
    button: HTMLButtonElement;
    iicon: HTMLIconifyElement;
    label: HTMLLabelElement;
    constructor(target: BaseHTML) {
        this.target = target;
        this.button = document.createElement('button');
        this.button.onclick = this.target.render;
        this.iicon = iicon.create(this.target.key);
        this.button.appendChild(this.iicon);
        this.label = document.createElement('label');
        this.label.textContent = this.target.label;
        this.button.appendChild(this.label);

        if (target instanceof HeadPage) {
            if (target.key === "hub") {
                target.app.hnav.prepend(this.button);
            } else {
                const hub = target.app.html.get("hub");
                const hb = this.button.cloneNode(true) as HTMLButtonElement;
                hb.onclick = this.target.render;
                hub.main.appendChild(hb);
            }
        } else if (target instanceof FootPage) {
            target.head.fnav.appendChild(this.button);
        }

    }

}