import buildCacheDB from "./build";
import updateCacheDB from "./delta";

let cacheDB: Promise<IDBDatabase>;
export default async function getCacheDB(): Promise<IDBDatabase> {
    if (!cacheDB) {
        cacheDB = new Promise<IDBDatabase>(resolve => {
            const req: IDBOpenDBRequest = indexedDB.open("AppDatabase", 1);
            req.onupgradeneeded = buildCacheDB;
            req.onerror = handleErrors;
            req.onsuccess = async () => {
                const db = req.result;
                await updateCacheDB(db);
                resolve(db);
            };
        });
    }
    return cacheDB;
}

async function handleErrors(this: IDBRequest<IDBDatabase>, ev: Event) {
    console.error('error opening idb database', this, ev);
}