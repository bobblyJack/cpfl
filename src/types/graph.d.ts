interface DriveItem {
    id: string;
    name: string;
    parentReference?: ItemReference;
    file?: FileFacet;
    folder?: FolderFacet;
    root?: RootFacet;
    // if not root (for some reason root does not have an etag)
    "@odata.etag": string; // compare to make sure working on latest version
    // or should i be actually getting eTag ? idk
    // or cTag? which is content-only, not the entity itself? idkkkkkk
    deleted?: DeletedFacet;
}

interface DownloadableItem extends DriveItem {
    "@microsoft.graph.downloadUrl"?: string | URL;
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