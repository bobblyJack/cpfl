interface DriveItem {
    id: string;
    name: string;
    file?: {
        hashes: {
            quickXorHash: string;
        }
        mimeType: string;
    }
    folder?: {
        childCount: number;
    }
    deleted?: {
        state: string;
    }
    parentReference?: ItemReference;
    root?: {}
}

interface ItemCollection {
    value: DriveItem[];
    "@odata.nextLink"?: string | URL;
    "@odata.deltaLink"?: string | URL;
}

interface ItemReference {
    id: string;
    name: string;
    path: string; // percent encoded
    driveId?: string;
    driveType?: string;
    siteId?: string;
}