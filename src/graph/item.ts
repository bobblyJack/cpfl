import { formURL } from "./url";
import { authFetch } from "./fetch";
import { getDrivePath } from "./site";

export async function getItem(id: string, query: SelectQuery = []) {
    let path = await getDrivePath();
    path += `/items/${id}`;
    const url = formURL(path, query)
    return authFetch<DriveItem>(url);
}

export async function getCollection(id?: string) {
    const item = id ? `items/${id}` : "root";
    let path = await getDrivePath();
    path += `/${item}/children`;
    const url = formURL(path, [
        "name", "id", "file", "folder"
    ]);

    return getItems(url)
    async function getItems(url: string | URL, values: DriveItem[] = []) {
        const response = await authFetch<ItemCollection>(url);
        for (const item of response.value) {
            values.push(item);
        }
        if (response["@odata.nextLink"]) {
            return getItems(response["@odata.nextLink"], values);
        }
        return values;
    }
}