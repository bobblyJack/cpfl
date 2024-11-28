import CPFL from "..";
import formURL from './url';
import { GraphItem } from ".";

interface DownloadableItem extends DriveItem {
    "@microsoft.graph.downloadUrl"?: string | URL;
}

export default class GraphFile implements FileFacet {
    private readonly id: string; // item ref
    public mimeType: string;
    public constructor(id: string, file: FileFacet) {
        this.id = id;
        this.mimeType = file.mimeType;
    }

    /**
     * fetch file content
     */
    public async download() {
        const url = await formURL(`items/${this.id}`);
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
    public async read() {
        const response = await this.download();
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
     * TBD: migrate to base item
     */
    public async upload(content: string) {
        try {
            const item = GraphItem.get(this.id);
            let path: string = "items/";
            try {
                path += `${item.parent.id}:/${item.name}:/content`;
            } catch {
                path += `${item.id}/content`;
            }
            const url = await formURL(path);
            await CPFL.app.fetch(url, 4, content);
            return true;
        } catch (err) {
            CPFL.app.debug.err('error uploading drive item', this, err);
            return false;
        }
    }


}




