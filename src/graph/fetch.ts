enum FetchMethod {
    GET, // retrieve resource - default
    POST, // submit data or create resource - not idempotent
    PATCH, // update fields of existing resource
    DELETE, // remove a resource

    /* uncommon methods */
    PUT, // completely replace or create a resource
    HEAD, // get resource metadata (headers only)
    OPTIONS, // get allowed fetch methods
    TRACE // loopback debug (returns the request)
}

/**
 * auth fetch
 * @param url access target
 * @param method fetch method
 * @param jsonBody object body
 * @param addScopes extra auth
 * @returns json response
 */
export async function authFetch<T>(token: string, url: string | URL, method: FetchMethod = 0, jsonBody?: any) {

    const request: RequestInit = {
        method: FetchMethod[method], // WIP: flesh out beyond GET
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
            'Expires': '-1',
            'Pragma': 'no-cache'
        }    
    }

    if (jsonBody) {
        request.body = JSON.stringify(jsonBody);
    }
    
    const response = await fetch(url, request);

    if (!response.ok) {
        console.error('auth fetch response not ok');
        throw new Error(response.statusText);
    }

    return response.json() as T;

}
