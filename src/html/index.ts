import CPFL from '..';
import createNav from './nav';
import fetchElement from './element';
import './hub.css';
import initAct from './act';
import initBal from './bal';
import initLib from './lib';

enum AppPages {
    "hub" = "Dashboard",
    "act" = "Active Matter",
    "bal" = "Balance Sheet",
    "lib" = "Precedent Library",
    "usr" = "User Settings"
}

/**
 * Page Objects
 */
export class PageHTML {

    /* current display and basic navigation */
    private static _display: PageHTML;
    public static get display() {
        if (!this._display) {
            throw new Error('display not set');
        }
        return this._display;
    }

    public static set display(page: PageHTML) { // page navigation

        page.hnav.disabled = true; // prevent double load

        if (PageHTML._display) { 
            PageHTML._display.hnav.removeAttribute("disabled"); // unlock previous page
            document.body.classList.remove(PageHTML._display.key); // remove old style
        }

        document.body.classList.add(page.key); // load new style
        
        // set new content
        PageHTML.title = page.titleInt;
        PageHTML.main = page.main;
        PageHTML.fnav = page.fnav;

        PageHTML._display = page; // register new page
        
    }

    /* index of pages and search function */
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

    /* app header elements*/
    public static get title(): string { // get page title
        const e = fetchElement('page-title');
        return e.textContent || "";
    }
    public static set title(text: string) { // set page title
        if (text.length) {
            const e = fetchElement('page-title');
            e.textContent = text;
        }
    }
    public static get hnav(): HTMLElement { // get app navigation bar
        return fetchElement("header-nav");
    }

    /* main app container */
    public static set main(content: HTMLDivElement) { // swap main content
        const e = fetchElement('main-container');
        e.replaceChildren(content);
    }

    /* contextual footer bar */
    public static get fnav(): HTMLElement | null { // get page navigation bar
        const e = fetchElement("app-footer");
        return e.querySelector('nav');
    }
    public static set fnav(nav: HTMLElement) { // swap page navigation
        if (this.fnav) {
            this.fnav.replaceWith(nav);
        } else {
            const e = fetchElement("app-footer");
            e.appendChild(nav);
        }
    }

    /* page construction */
    public readonly key: keyof typeof AppPages;
    public titleExt: string; // exterior title
    public titleInt: string; // interior title
    public constructor(key: keyof typeof AppPages, h1?: string) {
        this.key = key;
        this.titleExt = AppPages[key];
        this.titleInt = h1 ? h1 : this.titleExt;
        this.set('button', 'nav', createNav(this));
        this.set('div', 'main');
        this.set('nav', 'footer');
        PageHTML.index.set(this.key, this);
        switch (this.key) {
            case 'hub': break;
            case 'act': {
                initAct(); 
                break;
            }
            case 'bal': {
                initBal(); 
                break;
            }
            case 'lib': {
                initLib(); 
                break;
            }   
            case 'usr': break;
        }
    }

    public get app(): CPFL { // fetch app context
        return CPFL.app;
    }

    private index: Map<string, HTMLElement> = new Map(); // page element map
    public get<T extends HTMLElement>(tag: keyof HTMLElementTagNameMap, id: string) {
        const key: string = `${tag}-${id}`;
        let element = this.index.get(key);
        if (!element) {
            throw new Error(`element ${key} not set`);
        }
        return element as T;
    }
    public set<T extends HTMLElement>(tag: keyof HTMLElementTagNameMap, id: string = "", element?: T) {
        const key: string = `${tag}-${id}`;
        if (!element) {
            element = document.createElement(tag) as T;
        }
        this.index.set(key, element);
        return element;
    }

    public get hnav(): HTMLButtonElement { // app navigation button
        return this.get('button', 'nav');
    }
    public get main(): HTMLDivElement { // main content page
        return this.get('div', 'main');
    }
    public get fnav(): HTMLElement { // page navigation bar
        return this.get('nav', 'footer');
    }
    
}