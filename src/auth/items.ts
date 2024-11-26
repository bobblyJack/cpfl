import { AuthUser } from ".";
import localEnv from "./local";
import formGraphURL from "./url";

async function fetchSiteID(user: AuthUser) {
    const path = `sites/${user.env.site.domain}:/sites/${user.env.site.name}`;
    const url = formGraphURL(path, ["id"]);
    const site = await user.fetch<BaseItem>(url);
    user.env.site.id = site.id;
    localEnv.set(user.env);
    return site.id;
}

async function formDriveRequest(user: AuthUser, req: string, method: "id" | "path" = "path", query: (keyof DriveItem | "children")[] = []) {
    try {
        let siteID = user.env.site.id;
        if (!siteID) { // update site id
            siteID = await fetchSiteID(user);
        }

        let path = `sites/${siteID}/drive/`;

        if (method === "path") {
            path += "root";
            if (req) {
                if (!req.startsWith(":")) {
                    if (!req.startsWith("/")) {
                        req = "/" + req;
                    }
                    req = ":" + req;
                }
                path += req;
            }
            
        } else if (method === "id") {
            path += `items/${req}`;
        }

        let select: (keyof DriveItem)[] = [];
        if (query.length) {
            if (query.includes("children")) {
                path += "/children";
            }
            select = query.filter(q => q !== "children");
        }

        return formGraphURL(path, select);
        
    } catch (err) {
        console.error('error forming drive request');
        throw err;
    }
}

/**
 * get drive item by id
 * @param id 
 * @param query 
 * @returns 
 */
async function getDriveItem(id: string, query: (keyof DriveItem)[] = []) {
    const user = AuthUser.current;
    const url = await formDriveRequest(user, id, "id", query);
    return user.fetch<DriveItem>(url);
}

/**
 * get drive item by path
 * @param path 
 * @returns 
 */
async function getItemByPath(path: string) {
    const user = AuthUser.current;
    const url = await formDriveRequest(user, path, "path");
    return user.fetch<DriveItem>(url);
}

/**
 * get drive items by parent id
 * @param id 
 * @returns 
 */
async function getDriveCollection(id: string) {
    const user = AuthUser.current;
    const url = await formDriveRequest(user, id, "id", [
        "id", "name", "file", "folder", "children"
    ]);

    return getItems(user, url);
    async function getItems(user: AuthUser, url: string | URL, values: DriveItem[] = []) {
        const response = await user.fetch<ItemCollection>(url);
        for (const item of response.value) {
            values.push(item);
        }
        if (response["@odata.nextLink"]) {
            return getItems(user, response["@odata.nextLink"], values);
        }
        return values;
    }
}

/**
 * get drive items by parent path
 * @param path 
 * @returns 
 */
async function getCollectionByPath(path: string) {
    const user = AuthUser.current;
    const url = await formDriveRequest(user, path, "path", [
        "id", "name", "file", "folder", "children"
    ]);

    return getItems(user, url);
    async function getItems(user: AuthUser, url: string | URL, values: DriveItem[] = []) {
        const response = await user.fetch<ItemCollection>(url);
        for (const item of response.value) {
            values.push(item);
        }
        if (response["@odata.nextLink"]) {
            return getItems(user, response["@odata.nextLink"], values);
        }
        return values;
    }

}

const getDrive = {
    itemID: getDriveItem,
    itemPath: getItemByPath,
    collectID: getDriveCollection,
    collectPath: getCollectionByPath
}

export default getDrive;