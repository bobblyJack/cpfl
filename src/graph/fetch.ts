import CPFL from "..";

/**
 * graph fetch methods
 */
enum FetchMethod {
    GET,
    POST,
    PATCH,
    DELETE,
    PUT,
    HEAD,
    OPTIONS,
    TRACE
}

/**
 * auth get request
 * retrieve resource
 */
export default async function authFetch(get: string | URL): Promise<Response>;
export default async function authFetch(url: string | URL, get: 0): Promise<Response>;
/**
 * auth post request
 * create resource (not idempotent)
 * @wip create folder
 * @tbd checkin/checkout
 */
export default async function authFetch(url: string | URL, post: 1, content?: string): Promise<Response>;
/**
 * auth patch request
 * update existing resource
 * @tbd update parentRef to move items
 */
export default async function authFetch(url: string | URL, patch: 2, content?: string): Promise<Response>;
/**
 * auth delete request
 * remove resource
 */
export default async function authFetch(url: string | URL, del: 3): Promise<Response>;
/**
 * auth put request
 * overwrite a resource
 * @wip upload file content
 */
export default async function authFetch(url: string | URL, put: 4, content?: string): Promise<Response>;
/**
 * auth head request
 * fetch resource metadata headers
 */
export default async function authFetch(url: string | URL, head: 5): Promise<Response>;
/**
 * auth options request
 * query allowed fetch methods
 */
export default async function authFetch(url: string | URL, options: 6): Promise<Response>;
/**
 * auth trace request
 * loopback debugging (returns request)
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
