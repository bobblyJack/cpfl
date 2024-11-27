import CPFL from "..";
import getURL from './url';

const baseCacheKey: string = "cpfl-map";
const baseDeltaKey: string = "cpfl-delta";

export default async function fetchLocalMetadata(folder: keyof SharepointFolders, refresh: boolean = false) {
    
    const cacheKey: string = `${baseCacheKey}-${folder}`;
    const deltaKey: string = `${baseDeltaKey}-${folder}`;
    
    let localCache = localStorage.getItem(cacheKey);
    let localDelta = localStorage.getItem(deltaKey);

    let cache: Map<string, DriveItem>;
    let link: string | URL;

    if (!localCache || !localDelta || refresh) {
        cache = new Map<string, DriveItem>();
        const env = await CPFL.app.env;
        const path = env.site.folders[folder];
        link = await getURL(`${path}/delta`);
    } else {
        cache = JSON.parse(localCache) as Map<string, DriveItem>;
        link = localDelta;
    }

    const updates = await fetchUpdates(deltaKey, link);

    for (const update of updates) {
        const exists = cache.get(update.id);
        if (exists) {
            cache.set(update.id, {
                ...exists,
                ...update
            });
        } else {
            cache.set(update.id, update);
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