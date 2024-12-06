import getKey from './key';

/**
 * decrypt item
 * @param obj to decrypt
 */
export async function deCrypto<T extends GraphBaseItem>(obj: EncryptedGraphItem<T>): Promise<T>;
/**
 * decrypt property
 * @param data property value
 * @param iv encryption vector
 */
export async function deCrypto(data: ArrayBuffer, iv: Uint8Array): Promise<string>;
export async function deCrypto<T extends GraphBaseItem>(encryptedItem: EncryptedGraphItem<T> | ArrayBuffer, iv?: Uint8Array): Promise<T | string> {
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
        if (k !== "id" && v instanceof ArrayBuffer) {
            data[k] = await decryptData(key, iv, v);
        }
    }

    return {...data, id} as T;
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