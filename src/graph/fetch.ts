import CPFL from "..";

/**
 * graph fetch methods (WIP)
 * TBD: expand a drive item class (or classes) to incorporate methods
 */
enum FetchMethod {
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
 * auth get request
 */
export default async function authFetch(get: string | URL): Promise<Response>;
export default async function authFetch(url: string | URL, get: 0): Promise<Response>;
/**
 * auth post request
 */
export default async function authFetch(url: string | URL, post: 1, content?: string): Promise<Response>;
/**
 * auth patch request
 */
export default async function authFetch(url: string | URL, patch: 2, content?: string): Promise<Response>;
/**
 * auth delete request
 */
export default async function authFetch(url: string | URL, del: 3): Promise<Response>;
/**
 * auth put request
 */
export default async function authFetch(url: string | URL, put: 4, content?: string): Promise<Response>;
/**
 * auth head request
 */
export default async function authFetch(url: string | URL, head: 5): Promise<Response>;
/**
 * auth options request
 */
export default async function authFetch(url: string | URL, options: 6): Promise<Response>;
/**
 * auth trace request
 */
export default async function authFetch(url: string | URL, trace: 7, content?: string): Promise<Response>;
/**
 * auth fetch
 * @param url access target
 * @param method fetch method
 * @param content string body
 * @returns fetch response
 */
export default async function authFetch(url: string | URL, method: FetchMethod = 0, content: string = "") {

    const token = await CPFL.app.access();

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
