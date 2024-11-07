import CPFL from '..';
import { PageHTML } from '.';
import { createIconifyIcon } from './icons';
import { IconifyIconHTMLElement } from 'iconify-icon';

export class NavControl {
    public readonly page: PageHTML;
    private button: HTMLButtonElement;
    private title: HTMLElement;
    private icon: IconifyIconHTMLElement;

    public constructor(page: PageHTML, icon: string) {
        this.page = page;

        this.button = document.createElement("button"); // create button
        this.button.id = `nav-${page.key}`;
        
        this.icon = createIconifyIcon(icon); // create button icon
        this.button.appendChild(this.icon);

        this.title = document.createElement("div"); // create button text block
        this.title.textContent = page.title;
        this.button.appendChild(this.title);

        this.button.onclick = () => { // set click behaviour
            if (!this.button.classList.contains("active")) {
                CPFL.app.display = this.page.key;
            }
        }
        
        PageHTML.nav.appendChild(this.button); // append button
    }

    public get text(): string {
        return this.title.textContent || "";
    }
    public set text(input: string) {
        this.title.textContent = input;
    }

    public activate() {
        this.button.classList.add("active");
    }

    public deactivate() {
        this.button.classList.remove("active");
    }

    public hide() {
        this.button.classList.add("hidden");
    }

    public show() {
        this.button.classList.remove("hidden");
    }
}