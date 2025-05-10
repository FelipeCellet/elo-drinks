import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAbAofZ4WVZFuXObGBsxyhhHC_yQokkNYI",
  authDomain: "elo-drinks.firebaseapp.com",
  projectId: "elo-drinks",
  storageBucket: "elo-drinks.appspot.com",
  messagingSenderId: "1051686987707",
  appId: "1:1051686987707:web:a41da026a8b5fee99cc69e"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
