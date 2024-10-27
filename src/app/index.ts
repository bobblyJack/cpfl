import { getEnv } from '../env';
import { AuthUser } from '../auth';

const supportedPlatforms = [ // WIP: mobile support
    Office.PlatformType.PC,
    Office.PlatformType.OfficeOnline,
    Office.PlatformType.Universal
]

type OfficeContext = { // WIP: null handler
    host: Office.HostType | null;
    platform: Office.PlatformType | null;
}

export default class CPFL {

    public static debug: boolean = false; // toggle debug mode
    
    private static instance: CPFL;
    public static async start(info?: OfficeContext): Promise<CPFL> {

        let restart: boolean = false; // restart switch
        if (!info) {
            restart = true;
            if (this.debug) {
                await AuthUser.logout(); // clear msal cache
            }
            info = {
                host: Office.context.host,
                platform: Office.context.platform
            }
        }
        
        if (!this.instance || restart) {
            this.instance = new this(info);
        }

        return this.instance;
    }
    
    private constructor(info: OfficeContext) {
        if (info.platform && supportedPlatforms.includes(info.platform)) {
            console.log(`Starting Taskpane on ${info.host}`);

            this._user = AuthUser.login().then(user => { // login and cache user config
                this._user = Promise.resolve(user);
                return this._user;
            });

            // WIP: make sure events aren't getting doubled up
            window.onload = () => this.hash; // WIP: dash as empty hash ?
            // in fact, should window.onload be the index start function?
            window.onhashchange = () => this.hash;

        } else {
            throw new Error('Office Platform Error'); // WIP: error handling ui
        }
    }

    public get env() {
        return getEnv(CPFL.debug);
    }

    private _user: Promise<AuthUser>;
    public get user() {
        return this._user;
    }

    /**
     * an html object
     * creating the first page renders the nav bar
     * the nav bar needs to have the OPTIONS for pages
     * but the pages themselves dont need to be instanced until later
     * they just request a page
     * the nav is static to the html class
     * instances of the class are the pages themselves
     * ALSO
     * the html cache should be sessionStorage, not script
     * so, it should interact with that probably
     * OR
     * should this just be handled through hashes ??
     * would need ... an event listener? i guess ?
     * app req would work also ?
     * 
     */
    public get html() {
        return class HTMLPagePlaceholder {}
    }

    /**
     * hash based navigation (with handlers created on instancing)
     */
    public get hash() {
        const path = window.location.hash; // "#/dashboard" "#/balance"
        switch (path) {
            // page specific loads
        }
        return path;
    }

    public set hash(path: string) {
        window.location.hash = path; // change hash to swap page
    }


}