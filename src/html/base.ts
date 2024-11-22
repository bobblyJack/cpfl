import { NavControl } from "./nav";


/**
 * shared features between head pages + foot pages
 */
abstract class BaseHTML {
    key: string;
    title: string; // interior title
    label: string; // exterior title
    nav: NavControl;
    main: HTMLElement;
    
    constructor(key: string) {
        this.key = key;
    }

    render() {

    }

}

class HeadPage extends BaseHTML {
    index: Map<string, SubPage>;
    get(key: string): SubPage {

    }
    set(key: string, page: SubPage) {

    }

}

class SubPage extends BaseHTML {
    head: HeadPage;
    index: Map<string, HTMLElement>;
    get(tag: keyof HTMLElementTagNameMap, id: string): HTMLElement {

    }
    set(tag: keyof HTMLElementTagNameMap, id: string, element?: HTMLElement) {

    }
}

