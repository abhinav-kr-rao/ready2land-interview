// Import the functions you need from the SDKs you need
import { getAuth } from "firebase/auth";
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyChD-tbVYJ7TPebq6VojZcRU1a5pSg1kOk",
    authDomain: "ready2land-3f8cd.firebaseapp.com",
    projectId: "ready2land-3f8cd",
    storageBucket: "ready2land-3f8cd.firebasestorage.app",
    messagingSenderId: "939336531119",
    appId: "1:939336531119:web:4d38ac8fa11dac8203285a",
    measurementId: "G-GYHXT5SBWT"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);