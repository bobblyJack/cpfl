import CPFL from "..";
import formURL from './url';

const rootIDs: Map<keyof SharepointFolders, Promise<string>> = new Map();
export default async function findRoot(type: keyof SharepointFolders) {
    let id = rootIDs.get(type);
    if (!id) {
        id = fetchRootID(type);
    }
    return id;
}

async function fetchRootID(type: keyof SharepointFolders) {
    const env = await CPFL.app.env;
    let rootPath = env.site.folders[type];
    if (!rootPath.startsWith("root")) {
        if (!rootPath.startsWith(":")) {
            if (!rootPath.startsWith("/")) {
                rootPath = "/" + rootPath;
            }
            rootPath = ":" + rootPath;
        }
        rootPath = "root" + rootPath;
    }
    const url = await formURL(rootPath, ["id"]);
    const res = await CPFL.app.fetch(url);
    const item = await res.json() as DriveItem;
    rootIDs.set(type, Promise.resolve(item.id));
    return item.id;
}