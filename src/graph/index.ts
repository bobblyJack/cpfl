import readBlob64 from './blob';
import * as cache from './cache';
import * as content from './content';
import authFetch from './fetch';
import formGraphURL from './url';

/**
 * basic graph class
 * @wip use metadata updater
 * @tbd get/set name
 * @tbd get/set parent
 * @tbd get path
 * @tbd enforce subclasses
 */
export class DriveItem implements GraphItem {  

    /**
     * fetch display label array
     */
    public static async labels(store: GraphCache) {
        return cache.getLabels(store);
    }

    /**
     * construct from display label
     */
    public static async get<T extends GraphItem>(store: GraphCache, label: string) {
        const item = await cache.getLabelled<T>(store, label);
        return new DriveItem(store, item);
    }

    public readonly id: string; // main db key
    public readonly cache: GraphCache; // index db store
    public readonly name: string; // file/folder name + extension
    public readonly parent: string; // parent folder id
    public readonly type: "file" | "folder"; // soft item subclass
    public label: string; // plaintext display label
    public constructor(store: GraphCache, item: GraphItem) {
        this.id = item.id;
        this.cache = store;
        this.name = item.name;
        this.label = this.name;
        this.parent = item.parentReference?.id || "";
        this.type = item.folder ? "folder" : "file";
        this.updates = {
            id: this.id
        }
    }

    protected updates: GraphDeltaItem;
    protected updateQueue: NodeJS.Timeout | null = null;
    /**
     * update item metadata WIP
     */
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

    /**
     * get file content (string) or folder children (item[])
     */
    public async open() {
        if (this.type === "file") {
            const blob = await content.downloadContent(`/items/${this.id}`);
            return readBlob64(blob);
        }
        const kids = await cache.getChildren(this.cache, this.id);
        const family = kids.map(item => new DriveItem(this.cache, item));
        return Promise.all(family);
    }

}