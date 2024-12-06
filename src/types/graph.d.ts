type GraphCache = "matters" | "contacts" | "precedents"; // local storage
type GraphScope = "user" | "app"; // cloud storage root
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
    file?: {
        mimeType: string;
    }
    "@microsoft.graph.downloadUrl"?: string | URL;
    folder?: {
        childCount: number;
    }
    root?: {/*emptyfacet*/}
}

interface GraphItemReference extends GraphBaseItem {
    name: string;
    path: string; // TBD: handle percent encoding
    driveId?: string;
    driveType?: string;
    siteId?: string;
}

interface GraphItemCollection {
    value: GraphItem[];
    "@odata.nextLink"?: string | URL;
}

type GraphDeltaItem = GraphBaseItem & Partial<GraphItem>;
interface GraphDeltaResponse extends GraphItemCollection {
    value: GraphDeltaItem[];
    "@odata.deltaLink"?: string | URL;
}

type EncryptedGraphItem<T extends GraphBaseItem = GraphItem> = GraphBaseItem & {
    iv: Uint8Array; // decryption vector
} & {
    [K in keyof Omit<T, keyof GraphBaseItem>]: ArrayBuffer; // encrypted data
}