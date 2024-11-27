/**
 * graph fetch methods (WIP)
 * TBD: expand a drive item class (or classes) to incorporate methods
 */
export enum FetchMethod {
    GET,// retrieve resource - default
    //sites/{hostname}:/{server-relative-path}
    //sites/{site-id}/drive/items/{item-id}
    //sites/{site-id}/drive/root:/{item-path}
    //sites/{siteId}/drive/root/delta
    POST,// create a resource (not idempotent)
    // used for checkout/checkin
    //sites/{siteId}/drive/items/{itemId}/checkout
    //sites/{siteId}/drive/items/{itemId}/checkin
    // used to create folder
    // requires content-type application/json
    //sites/{site-id}/drive/items/{parent-item-id}/children
    // can use this property to resolve conflicts also
    // "@microsoft.graph.conflictBehavior": "rename"
    PATCH,// update fields of existing resource
    // can update parentReference to move item
    // needs auth + content-type application/json
    //sites/{site-id}/drive/items/{item-id}
    DELETE,// remove a resource
    //sites/{siteId}/drive/items/{itemId}
    PUT, // completely replace or create a resource's content
    
    /* as yet unused methods */
    HEAD,// get resource metadata (headers only)
    OPTIONS, // get allowed fetch methods
    TRACE// loopback debug (returns the request)
}

/**
 * auth fetch
 * @param token user token
 * @param url access target
 * @param method fetch method
 * @param content string body
 * @returns fetch response
 */
export async function fetchRequest(token: string, url: string | URL, method: FetchMethod = 0, content: string = "") {

    const request: RequestInit = {
        method: FetchMethod[method],
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + token,
            'Cache-Control': 'private, no-store, no-cache, must-revalidate',
            'Expires': '-1',
            'Pragma': 'no-cache'
        }    
    }

    if (method === FetchMethod.PATCH || method === FetchMethod.POST) { //WIP
        request.body = content;
        request.headers = {
            ...request.headers,
            "Content-Type": "application/json"
        }
    } else if (method === FetchMethod.PUT) { //WIP
        request.body = content;
        request.headers = {
            ...request.headers,
            "Content-Type": "text/plain"
        }
    }
    
    const response = await fetch(url, request);

    if (!response.ok) {
        console.error('auth fetch response not ok', response);
        throw new Error(`http code: ${response.status}`);
    }

    return response;

}
