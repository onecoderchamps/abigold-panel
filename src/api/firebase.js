// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your Firebase config from the Firebase console
const firebaseConfig = {
    apiKey: "AIzaSyA6iAio_4FtqssqY2IcLeaSuePJlXO52bw",
    authDomain: "abigold-3f5c6.firebaseapp.com",
    projectId: "abigold-3f5c6",
    storageBucket: "abigold-3f5c6.firebasestorage.app",
    messagingSenderId: "290388008770",
    appId: "1:290388008770:web:27c95b583425b9e74c72db"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
