import authFetch from "./fetch";
import formGraphURL from "./url";

const appUpdates: Map<string, Partial<GraphItem>> = new Map();
const userUpdates: Map<string, Partial<GraphItem>> = new Map();

function getUpdateMap(scope: GraphScope) {
    switch (scope) {
        case "user": return userUpdates;
        case "app": return appUpdates;
    }
}

let updatesQueue: NodeJS.Timeout | null = null;

export default async function updateGraphItem(id: string, patch: Partial<GraphItem>, scope: GraphScope) {
    const updatesMap = getUpdateMap(scope);
    const existing = updatesMap.get(id);
    if (existing) {
        patch = {
            ...existing,
            ...patch
        }
    }
    if (patch.id) {
        patch.id = id;
    }
    updatesMap.set(id, patch);
    if (!updatesQueue) {
        updatesQueue = setTimeout(processUpdates, 10000);
    }
}

async function processUpdates() {
    try {
        const updatesA: [string, GraphScope][] = Array.from(appUpdates.keys()).map(id => [id, "app"]);
        const updatesB: [string, GraphScope][] = Array.from(userUpdates.keys()).map(id => [id, "user"]);
        const updates = updatesA.concat(updatesB);
        const process = updates.map((update) => processUpdate(update[0], update[1]));
        await Promise.all(process);
        console.log('graph update complete');
    } catch (err) {
        console.error('graph update failed', err);
    } finally {
        updatesQueue = null;
    }
}

async function processUpdate(id: string, scope: GraphScope) {
    try {
        const updatesMap = getUpdateMap(scope);
        const update = updatesMap.get(id);
        const packet = JSON.stringify(update);
        const url = formGraphURL(`/items/${id}`);
        await authFetch(url, 2, packet);
        updatesMap.delete(id);
    } catch (err) {
        console.error('error updating graph item', id);
        throw err;
    }
}