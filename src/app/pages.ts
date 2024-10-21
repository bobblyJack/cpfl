import './page.css';

/* pages:
    dashboard
    active matter
    balance sheet
    precedent library
    user settings
    
    landing page?
    welcome page?
    temp stuff?
*/

export class Page {

    public static get header() {
        return document.getElementById('page-title') as HTMLHeadingElement;
    }
    public static get main() {
        return document.getElementById('page-content') as HTMLElement;
    }
    public static get footer() {
        return document.getElementById('page-nav') as HTMLElement;
    }
    
    private static _context: Page;
    public static get context(): Page {
        return this._context;
    }

    public name: string;
    public rawHTML?: string;
    public constructor(title: string, content?: string) {
        this.name = title;
        this.rawHTML = content;
    }

    public async render() {
        Page.header.innerText = this.name;
        Page.main.innerHTML = this.rawHTML || "";
        Page.footer.innerHTML = "";
        Page._context = this;
    }

}