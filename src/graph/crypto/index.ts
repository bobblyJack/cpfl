import getKey from './key';

export async function enCrypto<T extends GraphBaseItem>(obj: T): Promise<EncryptedItem<T>> {
    const id = obj.id;
    const stringData = JSON.stringify(obj);
    const cryptoKey = await getKey();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encodedData = new TextEncoder().encode(stringData);
    const data = await crypto.subtle.encrypt(
        {name: "AES-GCM", iv},
        cryptoKey,
        encodedData
    )
    return {id, data, iv};
}

export async function deCrypto<T extends GraphBaseItem>(encryptedItem: EncryptedItem<T>): Promise<T> {
    const key = await getKey();
    const decryptedData = await crypto.subtle.decrypt(
        {
            name: "AES-GCM", 
            iv: encryptedItem.iv
        },
        key, 
        encryptedItem.data
    );
    const stringData = new TextDecoder().decode(decryptedData);
    return JSON.parse(stringData) as T;
}