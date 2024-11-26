import getDrive from "./items";

export default async function getFileContent(driveID: string): Promise<string>;
export default async function getFileContent(driveID: string, format: "blob"): Promise<string>;
export default async function getFileContent(driveID: string, format: "json"): Promise<any>;
export default async function getFileContent(driveID: string, format: "blob" | "json" = "blob") {
    try {
        const item = await getDrive.itemID(driveID);
        console.log('fetching file content', item);
        const url = item["@microsoft.graph.downloadUrl"];
        if (!url) {
            throw new Error('download link missing');
        }
        const response = await fetch(url);
        if (!response.ok) {
            console.error(response.status, response.statusText);
            throw new Error('download link not ok');
        }

        if (format === "blob") {
            const blob = await response.blob();
            return readBlob64(blob);
        } else {
            return response.json();
        }
        
    } catch (err) {
        console.error("error fetching file content");
        if (format === "blob") {
            console.error(err)
            return "";
        } else {
            throw err;
        }
    }
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