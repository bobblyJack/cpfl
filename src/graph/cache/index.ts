import CPFL from "../..";
import getCacheDB from "./db";
import {enCrypto} from '../cipher';

/**
 * get object store
 * @param cache database scope
 * @param mode readonly / readwrite
 * @returns cache scoped object store
 */
async function initAccess(cache: GraphCache, mode: IDBTransactionMode = "readonly") {
    const db = await getCacheDB();
    const trans = db.transaction(cache, mode);
    trans.onerror = (ev) => CPFL.app.debug.err('transaction error', ev);
    trans.onabort = (ev) => CPFL.app.debug.err('transaction aborted', ev);
    trans.oncomplete = (ev) => CPFL.app.debug.log('transaction complete', ev);
    return trans.objectStore(cache);
}

/**
 * get object index
 * @param cache database scope
 * @param index key reference
 * @returns idb index
 * @tbd define index types and fold into get item
 */
export async function getIndex(cache: GraphCache, index: string) {
    const store = await initAccess(cache);
    return store.index(index);
}

/**
 * get object
 * @param cache database scope 
 * @param id key reference
 * @returns encrypted item
 */
export async function getItem<T extends GraphItem>(cache: GraphCache | IDBIndex, key: string) {
    let req: IDBRequest;
    if (typeof cache === 'string') {
        const store = await initAccess(cache);
        req = store.get(key);
    } else {
        req = cache.get(key);
    }
    return new Promise<EncryptedGraphItem<T>>((resolve, reject) => {
        req.onerror = reject;
        req.onsuccess = () => {
            resolve(req.result);
        };
    });
}

/**
 * add object to store
 * @param cache database scope
 * @param item unencrypted item
 * @param force overwrite existing item
 */
export async function setItem<T extends GraphItem>(cache: GraphCache, item: T, force: boolean = false) {
    const store = await initAccess(cache, "readwrite");
    const encryptedItem = await enCrypto(item);
    if (force) {
        store.put(encryptedItem)
    } else {
        store.add(encryptedItem);
    }
}

/**
 * update object in store
 * @param cache database scope
 * @param id key reference
 * @param patch partial object
 */
export async function updateItem<T extends GraphItem>(cache: GraphCache, id: string, patch: Partial<T>) {
    const store = await initAccess(cache, "readwrite");
    const getreq: IDBRequest<EncryptedGraphItem<T>> = store.get(id);
    getreq.onsuccess = async () => {
        const base = getreq.result;
        const update = await enCrypto(patch, base);
        store.put(update);
    }
}

class CacheRequest {
    public static async init(cache: GraphCache, mode: IDBTransactionMode = "readonly") {
        const db = await getCacheDB();
        const trans = db.transaction(cache, mode);
        trans.onerror = (ev) => CPFL.app.debug.err('transaction error', ev);
        trans.onabort = (ev) => CPFL.app.debug.err('transaction aborted', ev);
        trans.oncomplete = (ev) => CPFL.app.debug.log('transaction complete', ev);
        return new CacheRequest(trans.objectStore(cache));
    }

    public readonly store: IDBObjectStore;
    private constructor(store: IDBObjectStore) {
        this.store = store;
    }
}