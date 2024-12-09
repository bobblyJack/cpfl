import CPFL from "..";
import formURL from './url';
import authFetch from "./fetch";

/**
 * fetch file content blob using id or path
 */
export async function download(input: GraphURLFragment, source: GraphScope = "app") {
    return fetchResponse(input, source);
    async function fetchResponse(input: GraphURLFragment, source: GraphScope, retry: boolean = false) {
        const url: URL = formURL(input, source);
        url.searchParams.set("$select", "id,@microsoft.graph.downloadUrl");
        const init = await authFetch(url);
        const body = await init.json() as GraphItem;
        if (body["@microsoft.graph.downloadUrl"]) {
            const res = await fetch(body["@microsoft.graph.downloadUrl"]);
            const blob = await res.blob();
            return readBlob64(blob);
        }
        if (retry || !body.id) {
            throw new Error('no content stream');
        }
        return fetchResponse(`/items/${body.id}`, source, true);
    }
}

/**
 * convert blob file to base 64 string
 */
async function readBlob64(blob: Blob) {
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = (err) => {
            reject(err);
        }
        reader.onload = () => { 
            resolve(reader.result as string);
        }
        reader.readAsText(blob);
    });
}

/**
 * upload plaintext file content by path
 */
export async function upload(content: string, path: string, source: GraphScope = "app") {
    try {
        const url = formURL(`:/${path}:/content`, source);
        return authFetch(url, 4, content);
    } catch (err) {
        CPFL.app.debug.err('error uploading file content');
        throw err;
    }
}