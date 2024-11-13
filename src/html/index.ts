import CPFL from '..';
import { NavControl } from './nav';
import { initHub } from './hub';

/**
 * Page Objects
 * @wip extendable properties/methods without defining new classes for each page
 * @wip content and caching
 * @wip check-out-check-in
 */
export class PageHTML {

    private static getStaticElement(tag: string) {
        try {
            const element = document.body.querySelector(tag);
            if (!element) {
                throw tag;
            }
            return element as HTMLElement;
        } catch (err) {
            if (err === tag) {
                throw new Error(`null static html ${tag} element`);
            }
            console.error('unknown issue getting static html element')
            throw err;
        }
    }

    // static html elements
    public static get header() {
        return this.getStaticElement("header");
    }
    public static get nav() {
        return this.getStaticElement("nav");
    }
    public static get main() {
        return this.getStaticElement("main");
    }
    public static get footer() {
        return this.getStaticElement("footer");
    }

    // page title
    public static get title() {
        return this.header.textContent || "";
    }
    public static set title(text: string) {
        let e = this.header.querySelector('h1');
        if (!e) {
            console.error('null page title', this.header);
            e = document.createElement("h1");
            e.id = "page-title";
            this.header.prepend(e);
        }
        e.textContent = text;
    }

    private static index: Map<string, PageHTML> = new Map(); // page map
    private static display: PageHTML | null = null; // current display

    public static get(): PageHTML; // get current display
    public static get(key: string): PageHTML; // get specific page
    public static get(keys: string[]): PageHTML[]; // get page collection
    public static get(req?: string | string[]): PageHTML | PageHTML[] | Promise<PageHTML> {

        if (Array.isArray(req)) {
            if (!req.length) { // req [] returns all pages
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

        } else {
            if (!this.display) {
                throw new Error('display not set');
            }
            return this.display;
        }
    }

    public static async set(page: PageHTML) { // basic navigation
        console.log('attempting nav');
        if (this.display) {
            await this.display.close();
        }
        this.display = await page.open();
    }

    public readonly key: string;
    public title: string = "";
    public content?: HTMLElement;
    public tray?: HTMLElement;
    public constructor(key: string) { // page construction
        this.key = key;
        PageHTML.index.set(this.key, this);
        this.init();
    }

    public get init() {
        if (!CPFL.app.keys.includes(this.key)) {
            throw new Error(`invalid page creation: ${this.key}`);
        }

        switch (this.key) { 
            case "hub": 
                return initHub;
            default: return () => {
                console.log('default page creation used');
                const pages = PageHTML.get([]);
                this.title = "Page #" + pages.length;
                this.nav = "template"
            }
        }
    }

    public get app(): CPFL { // get app context
        return CPFL.app;
    }
    
    private _nav?: NavControl; // navigation element
    public get nav(): NavControl {
        if (!this._nav) {
            console.error('nav control unavailable', this.key);
            this._nav = new NavControl(this, 'error');
        }
        return this._nav;
    }
    public set nav(icon: string) {
        this._nav = new NavControl(this, icon);
    }

    public closer?: (this: PageHTML) => Promise<void>; 
    public async close(): Promise<void> { // base page exit
        console.log('closing', this.key);
        PageHTML.title = "";

        if (this.content) {
            PageHTML.main.removeChild(this.content);
        }
        if (this.tray) {
            PageHTML.footer.removeChild(this.tray);
        }

        if (this.closer) {
            await this.closer();
        }

        this.nav.enable();
    }
    
    public opener?: (this: PageHTML) => Promise<void>; 
    public async open(): Promise<this> { // base page entrance
        console.log('opening', this.key);
        this.nav.disable();
        
        if (this.opener) {
            await this.opener();
        }

        if (this.content) {
            PageHTML.main.appendChild(this.content);
        }
        if (this.tray) {
            PageHTML.footer.appendChild(this.tray);
        }
        
        return this;
    }

}