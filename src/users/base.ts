import { GraphObject } from "../graph";

export class UserObject extends GraphObject {

    public static readonly scope: GraphScope = "user";

    public static async get(id?: string) {
        return super.get(id) as Promise<UserObject>;
    }
    public static async set() {
        return super.set("file", 'config.json') as Promise<UserObject>;
    }

    public async load(): Promise<UserConfig> {
        const content = await this._download();
        return JSON.parse(content);
    }

    public async save(patch: Partial<UserConfig>) {
        const config = await this.load();
        const update = {
            ...config,
            ...patch
        }
        if (config !== update) {
            this._content = JSON.stringify(update);
            this._update({content: this._content});
        }
    }

}