import CPFL from '..';
import { NavControl } from './nav';
import { HubPage } from './hub';
import { MtrPage } from './mtr';
import { BalPage } from './bal';
import { LibPage } from './lib';
import { UsrPage } from './usr';

/**
 * Page Objects
 * @wip content and caching
 * @wip check-out-check-in
 */
export abstract class PageHTML {

    /* static html elements */
    public static readonly header = document.getElementById('app-header') as HTMLElement;
    public static readonly title = document.getElementById('header-title') as HTMLHeadingElement;
    public static readonly nav = document.getElementById('app-nav') as HTMLElement;
    public static readonly main = document.getElementById('app-main') as HTMLElement;
    public static readonly footer = document.getElementById('app-footer') as HTMLElement;

    private static index: Map<string, PageHTML>; // page map
    public static async init(app: CPFL) {

        const Pages: (new () => PageHTML)[] = [ // default pages
            HubPage, 
            MtrPage, 
            BalPage
        ];
        if (app.mode === 'taskpane') { // conditional page
            Pages.push(LibPage);
        }
        Pages.push(UsrPage); // appended default page

        const pages: [string, PageHTML][] = Pages.map(Page => {
            const page = new Page();
            return [page.key, page];
        }); // instance pages and return iterator

        PageHTML.index = new Map(pages); // create index

        app.display = "hub"; // initiate display
    }

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

    public readonly app: CPFL;
    public readonly key: string;
    public readonly title: string;
    public readonly nav: NavControl;
    public constructor( // page construction
        key: string,
        title: string,
        icon: string
    ) { 
        this.app = CPFL.app;
        this.key = key;
        this.title = title;
        this.nav = new NavControl(this, icon);
    }

    public async close(): Promise<void> { // base page exit
        console.log('closing', this.key);
        PageHTML.title.textContent = "";
        this.nav.deactivate();
    }

    public async open(): Promise<this> { // base page entrance
        console.log('opening', this.key);
        this.nav.activate();
        return this;
    }

}

/* SUBCLASS TEMPLATE

import { PageHTML } from "..";

export class {KEY}Page extends PageHTML {
    
    constructor() {
        super({KEY}, {TITLE}, {ICON});
    }

    async open() {
        // subclass open script here
        return super.open();
    }

    async close() {
        // subclass close script here
        return super.close();
    }

}

*/