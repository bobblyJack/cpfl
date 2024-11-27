import CPFL from "..";
import formURL from './url';

interface DownloadableItem extends DriveItem {
    "@microsoft.graph.downloadUrl"?: string | URL;
}

/**
 * fetch file content
 */
export async function download(id: string) {
    const url = await formURL(`items/${id}`);
    url.searchParams.set("$select", "id,@microsoft.graph.downloadUrl");
    const init = await CPFL.app.fetch(url);
    const body = await init.json() as DownloadableItem;
    if (!body["@microsoft.graph.downloadUrl"]) {
        throw new Error('no content stream');
    }
    return fetch(body["@microsoft.graph.downloadUrl"]);
}

/**
 * convert blob file to base 64 string
 */
export async function read(id: string) {
    const response = await download(id);
    const blob = await response.blob();
    const reader = new FileReader();
    return new Promise<string>((resolve, reject) => {
        reader.onerror = (err) => {
            reject(err);
        }
        reader.onload = (event) => {  // slices metadata before return
            const data = String(event.target?.result).split(',')[1];
            resolve(data);
        }
        reader.readAsDataURL(blob);
    });
}

/**
 * upload file content
 */
export async function upload(item: DriveItem, content: string) {
    try {
        if (!item.file) {
            throw new Error('cannot upload non-file items');
        }
        let path: string = "items/";
        if (item.parentReference) {
            path += `${item.parentReference.id}:/${item.name}:/content`;
        } else {
            path += `${item.id}/content`;
        }
        const url = await formURL(path);
        await CPFL.app.fetch(url, 4, content);
        return true;
    } catch (err) {
        console.error('error uploading drive item', item, err);
        return false;
    }
}