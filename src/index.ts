import './global.css';
import './themes';
import body from './static.html';
import html from './html';
import debug from './debug';
import { AuthUser } from './auth';

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
     * app instance
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

            const user = await AuthUser.login(CPFL._app ? CPFL.app.debug.status : false); // login user
            CPFL._app = new CPFL(mode, user); // create app instance
            
        }

        return CPFL._app;

    }

    public readonly mode: AppMode;
    public readonly theme: AppTheme;
    public readonly user: AuthUser;
    public readonly html = html;
    public readonly debug = debug;
    private constructor(mode: AppMode, user: AuthUser, theme: AppTheme = "light") { // app construction
        
        this.mode = mode;
        this.user = user; // TBD - get user settings to set theme etc ?
        this.theme = theme;

        document.body.classList.add(mode, theme); // apply targeted css
        document.body.innerHTML = body; // set static elements

        this.debug.log('app restarted in debug mode');
        this.html.init().then(() => this.html.get('hub').render());
    
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