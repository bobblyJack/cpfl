type GraphCache = "matters" | "contacts" | "precedents"; // local storage
type GraphScope = "user" | "app"; // cloud storage root
type GraphURLFragment = `/${string}` | `:/${string}` // enforce correct path strings

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
}

interface GraphItemReference extends GraphBaseItem {
    path?: string; // TBD: handle percent encoding
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
} & {
    [K in keyof Omit<GraphItem, "id">]: ArrayBuffer; // encrypted data
}