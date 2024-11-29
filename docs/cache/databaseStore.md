/*
In this example, we're opening a database named 'myDatabase', 
and if it's the first time the database is being used (or if the version is increased), 
we create an object store named 'contacts' with a keyPath of 'id'. 
This means that each contact will have an id property as a unique key.
*/

// Open the IndexedDB database, create one if it doesn't exist
const request = indexedDB.open('myDatabase', 1);  // "1" is the version number

request.onupgradeneeded = (event) => {
    const db = (event.target as IDBRequest).result;
    
    // Create an object store called 'contacts', with 'id' as the key path
    const objectStore = db.createObjectStore('contacts', {
        keyPath: 'id',   // 'id' will be the unique identifier for each contact
        autoIncrement: true  // Automatically generate an ID for each record
    });
    
    // Optionally, you can create indexes on certain properties
    objectStore.createIndex('name', 'name', { unique: false });
};

request.onsuccess = (event) => {
    const db = (event.target as IDBRequest).result;
    console.log('Database opened successfully');
};

request.onerror = (event) => {
    console.error('Error opening database:', event);
};

// To add data, you need to open a transaction on the database and object store, then perform the add operation.

function addContact(contact: { name: string, phone: string }) {
    const request = indexedDB.open('myDatabase', 1);

    request.onsuccess = (event) => {
        const db = (event.target as IDBRequest).result;
        
        // Open a transaction with read/write access
        const transaction = db.transaction('contacts', 'readwrite');
        const objectStore = transaction.objectStore('contacts');

        // Add a new contact
        const addRequest = objectStore.add(contact);

        addRequest.onsuccess = () => {
            console.log('Contact added successfully');
        };

        addRequest.onerror = (event) => {
            console.error('Error adding contact:', event);
        };
    };
}

addContact({ name: 'John Doe', phone: '123-456-7890' });
// We open the 'myDatabase' database and begin a transaction on the 'contacts' object store.
// We then call add on the object store to add a new contact record.

// To retrieve data, you can use get (by key), getAll (all records), or openCursor (to iterate over records).
function getContactById(id: number) {
    const request = indexedDB.open('myDatabase', 1);

    request.onsuccess = (event) => {
        const db = (event.target as IDBRequest).result;
        
        // Open a transaction
        const transaction = db.transaction('contacts', 'readonly');
        const objectStore = transaction.objectStore('contacts');
        
        // Get a contact by id
        const getRequest = objectStore.get(id);
        
        getRequest.onsuccess = () => {
            const contact = getRequest.result;
            console.log('Contact found:', contact);
        };

        getRequest.onerror = (event) => {
            console.error('Error retrieving contact:', event);
        };
    };
}

getContactById(1);
// We use the get method to retrieve a record by its key (id in this case).
// If the contact exists, the data is logged.
// To update data, you can use put. If the key already exists, it will update the record; otherwise, it will add a new one.
function updateContact(id: number, newPhone: string) {
    const request = indexedDB.open('myDatabase', 1);

    request.onsuccess = (event) => {
        const db = (event.target as IDBRequest).result;

        // Open a transaction
        const transaction = db.transaction('contacts', 'readwrite');
        const objectStore = transaction.objectStore('contacts');

        // Retrieve the contact by id and update it
        const getRequest = objectStore.get(id);

        getRequest.onsuccess = () => {
            const contact = getRequest.result;
            if (contact) {
                contact.phone = newPhone;  // Update the phone number
                const putRequest = objectStore.put(contact);  // Update the record

                putRequest.onsuccess = () => {
                    console.log('Contact updated successfully');
                };
                putRequest.onerror = (event) => {
                    console.error('Error updating contact:', event);
                };
            } else {
                console.error('Contact not found');
            }
        };
    };
}

updateContact(1, '987-654-3210');

// To delete data, you use delete by providing the key.

function deleteContact(id: number) {
    const request = indexedDB.open('myDatabase', 1);

    request.onsuccess = (event) => {
        const db = (event.target as IDBRequest).result;

        // Open a transaction
        const transaction = db.transaction('contacts', 'readwrite');
        const objectStore = transaction.objectStore('contacts');

        // Delete a contact by id
        const deleteRequest = objectStore.delete(id);

        deleteRequest.onsuccess = () => {
            console.log('Contact deleted successfully');
        };

        deleteRequest.onerror = (event) => {
            console.error('Error deleting contact:', event);
        };
    };
}

deleteContact(1);
