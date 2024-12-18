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
    public constructor(key: FootKey, head: HeadPage) {
        if (!key.includes(head.key)) {
            console.error('invalid section mapped', key, head);
        }
        super(key);
        this.head = head;
        this.main.className = this.section;
        this.hide();
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
     * hide main section
     */
    public hide() {
        this.main.hidden = true;
    }
    /**
     * show main section
     */
    public show() {
        this.main.removeAttribute('hidden');
    }

    /**
     * nav exposed browsing
     * @wip order handling
     */
    public render(): void {
        this.nav.disable();
        const currentSubs = BaseHTML.display.feet;
        while (currentSubs.length >= FootPage._size) {
            const oldFoot = currentSubs.shift();
            if (oldFoot) {
                oldFoot.nav.enable();
                oldFoot.hide();
            }
        }
        this.show();
        super.render();
    }

}