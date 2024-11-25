import html from ".";
import { BaseHTML } from "./base";
import { FootPage } from "./section";
import { NavControl } from "./nav";

export class HeadPage extends BaseHTML {
    
    public label: string;
    public title: string;
    public readonly nav: NavControl;
    public readonly main: HTMLElement;
    public readonly fnav: HTMLElement;
    public constructor(key: keyof typeof html.keys, int?: string) {
        super(key);
        html.set(this); // map to page index
        this.label = html.keys[key];
        this.title = int ? int : this.label;

        this.nav = new NavControl(this);
        
        this.main = document.createElement('main');
        this.main.classList.add(this.key);

        this.fnav = document.createElement('nav');
    }

    private index: Map<string, FootPage> = new Map(); // section index
    public get(key: string): FootPage {
        const page = this.index.get(key);
        if (!page) {
            throw new Error(`can't find subsection ${key} on ${this.key}`);
        }
        return page;
    }
    public set(page: string | FootPage): FootPage {
        if (typeof page === 'string') {
            page = new FootPage(page, this);
        }
        this.index.set(page.key, page);
        return page;
    }

}