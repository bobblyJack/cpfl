import { GraphObject } from "../graph";

export class ContactObject extends GraphObject {
    public static readonly scope: GraphScope = "app";
    public static readonly cache: GraphCache = "contacts";

    protected static readonly _folders: Map<ContactType, GraphObject> = new Map();
    protected static async _folder(type: ContactType) {
        let folder = this._folders.get(type);
        if (!folder) {
            folder = await this.set("folder", type);
            this._folders.set(type, folder);
        }
        return folder;
    }

    public static async create(type: ContactType, name: Name) {
        const folder = await this._folder(type);
        const fileName = `${name.family}_${name.given.slice(0,2)}.json`;
        return this.set("file", fileName.toLowerCase(), folder) as Promise<ContactObject>;
    }

    public static async list(type: ContactType): Promise<Record<string, string>> {
        const folder = await this._folder(type) as ContactObject;
        const content = await folder._download();
        return JSON.parse(content);
    }

    public async load(): Promise<ContactCard> {
        const content = await this._download();
        return JSON.parse(content);
    }

    public async save(patch: Partial<ContactCard>) {
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