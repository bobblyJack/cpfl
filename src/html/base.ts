import CPFL from "..";
import { HeadPage } from "./main";
import { FootPage } from "./section";
import { NavControl } from "./nav";

/**
 * Base Page Objects
 */
export abstract class BaseHTML {
    private static _head: HeadPage; // current main page
    private static _feet: FootPage[]; // current sections
    public static get display() {
        return {
            get head(): HeadPage {
                if (!BaseHTML._head) {
                    throw new Error('null head');
                }
                return BaseHTML._head;
            },
            set head(page: HeadPage) { // WIP: page navigation
                page.app.title = page.title;
                page.app.main.replaceWith(page.main);
                page.app.fnav.replaceWith(page.fnav);
                BaseHTML._head = page;
            },
            get feet(): FootPage[] {
                if (!BaseHTML._feet || !BaseHTML._feet.length) {
                    throw new Error('null feet');
                }
                return BaseHTML._feet;
            },
            set feet(feet: FootPage[]) { // TBD: subpage rendering
                BaseHTML._feet = feet;
            }
        }
    }

    public readonly key: string;
    public label: string = "";
    public title: string = "";
    public nav?: NavControl;
    public main?: HTMLElement;
    
    constructor(key: string) {
        this.key = key;
    }

    public get app(): CPFL { // fetch app context
        return CPFL.app;
    }

    public render() { // WIP: nav exposed browsing
        if (this instanceof HeadPage) {
            BaseHTML.display.head = this;
        } else if (this instanceof FootPage) {
            BaseHTML.display.feet = [this];
        }
    }

}
