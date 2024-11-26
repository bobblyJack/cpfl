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

/**
 * graph fetch methods (WIP)
 * with http use cases
 */
type FetchMethod = 
    "GET"  | // retrieve resource - default
    //sites/{hostname}:/{server-relative-path}
    //sites/{site-id}/drive/items/{item-id}
    //sites/{site-id}/drive/root:/{item-path}
    "POST" | // create a resource (not idempotent)
    // used for permanent delete
    // /drives/{drive-id}/items/{item-id}/permanentDelete
    "PATCH" | // update fields of existing resource
    // can update parentReference to move item
    // needs auth + content-type application/json
    //sites/{site-id}/drive/items/{item-id}
    "DELETE" | // remove a resource
    //sites/{siteId}/drive/items/{itemId}


    /* uncommon methods */
    "PUT" | // completely replace or create a resource
    // needs auth + content-type text/plain
    //sites/{site-id}/drive/items/{item-id}/content - replace an exiting item
    //sites/{site-id}/drive/items/{parent-id}:/{filename}:/content - upload a new file
    "HEAD" | // get resource metadata (headers only)
    "OPTIONS" | // get allowed fetch methods
    "TRACE" // loopback debug (returns the request)