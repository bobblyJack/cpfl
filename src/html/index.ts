import CPFL from '..';
import createNav from './nav';
import initAct from './act';
import initBal from './bal';
import initLib from './lib';
import initUsr from './usr';

/**
 * Page Objects
 * @wip check-out-check-in
 */
export class PageHTML {

    public static get header(): HTMLElement {
        return getStaticElement("header", this.nav);
    }
    public static get nav(): HTMLElement {
        return getStaticElement("nav", this.main);
    }
    public static get main(): HTMLElement {
        return getStaticElement("main", this.footer);
    }
    public static get footer(): HTMLElement {
        return getStaticElement("footer", null);
    }

    private static _display: PageHTML; // current display
    public static get display() {
        if (!this._display) {
            throw new Error('display not set');
        }
        return this._display;
    }
    public static set display(page: PageHTML) {
        if (this._display) {
            this._display.nav.removeAttribute("disabled");
        }
        this._display = page.render();
    }

    private static index: Map<string, PageHTML> = new Map(); // page map
    public static get(): PageHTML; // get current page
    public static get(key: string): PageHTML; // get specific page
    public static get(all: []): PageHTML[]; // get page collection
    public static get(keys: string[]): PageHTML[]; // get specific pages
    public static get(req?: string | string[]): PageHTML | PageHTML[] {
        if (Array.isArray(req)) {
            if (!req.length) {
                return Array.from(PageHTML.index.values());
            }
            const pages: PageHTML[] = []
            for (const key of req) {
                try {
                    pages.push(PageHTML.get(key));
                } catch (err) {
                    console.error(err);
                }
            }
            return pages;
        } else if (req) {
            const page = PageHTML.index.get(req);
            if (!page) {
                throw new Error(`invalid get request: ${req}`);
            }
            return page;
        }
        return this.display;
    }

    public readonly key: string;
    public constructor(key: string) { // page construction
        this.key = key;
        PageHTML.index.set(this.key, this);
        switch (this.key) {
            case "hub": {
                this.titleExt = "Dashboard";
                this.titleInt = `Welcome ${this.app.user.name.given}`;
                break;
            }
            case "act": {
                initAct(this);
                break;
            }
            case "bal": {
                initBal(this);
                break;
            }
            case "lib": {
                initLib(this);
                break;
            }
            case "usr": {
                initUsr(this);
                break;
            }
            default: {
                console.log('default page creation used');
                const pages = PageHTML.get([]);
                this.titles = "Page #" + pages.length;
            }
        }
    }

    public get app(): CPFL { // fetch app context
        return CPFL.app;
    }

    public titleInt: string = ""; // interior title
    public titleExt: string = ""; // exterior title
    public set titles(text: string) {
        this.titleInt = text;
        this.titleExt = text;
    }

    private index: Map<string, HTMLElement> = new Map(); // page element map
    public get<T extends HTMLElement>(tag: keyof HTMLElementTagNameMap, id: string = "") {
        let key: string = tag;
        if (id) {
            key += `-${id}`;
        }
        let element = this.index.get(key);
        if (!element) {
            throw new Error(`element ${key} not set`);
        }
        return element as T;
    }
    public set<T extends HTMLElement>(tag: keyof HTMLElementTagNameMap, id: string = "", element?: T) {
        let key: string = tag;
        if (id) {
            key += `-${id}`;
        }
        if (!element) {
            element = document.createElement(tag) as T;
        }
        if (this.index.has(key)) {
            console.log('overwriting element', this, tag, id);
        }
        this.index.set(key, element);
        return element;
    }

    public get nav(): HTMLButtonElement { // navigation button
        try {
            return this.get('button', 'nav');
        } catch {
            return this.set('button', 'nav', createNav(this));
        }
    }
    public get main(): HTMLElement { // main content container
        try {
            return this.get('div', 'main');
        } catch {
            return this.set('div', 'main');
        }
    }
    public get footer(): HTMLElement { // footer container
        try {
            return this.get('div', 'footer');
        } catch {
            return this.set('div', 'footer');
        }
    }
    
    private render(): this { // simple page rendering
        for (const page of PageHTML.get([])) {
            page.nav.disabled = page.key === this.key;
        }
        PageHTML.header.textContent = this.titleInt;
        PageHTML.nav.hidden = this.key === 'hub';
        PageHTML.main.className = this.key;
        PageHTML.main.replaceChildren(this.main);
        PageHTML.footer.replaceChildren(this.footer);
        return this;
    }

}

function getStaticElement(tag: keyof HTMLElementTagNameMap, before: HTMLElement | null) {
    const id = `app-${tag}`;
    let element = document.getElementById(id);
    if (!element) {
        element = document.createElement(tag);
        element.id = id;
        if (!before) {
            document.body.appendChild(element);
        } else {
            document.body.insertBefore(element, before);
        }
    }
    return element;
}