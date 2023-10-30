import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA9qHvzkQ2Hm93sbkBX_m34PoVmaD1aXzo",
  authDomain: "aafit-ab095.firebaseapp.com",
  databaseURL: "https://aafit-ab095-default-rtdb.firebaseio.com",
  projectId: "aafit-ab095",
  storageBucket: "aafit-ab095.appspot.com",
  messagingSenderId: "982821599330",
  appId: "1:982821599330:web:5c6055deddd1a31fa8f93b",
  measurementId: "G-5MTWB4D4HE"
};



const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage();
const auth = getAuth();
const provider = new GoogleAuthProvider();
export { db, storage, auth, provider };
