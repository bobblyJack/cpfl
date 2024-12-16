import { GraphObject } from "../graph";

export class MatterObject extends GraphObject {
    public static readonly scope: GraphScope = "app";
    public static readonly cache: GraphCache = "matters";

    public static async get(id?: string) {
        return super.get(id) as Promise<MatterObject>;
    }
    public static async set(name: string) {
        return super.set("file", name) as Promise<MatterObject>;
    }

    public async load(): Promise<MatterCard> {
        return this._parse<MatterCard>();
    }

    public async save(patch: Partial<MatterCard>) {
        const config = await this.load();
        const update = {
            ...config,
            ...patch
        }
        if (config !== update) {
            this._content = JSON.stringify(update);
            this._update({content: "patch"});
        }

    }
}