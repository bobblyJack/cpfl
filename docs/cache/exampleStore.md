async function encryptAndStoreData(data) {
    // Generate a key
    const key = await crypto.subtle.generateKey(
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"]
    );

    // Encrypt the data
    const iv = crypto.getRandomValues(new Uint8Array(12)); // Random IV
    const encodedData = new TextEncoder().encode(data);
    const encryptedData = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        key,
        encodedData
    );

    // Store the encrypted data and IV in IndexedDB
    const dbRequest = indexedDB.open("MyAddInDB", 1);
    dbRequest.onupgradeneeded = (event) => {
        const db = event.target.result;
        db.createObjectStore("secureStore", { keyPath: "id" });
    };

    dbRequest.onsuccess = (event) => {
        const db = event.target.result;
        const tx = db.transaction("secureStore", "readwrite");
        const store = tx.objectStore("secureStore");

        store.put({
            id: 1,
            iv: Array.from(iv), // Store IV as an array
            encryptedData: Array.from(new Uint8Array(encryptedData)), // Convert buffer to array
        });

        tx.oncomplete = () => console.log("Data stored securely!");
    };
}
