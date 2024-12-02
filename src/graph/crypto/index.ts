import getKey from './key';

export async function enCrypto(data: string): Promise<EncryptedData> {
    const cryptoKey = await getKey();
    const initVector = crypto.getRandomValues(new Uint8Array(12));
    const encodedData = new TextEncoder().encode(data);
    const encryptedData = await crypto.subtle.encrypt(
        {
            name: "AES-GCM", 
            iv: initVector
        },
        cryptoKey,
        encodedData
    )
    return {
        data: encryptedData,
        iv: initVector
    }
}

export async function deCrypto(encryptedData: EncryptedData) {
    const key = await getKey();
    const decryptedData = await crypto.subtle.decrypt(
        {
            name: "AES-GCM", 
            iv: encryptedData.iv
        },
        key, 
        encryptedData.data
    );
    return new TextDecoder().decode(decryptedData);
}