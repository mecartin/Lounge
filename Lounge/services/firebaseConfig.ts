// services/firebaseConfig.ts
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore'; 

const firebaseConfig = {
  apiKey: "AIzaSyAxgC97nASQ2RoY0qE1H8A6Szapg8G7jdg",
  authDomain: "lounge-base.firebaseapp.com",
  projectId: "lounge-base",
  storageBucket: "lounge-base.firebasestorage.app",
  messagingSenderId: "387202977136",
  appId: "1:387202977136:web:a90880cad171e4adbe53b5",
  measurementId: "G-VFJZ5TR92S"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const firestore = firebase.firestore();

export { auth, firestore, firebase }; 