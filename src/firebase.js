import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDhsV-tUHvzg7UpPJSHg388B3fuEmepjC4",
    authDomain: "newproject-8a8af.firebaseapp.com",
    projectId: "newproject-8a8af",
    storageBucket: "newproject-8a8af.firebasestorage.app",
    messagingSenderId: "628578876534",
    appId: "1:628578876534:web:ded31ea6e04a5f82317357"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Email/Password Auth Functions
export const signUpWithEmail = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const signInWithEmail = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};