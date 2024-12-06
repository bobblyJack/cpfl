import CPFL from "../..";
import getURL from '../url';
import authFetch from "../fetch";
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
            const getreq: IDBRequest<EncryptedGraphItem<GraphDeltaItem> | undefined> = store.get(update.id);
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
        return fetchUpdates(env.delta, cache, delta);
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

async function fetchUpdates(
    env: EnvDeltaCache, 
    cache: GraphCache, 
    link: string | URL
): Promise<GraphDeltaItem[]> {
    let response: GraphDeltaResponse;
    let deltaLink: string | URL = "";
    const values = await collateValues(link);
    if (!deltaLink) {
        throw new Error('delta link undefined');
    }
    env[cache] = deltaLink;
    CPFL.app.env(env);
    return values;

    async function collateValues(
        dlink: string | URL, 
        values: GraphDeltaItem[] = [], 
        token: string | null = null) {
        try {
            if (!token) {
                token = await CPFL.app.access();
            }
            const res = await authFetch(dlink);
            response = await res.json();
            for (const item of response.value) {
                values.push(item);
            }
            if (response['@odata.nextLink']) {
                return collateValues(response['@odata.nextLink'], values, token);
            }
            if (response["@odata.deltaLink"]) {
                deltaLink = response["@odata.deltaLink"];
            }
            return values;
        } catch (err) {
            try {
                CPFL.app.debug.err('initial error fetching updates');
                CPFL.app.debug.log('attempting token refresh');
                return collateValues(dlink, values);
            } catch (err) {
                console.error('could not fetch updates', dlink, values);
                throw err;
            }
        }
    }
    
}