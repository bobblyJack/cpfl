type GraphCache = "matters" | "contacts" | "precedents"; // local storage
type GraphScope = "user" | "app"; // cloud storage appfolder
type GraphURLFragment = `/${string}` | `:/${string}` // enforce correct path strings

interface GraphBaseItem {
    id: string;
}

interface GraphItem extends GraphBaseItem {
    name: string;
    parentReference?: GraphItemReference;
    deleted?: {
        state: string;
    }
    file?: {}
    folder?: {}
}

interface GraphItemReference extends GraphBaseItem {
    name: string;
    path: string; // tbd: percent encoded?
    driveId?: string;
    driveType?: string;
    siteId?: string;
}

interface GraphFile extends GraphItem {
    file: {
        mimeType: string;
    }
    "@microsoft.graph.downloadUrl": string | URL;
}

interface GraphFolder extends GraphItem {
    folder: {
        childCount: number;
    }
    root?: {/*emptyfacet*/}
}

interface GraphItemCollection {
    value: GraphItem[];
    "@odata.nextLink"?: string | URL;
}

type GraphDeltaItem = GraphBaseItem & Partial<GraphItem & GraphFile & GraphFolder>;
interface GraphDeltaResponse extends GraphItemCollection {
    value: GraphDeltaItem[];
    "@odata.deltaLink"?: string | URL;
}

interface EncryptedItem<T extends GraphBaseItem> {
    id: string; // main key string
    data: ArrayBuffer; // encrypted object data
    iv: Uint8Array; // initiation vector for decryption
}