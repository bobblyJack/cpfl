import html from ".";
import { BaseHTML } from "./base";
import { FootPage } from "./section";

export class HeadPage extends BaseHTML {
      
    public readonly index: Map<string, FootPage> = new Map();
    public readonly main: HTMLElement = document.createElement('main');
    public readonly fnav: HTMLElement = document.createElement('nav');
    private _title: string;
    public constructor(key: PageKey, title?: string) {
        super(key);
        html.set(this);
        this._title = title ? title : this.label;
        this.main.className = this.key;
        this.app.hnav.appendChild(this.nav.button);
    }

    /**
     * nav exposed browsing
     */
    public render(): void {
        BaseHTML.display.head?.nav.button.removeAttribute('disabled');
        this.app.title = this.title;
        this.nav.button.disabled = true;
        this.app.main.replaceWith(this.main);
        this.app.fnav.replaceWith(this.fnav);
        super.render();
    }

    /**
     * interior title
     */
    public get title(): string {
        return this._title;
    }
    public set title(title: string) {
        if (title && title !== this.title) {
            this._title = title;
        }
        if (this.rendered) {
            this.app.main.title = this.title;
        }
    }

    /**
     * exterior title
     */
    public get label(): string {
        switch (this.key as PageKey) {
            case "hub": return "Dashboard";
            case "act": return "Active Matter";
            case "lib": return "Precedent Library";
            case "bal": return "Balance Sheet";
            case "usr": return "User Settings";
        }
    }

    /**
     * get all page sections
     */
    public get feet(): FootPage[] {
        return Array.from(this.index.values());
    }

    /**
     * get specific page section
     */
    public get(key: string): FootPage {
        const page = this.index.get(key);
        if (!page) {
            throw new Error(`can't find subsection ${key} on ${this.key}`);
        }
        return page;
    }

    /**
     * set and return specific page section
     */
    public set(page: string | FootPage): FootPage {
        if (typeof page === 'string') {
            page = new FootPage(page, this);
        }
        this.index.set(page.key, page);
        return page;
    }

}