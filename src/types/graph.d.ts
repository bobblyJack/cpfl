interface BaseItem {
    id: string;
    name: string;
}

interface DriveItem extends BaseItem {
    "@microsoft.graph.downloadUrl"?: string | URL;
    file?: {
        hashes: {
            quickXorHash: string;
        }
        mimeType: string;
    }
    folder?: {
        childCount: Number;
    }
}

interface ItemCollection {
    value: DriveItem[];
    "@odata.nextLink"?: string | URL;
}