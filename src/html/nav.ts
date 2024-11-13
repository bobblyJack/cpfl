import CPFL from '..';
import { PageHTML } from '.';
import { createIconifyIcon } from './icons';

export class NavControl {
    public readonly page: PageHTML;
    private button: HTMLButtonElement;
    private title: HTMLElement;
    private icon: HTMLIconifyElement;

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
            PageHTML.set(this.page);
        }
        
        PageHTML.nav.appendChild(this.button); // append button
    }

    public get text(): string {
        return this.title.textContent || "";
    }
    public set text(input: string) {
        this.title.textContent = input;
    }

    public disable() {
        this.button.disabled = true;
    }

    public enable() {
        this.button.disabled = false;
    }

    public hide() {
        this.button.hidden = true;
    }

    public show() {
        this.button.hidden = false;
    }

    public flag(signal: "hint" | "warn" = "warn") {
        this.button.classList.add(signal);
    }
    public unflag() {
        this.button.classList.remove("hint");
        this.button.classList.remove("warn");
    }
}