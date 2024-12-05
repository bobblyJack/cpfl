import CPFL from "..";
import { HeadPage } from "./main";
import { FootPage } from "./section";
import { NavControl } from "./nav";

/**
 * Base Page Object
 */
export abstract class BaseHTML {
    /**
     * get current display
     */
    public static get display() {
        return {
            get head(): HeadPage | null {
                try {
                    const main = document.body.querySelector('main');
                    if (!main) {
                        return null;
                    }
                    return CPFL.app.html(main.className as PageKey);
                } catch (err) {
                    console.log('no head page', err);
                    return null;
                }
            },
            get feet(): FootPage[] {
                try {
                    if (!this.head) {
                        return []
                    }
                    const currentPage = this.head;
                    const sections = Array.from(currentPage.main.querySelectorAll('section'));
                    const activeSections = sections.filter(section => !section.hasAttribute('hidden'));
                    return activeSections.map((section) => currentPage.get(section.className));
                } catch (err) {
                    console.log('no page feet', err);
                    return []
                }
            }
        }
    }

    public readonly nav: NavControl;
    public constructor(public readonly key: string) {
        this.nav = new NavControl(this);
    }
    
    /**
     * pass app context
     */
    public get app(): CPFL { // pass app context
        return CPFL.app; 
    }

    /**
     * base custom rendering
     */
    public loader?: () => void;

    /**
     * nav exposed browsing
     */
    public render(): void {
        if (this.loader) {
            this.app.debug.log('running page loader', this.key, this.loader);
            this.loader();
        }
    }

    /**
     * check if current
     */
    public get rendered(): boolean {
        if (this instanceof HeadPage) {
            return BaseHTML.display.head === this;
        } else if (this instanceof FootPage) {
            return BaseHTML.display.feet.includes(this);
        } else {
            return false;
        }
    }
}
