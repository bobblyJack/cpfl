import './styles';
import { AuthUser } from './auth';
import { PageHTML } from './html';
import { getBird } from './debug';

document.addEventListener('DOMContentLoaded', () => { // timing handler
    Office.onReady((info) => {
        try {
            CPFL.start(info);
        } catch (err) {
            console.error(err);
        }
    });
});

type AppMode = "taskpane" | "mobile" | "browser";

export default class CPFL {

    public static debug: boolean = false; // toggle debug mode

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
                await AuthUser.logout(true); // clear msal cache
            }
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

            const hub = new PageHTML("hub");
            switch (mode) { // construct pages
                default: 
                    new PageHTML("act");
                    new PageHTML("bal");
                    new PageHTML("lib");
                    new PageHTML("usr");
            }

            const bird = getBird(user.admin); // init debugger
            document.body.insertBefore(bird, PageHTML.main.nextSibling);

            PageHTML.display = hub; // open dashboard

        }

        return CPFL.app;

    }

    public readonly mode: AppMode;
    public readonly user: AuthUser;
    private constructor(mode: AppMode, user: AuthUser) { // app construction
        document.body.innerHTML = "";

        this.mode = mode; // set mode
        document.body.className = mode; // apply targeted css

        this.user = user; // set user config
        // WIP - get user settings to set css body theme ?

    }

    public get debug() {
        return CPFL.debug;
    }

    public get display() {
        return PageHTML.get();
    }

}