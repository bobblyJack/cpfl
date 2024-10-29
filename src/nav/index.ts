import './main.css';
import './header.css';
import { createIcon } from '../icons';

export class NavButton {
    private static _i: number = 0;
    private static _root: HTMLElement;
    public static get root() {
        if (!this._root) {
            const nav = document.createElement('nav');
            nav.id = 'app-nav';
            this._root = nav;
        }
        return this._root;
    }

    private i: number;
    private button: HTMLButtonElement;
    private action: () => any;
    public constructor(i: number, icon: string, action: () => any) {
        if (NavButton._i >= i) {
            throw new Error('nav button indexing error');
        }

        this.i = i;
        this.action = action;
        this.button = document.createElement('button');
        this.button.id = `nav-button-${this.i}`;
        this.button.onclick = this.action;

        const svg = createIcon(icon);
        this.button.appendChild(svg);

        NavButton.root.appendChild(this.button);
        NavButton._i++;
    }

    

    public async activate() {
        this.button.onclick = null;
        this.button.classList.add("active");
    }

    public async deactivate() {
        this.button.onclick = this.action;
        this.button.classList.remove("active");
    }

    public async flag(force?: boolean) {
        this.button.classList.toggle("warn", force);
    }

    public async error(force?: boolean) {
        this.button.classList.toggle("error", force);
    }
}
