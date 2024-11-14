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

type AppMode = "taskpane" | "mobile" | "browser";

export default class CPFL {

    public static debug: boolean = false; // toggle debug mode
    public static get env() {
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

            const user = await AuthUser.login(); // login user
            CPFL.app = new CPFL(mode, user); // create app instance
            for (const key of CPFL.app.keys) { // construct pages
                const page = new PageHTML(key);
                console.log('page created', page);
            }

        }

        PageHTML.get(); // init html display
        return CPFL.app;

    }

    public readonly user: AuthUser;
    public readonly mode: AppMode;
    public readonly keys: string[];
    private constructor(mode: AppMode, user: AuthUser) { // app construction
        PageHTML.main.textContent = "";

        this.mode = mode; // set mode
        document.body.className = mode; // apply targeted css

        this.user = user; // set user config

        this.keys = [ // WIP - define pages (use enum or type, make mode specific?)
            "hub", "act", "bal", "lib", "usr"
        ];

        if (user.admin) { // init debugger
            initBird(PageHTML.footer);
        }
        
    }

    public get token() {
        return AuthUser.access;
    }

    public async refresh() {
        const page = PageHTML.get();
        await page.close();
        return page.open();
    }

    public get debug() {
        return CPFL.debug;
    }

}