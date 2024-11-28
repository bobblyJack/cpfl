import { GraphItem } from ".";
import CPFL from "..";
import formURL from './url';

export default class GraphFolder implements FolderFacet {
    private readonly id: string;
    public childCount: number;
    public constructor(id: string, folder: FolderFacet) {
        this.id = id;
        this.childCount = folder.childCount;
    }

    /**
     * get folder children
     */
    public async open() {
        const url = await formURL(`items/${this.id}/children`, ["id"]);
        const ids = await collectItems(url);
        return ids.map(id => GraphItem.get(id));
        
        async function collectItems(link: string | URL, values: string[] = []) {
            let response: ItemCollection;
            try {
                const res = await fetch(link);
                if (!res.ok) {
                    throw res.status;
                }
                response = await res.json();
            } catch {
                const res = await CPFL.app.fetch(link);
                response = await res.json(); 
            }
            for (const item of response.value) {
                values.push(item.id);
            }
            if (response['@odata.nextLink']) {
                return collectItems(response["@odata.nextLink"], values);
            }
            return values;
        }
    }
}