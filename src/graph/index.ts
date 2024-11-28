import CPFL from "..";
import formURL from './url';
import deltaRequest from './delta';
import GraphFile from './file';
import GraphFolder from "./folder";
import getDrive from './drives';

export class GraphItem implements DriveItem {

    private static _index: Map<string, DriveItem | GraphItem>;
    public static get index(): Map<string, DriveItem | GraphItem> {
        if (!GraphItem._index) {
            throw new Error('drive unmapped');
        }
        return GraphItem._index;
    }
    
    private static async init(refresh: boolean = false) {
        try {
            GraphItem._index = await deltaRequest(refresh);
        } catch (err) {
            console.error('drive unmapped');
            throw err;
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

    private static _root: string;
    public static get root(): GraphItem {
        if (!this._root) {
            throw new Error('root unmapped');
        }
        return this.get(this._root);
    }

    public static async branch(key: keyof SharepointFolders): Promise<GraphItem> {
        try {
            if (!this._index) {
                await this.init(CPFL.app.debug.status);
            }
            const id = await getDrive(key);
            const item = this.get(id);
            if (!item.folder) {
                CPFL.app.debug.err('branch status invalid');
            }
            return item;
        } catch (err) {
            console.error('branch undefined');
            throw err;
        }
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

        if (item.root) {
            GraphItem._root = this.id;
        } else if (item.parentReference) {
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

    private _parent?: string;
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
                    path: `/drive/${item.path}`
                }
            });
        }
    }

    public get path(): string {
        try {
            const parentPath: string = this.parent.path;
            const encodedName: string = encodeURIComponent(this.name);
            return `${parentPath}/${encodedName}`;
        } catch {
            CPFL.app.debug.log('root discovered');
            return "root:"
        }
    }

}