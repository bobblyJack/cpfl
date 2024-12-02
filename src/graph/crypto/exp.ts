import {uploadContent} from '../content';

export default async function exportCryptoKey(key: CryptoKey){
    try {
        const buffer = await crypto.subtle.exportKey("raw", key);
        const encodedKey = new TextDecoder().decode(buffer);
        uploadContent(encodedKey, "key.txt", "app");
    } catch (err) {
        console.error('error uploading crypto key', err);
    }
}