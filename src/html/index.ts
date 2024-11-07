import CPFL from '..';
import {NavControl} from './nav';
import {QueueRequest} from './qreq';

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

    public static get cleanQ(): Promise<void> {
        return QueueRequest.awaitAll();
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

    public async close(): Promise<void> { // exit page
        const display = new QueueRequest(async () => {
            switch (this.key) {

                case 'hub': {
                    PageHTML.index.forEach((page) => {
                        page.nav.text = "";
                    });
                    this.nav.show();
                    break;
                }

            }

            this.nav.deactivate(); 

        });
        return display.result;
    }

    public async open(): Promise<this> { // display html
        const display = new QueueRequest(async () => {

            switch (this.key) {

                case "hub": {
                    PageHTML.title.textContent = `Welcome ${CPFL.app.user.name.given}`;
                    PageHTML.main.appendChild(PageHTML.nav);
                    PageHTML.index.forEach((page) => {
                        page.nav.text = page.title;
                    });
                    this.nav.hide();
                    break;
                } 

                default: {
                    PageHTML.title.textContent = "";
                    PageHTML.header.appendChild(PageHTML.nav);
                }
            }

            this.nav.activate();
            
            return this;

        });
        return display.result;
    }

    
    
}