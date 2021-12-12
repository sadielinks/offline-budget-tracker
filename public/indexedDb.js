// db
let db;

// new db request with .open
const request = window.indexedDB.open('budget', 1);

request.onupgradeneeded = (event) => {
    event.target.result.createObjectStore("pending", {
        keyPath: "id",
        autoIncrement: true
    });
};

