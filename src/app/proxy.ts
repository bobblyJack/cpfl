// idea for a proxied cache handler
// currently reckon a per-variable cache might be better
// or at least more flexible than something dynamic like this

export class CPFL implements AppConfig {
    private static instance: CPFL;
    private static cache: Map<string, Promise<any>> = new Map();
    
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
            CPFL.cache.clear();
            const target = new this(info);

            this.instance = new Proxy(target, { // proxied cache handler
                get: (app: CPFL, key: string) => {

                    if (typeof app[key] === 'function') { // return methods directly
                        return app[key];
                    }

                    if (!CPFL.cache.has(key)) { // check cache for properties
                        const promise = app[key].then(value => {
                            CPFL.cache.set(key, Promise.resolve(value));
                            return value;
                        });
                        CPFL.cache.set(key, promise);
                    }
                    return CPFL.cache.get(key);

                }
            });

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

    [key: string]: Promise<any> | ((...args: any[]) => Promise<any>) // async index sig

    public get env(): Promise<EnvConfig> {
        return getConfig();
    }

    public get user(): Promise<UserConfig> {
        

    }

}