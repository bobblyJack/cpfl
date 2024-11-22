import { PageHTML } from ".";
import { NavControl } from "./nav";

/**
 * sub pages organised via sections
 * hidden by default and activated on page load
 * multiple can be loaded depending on screen size for browser mode
 * footer nav buttons are shown for each sub not displayed
 * THIS is where the index of elements needs to go, really.
 * and the page itself needs to have an index of these
 */
export class SubPage {
    readonly parent: PageHTML;
    readonly key: string;
    readonly main: HTMLElement;
    readonly nav: NavControl;
    readonly elements: Map<string, HTMLElement>;
    public constructor(parent: PageHTML, key: string) {
        this.parent = parent;
        this.key = key;
        this.main = document.createElement('section');
        this.nav = new NavControl(this);
        this.elements = new Map();
    }

    public get titleExt(): string {
        switch (this.parent.key) {
            case "hub": 
            case "act":
            case "bal":
            case "lib":
            case "usr":
            default: return this.parent.titleExt; //placeholder
        }
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

    public render() {
        // display this.
    }


}