class DataCache {
    public static async init() {
        const req = indexedDB.open("DataCache");
        req.onupgradeneeded = (ev) => {
            // create database logic
        }
        req.onsuccess = (ev) => {
            const targ = ev.target as IDBRequest;
            targ.result; // resolve this as the promise i think
        }
        req.onerror = (ev) => {
            // reject here
        }

    }
    public constructor() {
        
    }
}

let dataCache: Promise<IDBDatabase>;
dataCache.then((db) => {
    const trans = db.transaction()
})