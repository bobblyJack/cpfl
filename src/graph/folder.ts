import { GraphObject } from ".";
import authFetch from "./fetch";
import formGraphURL from "./url";

/**
 * create folder
 * @param name folder name
 * @param parent parent object
 * @param scope graph scope
 */
export default async function createGraphFolder(name: string, parent?: GraphObject, scope: GraphScope = "app"): Promise<GraphItem> {
    const path: GraphURLFragment = parent ? `${parent.path}:/children` : "/children";
    const url = formGraphURL(path);
    const res = await authFetch(url, 1, JSON.stringify({
        name, folder: {}
    }));
    return res.json();
}