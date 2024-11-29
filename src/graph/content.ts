import CPFL from "..";
import formURL from './url';

/**
 * fetch file content using id or path
 */
export async function download(input: string, retry: boolean = false) {
    let url: URL;
    if (input.includes(":") || input.includes("/")) {
        url = await formURL(["root:", input])
    } else {
        url = await formURL(["items", input]);
    }
    url.searchParams.set("$select", "id,@microsoft.graph.downloadUrl");
    const init = await CPFL.app.fetch(url);
    const body = await init.json() as DownloadableItem;
    if (body["@microsoft.graph.downloadUrl"]) {
        return fetch(body["@microsoft.graph.downloadUrl"]);
    }
    if (retry || !body.id) {
        throw new Error('no content stream');
    }
    return download(body.id, true);
}

/**
 * convert blob file to base 64 string
 */
export async function read(blob: Blob) {
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = (err) => {
            reject(err);
        }
        reader.onload = (event) => { 
            if (event.target) {
                if (typeof event.target.result === 'string') {
                    resolve(event.target.result);
                }
            }
        }
        reader.readAsText(blob);
    });
}

/**
 * upload file content
 */
export async function upload(content: string, id: string): Promise<boolean>;
export async function upload(content: string, parent: string, name: string): Promise<boolean>;
export async function upload(content: string, id: string, name?: string) {
    try {
        const path: string[] = ["items"];
        if (name) {
            id = id + ":";
            name = name + ":";
        }
        path.push(id);
        if (name) {
            path.push(name);
        }
        path.push("content");
        const url = await formURL(path);
        await CPFL.app.fetch(url, 4, content);
        return true;
    } catch (err) {
        CPFL.app.debug.err('error uploading drive item', id, name, err);
        return false;
    }
}