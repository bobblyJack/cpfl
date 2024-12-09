import CPFL from "../..";
import getURL from '../url';
import authFetch from "../fetch";
import collItems from "../collate";
import * as cipher from '../cipher';

export default async function updateCacheDB(db: IDBDatabase) {
    const caches = Array.from(db.objectStoreNames) as GraphCache[];
    const trans = db.transaction(caches, "readwrite");
    trans.onerror = console.error;
    trans.onabort = CPFL.app.debug.err;
    trans.oncomplete = CPFL.app.debug.log;
    for (const cache of caches) {
        updateCache(trans, cache);
    }
}

async function updateCache(trans: IDBTransaction, cache: GraphCache) {
    const store = trans.objectStore(cache);
    const updates = await deltaRequest(cache);
    for (const update of updates) {
        if (update.deleted) {
            const delreq = store.delete(update.id);
            delreq.onerror = CPFL.app.debug.err;
            delreq.onsuccess = CPFL.app.debug.log;
        } else {
            const getreq: IDBRequest<EncryptedGraphItem | undefined> = store.get(update.id);
            getreq.onerror = CPFL.app.debug.err;
            getreq.onsuccess = async () => {
                const item = getreq.result;
                const encryptedItem = await cipher.enCrypto(update, item);
                store.put(encryptedItem);
            }
        }
    }
} 

/**
 * query shared approot for changes
 */
async function deltaRequest(cache: GraphCache, retried: boolean = false) {
    const env = await CPFL.app.env();
    let delta = env.delta[cache];
    if (!delta) {
        delta = getURL(`:/${cache}:/delta`);
    }
    try {
        const res = await collItems(delta, true);
        env.delta[cache] = res["@odata.deltaLink"] as string | URL;
        CPFL.app.env(env.delta);
        return res.value;
    } catch (err) {
        if (!retried) { // attempt cache creation
            const url = getURL('/children');
            await authFetch(url, 1, JSON.stringify({
                name: cache,
                folder: {}
            }));
            return deltaRequest(cache, true);
        }
        throw err;
    }
}