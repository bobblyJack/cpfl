import { BaseHTML } from "./base";
import { HeadPage } from "./main";

export class FootPage extends BaseHTML {

    /**
     * max displayed page sections
     * @tbd calculate this
     */
    protected static _size: number = 1;

    public readonly head: HeadPage;
    public readonly main: HTMLElement = document.createElement('section');
    public readonly index: Map<string, HTMLElement> = new Map();
    public constructor(key: FootKey, head: HeadPage) {
        if (!head.key.includes(key)) {
            console.error('invalid section mapped', key, head);
        }
        super(key);
        this.head = head;
        this.main.className = this.section;
        this.main.hidden = true;
        this.head.main.appendChild(this.main);
        this.head.fnav.appendChild(this.nav.button);
    }

    /**
     * slice off headkey from footkey
     */
    public get section(): string {
        return this.key.slice(this.key.indexOf("_") + 1);
    }

    /**
     * fetch label from labeller
     */
    public get label(): string {
        if (this.head.labeller) {
            return this.head.labeller(this.section);
        }
        return this.section;
    }

    /**
     * nav exposed browsing
     * @wip does not call super.render
     * @wip proper order handling
     */
    public render(): void {
        const currentSubs = BaseHTML.display.feet;
        while (currentSubs.length >= FootPage._size) {
            const oldFoot = currentSubs.shift();
            if (oldFoot) {
                oldFoot.nav.button.removeAttribute('disabled');
                oldFoot.main.hidden = true;
            }
        }
        this.main.removeAttribute('hidden');
    }

    /**
     * get child element of section
     */
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

    /**
     * set and return child element
     * @param key child reference
     * @param element html element
     */
    public set<T extends HTMLElement>(key: string, element: T): T;
    /**
     * set, construct, and return child element
     * @param key child reference
     * @param tag html element tag name
     */
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