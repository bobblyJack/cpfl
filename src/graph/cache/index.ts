import CPFL from "../..";
import getCacheDB from "./db";
import { deCrypto, enCrypto } from "../crypto";

async function initTransaction(storeName: string) {
    const db = await getCacheDB();
    const trans = db.transaction(storeName, "readwrite");
    trans.onerror = console.error;
    trans.onabort = CPFL.app.debug.err;
    trans.oncomplete = CPFL.app.debug.log;
    return trans.objectStore(storeName);
}

async function addItem(store: IDBObjectStore, item: GraphBaseItem) {
    const encryptedItem = await enCrypto(item);
    const req = store.add(encryptedItem);
    req.onerror = console.error;
    req.onsuccess = CPFL.app.debug.log;
}

async function putItem(store: IDBObjectStore, item: GraphBaseItem) {
    const encryptedItem = await enCrypto(item);
    const req = store.put(encryptedItem);
    req.onerror = console.error;
    req.onsuccess = CPFL.app.debug.log;
}

async function fetchItem<T extends GraphBaseItem>(storeName: string, key: string): Promise<[IDBObjectStore, T | undefined]> {
    // fetch item and decrypt it
    // passes item + object store for use in both get and set
    const store = await initTransaction(storeName);
    return new Promise<[IDBObjectStore, T | undefined]>(resolve => {
        const req: IDBRequest<EncryptedItem<T> | undefined> = store.get(key);
        req.onerror = console.error;
        req.onsuccess = async () => {
            const encryptedItem = req.result;
            if (!encryptedItem) {
                resolve([store, encryptedItem]);
            } else {
                const item = await deCrypto<T>(encryptedItem);
                resolve([store, item]);
            }
        }
    });
}

export async function getItem<T extends GraphBaseItem>(storeName: GraphCache, key: string) {
    const results = await fetchItem<T>(storeName, key);
    if (!results[1]) {
        throw new Error(`item ${key} unmapped in ${storeName}`);
    }
    return results[1];
}

/**
 * add item to cache
 * @param store name of object store
 * @param item to add
 */
export async function setItem<T extends GraphBaseItem>(store: GraphCache, item: T) : Promise<void>;
/**
 * update item in cache
 * @param store name of object store
 * @param item update from partial input
 */
export async function setItem<T extends GraphBaseItem>(store: GraphCache, item: (Partial<T> & GraphBaseItem)) : Promise<void>;
/**
 * overwrite item in cache
 * @param store name of object store
 * @param item to forcibly add
 */
export async function setItem<T extends GraphBaseItem>(store: GraphCache, item: T, force: true) : Promise<void>;
export async function setItem<T extends GraphBaseItem>(
    storeName: GraphCache,
    item: (Partial<T> & GraphBaseItem) | T, 
    force: boolean = false
) {
    if (force) {
        const store = await initTransaction(storeName);
        return putItem(store, item);
    }
    const init = await fetchItem<T>(storeName, item.id);
    const store = init[0];
    if (!init[1]) {
        return addItem(store, item);
    }
    const update: T = {
        ...init[1],
        ...item
    }
    return putItem(store, update);
}

export async function deleteItem(storeName: GraphCache, key: string) {
    const store = await initTransaction(storeName);
    const req = store.delete(key);
    req.onerror = console.error;
    req.onsuccess = CPFL.app.debug.log;
}