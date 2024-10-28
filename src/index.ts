import { getEnv } from './env';
import { AuthUser } from './auth';
import { BrowserApp } from './browser';
import { MobileApp } from './mobile';
import { TaskpaneApp } from './taskpane';

document.addEventListener('DOMContentLoaded', () => { // WIP: timing handler
    console.log('DOM Content Ready');
}) 

let appReady = false;

try { // loading page
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

            if (info.host === null) { // WIP: out-of-office support
                throw new Error('out-of-office experience unsupported');
                CPFL.app = new BrowserApp(page);
    
            } else {
                switch (info.platform) {
                    case Office.PlatformType.Android:
                    case Office.PlatformType.iOS: {
                        // WIP: mobile support
                        throw new Error('mobile platform unsupported');
                        CPFL.app = new MobileApp(page);
                        break;
                    }
                    case Office.PlatformType.Mac: {
                        // WIP: mac support
                        throw new Error('apple platform unsupported');
                    }
                    default: {
                        CPFL.app = new TaskpaneApp(page);
                    }
                }
            }
        }

        return CPFL.app;
    }
    
    protected constructor(page: string) {

        this._user = AuthUser.login().then(user => { // login and cache user config
            this._user = Promise.resolve(user);
            return this._user;
        });

        if (page) { // prep for init render
            this.hash = "";
        }

        window.onhashchange = this.display; // set event listener
        this.hash = page || "/hub"; // render init page

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
        let path = window.location.hash;
        path = path.slice(1) // trim leading #
        return path;
    }
    public set hash(path: string) {
        window.location.hash = path;
    }

    
    public async display(ev: HashChangeEvent) {
        // public facing rendering
        return this.render
    }

    protected async render(ev?: HashChangeEvent) {
        // mode-specific html display
        // extend in subclasses to do stuff like:
        // store old url
        // check storage for new url
        // render new url 
        
    }

    

}