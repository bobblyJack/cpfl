import CPFL from '..';
import { NavControl } from './nav';
import qreq from './qreq';

/**
 * Page Objects
 * @wip content and caching
 * @wip check-out-check-in
 */
export class PageHTML {

    /* static html elements */
    public static readonly header = document.getElementById('app-header') as HTMLElement;
    public static readonly title = document.getElementById('header-title') as HTMLHeadingElement;
    public static readonly nav = document.getElementById('app-nav') as HTMLElement;
    public static readonly main = document.getElementById('app-main') as HTMLElement;
    public static readonly content = document.getElementById('main-content') as HTMLElement;
    public static readonly debugger = document.getElementById('debug-button') as HTMLButtonElement;
    public static readonly footer = document.getElementById('app-footer') as HTMLElement;
    
    private static _current?: PageHTML; // current display
    public static get current(): Promise<PageHTML> { // hub default
        if (!this._current) {
            return PageHTML.get('hub').open();
        }
        return Promise.resolve(this._current);
    }
    public static set current(input: string | PageHTML) { // browse
        let page: PageHTML;
        if (typeof input === 'string') {
            page = PageHTML.get(input);
        } else {
            page = input;
        }
        if (this._current) {
            this._current.close();
        }
        page.open();
    }

    private static readonly index: Map<string, PageHTML> = new Map(); // pages index
    public static get(): PageHTML[];
    public static get(key: string): PageHTML;
    public static get(key?: string): PageHTML | PageHTML[] {
        if (key) { // get specific page
            const page = this.index.get(key);
            if (!page) {
                throw new Error(`${key} page undefined`);
            }
            return page;
        } else { // get page collection
            const pages = this.index.values();
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
        PageHTML.index.set(key, this);
    }

    public async refresh() {
        await this.close();
        return this.open();
    }

    private async close(): Promise<void> { // exit page
        const display = new qreq(async () => {
            switch (this.key) {
                case 'hub': {
                    PageHTML.index.forEach((page) => {
                        page.nav.textless(true);
                    });
                    this.nav.button.classList.remove("hidden");
                    break;
                }
            }

            await this.nav.switch(false);
            PageHTML._current = undefined;

        });
        return display.result;
    }

    private async open(): Promise<this> { // display html
        const display = new qreq(async () => {

            switch (this.key) {
                case "hub": {
                    const user = await CPFL.app?.user;
                    PageHTML.title.innerText = user ? `Welcome ${user.name.given}` : this.title;
                    PageHTML.main.appendChild(PageHTML.nav);
                    PageHTML.index.forEach((page) => {
                        page.nav.textless(false);
                    });
                    this.nav.button.classList.add("hidden");
                    break;
                } 
                default: {
                    PageHTML.title.innerText = "";
                    PageHTML.header.appendChild(PageHTML.nav);
                }
            }

            await this.nav.switch(true);
            PageHTML._current = this;
            return this;

        });
        return display.result;
    }

    
    
}