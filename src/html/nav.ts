import { IconifyIconHTMLElement } from 'iconify-icon';
import { PageHTML } from '.';
import { createIconifyIcon } from './icons';

type NavSignal = "active" | "warn" | "error";

export class NavControl {

    public readonly page: PageHTML;
    public readonly button: HTMLButtonElement;
    public readonly icon: IconifyIconHTMLElement;
    public readonly title: HTMLElement;

    public constructor(page: PageHTML, icon: string) {
        this.page = page; 

        this.button = document.createElement("button");
        this.button.id = `nav-${this.page.key}`;

        this.icon = createIconifyIcon(icon);
        this.button.appendChild(this.icon);

        this.title = document.createElement("p");
        this.title.innerText = page.title;
        this.button.appendChild(this.title);

        this.button.onclick = () => PageHTML.current = this.page.key;

        PageHTML.nav.appendChild(this.button);
    }

    public textless(force: boolean = true) {
        this.title.classList.toggle("hidden", force);
    }

    public async switch(on: true): Promise<true>;
    public async switch(off: false): Promise<false>;
    public async switch(signal?: NavSignal): Promise<boolean>;
    public async switch( // button implementation
        flag: boolean | NavSignal = "active", 
        force?: boolean
    ): Promise<boolean> {
        if (typeof flag === 'boolean') {
            force = flag;
            flag = "active";
        } else if (!flag) {
            flag = "active"
        }

        if (flag === "active") { // set activation action
            if (force === true) { // force page on
                this.button.onclick = null;
            } else if (force === false) { // force page off
                this.button.onclick = () => PageHTML.current = this.page.key;
            } else if (this.button.classList.contains(flag)) { // toggle page off
                this.button.onclick = () => PageHTML.current = this.page.key;
            } else { // toggle page on
                this.button.onclick = null;
            }
        }
        
        return this.button.classList.toggle(flag, force); // flip css
        
    }

}