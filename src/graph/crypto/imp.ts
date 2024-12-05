import {downloadContent} from '../content';
import readBlob64 from '../blob';

export default async function importKey(): Promise<CryptoKey> {
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