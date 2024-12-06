import getKey from './key';

/**
 * graph encryption
 * @param obj item to encrypt or properties to update
 * @param base original encrypted item for updating
 */
export async function enCrypto<T extends GraphBaseItem>(
    obj: T | Partial<T>, 
    base?: EncryptedGraphItem<T>
): Promise<EncryptedGraphItem<T>> {
    const id = base ? base.id : obj.id as string;
    const iv = base ? base.iv : crypto.getRandomValues(new Uint8Array(12));
    const cryptoKey = await getKey();

    const data: Record<string, ArrayBuffer> = {};
    for (const [key, val] of Object.entries(obj)) {
        if (key !== "id") {
            const text = String(val);
            const encodedText = new TextEncoder().encode(text);
            data[key] = await crypto.subtle.encrypt(
                {name: "AES-GCM", iv},
                cryptoKey,
                encodedText
            );
        }
    }

    if (base) {
        return {
            ...base,
            ...data
        }
    } else {
        return {
            ...data, id, iv
        } as EncryptedGraphItem<T>;
    }
}