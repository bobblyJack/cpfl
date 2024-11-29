async function retrieveAndDecryptData() {
    // Open IndexedDB
    const dbRequest = indexedDB.open("MyAddInDB", 1);

    dbRequest.onsuccess = async (event) => {
        const db = event.target.result;
        const tx = db.transaction("secureStore", "readonly");
        const store = tx.objectStore("secureStore");

        const record = await store.get(1);

        // Decrypt the data
        const key = await crypto.subtle.generateKey(
            { name: "AES-GCM", length: 256 },
            true,
            ["encrypt", "decrypt"]
        );
        const iv = new Uint8Array(record.iv);
        const encryptedData = new Uint8Array(record.encryptedData);

        const decryptedData = await crypto.subtle.decrypt(
            { name: "AES-GCM", iv },
            key,
            encryptedData
        );

        console.log(new TextDecoder().decode(decryptedData)); // Decoded original data
    };
}
