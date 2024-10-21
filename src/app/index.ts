import {AuthClient} from './auth';
import {AppUser} from './user';

const supportedPlatforms = [ // WIP: mobile support
    Office.PlatformType.PC,
    Office.PlatformType.OfficeOnline,
    Office.PlatformType.Universal
]

export class CPFL {
    
    private static _instance: CPFL;
    public static async start(restart: boolean = false) {
        if (!this._instance || restart) {
            this._instance = new this();
        }
        return new Promise<CPFL>((resolve) => {
            if (this._instance._ready) {
                resolve(this._instance);
            } else {
                const timer = setInterval(() => {
                    if (this._instance._ready) {
                        clearInterval(timer);
                        resolve(this._instance)
                    } else {
                        this._instance.main.textContent += ".";
                    }
                }, 50);
            }
        });
    }

    public header = document.getElementById('app-header') as HTMLElement;
    public main = document.getElementById('app-main') as HTMLElement;
    public footer = document.getElementById('app-footer') as HTMLElement;

    private constructor() {
        this._ready = false;
        if (supportedPlatforms.includes(Office.context.platform)) {
            console.log(`Starting Taskpane on ${Office.context.host}`);
            this.init().then(() => {
                this._ready = true;
            });
        } else {
            this._ready = true;
            this.throwApp(`Taskpane Platform Error on ${Office.context.platform}`);
        }
    }

    private throwApp(message: string) { // WIP: error handling
        this.header.innerHTML = "";
        this.footer.innerHTML = "";
        this.main.innerHTML = `<p class="error">${message}</p>`;
        throw this;
    }

    private _env?: EnvConfig;
    public get env() {
        return this._env as EnvConfig;
    }

    private _ready: boolean;
    private async init() {

        const localKey = 'cpfl-config';
        let localValue = localStorage.getItem(localKey);
        if (!localValue) {
            const response = await fetch('./config.json');
            if (!response.ok) {
                console.error(response.statusText);
                this.throwApp('Config Fetch Error');
            }
            localValue = await response.text();
            localStorage.setItem(localKey, localValue);
        }
        this._env = JSON.parse(localValue);
        

        
    }
    
    

   
}