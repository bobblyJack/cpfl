import CPFL from "..";
import getURL from './url';

const cacheKey: string = "cpfl-map";
const deltaKey: string = "cpfl-delta";

export default async function fetchLocalMetadata(refresh: boolean = false) {
    
    let localCache = localStorage.getItem(cacheKey);
    let localDelta = localStorage.getItem(deltaKey);

    let cache: Map<string, DriveItem>;
    let link: string | URL;

    if (!localCache || !localDelta || refresh) {
        cache = new Map<string, DriveItem>();
        link = await getURL('root/delta');
    } else {
        cache = JSON.parse(localCache) as Map<string, DriveItem>;
        link = localDelta;
    }

    const updates = await fetchUpdates(deltaKey, link);

    for (const update of updates) {
        if (update.deleted) {
            cache.delete(update.id);
        } else {
            const exists = cache.get(update.id);
            const item: DriveItem = exists ? {
                ...exists, ...update
            } : update;
            cache.set(item.id, item);
        }
    }

    localStorage.setItem(cacheKey, JSON.stringify(cache));
    
    return cache;
}

async function fetchUpdates(key: string, link: string | URL, values: DriveItem[] = []): Promise<DriveItem[]> {
    let response: ItemCollection;
    
    try {
        const res = await fetch(link);
        if (!res.ok) {
            throw res.status;
        }
        response = await res.json();
    } catch {
        const res = await CPFL.app.fetch(link);
        response = await res.json(); 
    }

    for (const item of response.value) {
        values.push(item);
    }

    if (response['@odata.nextLink']) {
        return fetchUpdates(key, response['@odata.nextLink'], values);
    }

    if (response['@odata.deltaLink']) {
        localStorage.setItem(key, String(response['@odata.deltaLink']));
    }

    return values;
}