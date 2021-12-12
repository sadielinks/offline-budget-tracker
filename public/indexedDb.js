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
    checkDatabase();
    };
    
};