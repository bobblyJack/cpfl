import { getEnv } from './env';
import { AuthUser } from './auth';
import { setStyles } from './styles';
import { PageHTML } from './pages';

document.addEventListener('DOMContentLoaded', () => { // WIP: timing handler
    console.log('DOM Content Ready');
}) 


let appReady = false; // loading page
try { 
    const main = document.getElementById("app-main");
    let i = 0;
    if (!main) {
        throw new Error('DOM null error');
    }
    const loader = setInterval(() => {
        if (appReady) {
            clearInterval(loader);
        } else {
            i++;
            console.log(`${i} mississippi`);
            main.innerText += ".";
        }
    }, 1000);
} catch (err) {
    console.error(err);
}

Office.onReady((info) => {
    console.log('Office JS Ready');
    CPFL.start(info).then((app) => {
        appReady = true;
        
    });
});

const supportedHosts = [
    Office.HostType.Word,
    null, // (OoO browser)
    // WIP: Office.HostType.Outlook,
    // WIP: Office.HostType.Excel
]

export default class CPFL {

    public static debug: boolean = false; // toggle debug mode
    
    private static app: CPFL;
    public static async start(info?: {
        host: Office.HostType | null;
        platform: Office.PlatformType | null;
    }): Promise<CPFL> {

        let restart: boolean = false; // restart switch
        if (!info) {
            restart = true;
            if (CPFL.debug) {
                await AuthUser.logout(); // clear msal cache
            }
            info = {
                host: Office.context.host,
                platform: Office.context.platform
            }
        }
        
        if (!CPFL.app || restart) {

            if (supportedHosts.includes(info.host)) {
                console.log(`Starting Taskpane ${info.host ? "on " + info.host : ""}`);
            } else {
                throw new Error('Office Host Error');
            }

            const page = window.location.hash.slice(1); // get initial page
            // WIP: per-platform supported page types references

            let mode: AppMode;
            if (info.host === null) {
                mode = 'browser';
                throw new Error('out-of-office experience unsupported'); // WIP: out-of-office support
    
            } else {
                switch (info.platform) {
                    case Office.PlatformType.Android:
                    case Office.PlatformType.iOS: {
                        mode = 'mobile';
                        throw new Error('mobile platform unsupported'); // WIP: mobile support
                        break;
                    }
                    case Office.PlatformType.Mac: {
                        throw new Error('apple platform unsupported'); // WIP: mac support
                    }
                    default: {
                        mode = 'taskpane';
                    }
                }
            }

            CPFL.app = new this(mode, page);
        }

        return CPFL.app;
    }
    
    protected constructor(mode: AppMode, page: string) {

        setStyles(mode); // apply specific css

        this._user = AuthUser.login().then(user => { // login and cache user config
            this._user = Promise.resolve(user);
            return this._user;
        });

        
        // WIP: init nav, then
        window.onhashchange = this.display; // set event listener

        this.current = new PageHTML(this, page); // render page

    }

    public get env() {
        return getEnv(CPFL.debug);
    }

    private _user: Promise<AuthUser>;
    public get user() {
        return this._user;
    }

    /**
     * hash path navigation
     */
    public get hash() {
        return window.location.hash.slice(1);
    }
    public set hash(path: string) {
        window.location.hash = path;
    }

    private current: PageHTML; // current page context
    private async display(ev: HashChangeEvent) { // WIP: event listener exposed html rendering

        const env = await this.env;

        const prev = new URL(ev.oldURL);
        if (prev.hash) {
            const oldKey = env.id + prev.hash;
            const oldValue = JSON.stringify(this.current);
            sessionStorage.setItem(oldKey, oldValue);
        }

        const next = new URL(ev.newURL);

        const newKey = env.id + next.hash;
        const newValue = sessionStorage.getItem(newKey);

        this.current = new PageHTML(this, next.hash, newValue);

    }

    

    

}