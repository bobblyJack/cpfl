type GraphCache = "matters" | "contacts" | "precedents"; // local storage
type GraphScope = "user" | "app"; // cloud storage

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

interface GraphItemReference {
    id: string;
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

type GraphDeltaItem = Partial<GraphItem & GraphFile & GraphFolder> & {
    id: string
};
interface GraphDeltaResponse extends GraphItemCollection {
    value: GraphDeltaItem[];
    "@odata.deltaLink"?: string | URL;
}