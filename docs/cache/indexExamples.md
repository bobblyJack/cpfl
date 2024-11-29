// indexedDB
// Use indexedDB.open to create or open a database. You can specify a version number to manage schema changes.
const request = indexedDB.open("myDatabase", 1)
// If the version number is higher than the existing one, the onupgradeneeded event is triggered. 
// This is where you define object stores and indexes.
request.onupgradeneeded = (event) => {
    const db = event.target.result;
    if (!db.objectStoreNames.contains('contacts')) {
        db.createObjectStore('contacts', { keyPath: 'id' });
    }
};
// Once the database is open, you can perform transactions to read/write data.
request.onsuccess = (event) => {
    const db = event.target.result;
    const transaction = db.transaction('contacts', 'readwrite');
    const store = transaction.objectStore('contacts');
    store.add({ id: 1, name: 'Alice', email: 'alice@example.com' });
};
// Use methods like get or a cursor to retrieve data.
const transaction = db.transaction('contacts', 'readonly');
const store = transaction.objectStore('contacts');
const getRequest = store.get(1);

getRequest.onsuccess = () => {
    console.log(getRequest.result); // { id: 1, name: 'Alice', email: 'alice@example.com' }
};
// You can create indexes on object store fields to speed up lookups.
const store = db.createObjectStore('contacts', { keyPath: 'id' });
store.createIndex('email', 'email', { unique: true });


// encryption using web crypto API
//You can generate a random key or derive one from user input (e.g., a password).
//Example: Generate a Random AES Key
async function generateKey(): Promise<CryptoKey> {
    return crypto.subtle.generateKey(
        {
            name: "AES-GCM",
            length: 256, // 256-bit key for strong encryption
        },
        true, // Key is exportable
        ["encrypt", "decrypt"]
    );
}
//Example: Derive a Key from a Password
async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
        "raw",
        encoder.encode(password), // Convert password to raw key material
        "PBKDF2",
        false,
        ["deriveKey"]
    );

    return crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: salt,
            iterations: 100000, // Increase for higher security
            hash: "SHA-256",
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"]
    );
}
// encrypt data
// AES-GCM is recommended because it provides both encryption and integrity verification.
async function encryptData(data: string, key: CryptoKey): Promise<{ ciphertext: ArrayBuffer, iv: Uint8Array }> {
    const encoder = new TextEncoder();
    const iv = crypto.getRandomValues(new Uint8Array(12)); // Generate a random initialization vector (IV)

    const ciphertext = await crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv: iv, // IV must be unique for each encryption
        },
        key,
        encoder.encode(data) // Convert string to binary
    );

    return { ciphertext, iv };
}

// Use the same key and IV to decrypt the data.
async function decryptData(ciphertext: ArrayBuffer, iv: Uint8Array, key: CryptoKey): Promise<string> {
    const decoder = new TextDecoder();

    const decrypted = await crypto.subtle.decrypt(
        {
            name: "AES-GCM",
            iv: iv,
        },
        key,
        ciphertext
    );

    return decoder.decode(decrypted); // Convert binary back to string
}
// Encrypted data can be stored in any storage mechanism, like IndexedDB, localStorage, or sessionStorage.
// Store encrypted data
await db.contacts.add({ id: 1, encryptedData: encrypted.ciphertext, iv: encrypted.iv });

// Retrieve and decrypt data
const record = await db.contacts.get(1);
const decryptedData = await decryptData(record.encryptedData, record.iv, key);
console.log(decryptedData);
