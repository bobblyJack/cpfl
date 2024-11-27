import CPFL from "..";
import formURL from './url';
import deltaRequest from './delta';

abstract class GraphItem {

    protected static get root(): keyof SharepointFolders {
        throw new Error('abstract root access');
    }
    public static get path() { // fetch root path
        return CPFL.app.env.then((env) => env.site.folders[this.root]);
    }

    private static _index: Map<string, DriveItem | GraphItem>;
    public static get index(): Map<string, DriveItem | GraphItem> {
        if (!this._index) {
            throw new Error('drive unmapped');
        }
        return this._index;
    }

    public static async init(refresh: boolean = false) {
        try {
            this._index = await deltaRequest(this.root, refresh);
        } catch (err) {
            console.error('drive unmapped', err);
        }
    }

    public static async open(id: string): Promise<GraphItem> {
        try {
            let item = this.index.get(id);
            if (!item) {
                throw new Error('item unmapped');
            }
            if (item instanceof this) {
                return item;
            }
            if (!item.parentReference) {
                throw new Error('null parent reference');
            }
            const itemPath = item.parentReference.path;
            const rootPath = await this.path;
            if (!itemPath.includes(rootPath)) {
                console.error(itemPath, rootPath);
                throw new Error('invalid class opener');
            }
            switch (this.root) {
                case "matters": return new MatterItem(id);
                case "library": return new LibraryItem(id);
                case "users": return new UserItem(id);
            }
        } catch (err) {
            console.error('item unopened');
            throw err;
        }
    }

    // set up a hybrid map which, when reference, replaces the plain object reference with a class instance.
    // could possibly get it to go up its parents line until it hits one of the 3 special folders, also.
    // given itemReference includes the full path, it would be simple to check if that includes folder path
    // that way it can instance as a correct subclass. neat!

    public readonly id: string;
    protected constructor(id: string) {
        this.id = id;
    }

    protected get _baseMap(): Map<string, DriveItem> { // fetch root index
        const parent = this.constructor as typeof GraphItem;
        if (!parent.index) {
            throw new Error('drive unmapped');
        }
        return parent.index;
    }

    public get base(): DriveItem {
        const item = this._baseMap.get(this.id);
        if (!item) {
            throw new Error('drive item unmapped');
        }
        return item;
    }
    public set base(item: DriveItem) {
        if (this.id === item.id) {
            this._baseMap.set(this.id, item);
        }
    }

    private updates: Partial<DriveItem> = {};
    private updateQ: NodeJS.Timeout | null = null;
    protected async update(patch: Partial<DriveItem>) {
        this.base = {
            ...this.base,
            ...patch
        }
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

    public get name(): string {
        return this.base.name;
    }
    public set name(text: string) {
        this.update({name: text});
    }

}

export class MatterItem extends GraphItem {
    public static readonly root: keyof SharepointFolders = "matters";

}

export class LibraryItem extends GraphItem {
    public static readonly root: keyof SharepointFolders = "library";
    public static async open(id: string): Promise<LibraryItem> {
        return super.open(id);
    }

}

export class UserItem extends GraphItem {
    public static readonly root: keyof SharepointFolders = "users";

}

const test = GraphItem.open("test")
const test2 = LibraryItem.open("test")
const test3 = GraphItem.open<LibraryItem>("test");
const test4 = LibraryItem.open<LibraryItem>("test");