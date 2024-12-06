import CPFL from '../..';
import readBlob64 from '../blob';
import {
    uploadContent,
    downloadContent
} from '../content';

let cryptoKey: CryptoKey;

export default async function getCryptoKey() {
    if (!cryptoKey) {
        try {
            cryptoKey = await importKey();
        } catch (err) {
            CPFL.app.debug.err(err);
            cryptoKey = await crypto.subtle.generateKey({
                name: "AES-GCM", 
                length: 256 
            },
            true,
            [
                "encrypt", 
                "decrypt"
            ]);
            exportKey(cryptoKey);
        }
    }
    return cryptoKey;
}

async function importKey(): Promise<CryptoKey> {
    const blob = await downloadContent(":/key.txt");
    const text = await readBlob64(blob);
    const array = new TextEncoder().encode(text);
    return crypto.subtle.importKey(
        "raw",
        array,
        { 
            name: "AES-GCM", 
            length: 256 
        },
        true,
        [
            "encrypt", 
            "decrypt"
        ] 
    );
}

async function exportKey(key: CryptoKey){
    try {
        const buffer = await crypto.subtle.exportKey("raw", key);
        const encodedKey = new TextDecoder().decode(buffer);
        uploadContent(encodedKey, "key.txt");
    } catch (err) {
        console.error('error uploading crypto key', err);
    }
}