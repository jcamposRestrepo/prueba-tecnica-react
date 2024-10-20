import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAVc78d0StaKmElVhPhDsdHQP8ng4dJRMQ",
    authDomain: "login-54bd0.firebaseapp.com",
    projectId: "login-54bd0",
    storageBucket: "login-54bd0.appspot.com",
    messagingSenderId: "41589263974",
    appId: "1:41589263974:web:72afe6579229be8218a7a7"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

auth.settings.appVerificationDisabledForTesting = false; // Solo usar para pruebas


export { auth, db, RecaptchaVerifier, signInWithPhoneNumber };
