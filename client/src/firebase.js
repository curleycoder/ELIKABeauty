// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBf6dQ9AgKcnaWuP2_qVplREMUbLPkXcoA",
  authDomain: "beauty-shohre-studio-e745e.firebaseapp.com",
  projectId: "beauty-shohre-studio-e745e",
  storageBucket: "beauty-shohre-studio-e745e.firebasestorage.app",
  messagingSenderId: "808154205496",
  appId: "1:808154205496:web:06366853b9b1c67d7bc5cd",
  measurementId: "G-2WL8DY0KB4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);