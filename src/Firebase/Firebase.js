// Import necessary Firebase modules
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyAFlLAha8NaygGC7RbArb76Zx7mES2zff4",
  authDomain: "chatapplication-new-269b9.firebaseapp.com",
  projectId: "chatapplication-new-269b9",
  storageBucket: "chatapplication-new-269b9.appspot.com", // Fixed storageBucket typo
  messagingSenderId: "927110314283",
  appId: "1:927110314283:web:08453ed14087ccdf11ed6e",
  measurementId: "G-38SB1PW2T0",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firebase services
const db = getFirestore(firebaseApp);
const provider = new GoogleAuthProvider();
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(firebaseApp);

export { db, auth, provider, storage };
