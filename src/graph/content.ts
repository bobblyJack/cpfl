import CPFL from "..";
import formURL from './url';
import authFetch from "./fetch";

/**
 * fetch file content using id or path
 */
export async function downloadContent(input: string, source: GraphScope = "site") {
    return fetchResponse(input, source);
    async function fetchResponse(input: string, source: GraphScope, retry: boolean = false) {
        let url: URL;
        if (input.includes(":") || input.includes("/")) {
            url = await formURL(["root:", input], source)
        } else {
            url = await formURL(["items", input], source);
        }
        url.searchParams.set("$select", "id,@microsoft.graph.downloadUrl");
        const init = await authFetch(url);
        const body = await init.json() as GraphFile;
        if (body["@microsoft.graph.downloadUrl"]) {
            return fetch(body["@microsoft.graph.downloadUrl"]);
        }
        if (retry || !body.id) {
            throw new Error('no content stream');
        }
        return fetchResponse(body.id, source, true);
    }
}

/**
 * upload file content by path
 */
export async function uploadContent(content: string, path: string, source: GraphScope = "site") {
    try {
        const url = await formURL([
            "root:", 
            `${path}:`, 
            "content"
        ], source);
        await authFetch(url, 4, content);
        return true;
    } catch (err) {
        CPFL.app.debug.err('error uploading drive item', path, err);
        return false;
    }
}