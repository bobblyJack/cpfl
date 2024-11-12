import CPFL from '..';
import { NavControl } from './nav';

/**
 * Page Objects
 * @wip extendable properties/methods without defining new classes for each page
 * @wip content and caching
 * @wip check-out-check-in
 */
export class PageHTML {

    // static html elements
    public static get header() {
        return getStaticElement("header");
    }
    public static get nav() {
        return getStaticElement("nav");
    }
    public static get main() {
        return getStaticElement("main");
    }
    public static get footer() {
        return getStaticElement("footer");
    }

    // page title
    public static get title() {
        return this.header.textContent || "";
    }
    public static set title(text: string) {
        const e = this.header.querySelector('h1');
        if (e) {
            e.textContent = text;
        } else {
            console.error('null app title', this.header);
        }
    }

    private static index: Map<string, PageHTML> = new Map(); // page map

    public static get(): PageHTML[];
    public static get(key: string): PageHTML;
    public static get(key?: string): PageHTML | PageHTML[] {
        if (key) { // get specific page
            const page = PageHTML.index.get(key);
            if (!page) {
                throw new Error(`${key} page undefined`);
            }
            return page;
        } else { // get page collection
            const pages = PageHTML.index.values();
            return Array.from(pages);
        }
    }

    public readonly key: string;
    public readonly title: string;
    public readonly nav: NavControl;
    public constructor( // page construction
        key: string,
        title: string,
        icon: string
    ) { 
        this.key = key;
        this.title = title;
        this.nav = new NavControl(this, icon);
        PageHTML.index.set(this.key, this);
    }

    public get app(): CPFL {
        return CPFL.app;
    }

    public closer?: () => Promise<void>; // page exit
    public async close(): Promise<void> {
        console.log('closing', this.key);

        if (this.closer) {
            await this.closer();
        }
        
        PageHTML.title = "";
        this.nav.enable();
    }

    public opener?: () => Promise<void>; // page entrance
    public async open(): Promise<this> {
        console.log('opening', this.key);

        if (this.opener) {
            await this.opener();
        }
        
        this.nav.disable();
        return this;
    }

}





function getStaticElement(tag: "header" | "nav" | "main" | "footer") {
    const e = document.body.querySelector(tag);
    if (!e) {
        throw new Error(`null static html ${tag} element`);
    }
    return e;
}