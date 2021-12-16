// db
let db;

// new db request with .open
const request = window.indexedDB.open('budget', 1);

request.onupgradeneeded = (event) => {
    // create new object 'pending'
    event.target.result.createObjectStore('pending', {
        keyPath: 'id',
        autoIncrement: true,
    });
};

// IDBRequest .onerror https://developer.mozilla.org/en-US/docs/Web/API/IDBRequest/onerror
request.onerror = (error) => {
    console.log(error.message);
};

// IDBRequest .onsuccess https://developer.mozilla.org/en-US/docs/Web/API/IDBRequest/onsuccess
request.onsuccess = (event) => {
    db = event.target.result;

    if (navigator.onLine) {
        catchUpDatabase();
    }
    0;
};

// offline/no network saving from public/index.js
function saveRecord(record) {
    // transaction gets stored to 'pending' object
    const transaction = db.transaction(['pending'], 'readwrite');
    const store = transaction.objectStore('pending');
    store.add(record);
}

// once reconnected, add records saved inside 'pending'
function catchUpDatabase() {
    const transaction = db.transaction(['pending'], 'readonly');
    const store = transaction.objectStore('pending');
    // eventually used for fetching data from offline time
    const getAll = store.getAll();

    // fetch from own app api
    getAll.onsuccess = () => {
        // ignore 'empty' records that might have been saved
        if (getAll.result.length > 0) {
            fetch('/api/transaction/bulk', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                // added from help with TA https://developer.mozilla.org/en-US/docs/Web/API/Headers
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                },
            })
                // if conditions met, results in:
                .then((response) => response.json())
                .then(() => {
                    const transaction = db.transaction(['pending'], 'readwrite');
                    const store = transaction.objectStore('pending');
                    store.clear();
                });
        }
    };
}

// global window object will listen for the network coming back online
window.addEventListener('online', catchUpDatabase);
