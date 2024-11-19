/**
 * convert blob file to base 64 string
 */
export default async function readBlob64(blob: Blob) {
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