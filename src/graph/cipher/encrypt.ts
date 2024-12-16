import getKey from './key';

/**
 * graph encryption
 * @param obj item to encrypt or properties to update
 * @param base original encrypted item for updating
 */
export async function enCrypto(
    obj: GraphItem | Partial<GraphItem>, 
    base?: EncryptedGraphItem
): Promise<EncryptedGraphItem> {
    const id = base ? base.id : obj.id as string;
    const iv = base ? base.iv : crypto.getRandomValues(new Uint8Array(12));
    const hx = obj.parentReference ? obj.parentReference.id : base ? base.hx : undefined;
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
            ...data,
            hx
        }
    } else {
        return {
            ...data, id, iv, hx
        };
    }
}