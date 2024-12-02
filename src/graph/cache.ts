import CPFL from "..";
import deltaRequest from "./delta";
import { enCrypto } from "./crypto";


let cacheDB: Promise<IDBDatabase>;
async function getCacheDB(): Promise<IDBDatabase> {
    if (!cacheDB) {
        cacheDB = new Promise<IDBDatabase>(resolve => {
            const req = indexedDB.open("AppDatabase", 1);
            req.onupgradeneeded = buildCacheDB; // build db
            req.onerror = console.error; // handle errors
            req.onsuccess = async (ev) => { // update items
                const db = (ev.target as IDBOpenDBRequest).result;
                const init = db.transaction(["matters", "contacts", "precedents"], "readwrite");
                setTransactionHandlers(init);
                const matters = init.objectStore("matters");
                const contacts = init.objectStore("contacts");
                const precedents = init.objectStore("precedents");
                const updates = await deltaRequest();
                const process = updates.map(async update => {
                    
                    const data = JSON.stringify(update);
                    const encryption = await enCrypto(data);


                })
                
                resolve(db);
            } 
        });
    }
    return cacheDB;
}

async function buildCacheDB(this: IDBOpenDBRequest, ev: IDBVersionChangeEvent) {
    if (!ev.oldVersion) {
        const db = this.result;
        const dbParams = {
            keyPath: "id",
            autoIncrement: true
        }
        db.createObjectStore("matters", dbParams);
        db.createObjectStore("contacts", dbParams);
        db.createObjectStore("precedents", dbParams);
    }
}

function setTransactionHandlers(trans: IDBTransaction) {
    trans.onabort = abortHandler;
    trans.onerror = errorHandler;
    trans.oncomplete = completionHandler;

    function abortHandler(ev: Event) {
        console.error('cache transaction aborted', ev);
    }
    function errorHandler(ev: Event) {
        console.error('cache transaction error', ev);
    }
    function completionHandler(ev: Event) {
        CPFL.app.debug.log('cache transaction complete', ev);
    }
}

export default async function cacheRequest(storeName: string, mode: IDBTransactionMode = "readonly") {
    const db = await getCacheDB();
    const trans = db.transaction(storeName, mode);
    setTransactionHandlers(trans);
    return trans.objectStore(storeName);
}

