import { GraphObject } from "../graph";

export class MatterObject extends GraphObject {
    public static readonly scope: GraphScope = "app";
    public static readonly cache: GraphCache = "matters";

    public static async create(name: Name) {
        const fileName = `${name.family}_${name.given.slice(0,2)}.json`;
        return this.set("file", fileName) as Promise<MatterObject>;
    }

    public static async list(): Promise<Record<string, string>> {
        const folder = await this.get() as MatterObject;
        const content = await folder._download();
        return JSON.parse(content);
    }

    public async load(): Promise<MatterCard> {
        const text = await this._download();
        return JSON.parse(text);
    }

    public async save(patch: Partial<MatterCard>) {
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