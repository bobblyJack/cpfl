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
                    const results: Promise<void>[] = []

                    for (const update of updates) { // parse individual updates
                        const req: IDBRequest<EncryptedItem<GraphItem> | undefined> = cache.get(update.id);
                        req.onerror = console.error;
                        req.onsuccess = async () => {
                            const item = req.result;

                            if (!item) { // map new item
                                const encryptedData = await enCrypto(update);
                                let uniqueLabel: string;
                                if (update.name) {
                                    uniqueLabel = update.name;
                                } else {
                                    CPFL.app.debug.log('unique label undefined', update);
                                    uniqueLabel = update.id;
                                }
                                const encryptedItem: EncryptedItem<GraphItem> = {
                                    id: update.id,
                                    label: uniqueLabel,
                                    parent: update.parentReference?.id || "",
                                    ...encryptedData
                                }
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
                                const encryptedData = await enCrypto(updatedItem);
                                const encryptedItem: EncryptedItem<GraphItem> = {
                                    id: update.id,
                                    label: updatedItem.name,
                                    parent: updatedItem.parentReference?.id || "",
                                    ...encryptedData
                                }
                                const result = new Promise<void>(resolve => {
                                    const replacement = cache.put(encryptedItem);
                                    replacement.onerror = console.error;
                                    replacement.onsuccess = () => resolve();
                                });
                                results.push(result);
                            }
                        }
                    }
                });

                await Promise.all(caches);
                resolve(db);
            } 
        });
    }
    return cacheDB;
}