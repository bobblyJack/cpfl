Additional IndexedDB Features
Indexes:

You can create indexes on object store fields to allow for more efficient searching (e.g., searching by name or phone number in the contacts store).
Example:
``` typescript
Copy code
objectStore.createIndex('name', 'name', { unique: false });
```
Cursor:

If you want to iterate over records, you can use cursors to walk through each record in an object store.
Example:
``` typescript
Copy code
const cursorRequest = objectStore.openCursor();
cursorRequest.onsuccess = (event) => {
    const cursor = event.target.result;
    if (cursor) {
        console.log(cursor.value);  // Log each record
        cursor.continue();  // Move to the next record
    }
};
```
Transactions:

Operations like add, put, get, and delete need to be executed within a transaction. A transaction is an atomic unit of work, meaning that either all operations inside a transaction succeed, or none of them are applied.

Class Instances / Interfaces

IndexedDB works best when you store plain objects (no methods, just data) that represent your class instances. This ensures that the data can be serialized and stored efficiently.
When you retrieve the data, you can rebuild the class instance and restore any methods or class-specific behavior.
This approach makes it possible to use IndexedDB for persistent storage while still keeping the power of class methods and logic in your app.

