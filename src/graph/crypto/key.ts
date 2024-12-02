import importKey from './imp';
import exportKey from './exp';
import CPFL from '../..';

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