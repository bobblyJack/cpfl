import { GraphObject } from "../graph";

export class UserObject extends GraphObject {

    public static readonly scope: GraphScope = "user";

    public static async get(id?: string) {
        return super.get(id) as Promise<UserObject>;
    }
    public static async set(name: string) {
        return super.set("file", name) as Promise<UserObject>;
    }

    public get config(): Promise<UserConfig> {
        return this._parse<UserConfig>();
    }

    public set config(patch: Partial<UserConfig>) {
        this.config.then(config => {
            const update = {
                ...config,
                ...patch
            }
            if (config !== update) {
                this._content = JSON.stringify(update);
                this._update({content: "patch"});
            }
        });
    }

}