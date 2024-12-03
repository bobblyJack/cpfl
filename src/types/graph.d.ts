type GraphCache = "matters" | "contacts" | "precedents"; // local storage
type GraphCacheIndex = "label" | "parent";
type GraphScope = "user" | "app"; // cloud storage
type GraphURLFragment = `/items/${string}` | `:/${string}` // enforce id or path strings

interface GraphBaseItem {
    id: string;
}

interface GraphItem extends GraphBaseItem {
    name: string;
    parentReference?: ItemReference;
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

/**
 * an encrypted object
 */
interface EncryptedData<T extends {}> {
    data: ArrayBuffer; // encrypted object data
    iv: Uint8Array; // initiation vector for decryption
}

/**
 * the db cache item
 */
interface EncryptedItem<T extends {}> extends EncryptedData<T> {
    id: string; // main key string
    label: string; // unique indexed plaintext label
    parent: string; // indexed parent folder key
}