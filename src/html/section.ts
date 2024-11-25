import { BaseHTML } from "./base";
import { HeadPage } from "./main";
import { NavControl } from "./nav";

export class FootPage extends BaseHTML {

    public readonly head: HeadPage;
    public readonly main: HTMLElement;
    public readonly nav: NavControl;
    public constructor(key: string, head: HeadPage) {
        super(key);
        this.head = head;

        this.main = document.createElement('section');
        this.main.classList.add(this.key);

        this.nav = new NavControl(this);
    }

    private index: Map<string, HTMLElement> = new Map(); // child index

    public get<T extends HTMLElement>(key: string, tag?: keyof HTMLElementTagNameMap): T {
        if (tag) {
            key = `${tag}-${key}`;
        }
        const element = this.index.get(key);
        if (!element) {
            throw new Error(`can't get ${key} on ${this.key}`); 
        }
        return element as T;
    }

    public set<T extends HTMLElement>(key: string, element: T): T;
    public set<T extends HTMLElement>(key: string, tag: keyof HTMLElementTagNameMap): T;
    public set<T extends HTMLElement>(
        input: string, 
        element: HTMLElement | keyof HTMLElementTagNameMap
    ): T {    
        if (!(element instanceof HTMLElement)) {
            element = document.createElement(element);
        }
        this.index.set(input, element);
        return element as T;
    }

}