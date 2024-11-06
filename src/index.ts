import './styles';
import 'iconify-icon';
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

    private static supports = [ // WIP: expand hosting
        Office.HostType.Word,
        null, // (OoO browser)
        // WIP: Office.HostType.Outlook,
        // WIP: Office.HostType.Excel
    ]
    
    private static _app?: CPFL;
    public static get app() {
        return this._app;
    }

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
        
        if (!CPFL._app || restart) { // check app context

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

            CPFL._app = new CPFL(mode);

        }

        return CPFL._app;

    }
    
    protected constructor(mode: AppMode) { // app construction

        document.body.className = mode;

        this._user = AuthUser.login().then(user => {
            this._user = Promise.resolve(user);
            return user;
        });

        new PageHTML("hub", "Dashboard", "home");
        new PageHTML("mtr", "Active Matter", "credentials");
        new PageHTML("bal", "Balance Sheet", "calculation");
        new PageHTML("lib", "Precedent Library", "document");
        new PageHTML("usr", "User Settings", "settings");

        this.display = "hub"; // WIP change timing on page creation, user awaiting, and display setting

        initBird(); // debugger
        
    }

    public get env(): Promise<EnvConfig> {
        return getEnv(CPFL.debug);
    }

    private _user: Promise<AuthUser>;
    public get user() {
        return this._user;
    }

    public async token(addedScopes: string[] = []): Promise<string> {
        return AuthUser.access(addedScopes);
    }

    public get display(): Promise<PageHTML> {
        return PageHTML.current;
    }
    public set display(page: string | PageHTML) {
        PageHTML.current = page;
    }

}