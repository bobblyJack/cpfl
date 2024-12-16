import getKey from './key';

/**
 * decrypt item
 * @param obj to decrypt
 */
export async function deCrypto(obj: EncryptedGraphItem): Promise<GraphItem>;
/**
 * decrypt property
 * @param data property value
 * @param iv encryption vector
 */
export async function deCrypto(data: ArrayBuffer, iv: Uint8Array): Promise<string>;
export async function deCrypto(encryptedItem: EncryptedGraphItem | ArrayBuffer, iv?: Uint8Array): Promise<GraphItem | string> {
    const key = await getKey();
    if (encryptedItem instanceof ArrayBuffer) {
        if (!iv) {
            throw new Error('null iv');
        }
        return decryptData(key, iv, encryptedItem);
    }

    const id = encryptedItem.id;
    iv = encryptedItem.iv;
    const data: Record<string, any> = {};
    for (const [k, v] of Object.entries(encryptedItem)) {
        if (v instanceof ArrayBuffer) {
            data[k] = await decryptData(key, iv, v);
        }
    }

    return {...data, id};
}

async function decryptData(key: CryptoKey, iv: Uint8Array, data: ArrayBuffer): Promise<string> {
    const decryptedData = await crypto.subtle.decrypt(
        {
            name: "AES-GCM", iv
        },
        key, 
        data
    );
    return new TextDecoder().decode(decryptedData);
}