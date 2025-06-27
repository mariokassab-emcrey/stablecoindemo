// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyADouB0Kb2FgTPpUzSIoUSdPbyf5CawaHA",
  authDomain: "onlineshop-25b13.firebaseapp.com",
  databaseURL: "https://onlineshop-25b13-default-rtdb.firebaseio.com",
  projectId: "onlineshop-25b13",
  storageBucket: "onlineshop-25b13.firebasestorage.app",
  messagingSenderId: "224069021521",
  appId: "1:224069021521:web:ed604a1688e97f40556d70",
  measurementId: "G-8Y6H6VNLD7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);