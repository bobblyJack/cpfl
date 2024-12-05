import './global.css';
import './themes';
import * as env from './env';
import * as MSAL from './msal';
import body from './static.html';
import html from './html';
import debug from './debug';
import {AppUser} from './users';

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

            const config = await env.get(restart);
            await MSAL.set(config.id, config.tenant, restart);
            CPFL._app = new CPFL(mode); // create app instance
            debug.log('app restarted in debug mode');
            
        }

        return CPFL._app;

    }

    public readonly mode: AppMode;
    public readonly debug: AppDebug = debug;
    private constructor(mode: AppMode) { // app construction
        this.mode = mode; // set app mode
        AppUser.login().then(user => { // authenticate user
            document.body.classList.add(this.mode, user.theme); // apply targeted css
            document.body.innerHTML = body; // set static elements
            html.init();
            // WIP: init HTML
        });
    }

    /**
     * local tenant environment configuration
     */
    public async env(update?: Partial<EnvConfig>): Promise<EnvConfig> {
        const refresh = this.debug.status;
        const config = await env.get(refresh);
        if (!update) {
            return config;
        }
        const updated = {
            ...config,
            ...update
        }   
        env.set(updated);
        return updated;
    }

    /**
     * fetch access token
     */
    public async access() {
        const msal = await MSAL.get();
        return msal.accessToken;
    }

    /**
     * active user context
     */
    public get user(): AppUser {
        return AppUser.current;
    }

    /**
     * html page search
     */
    public get html() {
        return html.get;
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