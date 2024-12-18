import html from ".";
import { BaseHTML } from "./base";
import { FootPage } from "./section";

export class HeadPage extends BaseHTML {
      
    private _index: Map<FootKey, FootPage> = new Map();
    public readonly main: HTMLElement = document.createElement('main');
    public readonly fnav: HTMLElement = document.createElement('nav');
    public labeller?: (section: string) => string;
    private _title: string;
    public constructor(key: HeadKey, title?: string) {
        super(key);
        html.set(this);
        this._title = title ? title : this.label;
        this.main.className = this.key;
        this.fnav.className = this.key;
        this.app.hnav.appendChild(this.nav.button);
    }

    /**
     * nav exposed browsing
     */
    public render(): void {
        this.nav.disable();
        BaseHTML.display.head?.nav.enable();
        this.app.title = this.title;
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
        switch (this.key as HeadKey) {
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
        return Array.from(this._index.values());
    }

    /**
     * get specific page section
     */
    public get(key: FootKey): FootPage {
        const page = this._index.get(key);
        if (!page) {
            throw new Error(`can't find subsection ${key} on ${this.key}`);
        }
        return page;
    }

    /**
     * set and return specific page section
     */
    public set(page: FootKey | FootPage): FootPage {
        if (typeof page === 'string') {
            page = new FootPage(page, this);
        }
        this._index.set(page.key as FootKey, page);
        return page;
    }

}