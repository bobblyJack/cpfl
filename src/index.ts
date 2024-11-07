import 'iconify-icon';
import './styles';
import { getEnv } from './env';
import { AuthUser } from './auth';
import { PageHTML } from './html';
import { initBird } from './debug';

document.addEventListener('DOMContentLoaded', () => { // timing handler
    console.log('DOM Content Loaded');
    Office.onReady((info) => {
        console.log('Office JS Ready', info);
        try {
            console.log('Launching App');
            CPFL.start(info).then(app => {
                console.log('App Instanced', app);
            });
        } catch (err) {
            console.error(err);
        }
    });
});

export default class CPFL {

    public static debug: boolean = false; // toggle debug mode
    public static get env(): Promise<EnvConfig> {
        return getEnv(this.debug);
    }

    private static supports = [ // WIP: expand hosting
        Office.HostType.Word,
        null, // (OoO browser)
        // WIP: Office.HostType.Outlook,
        // WIP: Office.HostType.Excel
    ]
    
    public static app: CPFL;
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
        
        if (!CPFL.app || restart) { // check app context

            if (restart) {
                // WIP: reset html to landing page here.
            }

            console.log(info);
            if (!CPFL.supports.includes(info.host)) {
                throw new Error('Office Host Error');
            }

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

            const user = await AuthUser.login();
            CPFL.app = new CPFL(mode, user);

        }

        CPFL.app.display = "hub";
        return CPFL.app;

    }

    private _user: AuthUser;
    private _display?: PageHTML;
    private constructor(mode: AppMode, user: AuthUser) { // app construction

        document.body.className = mode;
        this._user = user;

        new PageHTML("hub", "Dashboard", "home");
        new PageHTML("mtr", "Active Matter", "credentials");
        new PageHTML("bal", "Balance Sheet", "calculation");
        new PageHTML("lib", "Precedent Library", "document");
        new PageHTML("usr", "User Settings", "settings");

        initBird(); // debugger
        
    }

    public get user() {
        return this._user;
    }

    public get token() {
        return AuthUser.access;
    }

    public get display(): Promise<PageHTML> { // get current page
        return PageHTML.cleanQ.then(() => {
            if (!this._display) {
                this._display = PageHTML.get('hub');
                return this._display.open();
            }
            return this._display;
        });
    }

    public set display(page: string | PageHTML) { // browse to new page
        try {
            
            if (this._display) {
                this._display.close();
            }

            this._display = typeof page === 'string' ? PageHTML.get(page) : page;
            this._display.open();

        } catch (err) {
            console.error('navigation error', page, err);
        }
    }

}