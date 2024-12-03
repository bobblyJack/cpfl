import readBlob64 from './blob';
import * as cache from './cache';
import * as content from './content';
import authFetch from './fetch';
import formGraphURL from './url';

// what to do here? once i get to needing scoped subclasses to cut between file/folder, will be annoying
// i could map construction functions so that they can be indexed/retrieved as needed
// i could just add an "itemType" thing so that it doesnt clash with other shit
// that still leaves the "open" function as returning a mixed return type which is annoying

/**
 * basic graph class
 * @wip use metadata updater
 * @tbd get/set name
 * @tbd get/set parent
 * @tbd get path
 */
abstract class DriveItem implements GraphItem {  
    protected static get cache(): GraphCache {
        throw new Error('abstract item cache reference');
    }

    /**
     * fetch display label array
     */
    public static async labels() {
        return cache.getLabels(this.cache);
    }

    /**
     * instantiate base class from item or label
     */
    public static async get(input: string | GraphItem) {
        try {
            let item: GraphItem;
            if (typeof input === 'string') {
                item = await cache.getLabelled(this.cache, input);
            } else {
                item = input;
            }

            if (item.folder) {
                return new DriveFolder(item);
            } else {
                return new DriveFile(item);
            }

        } catch (err) {
            console.error('item undefined', err);
            return undefined;
        }
    }


    public readonly id: string; // main db key
    public readonly name: string; // file/folder name + extension
    public readonly parent: string; // parent folder id
    public label: string; // plaintext display label
    protected constructor(item: GraphItem) {
        this.id = item.id;
        this.name = item.name;
        this.label = this.name;
        this.parent = item.parentReference?.id || "";
        this.updates = {
            id: this.id
        }
    }

    protected get cache(): GraphCache {
        const parent = this.constructor as typeof DriveItem;
        return parent.cache;
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

}

export class DriveFile extends DriveItem {
    public async open(): Promise<string> {
        const blob = await content.downloadContent(`/items/${this.id}`);
        return readBlob64(blob);
    }
}

export class DriveFolder extends DriveItem {
    public async open(): Promise<DriveItem[]> {
        const kids = await cache.getChildren(this.cache, this.id);
        const constructor = this.constructor as typeof DriveItem;
        const family = kids.map(item => constructor.get(item));
        const awaited = await Promise.all(family);
        return awaited.filter((item) => item !== undefined);
    }
}