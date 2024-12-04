import CPFL from "../..";
import buildCacheDB from "./build";
import deltaRequest from "./delta";
import { cacheNames } from "./names";
import { deCrypto, enCrypto } from "../crypto";

let cacheDB: Promise<IDBDatabase>;
export default async function getCacheDB(): Promise<IDBDatabase> {
    if (!cacheDB) {
        cacheDB = new Promise<IDBDatabase>(resolve => {
            const req = indexedDB.open("AppDatabase", 1);
            req.onupgradeneeded = buildCacheDB; // build db
            req.onerror = console.error; // handle errors
            req.onsuccess = async (ev) => {
                const db = (ev.target as IDBOpenDBRequest).result;
                const init = db.transaction(cacheNames, "readwrite");
                init.onerror = console.error;
                init.onabort = CPFL.app.debug.err;
                init.oncomplete = CPFL.app.debug.log;

                const caches = cacheNames.map(async name => {  // delta request
                    const cache = init.objectStore(name);
                    const updates = await deltaRequest(name);
                    const results: Promise<void>[] = [];

                    for (const update of updates) { // parse individual updates

                        if (update.deleted) { // removed deleted items
                            const result = new Promise<void>(resolve => {
                                const req = cache.delete(update.id);
                                req.onerror = CPFL.app.debug.err;
                                req.onsuccess = () => resolve();
                            });
                            results.push(result);

                        } else { // register updates
                            const req: IDBRequest<EncryptedItem<GraphItem> | undefined> = cache.get(update.id);
                            req.onerror = console.error;
                            req.onsuccess = async () => {
                                const item = req.result;

                                if (!item) { // map new item
                                    const encryptedItem = await enCrypto(update);
                                    const result = new Promise<void>(resolve => {
                                        const creation = cache.add(encryptedItem);
                                        creation.onerror = console.error;
                                        creation.onsuccess = () => resolve();
                                    });
                                    results.push(result);

                                } else { // update existing item
                                    const decryptedItem = await deCrypto<GraphItem>(item);
                                    const updatedItem = {
                                        ...decryptedItem, 
                                        ...update
                                    }
                                    const encryptedItem = await enCrypto(updatedItem);
                                    const result = new Promise<void>(resolve => {
                                        const replacement = cache.put(encryptedItem);
                                        replacement.onerror = console.error;
                                        replacement.onsuccess = () => resolve();
                                    });
                                    results.push(result);
                                }
                            }
                        }
                    }
                    return results;
                });

                await Promise.all(caches);
                resolve(db);
            } 
        });
    }
    return cacheDB;
}