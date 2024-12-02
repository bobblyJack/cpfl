/**
 * convert blob file to base 64 string
 */
export default async function readBlob64(blob: Blob) {
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = (err) => {
            reject(err);
        }
        reader.onload = (event) => { 
            if (event.target) {
                if (typeof event.target.result === 'string') {
                    resolve(event.target.result);
                }
            }
        }
        reader.readAsText(blob);
    });
}