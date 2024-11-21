import './global.css';
import './themes';
import body from './static.html';
import { AuthUser } from './auth';
import { PageHTML } from './html';
import { initBird } from './debug';

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

    public static debug: boolean = false; // toggle debug mode

    private static supports = [ // host options
        Office.HostType.Word,
        null, // (OoO browser)
        // TBD: Office.HostType.Outlook,
        // TBD: Office.HostType.Excel
    ]
    
    public static app: CPFL;
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
        
        if (!CPFL.app || restart) { // check app context

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
                        break;
                    }
                    default: {
                        mode = 'taskpane';
                    }
                }
            }

            const user = await AuthUser.login(this.debug); // login user
            CPFL.app = new CPFL(mode, user); // create app instance
            // construct individual pages
            const hub = new PageHTML("hub", `Welcome ${user.name.given}`);
            new PageHTML("act");
            new PageHTML("bal");
            new PageHTML("lib");
            new PageHTML("usr");
            initBird(user.admin); // init debugger
            PageHTML.display = hub; // render dashboard
        }

        return CPFL.app;

    }

    public readonly mode: AppMode;
    public readonly theme: AppTheme;
    public readonly user: AuthUser;
    private constructor(mode: AppMode, user: AuthUser, theme: AppTheme = "light") { // app construction
        
        this.mode = mode;
        this.theme = theme;
        this.user = user; // TBD - get user settings to set theme etc ?

        document.body.classList.add(mode, theme); // apply targeted css
        document.body.innerHTML = body; // set static elements
    
    }

    /**
     * fetch debug status
     */
    public get debug() {
        return CPFL.debug;
    }

    /**
     * debug-only console log
     */
    public iflog(...args: any[]) {
        if (this.debug) {
            console.log(...args);
        }
    }

    /**
     * fetch current display
     */
    public get display() {
        return PageHTML.get();
    }

}