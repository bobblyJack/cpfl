import CPFL from "..";
import formURL from './url';
import deltaRequest from './delta';
import GraphFile from './file';
import GraphFolder from "./folder";

export class GraphItem implements DriveItem {

    private static _index: Map<string, DriveItem | GraphItem>;
    public static get index(): Map<string, DriveItem | GraphItem> {
        if (!GraphItem._index) {
            throw new Error('drive unmapped');
        }
        return GraphItem._index;
    }

    public static async init(refresh: boolean = false) {
        try {
            GraphItem._index = await deltaRequest(refresh);
        } catch (err) {
            console.error('drive unmapped', err);
        }
    }

    public static get(id: string): GraphItem {
        const item = this.index.get(id);
        if (!item) {
            throw new Error('item unmapped');
        }
        if (item instanceof this) {
            return item;
        }
        if (item.deleted) {
            console.log('item deleted facet', item);
        }
        const instance = new this(item);
        this.index.set(id, instance);
        return instance;
    }

    public readonly id: string;
    public file?: GraphFile;
    public folder?: GraphFolder;
    protected constructor(item: DriveItem) {
        this.id = item.id;
        this._name = item.name;
        if (item.file) {
            this.file = new GraphFile(this.id, item.file);
        }
        if (item.folder) {
            this.folder = new GraphFolder(this.id, item.folder);
        }

        this._parent = "";
        if (item.parentReference && !item.root) {
            this._parent = item.parentReference.id;
        }
    }

    private updates: Partial<DriveItem> = {};
    private updateQ: NodeJS.Timeout | null = null;
    protected async update(patch: Partial<DriveItem>) {
        this.updates = {
            ...this.updates,
            ...patch
        }
        if (!this.updateQ) {
            this.updateQ = setTimeout(async () => {
                try {
                    const url = await formURL(`items/${this.id}`);
                    const packet = JSON.stringify(this.updates);
                    await CPFL.app.fetch(url, 2, packet);
                    this.updates = {};
                } catch (err) {
                    console.error('failed to update', err);
                } finally {
                    this.updateQ = null;
                }
            }, 10000);
        }
    }

    private _name: string;
    public get name(): string {
        return this._name;
    }
    public set name(text: string) {
        if (text && text !== this._name) {
            this._name = text;
            this.update({name: text});
        }
    }

    private _parent: string;
    public get parent(): GraphItem {
        if (!this._parent) {
            throw new Error('no parent reference');
        }
        return GraphItem.get(this._parent);
    }
    public set parent(item: GraphItem) {
        if (item !== this.parent) {
            this._parent = item.id;
            this.update({
                parentReference: {
                    id: item.id,
                    name: item.name,
                    path: item.path
                }
            });
        }
    }

    public get path(): string {
        const encodedName: string = encodeURIComponent(this.name);
        let parentPath: string = "";
        try {
            parentPath = this.parent.path;
        } catch {
            CPFL.app.debug.log('root discovered');
        }
        return `${parentPath}/${encodedName}`;
    }

}