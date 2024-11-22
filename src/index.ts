import './global.css';
import './themes';
import body from './static.html';
import debug from './debug';
import { AuthUser } from './auth';
import { PageHTML } from './html';


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

            const user = await AuthUser.login(CPFL.app ? CPFL.app.debug.status : false); // login user
            CPFL.app = new CPFL(mode, user); // create app instance
            // construct individual pages
            const hub = new PageHTML("hub", `Welcome ${user.name.given}`);
            new PageHTML("act");
            new PageHTML("bal");
            new PageHTML("lib");
            new PageHTML("usr");
            PageHTML.display = hub; // render dashboard

            CPFL.app.debug.log('app started in debug mode');
            
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
     * fetch debugger
     */
    public get debug() {
        return debug;
    }

    /* get static html elements */
    public get title() {
        return document.getElementById('page-title') as HTMLHeadingElement;
    }
    public get hnav() {
        return document.getElementById('header-nav') as HTMLElement;
    }
    public get main() {
        return document.getElementById('app-main') as HTMLElement;
    } 
    public get fnav() {
        return document.getElementById('footer-nav') as HTMLElement;
    }
    
    /**
     * fetch current display
     */
    public get display() {
        return PageHTML.get();
    }

}