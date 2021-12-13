// db
let db;

// new db request with .open
const request = window.indexedDB.open('budget', 1);

request.onupgradeneeded = (event) => {
    // create new object 'pending'
    event.target.result.createObjectStore('pending', {
        keyPath: 'id',
        autoIncrement: true
    });
};

// IDBRequest .onerror https://developer.mozilla.org/en-US/docs/Web/API/IDBRequest/onerror
request.onerror = (error) => {
    console.log(error.message)
};

// IDBRequest .onsuccess https://developer.mozilla.org/en-US/docs/Web/API/IDBRequest/onsuccess
request.onsuccess = (event) => {
    db = event.target.result;

    if (navigator.onLine) {

        catchUpDatabase();
    };

};

// offline/no network saving from public/index.js
function saveRecord(record) {
    // transaction gets stored to 'pending' object 
    const transaction = db.transaction('pending');
    const store = transaction.objectStore('pending');
    store.add(record);
};

// once reconnected, add records saved inside 'pending'
function catchUpDatabase() {
    const transaction = db.transaction('pending', 'readonly');
    const store = transaction.objectStore('pending');
    // eventually used for fetching data from offline time
    const allData = store.allData();

    // fetch from own app api
    allData.onsuccess = () => {

    }
}