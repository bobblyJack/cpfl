type GraphScope = "user" | "app" | "site"; // cloud storage
type GraphCache = "matters" | "contacts"; // local storage

interface EncryptedData {
    data: ArrayBuffer,
    iv: Uint8Array
}

interface GraphItem {
    id: string;
    name: string;
    parentReference?: ItemReference;
    deleted?: {
        state: string;
    }
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
    "@odata.deltaLink"?: string | URL;
}

interface GraphItemReference {
    id: string;
    name: string;
    path: string; // percent encoded
    driveId?: string;
    driveType?: string;
    siteId?: string;
}