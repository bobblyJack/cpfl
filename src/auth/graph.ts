import { getToken } from './msal';
import env from '../env';

async function authFetch(path: string | URL) {
    try {
        const token = await getToken();
        const response = await fetch(path, {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                'Expires': '-1',
                'Pragma': 'no-cache'
            }
        });
        if (!response.ok) {
            throw new Error(`${response.status}: ${response.statusText}`);
        }
        return response;
    } catch (err) {
        console.error('auth fetch error');
        if (err instanceof Error) {
            console.error(err.message);
        }
        throw err
    }
}

const taskpaneURL = 'https://graph.microsoft.com/v1.0/drives/' + env.drive;

async function queryGraph(path: string = '/root/children', query: string = '?$select=name,id,file') {
    const response = await authFetch(taskpaneURL + path + query);
    return response.json();
}

export async function getItemID(name: string) {
    return queryGraph();
}

async function readBlob64(blob: Blob) {
    const reader = new FileReader();
    return new Promise<string>((resolve, reject) => {
        reader.onerror = (err) => {
            reject(err);
        }
        reader.onload = (event) => {
            // this slices off the metadata
            const data = String(event.target?.result).split(',')[1];
            resolve(data);
        }
        reader.readAsDataURL(blob);
    })
}

export async function getFile(url: string) {
    const response = await authFetch(url);
    const blob = await response.blob();
    return readBlob64(blob);
}

