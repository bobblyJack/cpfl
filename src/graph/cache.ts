let cacheDB: Promise<IDBDatabase>;
async function getCacheDB(): Promise<IDBDatabase> {
    if (!cacheDB) {
        cacheDB = new Promise<IDBDatabase>((resolve, reject) => {
            const req = indexedDB.open("AppDatabase", 1);
            req.onerror = (ev) => {
                console.error(ev);
                reject("broken database");
            };
            req.onupgradeneeded = (ev) => {
                const db = (ev.target as IDBOpenDBRequest).result;
                if (!ev.oldVersion) {
                    const dbParams = {
                        keyPath: "id",
                        autoIncrement: true
                    }
                    db.createObjectStore("matters", dbParams);
                    db.createObjectStore("contacts", dbParams);
                }
            }
            req.onsuccess = (ev) => {
                const db = (ev.target as IDBOpenDBRequest).result;
                cacheDB = Promise.resolve(db);
                resolve(db);
            }
        });
    }
    return cacheDB;
}

export default async function cacheRequest(storeName: string, mode: IDBTransactionMode = "readonly") {
    const db = await getCacheDB();
    const trans = db.transaction(storeName, mode);
    trans.onabort = (ev) => {
        console.error('cache transaction aborted', ev);
    };
    trans.onerror = (ev) => {
        console.error('cache transaction error', ev);
    }
    trans.oncomplete = (ev) => {
        console.log('cache transaction complete', ev);
    }
    return trans.objectStore(storeName);
}

