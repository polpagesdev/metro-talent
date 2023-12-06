// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDF8OD4CIVZgp6pfGyUAcZpAodfeF6KZ1Q",
  authDomain: "metro-talent.firebaseapp.com",
  projectId: "metro-talent",
  storageBucket: "metro-talent.appspot.com",
  messagingSenderId: "162126285097",
  appId: "1:162126285097:web:75330511c69310e78c4f38",
  measurementId: "G-TVQN1MSPH9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);