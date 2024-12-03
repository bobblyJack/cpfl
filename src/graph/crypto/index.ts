import getKey from './key';

export async function enCrypto<T extends {}>(obj: T): Promise<EncryptedData<T>> {
    const stringData = JSON.stringify(obj);
    const cryptoKey = await getKey();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encodedData = new TextEncoder().encode(stringData);
    const data = await crypto.subtle.encrypt(
        {name: "AES-GCM", iv},
        cryptoKey,
        encodedData
    )
    return {data, iv};
}

export async function deCrypto<T extends {}>(encryptedData: EncryptedData<T>): Promise<T> {
    const key = await getKey();
    const decryptedData = await crypto.subtle.decrypt(
        {
            name: "AES-GCM", 
            iv: encryptedData.iv
        },
        key, 
        encryptedData.data
    );
    const stringData = new TextDecoder().decode(decryptedData);
    return JSON.parse(stringData) as T;
}