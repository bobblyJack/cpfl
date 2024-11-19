/**
 * auth fetch
 * @param url access target
 * @param method fetch method
 * @param jsonBody object body
 * @param addScopes extra auth
 * @returns json response
 */
export default async function authFetch<T>(token: string, url: string | URL, method: FetchMethod = "GET", jsonBody?: any) {

    const request: RequestInit = {
        method: method, // WIP: flesh out beyond GET
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + token,
            'Cache-Control': 'private, no-store, no-cache, must-revalidate',
            'Expires': '-1',
            'Pragma': 'no-cache'
        }    
    }

    if (jsonBody) {
        request.body = JSON.stringify(jsonBody);
        request.headers = {
            ...request.headers,
            'Content-Type': 'application/json'
        }
    }
    
    const response = await fetch(url, request);

    if (!response.ok) {
        console.error('auth fetch response not ok', response.status);
        throw new Error(response.statusText);
    }

    return response.json() as T;

}
