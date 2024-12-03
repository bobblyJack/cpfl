import {cacheNames} from "./names";

export default async function buildCacheDB(this: IDBOpenDBRequest, ev: IDBVersionChangeEvent) {
    if (!ev.oldVersion) {
        const db = this.result;
        const dbParams = {
            keyPath: "id",
            autoIncrement: true
        }
        for (const name of cacheNames) {
            const store = db.createObjectStore(name, dbParams);
            store.createIndex("label", "label", {
                unique: true
            });
            store.createIndex("parent", "parent", {
                unique: false
            });
        }
    }
}