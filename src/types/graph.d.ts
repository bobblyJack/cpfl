interface DriveItem {
    id: string;
    name: string;
    parentReference?: ItemReference;
    file?: FileFacet;
    folder?: FolderFacet;
    root?: RootFacet;
    deleted?: DeletedFacet;
}

interface FileFacet {
    mimeType: string;
}

interface FolderFacet {
    childCount: number;
}

interface RootFacet {
    // empty
}

interface DeletedFacet {
    state: string;
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