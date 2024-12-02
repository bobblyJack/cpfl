import './global.css';
import './themes';
import * as env from './env';
import * as MSAL from './msal';
import * as auth from './graph/fetch';
import body from './static.html';
import debug from './debug';

document.addEventListener('DOMContentLoaded', () => { // timing handler
    Office.onReady((info) => {
        try {
            CPFL.start(info);
        } catch (err) {
            console.error(err);
        }
    });
});

export default class CPFL {

    private static supports = [ // host options
        Office.HostType.Word,
        null, // (OoO browser)
        // TBD: Office.HostType.Outlook,
        // TBD: Office.HostType.Excel
    ]
    
    private static _app: CPFL;
    /**
     * hard get app instance
     */
    public static get app(): CPFL {
        if (!this._app) {
            throw new Error('app not ready');
        }
        return this._app;
    }
    /**
     * app starter
     * @param info from office js
     */
    public static async start(info?: {
        host: Office.HostType | null;
        platform: Office.PlatformType | null;
    }): Promise<CPFL> {

        let restart: boolean = false; // restart switch
        if (!info) {
            restart = true;
            info = {
                host: Office.context.host,
                platform: Office.context.platform
            }
        }
        
        if (!CPFL._app || restart) { // check app context

            console.log(info);
            if (!CPFL.supports.includes(info.host)) {
                throw new Error('Office Host Error');
            }

            let mode: AppMode;
            if (info.host === null) { // WIP: out-of-office support
                mode = 'browser';
    
            } else {
                switch (info.platform) {
                    case Office.PlatformType.Android:
                    case Office.PlatformType.iOS: {
                        mode = 'mobile';
                        throw new Error('mobile platform unsupported'); // TBD: mobile support
                    }
                    default: {
                        mode = 'taskpane';
                    }
                }
            }

            // log on. WIP
            // TBD make use of login_hint
            // probably need to move all this to a user module.
            // user specific config could be cloud stored.
            const config = await env.get(restart);
            await MSAL.set(config.id, config.tenant, restart);
            const auth = await MSAL.get();
            const claims = auth.idTokenClaims as Record<string, string>;
            console.log('WIP: change admin check', claims); // WIP
            const user: AppUser = {
                fname: claims["family_name"],
                gnames: claims["given_name"],
                email: claims["email"],
                theme: "light",
                admin: claims["gnames"] === "Lucas" //placeholder
            }
            
            CPFL._app = new CPFL(mode, user); // create app instance
            debug.log('app restarted in debug mode');
            
        }

        return CPFL._app;

    }

    public readonly mode: AppMode;
    public readonly user: AppUser; // WIP
    public readonly debug: AppDebug = debug;
    private constructor(mode: AppMode, user: AppUser) { // app construction
        
        this.mode = mode;
        this.user = user;

        document.body.classList.add(this.mode, this.user.theme); // apply targeted css
        document.body.innerHTML = body; // set static elements

    }

    /**
     * local tenant environment configuration
     */
    public async env(config?: EnvConfig): Promise<EnvConfig> {
        const refresh = this.debug.status;
        if (config && !refresh) {
            await env.set(config);
        }
        return env.get(refresh);
    }

    /**
     * fetch access token
     */
    public async access() {
        const msal = await MSAL.get();
        return msal.accessToken;
    }

    /**
     * auth user logout WIP
     */
    public async logout() {
        const msal = await MSAL.set();
        return msal.logoutPopup;
    }

    /**
     * header h1 title text
     */
    public get title(): string {
        return document.body.querySelector('header h1')?.textContent || "";
    }
    public set title(text: string) {
        const title = document.body.querySelector('header h1');
        if (title) {
            title.textContent = text;
        }
        this.debug.log('setting app title', title, text);
    }

    /* other static elements */
    public get hnav() {
        return document.body.querySelector('header nav') as HTMLElement;
    }
    public get main() {
        return document.body.querySelector('main') as HTMLElement;
    } 
    public get fnav() {
        return document.body.querySelector('footer nav') as HTMLElement;
    }

}