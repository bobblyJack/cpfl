import CPFL from '..';
import formURL from './url';

let cryptoKey: Promise<CryptoKey>;

async function getCryptoKey() {
    if (!cryptoKey) {
      cryptoKey = initCryptoKey();
    }
    return cryptoKey;
}
async function initCryptoKey() {
    const key = await crypto.subtle.generateKey(
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"]
    );
    cryptoKey = Promise.resolve(key);
    exportCryptoKey(key);
    return key;
}

async function exportCryptoKey(key: CryptoKey){
    const buffer = await crypto.subtle.exportKey("raw", key);
    const encodedKey = new TextDecoder().decode(buffer);
    
    const res = await CPFL.app.fetch(url);
    const item = await res.json();
    
        const init = await CPFL.app.fetch(url);
        const body = await init.json() as DownloadableItem;
        if (!body["@microsoft.graph.downloadUrl"]) {
            throw new Error('no content stream');
        }
        return fetch(body["@microsoft.graph.downloadUrl"]);

    
}

async function importKey(encodedKey: string) {
    const array = new TextEncoder().encode(encodedKey);
    const key = await crypto.subtle.importKey(
        "raw",
        array,
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"] 
    );

    const url = await formURL("root:/key.txt", "app");
    url.searchParams.set("$select", "id,@microsoft.graph.downloadUrl");
}

function initVector() {
    return crypto.getRandomValues(new Uint8Array(12));
}

async function enCrypto(data: string) {
    const key = await getKey();
    const encoder = new TextEncoder();
    
    const iv = initVector()
    const encodedData = new TextEncoder().encode(data);
    const params: AesGcmParams = {name: "AES-GCM", iv: iv}
    const encryptedData = await crypto.subtle.encrypt(
        {name: "AES-GCM", iv},
        key,
        encodedData
    )
    return {encryptedData, iv}
}

async function deCrypto(key: CryptoKey, encryptedData: ArrayBuffer, iv: Uint8Array) {
    const decryptedData = await crypto.subtle.decrypt(
        {name: "AES-GCM", iv},
        key, 
        encryptedData
    );
    return new TextDecoder().decode(decryptedData)
}

