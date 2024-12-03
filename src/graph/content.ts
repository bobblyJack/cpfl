import CPFL from "..";
import formURL from './url';
import authFetch from "./fetch";

/**
 * fetch file content blob using id or path
 */
export async function downloadContent(input: GraphURLFragment, source: GraphScope = "app") {
    return fetchResponse(input, source);
    async function fetchResponse(input: GraphURLFragment, source: GraphScope, retry: boolean = false) {
        const url: URL = formURL(input, source);
        url.searchParams.set("$select", "id,@microsoft.graph.downloadUrl");
        const init = await authFetch(url);
        const body = await init.json() as GraphFile;
        if (body["@microsoft.graph.downloadUrl"]) {
            const res = await fetch(body["@microsoft.graph.downloadUrl"]);
            return res.blob();
        }
        if (retry || !body.id) {
            throw new Error('no content stream');
        }
        return fetchResponse(`/items/${body.id}`, source, true);
    }
}

/**
 * upload plaintext file content by path
 */
export async function uploadContent(content: string, path: string, source: GraphScope = "app") {
    try {
        const url = formURL(`:/${path}:/content`, source);
        await authFetch(url, 4, content);
        return true;
    } catch (err) {
        CPFL.app.debug.err('error uploading drive item', path, err);
        return false;
    }
}