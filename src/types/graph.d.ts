type GraphCache = "matters" | "contacts" | "precedents"; // local storage
type GraphScope = "user" | "app"; // cloud storage root
type GraphURLFragment = `/${string}` | `:/${string}` // enforce correct path strings
type GraphItemType = "file" | "folder"; // facet check

interface GraphBaseItem {
    id: string;
    name?: string;
}

interface GraphItem extends GraphBaseItem {
    parentReference?: GraphItemReference;
    deleted?: {
        state: string;
    }
    file?: {
        mimeType: string;
    };
    folder?: {
        childCount: number;
    };
    "@microsoft.graph.downloadUrl"?: string | URL;
    eTag?: string; // entity tag - tracks content
    cTag?: string; // change tag - tracks metadata
    content?: string // stringified extension object
}

interface GraphItemReference extends GraphBaseItem {
    path?: string;
    driveId?: string;
    siteId?: string;
}

interface GraphItemCollection {
    value: GraphItem[];
    "@odata.nextLink"?: string | URL;
    "@odata.deltaLink"?: string | URL;
}

type EncryptedGraphItem = {
    id: string; // plaintext key ref
    iv: Uint8Array; // decryption vector
    hx?: string; // history - indexed parent id
} & {
    [K in keyof Omit<GraphItem, "id">]: ArrayBuffer; // encrypted data
}