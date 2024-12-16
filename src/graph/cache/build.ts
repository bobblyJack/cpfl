const cacheNames: GraphCache[] = [
    "contacts", "matters", "precedents"
]

export default async function buildCacheDB(this: IDBOpenDBRequest, ev: IDBVersionChangeEvent) {
    if (!ev.oldVersion) {
        const db = this.result;
        const dbParams = {
            keyPath: "id",
            autoIncrement: true
        }
        for (const store of cacheNames) {
            const objectStore = db.createObjectStore(store, dbParams);
            objectStore.createIndex('parentID', 'hx', {
                unique: false
            });
        }
    }
}