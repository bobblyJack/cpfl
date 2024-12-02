import CPFL from "../..";
import formURL from '../url';
import { GraphItem } from "./items";

export default class GraphFolder implements FolderFacet {
    private readonly id: string;
    public childCount: number;
    public constructor(id: string, folder: FolderFacet) {
        this.id = id;
        this.childCount = folder.childCount;
    }

    public get children(): Promise<GraphItem[]> {
        return fetchIDs(this.id, this.childCount);
        async function fetchIDs(id: string, count: number) {
            const url = await formURL(`items/${id}/children`, ["id", "folder"]);
            const ids = await collectItems(url);
            if (count !== ids.length) {
                CPFL.app.debug.err('weird child count', count, ids);
            }
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
}