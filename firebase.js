// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp} from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBG6ateI3dL3VvadPmBkKqUrjx24sT2_TM",
  authDomain: "keesapp-c91e5.firebaseapp.com",
  projectId: "keesapp-c91e5",
  storageBucket: "keesapp-c91e5.appspot.com",
  messagingSenderId: "810085541976",
  appId: "1:810085541976:web:7583cfd333d2f0ba13c22d"
};

// Initialize Firebase
// const app = !getApps().length ? initializeApp(firebaseConfig,'keesApp') : getApps()[0];
let app;
try {
  app = getApp('keesApp');
} catch (error) {
  app = initializeApp(firebaseConfig,'keesApp');
}
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { db, auth, provider, signInWithPopup };