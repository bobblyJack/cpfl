/**
 * convert blob file to base 64 string
 */
export default async function readBlob64(blob: Blob) {
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = (err) => {
            reject(err);
        }
        reader.onload = () => { 
            resolve(reader.result as string);
        }
        reader.readAsText(blob);
    });
}

/**
 * convert blob file to array buffer
 */
export async function readArrayBlobber(blob: Blob): Promise<ArrayBuffer> {
    return new Promise<ArrayBuffer>((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = (err) => {
            reject(err);
        }
        reader.onload = () => {
            resolve(reader.result as ArrayBuffer);
        }
        reader.readAsArrayBuffer(blob);
    })

}