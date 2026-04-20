import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyB-FfZy3IGc075PfuG_DnblNKG3pt3x02o",
    authDomain: "soldbytm777.firebaseapp.com",
    databaseURL: "https://soldbytm777-default-rtdb.firebaseio.com",
    projectId: "soldbytm777",
    storageBucket: "soldbytm777.firebasestorage.app",
    messagingSenderId: "221424016040",
    appId: "1:221424016040:web:c13f86dd5fffd18cf2809d",
    measurementId: "G-BYZTZWTQ6X",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export { app, database, auth };
