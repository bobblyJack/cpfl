import {getConfig} from '../config';

const supportedPlatforms = [ // WIP: mobile support
    Office.PlatformType.PC,
    Office.PlatformType.OfficeOnline,
    Office.PlatformType.Universal
]

type OfficeStartInfo = { // WIP: null handler
    host: Office.HostType | null;
    platform: Office.PlatformType | null;
}

export class CPFL {
    private static instance: CPFL;
    
    public static async start(info?: OfficeStartInfo): Promise<CPFL> {

        let restart: boolean = false; // restart switch
        if (!info) {
            restart = true;
            info = {
                host: Office.context.host,
                platform: Office.context.platform
            }
        }
        
        if (!this.instance || restart) {
            this.instance = new this(info);
        }

        return this.instance;
    }
    
    private constructor(info: OfficeStartInfo) {
        if (info.platform && supportedPlatforms.includes(info.platform)) {
            console.log(`Starting Taskpane on ${info.host}`);
        } else {
            throw new Error('Office Platform Error'); // WIP: error handling ui
        }
    }

    public get env() {
        return getConfig().then(config => config.env);
    }

    public get user() {
        return getConfig().then(config => config.user);
    }

}