import CPFL from "../..";
import getCacheDB from "./db";
import {deCrypto, enCrypto} from '../cipher';

export default class DatabaseRequest {
    /**
     * init db transaction
     * @param cache db scope
     * @returns new DatabaseRequest
     */
    public static async init(cache: GraphCache) {
        const db = await getCacheDB();
        const trans = db.transaction(cache, "readwrite");
        trans.onerror = (ev) => CPFL.app.debug.err('idb transaction error', ev);
        trans.onabort = (ev) => CPFL.app.debug.err('idb transaction aborted', ev);
        trans.oncomplete = (ev) => CPFL.app.debug.log('idb transaction complete', ev);
        return new DatabaseRequest(trans.objectStore(cache));
    }

    private constructor(
        private readonly _store: IDBObjectStore) {
        CPFL.app.debug.log('idb transaction initiated'); 
    }

    /**
     * get decrypted item
     * @param id key reference
     */
    public async get(id: string): Promise<GraphItem>;
    /**
     * get decrypted property
     * @param id key reference
     * @param prop property key
     * @return stringified value
     */
    public async get(id: string, prop: Exclude<keyof GraphItem, "id">): Promise<string>;
    public async get(
        key: string, 
        prop?: Exclude<keyof GraphItem, "id">
    ): Promise<GraphItem | string> {
        const req: IDBRequest<EncryptedGraphItem> = this._store.get(key);
        return new Promise<GraphItem | string>((resolve, reject) => {
            req.onerror = reject;
            req.onsuccess = async () => {
                try {
                    const res = req.result;
                    if (!res) {
                        throw new Error('undefined idb entry');
                    }
                    if (!prop) {
                        const item = await deCrypto(res)
                        resolve(item);
                    } else if (!res[prop]) {
                        throw new Error('undefined property value');
                    } else {
                        const val: ArrayBuffer = res[prop];
                        const text = await deCrypto(val, res.iv);
                        resolve(text);
                    }
                } catch (err) {
                    reject(err);
                }
            }
        });
    }

    /**
     * add encrypted item
     * @param obj unencrypted obj
     */
    public async set(obj: GraphItem): Promise<void>;
    /**
     * put encrypted item
     * @param obj unencrypted obj
     * @param force overwrite db
     */
    public async set(obj: GraphItem, force: true): Promise<void>;
    /**
     * update encrypted item
     * @param patch updated props
     * @param id base key
     */
    public async set(patch: Partial<GraphItem>, id: string): Promise<void>;
    public async set(obj: GraphItem | Partial<GraphItem>, mode: string | boolean = false): Promise<void> {
        let item: EncryptedGraphItem;
        let base: EncryptedGraphItem | undefined = undefined;

        if (typeof mode === 'string') {
            base = await new Promise<EncryptedGraphItem>(resolve => {
                const req = this._store.get(mode);
                req.onsuccess = () => resolve(req.result);
            });
        }

        item = await enCrypto(obj, base);

        if (mode) {
            this._store.put(item);
        } else {
            this._store.add(item);
        }
    }

    /**
     * get children
     * @param parentID parent index 
     * @returns record of name:id 
     */
    public async list(parentID: string) {
        const i = this._store.index("parentID");
        const req: IDBRequest<EncryptedGraphItem[]> = i.getAll(parentID);
        return new Promise<Record<string, string>>(async (resolve) => {
            const res = req.result;
            const names = res.filter(item => item.name !== undefined);
            const map = names.map(async item => {
                if (!item.name) {
                    throw new Error('filtration error');
                }
                const name = await deCrypto(item.name, item.iv);
                return [name, item.id];
            });
            const props = await Promise.all(map);
            resolve(Object.fromEntries(props));
        });
    }

}