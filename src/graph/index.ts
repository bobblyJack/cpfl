import readBlob64 from './blob';
import * as cache from './cache';
import * as content from './content';
import authFetch from './fetch';
import formGraphURL from './url';
export * as userConfig from './user';

/**
 * basic graph class
 * @tbd approot relative path getter
 */
export class DriveItem implements GraphItem {  

    protected static temp: WeakMap<GraphItem, DriveItem> = new WeakMap(); // temp local map

    public static async create(fileName: string, localCache: GraphCache) { // create new empty drive file
        try {
            const res = await content.uploadContent("", `${localCache}/${fileName}`);
            if (!res.ok) {
                throw res;
            }
            const body = await res.json() as GraphFile;
            cache.setItem(localCache, body);
            return new DriveItem(localCache, body);
        } catch (err) {
            console.error('error creating file', err);
            throw err;
        }
    } 

    public static async get(store: GraphCache, id: string) { // fetch graph item using map to skip construction
        const item = await cache.getItem<GraphItem>(store, id);
        let driveItem = this.temp.get(item);
        if (!driveItem) {
            driveItem = new this(store, item);
        }
        return driveItem;
    }

    private static caches: Map<GraphCache, Map<string, string>> = new Map();
    public static async cache(store: GraphCache) { // fetch index of names -> ids
        let map = this.caches.get(store);
        if (!map) {
            map = await cache.mapItems(store);
            this.caches.set(store, map);
        }
        return map;
    }

    public readonly id: string; // main db key
    public readonly cache: GraphCache; // local location
    public readonly type: "file" | "folder";
    private _name: string; // file/folder name + extension
    private _parent?: GraphItemReference; // parent folder
    private _content: any; // file content / folder children
    protected constructor(cache: GraphCache, item: GraphItem) {
        this.id = item.id;
        this.cache = cache;
        this.type = item.folder ? "folder" : "file";
        this._name = item.name;
        this._parent = item.parentReference;
        this.updates = {
            id: this.id
        }
        DriveItem.temp.set(item, this);
    }

    protected updates: GraphDeltaItem;
    protected updateQueue: NodeJS.Timeout | null = null;
    protected async update(patch: Partial<GraphDeltaItem>) {
        this.updates = {
            ...this.updates,
            ...patch
        }
        if (!this.updateQueue) {
            this.updateQueue = setTimeout(async () => {
                try {
                    cache.setItem(this.cache, this.updates);
                    const url = formGraphURL(`/items/${this.id}`);
                    const packet = JSON.stringify(this.updates);
                    await authFetch(url, 2, packet);
                    this.updates = {
                        id: this.id
                    }
                } catch (err) {
                    console.error('item update failed', err);
                } finally {
                    this.updateQueue = null;
                }
            }, 10000);
        }
    }

    public get name(): string {
        return this._name;
    }
    public set name(name: string) {
        if (name && name !== this._name) {
            this._name = name;
            this.update({name});
        }
    }

    public get parentReference(): GraphItemReference {
        if (!this._parent) {
            throw new Error('parent undefined')
        }
        return this._parent;
    }

    public async openFile(): Promise<string> {
        if (this.type === "folder") {
            return "";
        }
        const blob = await content.downloadContent(`/items/${this.id}`);
        return readBlob64(blob);        
    }

    public async parseContent<T>(): Promise<T> {
        const text = await this.openFile();
        this._content = JSON.parse(text);
        return this._content as T;
    }

    public async saveContent<T extends {}>(newContent?: T) { // WIP doesnt handle nested folders 
        try {
            if (newContent) {
                this._content = newContent;
            }
            const text = JSON.stringify(this._content);
            const path = `${this.parentReference.name}/${this.name}`;
            content.uploadContent(text, path);
        } catch (err) {
            console.error('error uploading file content', this, err);
        }
    }

    public async openFolder(): Promise<DriveItem[]> {
        if (this.type === "file") {
            return [];
        }

        const url = formGraphURL(`/items/${this.id}/children`);
        url.searchParams.append("$select", "id");
        const items = await collateItems(url);
        return Promise.all(items.map(item => DriveItem.get(this.cache, item.id)));
        
        async function collateItems(url: string | URL, values: GraphItem[] = []) {
            const res = await authFetch(url);
            const collection = await res.json() as GraphItemCollection;
            for (const item of collection.value) {
                values.push(item);
            }
            if (collection['@odata.nextLink']) {
                return collateItems(collection['@odata.nextLink'], values);
            }
            return values;
        }
    }
}