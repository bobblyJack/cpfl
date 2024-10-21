import { getItem } from "./item";

/**
 * get file content
 * @param id drive item id
 * @returns base 64 string
 */
export async function getContent(id: string) {
    const item = await getItem(id);
    const url = item["@microsoft.graph.downloadUrl"];
    if (!url) {
        console.error('download link missing');
        throw new Error(id);
    }
    const response = await fetch(url);
    if (!response.ok) {
        console.error('download link not ok');
        throw new Error(response.statusText);
    }
    const blob = await response.blob();
    return readBlob64(blob);
}

/**
 * convert blob file to base 64 string
 */
async function readBlob64(blob: Blob) {
    const reader = new FileReader();
    return new Promise<string>((resolve, reject) => {
        reader.onerror = (err) => {
            reject(err);
        }
        reader.onload = (event) => {  // slices metadata before return
            const data = String(event.target?.result).split(',')[1];
            resolve(data);
        }
        reader.readAsDataURL(blob);
    })
}