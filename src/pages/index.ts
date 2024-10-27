import CPFL from '../app';
import { NavButton } from '../nav';

enum PageIndex {
    "Dashboard",
    "Active Matter",
    "Balance Sheet",
    "Precedent Library",
    "User Settings",
}

enum PageIcons {
    home,
    credentials,
    calculation,
    document,
    settings
}

// make these into a map or something that can hold more than one part of data.
// or just construct them and use that as a reference point, duh, dont enumerate at all
// finally, finish the rendering

export default class Page {

    

    public static Index = PageIndex;
    public index: PageIndex;

    private _nav?: NavButton;
    public get nav() {
        if (!this._nav) {
            throw new Error()
        }
        return this._nav;
    }
    

    public constructor(i: PageIndex, app: CPFL) { // WIP
        this.index = i;
        
        this._nav = new NavButton(this.index, "iconstring", () => app.browse(this.index));
        
    }

    public async render() {
        // WIP: display this page
        
        
        
        this.header.render();
        this.main.render();
        this.footer.render();
    }
}

private hub: Promise<Page>;
    private mtr: Promise<Page>;
    private bal: Promise<Page>;
    private lib: Promise<Page>;
    private usr: Promise<Page>;
    

    public async browse(toPage: number): Promise<void>;
    public async browse(i: number) {
        // WIP: cache and queue the browse request
        // WIP: app runs browse(0) when initially ready;

        const env = await this.env;
        const sessionKey = `${env.id}#`;

        sessionStorage.setItem(sessionKey + this.page.index, JSON.stringify(this.page));

        let cache = sessionStorage.getItem(sessionKey + i);

        if (!cache) {
            this.page = new Page(i);
        } else {
            this.page = JSON.parse(cache);
        }

        return this.page.render()
    }

    this.page = new Page(0); // WIP: dashboard creation - welcome message header, nav buttons content, blank footer
            
    private display: Page;